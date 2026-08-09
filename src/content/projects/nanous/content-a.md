# Code LM

## [!id](intro)

Build a LLaMA-style language model, an adapted byte-level BPE tokenizer, pre-train it on custom HuggingFace datasets, and use it to generate Python code. How fun!

Then keep going. Teach it to answer an instruction and stop, let it grade its own attempts by actually running them, and train it on the verdict. Nothing here is imported pre-built: no `AutoTokenizer`, no `transformers` architecture, no `trl`, no off-the-shelf pretraining set. Every piece gets built and motivated in the order you would genuinely need it, and every artifact is pushed to HuggingFace so the next notebook can pick it up.
