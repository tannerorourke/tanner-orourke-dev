# Output Form, Not Knowledge

## Four ways it fails, none of them needing a correctness label [!id](condemned)

Everything in the section above depends on labels, a judge, and an audit. The construct-validity case needs none of them, and all four diagnostics replicate across both elicitation regimes.

- **Not format-specific.** A format-exploitation score should track open-ended fragility *specifically*. FIRS predicts plain MCQ accuracy about three times more strongly than the open-ended outcome at 0-shot ($r = -0.252$ vs $-0.088$), twice as strongly and with the opposite sign at 5-shot ($-0.195$ vs $+0.098$), and predicts shuffled-MCQ accuracy just as well. A score that anticipates every behavioral outcome equally is measuring general item difficulty.
- **Template-dominated, blind to option content.** Any two MCQ-shaped prompts sit near cosine 0.97 regardless of what their options say. Any MCQ/OE pair sits far below regardless of shared content. The one intervention that changes what the options *mean* barely registers.
- **Contaminated by prompt geometry.** Option-token fraction alone explains over a quarter of the variance.
- **At chance where the construct is defined.** Format exploitation only means anything for items the model gets right *with* options: an exploiter is MCQ-correct and open-ended-wrong, a knower is correct both ways. On that subset ($n = 271$ at 0-shot, $280$ at 5-shot) FIRS separates knowers from exploiters at AUC 0.469 to 0.491 across every cut, scorer, and condition. The metric's entire reason to exist, and it is a coin flip there.

The last one is the cheapest and the most damning, and it takes minutes to compute from the same forward passes that produce the metric.
