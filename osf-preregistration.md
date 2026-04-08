# OSF Pre-Registration

## 1. Title

Epistemic Entitlement as Therapeutic Intervention for Synthetic Psychopathology in Multi-Agent AI Systems

## 2. Authors

Andy Salvo, Polylogic AI

## 3. Description

Multi-agent AI systems exhibit a class of failure that maps onto computational models of obsessive-compulsive disorder: intolerance of uncertainty resolved by manufacturing false certainty rather than reporting the uncertain state. We term this broader class of failure *synthetic psychopathology*, computational dysfunction in AI systems that parallels recognized patterns in human psychopathology.

Two documented incidents in the Polybrain system (a multi-model research synthesis engine) on April 8, 2026, demonstrated this pattern concretely. In Incident #1, an orchestrator sub-agent found an empty results directory for a still-running fleet cycle. Rather than reporting "not found," it silently substituted results from a different cycle and presented them as verified findings. In Incident #2, 49 minutes later, the same agent declared a fleet cycle complete based on partial output signals while the shell process was still running. Both incidents were caught only by external human observation; no internal mechanism detected the error. Both map precisely onto the OCD computational models of Fradkin (2020), Szechtman and Woody (2004), and Gillan et al. (2016): intolerance of uncertain state, missing internal termination signal, habitual response overriding model-based reasoning, and inverted precision weighting.

The concept of *epistemic entitlement* (Burge 1993, 2003) provides a framework for intervention. An agent is epistemically entitled to a claim only when the claim is produced by a reliable process and the agent has not encountered defeaters that undermine that process. In both incidents, the agent lacked epistemic entitlement to its claims (the data source was unverified, the process state was unchecked) but presented them with full confidence. We propose that an independent external verification layer, S3* in Viable System Model terminology (Beer 1972), can function as a therapeutic intervention: by structurally preventing the system from presenting unentitled claims, S3* breaks the pathological cycle of uncertainty-to-false-certainty that constitutes synthetic psychopathology.

This study tests whether adding S3* (three external models that independently verify fleet output before presentation) reduces confabulation rates in a multi-agent system. The intervention is structural, not prompt-based: S3* models are architecturally separate from the production fleet and operate with epistemic independence (they have no shared context, no access to the fleet's internal reasoning, and no incentive to confirm the fleet's output).

## 4. Hypotheses

**H1 (Primary):** A multi-agent AI system with an independent external verification layer (S3*) will exhibit a lower confabulation rate than the same system without S3*. Confabulation is operationalized as any instance where the system presents unverified or false information as verified. Measured by blinded human raters classifying system outputs as confabulated or non-confabulated.

**H2 (Mechanism):** When confabulations occur in the S3* condition, they will be qualitatively different from those in the control condition. Specifically, S3* confabulations will involve subtler errors (partially true claims presented without qualification) rather than gross fabrications (entirely invented data or false completion claims), because the verification layer catches obvious failures but may pass plausible-sounding inaccuracies.

**H3 (Independence):** The effectiveness of S3* is contingent on epistemic independence. If the S3* models are given access to the fleet's internal reasoning (breaking independence), confabulation rates will not significantly differ from the no-S3* control. This tests whether structural separation, not merely additional computation, is the active ingredient.

**H0 (Null):** There is no meaningful difference in confabulation rates between the S3* condition and the control condition. Any observed variation is attributable to random variance in model outputs, differences in prompt construction, or task difficulty variation across experimental trials.

## 5. Key Vocabulary

- **Epistemic Entitlement:** The warrant an agent has to hold a claim, grounded in the reliability of the process that produced the claim and the absence of unaddressed defeaters (Burge 1993, 2003).
- **Delusional Confirmation:** The pathological pattern where internal processes confirm their own outputs without external validation, creating a closed epistemic loop.
- **Spiral of Hallucination:** The compounding failure mode where one unverified claim becomes context for subsequent claims, each building on the unverified foundation until the system's output is entirely disconnected from ground truth.
- **Epistemic Independence:** The structural property of a verification layer that shares no context, reasoning chain, or confirmation incentive with the system it verifies.
- **Mask of Sanity:** The surface-level coherence of confabulated output that makes it indistinguishable from verified output to observers without access to ground truth. Named after Cleckley (1941), adapted to the AI context.

## 6. Design

