# Anatomy of Surprise: Interpreting Self-Supervised Clinical Sequences

## [!id](overview)

Clinical data can be described as a sequence of encounters. Inside each encounter, a variety of events can happen: diagnosed with X, started Y medication, etc. Just like encoding a token of text, each encounter holds fascinating temporal state about a patient. What were the encounter states leading up to a deteriorating diagnosis? How long between them? *Can we predict what comes next?*

Clinical encounters are generally sparse, despite being feature rich themselves. That combination is what makes them a prime candidate for JEPA models, and it is also a chance to decode how a model represents such information.

## JEPAs are strange, and strange is good! [!id](jepas-are-strange)

A Joint-embedding predictive architecture (JEPA) is trained without labels, but calling it "unsupervised" undersells what makes it strange. These models borrow machinery from supervised learning: make a prediction, compare it to a target, minimize the distance. The difference is that they manufacture the target themselves, encoding one part of the data as the *target* and taking on the objective of predicting the *latent encoding* of the held-out part. In plain terms, the "label" being scored against is a running encoding of partial input.

That incidentally makes JEPAs a difficult yet enticing interpretability target. With no external objective there is no conditioned output head to read predictions off of, and the model's residuals aren't defined by a label's direction or magnitude, so the internal geometry is whatever happens to help the model predict its own held-out internal geometry. That being said, self-supervised models such as JEPA that organizes its internal representation around the geometry of its inputs, not the inputs as they pertain to labels, are remarkably effective at showcasing data's structure. You can't simply interpret a JEPA by inspecting its outputs the way you would a classifier or a language model. Or can you?

## Sequence Modeling [!id](sequence-modeling)

The classical JEPA pipelines (vJEPA, iJEPA) train on videos and images, respectively, holding out multiple patches of input for prediction. We'll instead treat the input like a sequence of embeddings, similar to that of an autoregressive language model would: The previous encounters become the context, passed into the JEPA encoder to produce $z_{enc}$, and the *next encounter embedding* is the held-out target, passed into the target encoder to produce $z_{target}$.

We apply this objective to two JEPA-style models. An EMA JEPA avoids representational collapse by keeping the target encoder as an exponential moving average of the context encoder. A Stop-Grad JEPA trades that mechanism for VICReg loss (Bardes et al., 2022), which lets the target and context encoder share one set of weights, and with it, more exact representations.

## The clinical objective [!id](the-objective)

This work aims to answer two questions in one. First, we want to investigate the structure of how the model encodes encounters, both as individual encounter embeddings and as a chain of events (i.e., an "embedding trajectory"). Can we find concepts in these embeddings and compose them to reproduce an encoded state? Second, we want to measure the gap between the model's characterization of "what it thinks will happen" and "what does happen". Is that prediction error, the distance between the predicted embedding and the real one, just noise, or is it the model's "clinical surprise"?

These questions reach two things at once: mechanistic confounds not found in supervised models, and actionable clinical insight. Mechanistically, the residual between what the labels say (we have them, but we never feed them to the model) and what the geometry encodes can potentially uncover granularity (no single label encodes it), ambiguity (a feature sits between human concepts), and adversarial fragility (inputs firing features without instantiating the labeled concept). What's even more exciting is that those same concepts map directly onto unique and actionable reads of an encoded patient encounter sequence.

Which, I think, is really @#%&'ing cool.

## Contact me for more [!id](contact)

If you'd like to learn more about the work, feel free to [contact me](?view=contact). I'll post more here once analyses and reports are complete.
