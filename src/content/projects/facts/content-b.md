# Cross-Abstractive Alignment in Fact-Checking

## FActScore framing [!id](factscore-framing)

FActScore measures system-vs-human agreement on percent-supported across a generation. On this dev subset, the classifier puts ChatGPT at 47.1% supported vs. human-derived 50.7% - a 3.6 percentage-point gap. [The paper](https://arxiv.org/abs/2305.14251) reports under 2 percentage points on the full test set using LLM-as-judge instead of NLI. The goal here wasn't to beat that number; it was to do the error analysis the single number hides.
