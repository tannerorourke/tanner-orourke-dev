# Output Form, Not Knowledge

## Why no capture point could have saved it [!id](mechanism)

The failure is structural rather than a matter of tuning. At the scored position the MCQ prompt must emit a *letter* and the open-ended prompt must emit a *content word*, so the cosine there largely measures letter-mode versus word-mode. And there is nowhere better to look: the two prompts are token-identical up to the question and diverge only after it. Every capture point is either **before** the divergence, where causal attention makes the activations identical and the cosine is exactly 1.0, or **after** it, where the required output types differ and the comparison is contaminated. No hook placement escapes.

My own pre-registration checked the wrong invariant. I verified that the final *token* matched across formats - both prompts end in the colon of `Answer:` - and treated that as licensing the comparison. Token identity is not task identity. What mattered was that the *next* token's job differed.

Two follow-ups close the obvious escape routes. If output mode were a separable additive component, projecting it out might expose knowledge underneath: the dominant shared direction carries 48-61% of the MCQ-to-OE difference energy, and removing it raises mean cosine from 0.703 to 0.845 while leaving every diagnostic correlation essentially unchanged. What remains is still difficulty, still not format-specific. And the natural template repair - moving the options *before* the question so both formats end in an identical suffix - fails differently: the model regurgitates the option block instead of answering. That redesign did not merge the two output spaces, it invented a third. The confound belongs to the metric family, not to my template.

## The bug I kept in the paper on purpose [!id](bug)

The first extraction truncated open-ended continuations at the first newline. Gemma-2-2B is a base model, and base models routinely open with a newline and answer on the next line, so roughly nine in ten answers were silently discarded. The "non-empty" cut quietly meant *"answered without a leading newline"*.

That run produced a statistically significant **reversal**, AUC 0.334. And I believed it, reasoning that label noise attenuates effects toward chance and cannot manufacture one. That reasoning is true of noise and irrelevant here: the bug was a *selection rule correlated with the outcome*, not noise. Repairing it sent the effect to chance.

I kept the episode in the write-up because "the effect strengthened as the labels improved, so it must be real" is an inference pattern other people will find exactly as persuasive as I did.

The separate elicitation lesson: 5-shot demonstrations fixed every base-model pathology at once - option copying, boilerplate, the newline habit - which confirms the degeneracy was framing rather than capability. MCQ accuracy 0.560, 100% letter parsing, all 500 continuations non-empty. Cleaner behavior made the construct failure *sharper*, not better.

## What survives [!id](survives)

The instrument is fine. It reliably measures final-token representational similarity across formats. What failed is *construct validity* - the gap between what it measures and what I claimed it measures. A thermometer that turns out to reliably measure humidity is not broken, but you cannot call it a thermometer. The deflating part is that what it actually tracks - prompt shape, output mode, item difficulty - is all measurable directly and more cheaply, so it is not even a useful proxy.

Five lessons that transfer past this metric:

- **Token identity is not task identity.** Align what the model must *do* at the compared position, not the token sitting at it.
- **A scorer-fragile effect is no effect.** Report a lexical *and* a semantic scorer, and distrust anything that survives only the lexical one.
- **Label repair is not evidence.** Movement under improving labels carries no weight when the original error was a selection rule.
- **Similarity conflates content with form.** "Does the model know this" is a decoding question. Invariance is not a substitute for recoverability.
- **Run the construct checks first.** Every diagnostic here except one computes without any correctness label, in minutes, from forward passes you already have. I ran the expensive primary validation first because it was the headline. The cheap checks would have killed the design before the headline existed.

## Where it goes next [!id](next)

The reframe that survives the negative result: stop asking how *similar* two representations are, and start asking whether the answer content is **recoverable** and whether the options **assist the readout**. Four designs in rising order of evidential strength:

1. Decode answer *text* from the options-free representation. (My originally planned probe targeted the correct *letter* - information the open-ended prompt never contains, so it was invalid by construction.)
2. Rank each option's text by its likelihood as a continuation of the bare question.
3. Grade format assistance by where the correct option sits in that options-free ranking.
4. Activation patching: transplant the open-ended hidden state into the MCQ forward pass and see whether the correct letter still emerges - the causal form of the question FIRS asked correlationally.

The third is the practical next step, and it runs on artifacts this pipeline already produces. Bucket MCQ-correct items by the options-free rank of the correct answer: rank 1 means the model knew it, rank 2-3 means the options lifted it, rank 4 or absent means position or guessing. If the middle bucket comes back empty the mechanism is not there and the follow-on dies in an afternoon. If it is populated, that is a graded, behaviorally-defined format-assistance signal - the thing FIRS never had.

Either way it runs as a *new* project. This one is a finished unit with a claim, four diagnostics, a scorer-robustness check, and a mechanism. Bolting a half-built successor onto it would dilute a crisp story, and a second dead end under the same banner would retroactively muddy the first.
