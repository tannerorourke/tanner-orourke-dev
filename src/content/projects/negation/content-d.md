# Syntactic Negation Probing

## Intervention: contrast sets + slice-aware reweighting [!id](intervention)

The diagnosis pointed at two targets - under-coverage of premise-negation in the training distribution, and an over-strong shortcut that the model had already internalized. The intervention attacked both, deliberately keeping the architecture frozen so any improvement could be attributed to data-side changes alone.

First, I hand-built ~150 contrastive examples seeded from SNLI premises with explicit negation, generating hypotheses that (i) preserve the core event, (ii) cover under-represented region patterns identified by NPAS, and (iii) deliberately produce `NEUTRAL` or `ENTAILMENT` labels - directly attacking the 'premise negation = contradiction' shortcut. Examples were split 70/30 into train and validation after a deterministic shuffle.

Second, after a dry training run to recompute slice error rates, I applied a margin-dependent reweighting in the cross-entropy loss: examples in slices where the baseline performed worse than overall accuracy (premise root, premise subject, premise quantifier) were upweighted; slices the baseline already handled well were left alone. Optimizer, batch size, and epoch count stayed identical to the baseline.
