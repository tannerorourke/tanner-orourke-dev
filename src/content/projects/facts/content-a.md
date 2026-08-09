# Cross-Abstractive Alignment in Fact-Checking

## Overview [!id](overview)

LLMs are increasingly the first stop for people seeking information, fluent enough to mix supported claims with confident hallucinations in the same paragraph. [FActScore](https://arxiv.org/abs/2305.14251) (Min et al., 2023) gave the field a way to measure this: break a generation into atomic facts and report the fraction supported by a knowledge source. For ChatGPT biographies, human evaluators score around 58%.

The goal here was to characterize *where* automated fact-checkers get it wrong, not just how often. Using FActScore's released dev split - 31 ChatGPT-generated biographies, 221 human-labeled atomic facts, BM25-retrieved Wikipedia passages - surfaces a recurring failure mode I call *cross-abstractive alignment*.

## How to fact check [!id](how-to-fact-check)

The task: given an atomic fact (*"Marianne McAndrew is a singer"*) and up to five BM25-retrieved Wikipedia passages, label it **Supported** or **Not Supported**.

A lexical baseline asks how many of the fact's content words appear in the passage, TF-IDF-weighted so common words count for less than rare ones. Reaches **79.2%** accuracy. The intuition is that if a passage shares the fact's salient vocabulary, the fact is probably supported. That's workable until the fact and the passage say the same thing in different words, or until a single token decides truth (*"Under-23"* vs. *"U-20"*).

The entailment pipeline below swaps bag-of-words for a model trained to recognize when one sentence logically implies another. Reaches **85.5%**.

- **Windowing.** Each passage is split into sentences and adjacent bi-sentence pairs, normalized (NFKC, diacritic stripping) and lemmatized with spaCy. Each window becomes a candidate premise - a chunk small enough for the NLI model to handle.
- **Top-k pruning.** Each window gets a composite score against the fact: $\text{score} = 0.6 \cdot \text{recall} + 0.3 \cdot \text{Jaccard} + 0.1 \cdot \text{bigram}$ and only the top 24 pass to NLI. A passage often has dozens of candidate windows; the pre-score filters distractors before the slow model sees them.
- **DeBERTa-v3-MNLI entailment.** Each surviving window runs as premise against the fact as hypothesis, batched. The model outputs probabilities for *entail, neutral, contradict. Model: `MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli`.
- **Threshold + win-gap decision.** Predict S only if $\text{entail} \geq 0.55$ AND $\text{entail} - \max(\text{neutral}, \text{contradict}) \geq 0.15$. The threshold catches confidence; this stops 0.55-entail / 0.46-neutral coin-flip calls dressed up as confidence.