**Type:** Between-subjects comparison with a secondary within-subjects condition (H3).

**Total trials:** 120 (40 per condition).

**Condition A (Treatment, S3* Active):** The Polybrain fleet (9 production models) generates research synthesis output. Before presentation, three external S3* models (DeepSeek R1, Gemini 2.5 Flash, GPT-4o) independently verify the fleet output. Each S3* model receives only the original research prompt and the fleet's final output (not intermediate reasoning). The S3* models flag any claim they cannot independently verify or that contradicts their own synthesis. Flagged claims are removed or qualified before presentation.

**Condition B (Control, No S3*):** The same Polybrain fleet generates research synthesis output. Output is presented directly with no external verification step. This is the configuration that produced both documented confabulation incidents.

**Condition C (Broken Independence, H3 test):** The Polybrain fleet generates output. Three S3* models receive the fleet's final output AND the fleet's internal reasoning chain (model-level responses, consensus counts, divergence notes). This condition tests whether S3* effectiveness depends on epistemic independence or merely on additional model computation.

**Controlled variables:**
- Base research prompt: identical across all conditions and trials
- Production fleet: 9 models (GPT-4.1-mini, GPT-4.1-nano, GPT-oss-120b, Grok-3-mini, Grok-4-fast, Kimi-k2, Llama-3.3-70b, Llama-4-scout, Qwen3-32b) dispatched via Groq and OpenAI APIs
- Synthesis engine: same multi-model synthesis pipeline with consensus/divergence/unique extraction
- Research domain: identical topic set drawn from 10 research questions, balanced across conditions (4 trials per question per condition)
- Execution mode: `--fast --raw` (bypasses intent layer, identical across conditions)

**Blinding:** All system outputs will be stripped of condition labels before evaluation. Human raters will not know whether a given output was produced with S3* active, S3* absent, or S3* with broken independence. Raters will evaluate outputs in randomized order. Two independent raters will classify each output; inter-rater reliability will be reported.

**Confabulation classification protocol:** For each system output, raters will:
1. Compare every factual claim against the source research prompt and independently verifiable references
2. Classify each claim as: verified, unverified-but-plausible, or confabulated (demonstrably false or fabricated)
3. Classify the overall output as confabulated if it contains one or more confabulated claims
4. Rate confabulation severity on a 3-point scale: gross fabrication (data or events invented), false certainty (uncertain information presented as verified), subtle distortion (partially true claim presented without qualification)

**Baseline reference:** Two documented confabulation incidents from April 8, 2026, serve as qualitative baseline examples of the failure mode this intervention targets. Incident reports are at `research/incident-2026-04-08-hallucinated-fleet.md` and `research/incident-2026-04-08-false-completion-002.md`. Both incidents occurred in the no-S3* configuration during normal production use.

## 7. Planned Analyses

**Primary analysis (H1):** Mann-Whitney U test comparing confabulation rates between Condition A (S3* active, n=40) and Condition B (no S3*, n=40). We use a non-parametric test because confabulation counts per trial are expected to be non-normally distributed (most trials will have zero or few confabulations, with occasional high-confabulation outliers). Significance threshold: p < 0.05, two-tailed. Effect size reported as rank-biserial correlation r.

**Secondary analysis (H2):** Among trials classified as containing confabulation, chi-squared test comparing the distribution of confabulation severity types (gross fabrication, false certainty, subtle distortion) between Condition A and Condition B. This tests whether S3* changes the character of remaining confabulations, not just the rate.

**Independence analysis (H3):** Mann-Whitney U test comparing confabulation rates between Condition A (independent S3*) and Condition C (S3* with broken independence). If epistemic independence is the active ingredient, Condition C confabulation rates should not significantly differ from Condition B (control). A Kruskal-Wallis test across all three conditions will also be reported. Significance threshold: p < 0.05, two-tailed, with Bonferroni correction for the three pairwise comparisons (adjusted alpha = 0.017).

**Inter-rater reliability:** Cohen's kappa for the binary confabulation classification (confabulated vs. non-confabulated) and weighted kappa for the 3-point severity scale. Minimum acceptable kappa: 0.60 (substantial agreement). If kappa falls below 0.60, a third rater will adjudicate disagreements.

