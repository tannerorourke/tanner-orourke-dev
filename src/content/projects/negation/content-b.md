# Syntactic Negation Probing

## Locating negation with dependency parses [!id](npas-intro)

The diagnostic engine for the whole project is a small pipeline I call **NPAS** (Negation-Perturbation Analysis with Slices). Most negation analyses in NLI ask a binary question: does this sentence contain a negation word? NPAS asks a structural one instead - where does the negation attach, and what is it modifying?

For each premise and hypothesis, NPAS runs a spaCy dependency parse, then detects cues using three parallel strategies. **Token rules** catch single-word negators (`not`, `n't`, `never`, `no`), negative pronouns (`nobody`, `nothing`), negative verbs (`deny`, `refuse`, `lack`, `fail`), the `without` preposition, and the `rule out` particle verb. **Phrase patterns** match multi-token cues like `never ever` and `in no way` via spaCy's Matcher. **Sentence-level rules** handle `neither…nor` coordination.

Each cue's *anchor* - the token it grammatically modifies - is then classified into one of seven regions by inspecting its dependency label, part-of-speech tag, and children: `root` for the main predicate, `subject` for negated noun-phrase subjects, `object` for direct/indirect objects and complements, `locative` for prepositional phrases, `attribute` for adjectival predicates, `modal` for auxiliary verbs, and `quantifier` for determiners and numerals. Each cue's *scope* is taken as the anchor's subtree, clipped to the sentence. This gives per-pair feature flags like `prem_neg_subject` and `hyp_neg_root` that the rest of the analysis slices on.
