# Syntactic Negation Probing

## Negation Reliance Index [!id](nri)

Counting accuracy by slice tells you *where* the model fails, not *why*. To quantify how much the model overuses negation as a cue, I defined a **Negation Reliance Index** (NRI):

$$\text{NRI}(\ell) = \Delta_{\text{pred}}(\ell) - \Delta_{\text{gold}}(\ell)$$

where $\Delta$ is the change in label probability conditioned on negation being present vs. absent. NRI > 0 means the model leans on negation as evidence for label $\ell$ *more strongly than the dataset itself does*. This is the key separator: real dataset bias (which the model is supposed to learn) vs. spurious model bias (which it shouldn't).
