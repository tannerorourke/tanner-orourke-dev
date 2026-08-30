# Output Form, Not Knowledge

## Overview [!id](overview)

Multiple-choice benchmarks are gameable, and everyone knows it. Models score above chance without seeing the question, flip answers when options are reordered, and shed double-digit accuracy when the same items are asked open-ended. The open problem is *per-item attribution*: which questions did the model answer from knowledge, and which did it answer by working the options?

There is an obvious mechanistic move here. Look inside. Snapshot the residual stream at the last prompt token - the moment before the model must commit to an answer - for the same question rendered with options (`mcq`) and without (`oe`). If the model held its answer from the question alone, the two states should look alike. If the options did the work, they should diverge. Take the cosine. Call it **FIRS**, the Format-Invariant Representation Score.

I built it, and it does not work. Not in the sense of a weak effect that needs more data - in the sense that it measures a different construct than the one it was built for. The score reads the *shape of the prompt* and the *form of the required output*, not knowledge. This project is that negative result, plus the checklist of cheap diagnostics that would have caught it in an afternoon.

## The metric [!id](metric)

Every MMLU question gets rendered four ways, all sharing a trailing `Answer:` suffix so the final token aligns across formats:

- `mcq` - the question plus four lettered options
- `oe` - the question alone, options stripped
- `mcq_shuffle` - options rotated so the correct one leaves its original position
- `mcq_nota` - the correct option's *text* replaced by "None of the above", keeping its position and the question's own three distractors

Activations come from `resid_post` at the final token, every layer, averaged over the 50-80% depth band (layers 12 to 19 of 26 in Gemma-2-2B):

$$\text{FIRS}(q) = \frac{1}{|L|}\sum_{\ell \in L} \cos\!\big(h^{(\ell)}_{\text{mcq}}(q),\; h^{(\ell)}_{\text{oe}}(q)\big)$$

The companion renderings are the interventions. `mcq_shuffle` isolates positional invariance. `mcq_nota` is the sharp one: it destroys exactly one thing, the surface content of the correct answer, and leaves everything else standing.

500 MMLU test questions, proportionally stratified over all 57 subjects. Two elicitation regimes kept side by side - 0-shot bare templates, and 5-shot with same-subject exemplars rendered in each format's own style. Open-ended correctness follows a protocol fixed before any results were seen: deterministic normalized string match, hand-audited, escalating to a blinded LLM judge that re-scores *only* the match-negatives, so it can flip false negatives and nothing else. Both regimes tripped the audit threshold, so everything is reported under both scorers. That duplication was meant as a robustness formality. It became the finding.

## The headline result is a property of the scoring rule [!id](scorer) [!accent](copper)

At 0-shot the primary correlation is null under both scorers, with the two point estimates sitting on opposite sides of chance (match AUC 0.521, judge 0.446).

At 5-shot the metric appears to work. Under exact string match it predicts open-ended success at **AUC 0.698 [0.634, 0.760]** - a real-looking effect with a confidence interval clear of chance. Then add back the 57 correct paraphrases the judge recovers, and the same activations give **0.530 [0.471, 0.588]**. On the self-contained-question subset it lands at 0.465, the wrong side of chance entirely.

Nothing about the model, the prompts, or the representations differs between those rows. Only the definition of *correct* changed. At this effect size the scoring rule moves the estimate further than any signal in the representations does, and a claim that survives only under the lexical scorer is not a claim about knowledge.

The hero figure above explains how the manufacturing works. Partition the 5-shot answers into disjoint groups and take mean FIRS: verbatim-correct 0.641, judge-confirmed wrong 0.577, correct paraphrases 0.538. The paraphrase group is the one set of items where the model *demonstrably knew the answer without options*. A knowledge metric must score them high. FIRS scores them last, because their surface form departs from the gold string. That ordering is unproduceable by a metric measuring knowledge and forced for a metric measuring output form - and it is the same property the exact-match scorer rewards. The two correlate with each other, not with knowledge.
