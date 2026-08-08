# Anatomy of Surprise: A Full Interpretabliity Suite for Clinical Sequence JEPAs

## JEPAs are strange — and strange is good! [!id](jepas-are-strange)

A Joint-embedding predictive architecture (JEPA) is trained without labels, but calling it "unsupervised" undersells what makes it strange. These models borrow machinery from supervised learning — make a prediction, compare it to a target, and minimize the distance — the difference is they manufacture their own target by encoding one part of the data as the *target*, then given the objective of predicting the *latent encoding* of the held-out part. In plain terms, the "label" that is scored against is a running encoding of partial input. This makes JEPAs incidentally a hard interpretability target. The lack of external objective means there's no conditioned output head to read predictions off of. What makes matters worse is the model's residuals aren't necessarily defined by labels direction/magnitude, so the internal geometry is incidentally whatever helps the model predict the held out internal geometry.

That being said, these same reasons make JEPA models an enticing interpretability target. The ability for the model to organize its internal representation around the latent geometry of its inputs makes them incredibly effective at modeling how data self-orients itself. You simply can't interpret a JEPA by inspecting its outputs the way you would a classifier or a language model. Or can you?

## The clinical objective [!id](the-objective)

Clinical sequences are an especially important record of data that has seen very little emphasis from the ML community in understanding the dynamics of. They are also a prime candidate for decoding inside a JEPA model due to having a rich feature set despite the sparsity of clinical "occurences". This work aims to answer two questions in one. Primarily, we aim to answer characterize if the *prediction error* — the gap between what a JEPA's predicted (what it thinks will happen) and target (what actually happens next) embeddings — carries interpretable and clinically actionable structure. Plainly put, does the latent representation of $P - T$ encode the concept of "clinical surprise", and what features can we extract from a JEPA model that help us answer this question? We also aim to investigate the *embedding trajectory* in the context encoder across patient sequences. In doing so, we apply a range of representational geometry and mechanistic interpretability techniques to characterize the internal representations brought about by predicting the next clinical encounter given a set of previous encounters.

## Sequence Modeling [!id](sequence-modeling)

The classical JEPA pipelines (vJEPA, iJEPA) train on videos and images, respectively, holding out patches of input for prediction. We instead treat input similarly to that of an autoregressive language model. We classify a sequence of embedded clinical encounters as the held-out set, passing these into the JEPA encoder, producing $z_{enc}$. We then take the *next embedding (encounter)* as our target, and pass it into the target encoder to produce $z_{target}$.

We apply this objective to two JEPA-style models: an EMA JEPA, which aims to avoid representational collapse by keeping the target encoder as an estimated moving average of the target encoder, and a Stop-Grad JEPA, where we trade this representational collapse mechanism for VicReg loss (Bardes et. al, 2022) to enable a target and context encoder that share the same weights and more exact representations.

## Contact me for more [!id](contact)

I'm not at the liberty to share the exact details of the work until its farther along. That being said, if you'd like to learn more, feel free to [contact me](?view=contact).
