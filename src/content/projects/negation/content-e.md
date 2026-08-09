# Syntactic Negation Probing

## Takeaways [!id](takeaways)

- **Dependency-parse slicing surfaces failures that bag-of-words analysis hides.** 'Does the sentence contain a negation word?' is too coarse - the same word in subject vs. root vs. locative position produces measurably different model behavior. The seven-region taxonomy turns out to be the right granularity for this dataset.
- **Slice-aware augmentation can stabilize aggregate accuracy while exposing rare patterns** - the augmented model didn't regress on the easy majority slice, which isn't guaranteed.
- **Lexical overlap is not where the model fails most.** The baseline handled high-overlap examples (92%) better than low-overlap (85%). The interesting failure mode is structural, not surface.
- **'Hypothesis-negation -> contradiction' is mostly a real dataset prior.** The model isn't inventing it; it's learning what SNLI teaches. NRI is the tool that separates real coupling from spurious shortcut.
- **Premise-negation is the spurious one - and dataset-side fixes don't fully resolve it.** Even after augmentation and reweighting, premise-root and premise-subject negation accuracy stayed in the 58-59% range. Architectural interventions (residual debiasing heads, ensemble-based artifact experts) are likely needed for real movement here.
- **Building NPAS was 60% of the value.** Once you can ask 'where does negation live?' as a structured query rather than a regex, every other diagnostic in the project comes nearly free.

## Limitations and what I'd do next [!id](limitations)

Three honest caveats. First, every result is tied to SNLI; the contrast sets are small and adversarial by construction, not a sample of natural premise-negation. Second, NPAS region assignment relies on spaCy's parser plus hand-written rules - parser errors and dependency-vs-semantic-scope mismatches are the dominant noise source, and complex sentences are likely mis-categorized at non-trivial rates. Third, the project deliberately froze the model architecture to isolate dataset-side effects; prior work (residual correction heads, artifact-expert ensembles, debiased fine-tuning) suggests the ceiling on premise-negation slices is much higher with model-side interventions.

If I picked this up again I'd swap the rule-based scope detection for a learned negation-scope model, scale the contrast set with templated generation rather than hand-editing, and pair the reweighting scheme with a small residual debiasing head - partly to test whether NRI on premise-negation can actually be driven to zero, and partly because the diagnostic toolkit deserves a stronger model to evaluate.
