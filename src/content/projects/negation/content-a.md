# Syntactic Negation Probing

## Overview [!id](overview)

If 'The room is never empty without music', then is 'The room empty with music'?

State-of-the-art NLI models routinely lean on shallow lexical heuristics - antonyms, bag-of-words overlap, and the presence of a single negation word - to clear benchmarks like SNLI. Dutifully so, negation is a common pitfall for these models, and we found that a fine-tuned ELECTRA-small drastically over-predicts when contradiction is in the premise, among other notable gaps.

This project asks the narrow question: *where* in a sentence does negation appear, and does that location change how the model behaves?

I fine-tuned a baseline `ELECTRA-small` discriminator on SNLI, then built a dependency-parse-driven analyzer (NPAS) that locates each negation cue inside the sentence's syntactic structure and assigns it to one of seven regions: root, subject, object, locative, attribute, modal, or quantifier. Slicing predictions by region - alongside lexical overlap and label distribution - surfaced a premise-side contradiction shortcut that a two-stage intervention (contrast-set augmentation plus slice-aware loss reweighting) could mitigate, but not remove.

## Headline findings [!id](headline)

Three results drove the rest of the project:

- **Negation has a location, and the location matters.** Slicing by dependency region - not just by whether a negation word appears - exposes failures invisible to coarser analysis. Premise-root and premise-subject negation accuracy stayed in the 58-59% range while overall accuracy held at 86%.
- **Premise negation is vanishingly rare in SNLI.** Only ~0.6% of validation examples contain a negation cue in the premise - captions from Flickr30k almost never assert what is *not* happening.
- **The model overgeneralizes 'negation -> contradiction', but only on the premise side.** Hypothesis-negation reflects a real dataset prior (NRI ≈ 0.025); premise-negation injects an unwarranted bias (NRI ≈ 0.099) where gold labels don't actually skew toward contradiction. Augmentation reduced this on rare slices but pushed the bias *up* on PREM_ONLY (NRI ≈ 0.147) - the shortcut is structural, not just under-sampled.
