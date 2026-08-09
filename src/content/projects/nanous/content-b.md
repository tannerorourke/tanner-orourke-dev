# Code LM

## What you'll do [!id](what-youll-build)

In rough order:
- Build and train a byte-level BPE tokenizer from-scratch, custom fit to avoid splitting common keywords.
- pre- and post-processing pipeline, targeting special tokens such as indents, dedents, comments, and Fill-in-the-middle training sample adaptation.
- Create a custom dataset specifically designed for technical comprehension and code completion.
- Train and sample from a LLaMA-style language model on the custom dataset.
- Instruction-tune it so it answers the task and then stops, instead of politely continuing the prompt.
- Sample it against real unit tests, keep what passes, and train on the wins and on the win/loss pairs.
- Circle back and wrap it all up to ship on HuggingFace.

## The notebooks [!id](notebooks)

Five notebooks, plus an introduction that maps them. Each one is a public Colab that reads against the same installable package, so you fork the repository, `pip install -e .`, and run against real modules rather than pasted cells. Each stage consumes the previous stage's published artifact, which means you can join anywhere without rerunning what came before.

If you have never built a language model end to end, start at the top.

- [Introduction](https://colab.research.google.com/drive/1nwCKzG2hFeQyrmINdJxji_f_vJVf9AUv?usp=sharing) - the map. What gets built, in what order, and where every artifact lands.

1. [Source Data](https://colab.research.google.com/drive/1kw-R7hznFjHwpF3UYg7zFcp4VUdCveVR?usp=sharing) - choose seven sources, normalize them to one field, and solve the mix so the *token* proportions land where you want them.
2. [Tokenizer](https://colab.research.google.com/drive/1jKz9KB1qISMOmQn7xffbHVzP4WiNOXcu?usp=sharing) - byte-level BPE from scratch, with Python keywords locked, indentation rewritten into scope tokens, and fill-in-the-middle sentinels added.
3. [Base Model](https://colab.research.google.com/drive/1XE-3OBhWYlssQRXc2_s9lZnhmjfWqCVB?usp=sharing) - assemble the decoder one component at a time, run each piece before stacking it, then pretrain the whole thing.
4. [SFT](https://colab.research.google.com/drive/1TTdyEzp106U--42HO6PQ2WsCjJJbZY96?usp=sharing) - instruction tuning with the loss masked to the completion, plus decode-time constraints that make the output shape free.
5. [RFT & DPO](https://colab.research.google.com/drive/1urlRWYFI1ojhvB64t46Epv4g3zybZSgv?usp=sharing) - sample, execute, label by whether the tests pass, and train the model toward its own successes.

## A data mix you solve, not guess [!id](corpus)

A model can only learn what its training data shows it, so the corpus comes before a single layer of the network. Seven sources stream from the Hub and interleave into one: whole Python files for the backbone, five instruction sets for the task-and-solution shape, and English prose so the model can read a request phrased in a way it has never seen.

The subtlety that makes this a real exercise is that interleaving samples **documents**, while the model trains on **tokens**, and mean document length varies about fourfold across these sources. A document mix is therefore not a token mix. The sampling weights are solved backwards from the target - roughly 78% code by token - using survival rates measured against the live datasets rather than round numbers, and per-source character caps are set from measured length distributions. A single global cap would quietly select for whichever source happens to be shortest.

Every source is normalized into one shape, `## Task` then `## Solution`, and that shape never changes again. Not in pretraining, not in instruction tuning, not in preference tuning. Fine-tuning is then sharpening a distribution the model already occupies rather than teaching it a new interface.

## The tokenizer is where the code knowledge goes [!id](tokenizer)

Byte-level BPE is a compression algorithm, and it does not care what your tokens mean. Left to itself it will happily learn `const` as `con` + `st`, because `con` is a frequent English prefix - and now the model has to reassemble from two unrelated pieces an idea that was atomic to begin with. Tokenizing Python and English into one vocabulary is genuinely harder than either alone, and that collision is where most of the design work goes.

The fix is semi-supervised. Seed the Python keywords, the operators, and the code fence into the vocabulary before training starts, and give them their own branch in the split pattern so they are never split. They get an id at construction, which also means they hit the merge cache immediately.

Two further code-specific commitments:

- **Indentation is treated as syntax.** Inside a fenced block, leading whitespace is rewritten into explicit `<|indent|>` and `<|dedent|>` scope transitions, with tab width detected per document and open scopes closed at the end. The model reads structure directly instead of spending capacity rediscovering it from runs of spaces, and deeply nested code costs far fewer tokens.
- **Generation is not only left-to-right.** Fill-in-the-middle sentinels, following [Bavarian et al. 2022](https://arxiv.org/abs/2207.14255), reorder a document so ordinary next-token training also teaches infilling. The reorder happens on the already-tokenized id stream, so splits land on real token boundaries and each sentinel is a single token. It is applied to training text only, never to validation, so validation loss stays comparable across runs.

The trainer is the half GPT-2 never released. The encoder was public; the code that actually fits the merge table was not, so you write it here. Keeping it tractable is its own lesson: an inverted index from pairs to the words containing them means each merge only touches the words that changed, instead of rescanning the corpus.

## A modern decoder, one part at a time [!id](decoder)

The skeleton starts as GPT-2, and then each component is replaced by its modern counterpart deliberately, one at a time, so you can see what each swap actually buys:

- **RoPE** injects position by rotation, so an attention score depends only on the relative offset between two tokens. That retires the learned position table and extrapolates past the trained context length.
- **SwiGLU** replaces the 4x GELU feed-forward, sized to `2/3 * 4 * emb_dim` so the three-matrix gated block matches the two-matrix block's parameter count exactly. A parameter-matched swap is the only kind you can honestly compare.
- **RMSNorm** is cheaper than LayerNorm and drops a parameter tensor with no quality cost.
- **QK-norm** applies a per-head norm to queries and keys, bounding the attention logits and buying the stability to train at a higher learning rate.

Nothing in the architecture is novel, and that is deliberate. Every piece is standard; the value is understanding *why* each one earns its place at this scale. You build and run each component on its own before stacking it, predict what an untrained model's loss should be before training it, and overfit a single batch first - because a stack that cannot memorize one batch has a bug, not a data problem.

## Post-training, built rather than imported [!id](post-training)

A pretrained model is a next-token reflex. Prompt it with an instruction and it will cheerfully continue the *instruction* - tack on another bullet, open a second `## Task` - rather than answer it. The knowledge is in there; the habit of responding and then stopping is not. Three stages install it, and none of them reaches for `trl` or `peft`.

**Supervised fine-tuning** changes the objective from $\log p(x)$ to the conditional $\log p(y \mid x)$. Nothing about the architecture or the forward pass changes. The only difference is which positions the loss scores: prompt tokens still flow through the model, because the answer has to attend to them, but they contribute zero gradient. Two details carry the stage. Each response is stripped to its fenced code block, so supervision goes to Python instead of to English *about* Python. And the prompt/completion boundary is measured rather than searched for, because a BPE merge can straddle the `## Solution` marker and there is no guarantee it lands on a token edge. Get that off by one and it fails silently.

**Preference learning** needs a verdict on which of two answers is better. Classical RLHF collects human comparisons and fits a reward model to them; at this size that is one more weak learner to trust, judging code it cannot run. So strip it back to the one ground truth code actually has: does it execute, and does it pass the tests? Each held-out task gets k completions sampled from the instruction-tuned model, and each completion runs against the task's own asserts in an isolated subprocess.

That single expensive pass feeds two stages. Passing samples become a rejection fine-tuning set, which is just fine-tuning again on self-generated, execution-filtered targets. Tasks that produced both a pass and a fail become chosen/rejected pairs for direct preference optimization. The pairs are on-policy by construction, because the model wrote both sides, and the label is not a proxy for correctness - it *is* correctness. Rejection fine-tuning is the robust half: a task where every sample passes still donates good targets, while preference pairs need a task hard enough to sometimes fail and easy enough to sometimes pass. That band is scarce at this size, so the notebook gates the whole stage on a probe that checks whether enough pairs even exist before you spend the compute.

Because every completion has exactly one shape, that shape can be enforced at decode time instead of hoped for. The opening fence is appended to the context rather than sampled, so a model that has not fully learned the format cannot fail to open one; generation halts on the closing fence, so trailing prose is impossible; and candidates that fail `ast.parse` are discarded before you ever look at them. The fence is a single token, which is what makes stopping one id comparison instead of a suffix match.

## What it can't do, and why that's in the notebooks [!id](honest-limits)

The whole project targets one GPU, and the reference pretraining run is about six hours on a single A100. At roughly 19 tokens per parameter that is far below what a model this size wants, and it is a compute decision rather than a claim about optimality. Three intermediate checkpoints are kept and evaluated as a scaling curve, so you watch loss and parse rate still climbing at the moment training stopped instead of taking the limitation on faith.

That choice shapes everything downstream. Post-training can fix the failure modes that live in the output distribution - format adherence, stopping, not derailing - and it cannot manufacture knowledge the base model never saw. An undertrained base post-trains into a model that reliably emits well-formed Python that is wrong. Which is exactly why correctness here is measured by execution rather than by loss, and why the harness reports parse rate separately from pass@k: at this scale, form is learned well before function, and collapsing the two hides the interesting half.

The scope is narrow on purpose too. NanoCoder reads English and writes Python, and it is never asked to do anything else. It cannot explain itself, hold a conversation, or decline a task. Naming that up front is cheaper than discovering it later, and it is what makes the narrow output space worth the trade.

## Check it out [!id](check-it-out)

Get started with the [Introduction](https://colab.research.google.com/drive/1nwCKzG2hFeQyrmINdJxji_f_vJVf9AUv?usp=sharing), or go straight to [NanoCoder 1: Source Data](https://colab.research.google.com/drive/1kw-R7hznFjHwpF3UYg7zFcp4VUdCveVR?usp=sharing) and start building.

The package and all six notebooks live on [GitHub](https://github.com/tannerorourke/NanoCoder) - fork it and read the notebooks alongside the modules, which is how they are meant to be used. The finished weights are on HuggingFace: [NanoCoder-123M](https://huggingface.co/torq1/NanoCoder-123M) for the pretrained base, and [NanoCoder-123M-Instruct](https://huggingface.co/torq1/NanoCoder-123M-Instruct) for the instruction-tuned one.

If you use any of this to teach, please credit me or reach out. I would love to hear where it ended up.
