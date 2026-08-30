# Cross-Abstractive Alignment in Fact-Checking

## [!id](takeaways-list)

- **NLI is the bottleneck, not retrieval.** Every false negative happens after NLI sees a relevant window - the model just scores it low, usually under 0.05. The cross-abstractive pattern explains why: NLI handles same-granularity comparisons cleanly and falls off cliffs at cross-granularity ones.
- **Win-gap beats threshold alone.** Requiring entailment to beat $\max(\text{neutral}, \text{contradict})$ by 0.15 removes the kind of false positive where the model is 0.55 entail / 0.46 neutral. The decision rule needs more than one number.
- **Some of the errors aren't errors.** About a third of the 32 misclassifications look like data quality issues - facts mislabeled by annotators (*"Cleveland is in Ohio"* labeled NS) or passages that don't mention the relevant entity. The printed-gold ceiling is probably around 90%.

## Parting thoughts [!id](parting-thoughts)

Fact-checking matters because LLMs are now embedded in workflows where users treat their output as authoritative. The same property that makes them useful - synthesizing across context - also makes them prone to plausible-sounding errors that are hard to spot without verification. Automated fact-checking is one piece of the broader effort to keep these models accountable to ground truth; the cross-abstractive failure mode points at where current pipelines need work. Three things I'd try next:

- **Sentence-embedding pre-pruning.** Run sBERT or E5 alongside the lexical composite score. Catches the FGM-style false negatives that get killed by zero lexical overlap before NLI sees them.
- **Per-fact threshold calibration.** Detail mismatches and summarization-style facts almost certainly want different operating points. The fact that every false negative is a threshold miss suggests the threshold is wrong for some facts, more than the model is.
- **LLM-as-judge in place of NLI.** The paper's actual automated pipeline. Would close the FActScore gap and handle the multi-sentence-synthesis cases NLI breaks on. The real reproduction of FActScore lives here.
