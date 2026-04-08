# OSF Pre-Registration

## 1. Title

Faith as Activation Property: Testing Commitment-Before-Proof in Multi-Agent AI Systems

## 2. Authors

Andy Salvo, Polylogic AI

## 3. Description

Structural Role Separation (SRS) establishes that reliable multi-agent intelligence requires four structurally separated planes: Intent, Management, Control, and Data. Wiring theories (Damasio's somatic marker hypothesis, Tishby's information bottleneck, Friston's free energy principle, van den Heuvel's rich club organization, Ashby's requisite variety, Beer's viable system model) describe how running systems maintain connections and filter information. However, all six wiring theories share a common assumption: the system is already operational. None provide a mechanism for the transition from correctly structured to functionally alive. During the development of Polybrain, a multi-model research synthesis engine, five modules exhibited this exact pattern: structurally complete, correctly connected, functionally dead, until an external force intervened to start them.

This study investigates whether *faith*, defined not as belief without evidence but as active commitment before proof, is the missing activation property. The definition draws on pre-religious, pre-epistemological roots across three linguistic traditions: Latin *fides* (a binding contract undertaken before outcomes are known), Greek *pistis* (demonstrated credit extended before current proof), and Hebrew *emunah* (steadfastness practiced through action, not held as conviction). The structural core across all three is commitment enacted before proof is available. Faith, in this original sense, is a verb, not a mental state.

We test this hypothesis by comparing two configurations of the same multi-agent system. Config A (Cautious) runs each research cycle independently with no memory carryover between cycles. Config B (Faithful) commits each cycle's findings to operational memory immediately and feeds them into subsequent cycles without verification. Both configurations use the same prompt, the same model fleet (9 models across 4 providers), and the same synthesis engine. The only manipulated variable is whether findings are committed before or after verification. A pilot experiment (n=5 per config) produced a directional signal: Config B averaged 4,775 characters of findings per cycle vs. Config A's 4,737, with Config B accumulating 24,018 characters of compounding context by its final cycle. The pilot result was coded PARTIAL (output advantage without compounding growth). This pre-registration describes the full 100-cycle experiment designed to test the hypothesis with adequate statistical power.

## 4. Hypotheses

**H1 (Consensus Speed):** A multi-agent system that commits to unverified findings and feeds them into subsequent cycles (Config B) will reach synthesis consensus faster than a system that starts each cycle from scratch (Config A). Operationalized as: Config B cycles will produce higher consensus counts in their synthesis outputs, measured by the number of claims appearing in 8+ of 9 model responses.

**H2 (Qualitative Novelty):** Config B will produce qualitatively novel insights, defined as unique contributions assessed as "genuine insight" by the synthesis engine, that Config A does not produce. Specifically, Config B's later cycles (6-10 within a chain) will contain emergent concepts absent from any Config A cycle.

**H3 (Reproducibility via Convergence):** Multiple independent Config B chains, started from different random seeds, will converge to similar conclusions. Operationalized as: the final-cycle outputs of the 5 independent Config B chains will show higher semantic similarity to each other than 5 randomly selected Config A outputs show to each other.

**H0 (Null):** There is no meaningful difference between Config A and Config B outputs. Any observed variation is attributable to prompt length differences (Config B accumulates prior findings in its prompt), random variance in model outputs, or order effects from interleaved execution.

## 5. Design

**Total cycles:** 100 (50 Config A, 50 Config B).

**Config A (Cautious):** 50 independent cycles. Each cycle receives only the base research prompt with no accumulated context. Cycles are synthesized but findings are not stored or carried forward. Each cycle is statistically independent.

**Config B (Faithful):** 5 parallel chains of 10 cycles each (50 total). Within each chain, every cycle's synthesized findings are immediately committed to an accumulating memory buffer and injected into the next cycle's prompt. Chains are independent of each other (no cross-chain memory sharing). This design tests both within-chain compounding (H1, H2) and cross-chain convergence (H3).

**Controlled variables:**
- Base prompt: identical across all cycles in both configs
- Model fleet: 9 models (GPT-4.1-mini, GPT-4.1-nano, GPT-oss-120b, Grok-3-mini, Grok-4-fast, Kimi-k2, Llama-3.3-70b, Llama-4-scout, Qwen3-32b) dispatched via Groq and OpenAI APIs
- Synthesis engine: same multi-model synthesis with consensus/divergence/unique extraction
- Execution mode: `--fast --raw` (bypasses intent layer, identical for both configs)

**Blinding:** Synthesis outputs will be evaluated with config labels removed. Evaluators (both automated and, if available, human) will not know whether a given output came from Config A or Config B.