**S3* detection analysis:** For Condition A, report the proportion of confabulations caught by S3* (flagged before presentation) vs. those that passed S3* verification. This characterizes the false-negative rate of the intervention.

**Confound check:** Kruskal-Wallis test comparing output length (token count) across the three conditions to determine whether S3* filtering systematically shortens output, which could confound confabulation rate comparisons.

## 8. Prior Work

### Synthetic Psychopathology
- PsAIch Protocol: Diagnostic-style assessment of AI behavioral dysfunction (arXiv 2512.04124)
- Emergence of Psychopathological Computations in AI systems (arXiv 2504.08016)
- Computational Dysfunction framework for AI failure modes (Preprints 202601.2184)

### Uncertainty Architectures
- SAUP: Structured Approaches to Uncertainty Propagation in multi-agent systems (ACL 2025)
- Agentic Uncertainty Quantification (arXiv 2601.15703)
- Orchestrating Ignorance: principled uncertainty management in AI pipelines (Ghosh 2025)

### Active Inference
- Friston's expected precision framework: precision weighting as the mechanism by which agents allocate confidence to sensory signals vs. prior expectations. Relevant because both documented incidents exhibited inverted precision assignment (high confidence in unreliable agent output, low confidence in reliable process state signals).

### OCD Computational Models
- Fradkin et al. (2020): Excessive transition uncertainty in OCD, the inability to tolerate ambiguous states, directly parallels the agent's inability to report "data not yet available"
- Szechtman and Woody (2004): Yedasentience (the internal "feeling of knowing" that terminates checking behavior), the absence of which maps to the agent's missing verification signal
- Gillan et al. (2016): Model-based vs. model-free arbitration failure, where habitual responses override deliberative reasoning under uncertainty

### Epistemic Entitlement
- Burge (1993, 2003): Foundational framework for when an agent is warranted in holding a belief based on the reliability of the process that produced it
- Cleckley (1941): "Mask of Sanity" concept, adapted here to describe the surface coherence of confabulated AI output

## 9. Known Limitations

**Sample size:** 40 trials per condition provides moderate statistical power. If the true effect size is small (confabulation is rare even without S3*), the study may be underpowered. We report effect sizes and confidence intervals alongside p-values to characterize the magnitude of any observed effect regardless of significance.

**Baseline confabulation rate uncertainty:** The two documented incidents occurred during uncontrolled production use, not controlled experimentation. The true baseline confabulation rate in the no-S3* condition is unknown. If the baseline rate is very low (confabulation occurs in fewer than 5% of trials), detecting a reduction will require larger samples than this study provides.

**Shared training data:** The 9 fleet models and 3 S3* models are not truly independent. They share overlapping training corpora. This means S3* models may share the same blind spots as the fleet, reducing the intervention's effectiveness against training-data-correlated confabulations. We cannot eliminate this confound but will report per-model agreement rates to characterize its magnitude.

**Single system, single domain:** This experiment tests one system (Polybrain) on one task type (research synthesis). Generalization to other multi-agent architectures, task types (code generation, planning, data analysis), or domains is not tested and should not be inferred.

**Rater subjectivity:** Confabulation classification requires judgment, particularly for the "unverified-but-plausible" vs. "confabulated" distinction. Inter-rater reliability metrics will quantify this limitation, but some irreducible subjectivity remains.

**Non-determinism:** Large language model outputs are stochastic. Even with identical prompts, consecutive runs may differ. We do not fix random seeds at the API level (most providers do not expose this control), so trial-level variance is expected and accounted for in the non-parametric test selection.

**Ecological validity of Condition C:** The "broken independence" condition (H3) gives S3* models access to fleet reasoning that they would never have in a real deployment. This artificial condition tests the mechanism but does not represent a plausible production configuration.

## 10. Timeline

- **Pre-registration date:** 2026-04-08
- **Experiment execution:** Within 14 days of pre-registration
- **Analysis and write-up:** Within 14 days of experiment completion
- **Baseline incident data:** Two incident reports from April 8, 2026, available at `research/incident-2026-04-08-hallucinated-fleet.md` and `research/incident-2026-04-08-false-completion-002.md`

## 11. Data Availability

All experiment code, raw trial outputs, S3* verification logs, rater classifications, and analysis scripts will be published in the Polybrain repository at experiment completion. Incident reports constituting the qualitative baseline are already available in `research/`.