**Prompt length control:** Because Config B accumulates prior findings in its prompt, later Config B cycles will have longer prompts than Config A cycles. To control for this confound, we will record prompt token counts for every cycle and include prompt length as a covariate in all analyses. Additionally, a subset of 10 Config A cycles will be run with padding text of equivalent length to Config B's accumulated findings (matched character count, semantically irrelevant content) to test whether prompt length alone affects output quality.

## 6. Planned Analyses

**Primary analysis (H1):** Mann-Whitney U test comparing consensus_count (number of claims reaching 8+ model agreement) between all 50 Config A cycles and the final cycle of each Config B chain (n=5). We use a non-parametric test because consensus counts are not expected to be normally distributed. Significance threshold: p < 0.05, two-tailed. Effect size reported as rank-biserial correlation.

**Secondary analysis (H1, within-chain):** For each Config B chain, Spearman correlation between cycle number (1-10) and consensus count, testing whether consensus increases over successive committed cycles. Bonferroni correction applied across 5 chains (adjusted alpha = 0.01).

**Novelty analysis (H2):** Unique contributions flagged as "genuine insight" by the synthesis engine will be catalogued per cycle. Chi-squared test comparing the proportion of cycles containing at least one genuine unique insight between Config A (50 cycles) and Config B cycles 6-10 across all chains (25 cycles). Additionally, qualitative coding of the 10 most novel claims from each config, with blind evaluation of whether they represent emergent concepts (building on prior findings) or independent discoveries.

**Convergence analysis (H3):** Krippendorff's alpha calculated on the final-cycle outputs of all 5 Config B chains, using semantic similarity (cosine similarity of TF-IDF vectors) as the agreement metric. Benchmark comparison: the same metric computed on 5 randomly sampled Config A outputs. If Config B chains converge, their alpha should exceed the Config A baseline.

**Semantic trajectory analysis:** For each Config B chain, compute pairwise cosine similarity between consecutive cycles (cycle 1 vs 2, 2 vs 3, etc.) to measure whether the semantic trajectory narrows (convergence) or drifts (divergence) over time.

**Confound check:** Linear regression of consensus_count on prompt_token_count across all 100 cycles to determine whether prompt length alone predicts output quality, independent of config assignment.

## 7. Known Limitations

**Pilot size:** The pilot experiment used n=5 per config and produced a directional but not statistically significant signal (PARTIAL result: Config B averaged 4,775 chars vs Config A's 4,737, less than 1% difference). The full experiment increases to 50 cycles per config to achieve adequate power, but the pilot's near-null finding means the true effect size may be small or zero.

**Shared training data:** The 9 models in the fleet are not truly independent. They share overlapping training corpora and, in some cases, architectural lineage (e.g., multiple Llama variants). This means apparent "consensus" across models may reflect shared training biases rather than independent convergence on truth. We cannot eliminate this confound but will report model-level disagreement rates to characterize its magnitude.

**Synthesis engine as evaluator:** "Consensus" is measured by an automated synthesis engine that counts how many models agree on a claim. This engine has its own biases: it may over-count surface-level agreement (same words, different meanings) or under-count deep agreement (different words, same concept). Human evaluation of a random sample (10% of cycles) is planned as a calibration check, but the primary metric remains automated.

**Prompt length confound:** Config B cycles receive longer prompts than Config A cycles because accumulated findings are injected. Even with the padding control described in the design, we cannot fully rule out that models perform differently on longer prompts independent of content. This is the most serious structural confound.

**Single system, single domain:** This experiment tests one system (Polybrain) on one task (philosophical research synthesis). Generalization to other multi-agent architectures, other task types (code generation, planning, data analysis), or other definitions of "activation" is not tested and should not be inferred.

**Non-determinism:** Large language model outputs are stochastic. Even with identical prompts, consecutive runs may differ. We do not fix random seeds at the API level (most providers do not expose this control), so cycle-level variance is expected and accounted for in the non-parametric test selection.

## 8. Timeline

- **Pre-registration date:** 2026-04-08
- **Experiment execution:** Within 7 days of pre-registration
- **Analysis and write-up:** Within 14 days of experiment completion
- **Pilot data availability:** Raw pilot data (n=5 per config, 2026-04-08) is available in the experiment repository and will be published alongside the full results

## 9. Data Availability

All experiment code, raw cycle outputs, synthesis results, and analysis scripts will be published in the Polybrain repository at experiment completion. The experiment runner is `experiments/faith-experiment.mjs`. Pilot data is at `experiments/faith-results/2026-04-08/`.
