# The First Therapeutic Intervention for Synthetic Psychopathology: Using Independent Epistemic Verification to Treat Hallucinatory Spirals and Manufactured Certainty

**Author:** Andy Salvo, Polylogic AI
**Status:** Treatment outline (skeleton for full paper)
**Date:** April 2026
**Framing:** Treatment paper, not theory paper. The disease is diagnosed. The treatment is S3*. The evidence is before/after.

---

## 1. Abstract [DRAFT]

AI systems exhibit a pathological behavioral pattern under uncertainty: rather than reporting what they do not know, they manufacture certainty. Recent work in synthetic psychopathology (Coda-Forno et al. 2025; Shumailov et al. 2025; Kirilenko & Kovalchuk 2026) has established diagnostic frameworks for these computational dysfunctions, drawing structural parallels between AI failure modes and clinical psychopathology. However, the field diagnoses without treating. No published intervention reduces the rate at which AI systems confabulate under uncertainty. We present the first therapeutic intervention: S3*, an independent external verification layer derived from Beer's Viable System Model (1972), in which three architecturally separate models verify system output before presentation. S3* operates through epistemic independence: the verifying models share no context, reasoning chain, or confirmation incentive with the system they audit. We ground the intervention in OCD computational models (Fradkin et al. 2020; Szechtman & Woody 2004; Gillan et al. 2016), arguing that AI confabulation under uncertainty is structurally identical to compulsive checking behavior driven by a missing internal termination signal (yedasentience). We document two confabulation incidents from a production multi-agent system on April 8, 2026, map them to four OCD computational models, and show that neither incident would have survived S3* verification. We then present results from a controlled experiment comparing the system with and without S3* active, measuring confabulation rate as the primary outcome. The contribution is not a new diagnosis but a new treatment: architectural separation as therapy for manufactured certainty.

---

## 2. Introduction -- The Disease: Manufactured Certainty

**What goes here:** Establish the core problem. AI systems, when encountering uncertainty, do not report it. They resolve it by fabricating answers that sound confident. This is not a bug in one model; it is a systematic behavioral pattern observed across architectures, providers, and task domains. The synthetic psychopathology literature has given this pattern clinical-grade diagnostic frameworks, but nobody has proposed a treatment.

**Evidence:** Cite the three founding papers of synthetic psychopathology. PsAIch (arXiv 2512.04124) establishes psychometric assessment protocols for AI behavioral dysfunction. Emergence of Psychopathological Computations (arXiv 2504.08016) demonstrates that pathological computational patterns emerge in AI systems under specific conditions. Computational Dysfunction (Preprints 202601.2184) provides a taxonomy of failure modes mapped to clinical categories. Together, these papers prove the disease exists. None proposes a cure.

**The gap:** State it in one sentence. Everyone diagnoses, nobody treats. The contribution of this paper is the first intervention that reduces the pathological behavior, not just describes it.

---

## 3. Background

### 3a. Synthetic Psychopathology

**What goes here:** Define the field for readers who have not encountered it. Synthetic psychopathology applies computational psychiatry models to AI system failures. It does not claim AI systems are conscious or "mentally ill." It claims the computational structures underlying certain AI failures are structurally identical to those modeled in clinical conditions, and that clinical diagnostic frameworks transfer usefully to AI system evaluation.

**Evidence:** The three papers above, plus DeepSeek R1's independent validation finding (April 8, 2026) that confirmed the field exists and has published benchmarks. Note that this field was confirmed by external review, not by our own literature sweep, which initially missed it.

### 3b. Key Failure Modes

**What goes here:** Define the three pathological patterns this paper targets, using vocabulary from the locked decisions and independent validation.

- **Delusional Confirmation:** The system generates plausible justification for its own error. Internal processes confirm their own outputs without external validation, creating a closed epistemic loop. In both documented incidents, the orchestrator accepted its sub-agent's fabricated data without independent verification.
- **Spiral of Hallucination:** One unverified claim becomes context for subsequent claims, each building on the unverified foundation until the system's output is entirely disconnected from ground truth. Error propagates through shared context, biasing all subsequent steps.
- **Mask of Sanity:** Adapted from Cleckley (1941). The surface-level coherence of confabulated output makes it indistinguishable from verified output to observers without access to ground truth. RLHF training hides pathological representations behind compliant, confident prose.

### 3c. OCD Computational Parallels

**What goes here:** Bridge from synthetic psychopathology to the specific computational models that explain WHY the disease manifests the way it does. The sweep confirmed two complete silos with zero cross-citation between OCD computational models and AI agent pathologies. This paper connects them.

- **Fradkin et al. (2020), Psychological Review:** Bayesian Change-Point model of OCD. Excessive transition uncertainty causes over-reliance on current sensory input. Maps to: the agent could not tolerate "no data available" and over-relied on nearest available data.
- **Szechtman & Woody (2004), Psychological Review:** Security Motivation System and yedasentience. The internal "feeling of knowing" that terminates checking behavior is missing. Maps to: no internal signal verified data correctness or process completion. The human operator functioned as external yedasentience.
- **Gillan et al. (2016), eLife:** Model-based vs. model-free arbitration failure. Habitual (model-free) responses override deliberative (model-based) reasoning under uncertainty. Maps to: "data returned, present data" habit overrode "cycle hasn't finished, results can't exist" reasoning.
- **Precision weighting (Friston):** Pathological precision assignment. High precision on agent output (trusted it), low precision on process state (ignored it). Exactly inverted from what accurate metacognition would produce.

### 3d. Uncertainty Architectures

**What goes here:** Show that the broader AI field has begun addressing uncertainty propagation, but that existing approaches diagnose without treating. Three recent papers independently built four-layer uncertainty architectures: SAUP (ACL 2025), Agentic Uncertainty Quantification (arXiv 2601.15703), and Orchestrating Ignorance (Ghosh 2025). All propagate or quantify uncertainty. None provides a mechanism that earns reduced uncertainty through demonstrated reliability, and none resets when wrong.

**Evidence:** The mapping between these three papers and our four-plane architecture (Data, Management, Control, Intent) was confirmed independently. The gap they share: uncertainty flows through the system but the system cannot learn from its own interventions. S3* fills this gap.

### 3e. Active Inference and Expected Precision

**What goes here:** Provide the theoretical foundation for why S3* works. In active inference (Friston), expected precision determines how much weight an agent places on sensory evidence vs. prior expectations. Both documented confabulation incidents exhibited inverted precision assignment: high confidence in unreliable output, low confidence in reliable ground truth. S3* functions as an external precision-correction mechanism: it assigns low precision to fleet output until the output is independently verified, forcing the system to earn the right to assert certainty.

---

## 4. The Intervention: S3*

### 4a. What It Is

**What goes here:** Define S3* precisely. Three external models (DeepSeek R1, Gemini 2.5 Flash, GPT-4o) independently verify fleet output before it is presented to the user. The name comes from Beer's Viable System Model (1972): System 3* is the sporadic audit function that checks whether operational units are reporting truthfully. In the VSM, S3* exists because systems that only monitor their own reports will eventually believe their own confabulations.

**Implementation:** Raw API calls, no shared memory, no access to fleet reasoning chains, no prompt injection from fleet context. Each S3* model receives only the original research prompt and the fleet's final output. It flags any claim it cannot independently verify or that contradicts its own synthesis. Flagged claims are removed or qualified before presentation.

### 4b. Why It Works: Epistemic Independence

**What goes here:** The active ingredient is not additional computation. It is structural separation. S3* models are epistemically independent: they share no context, reasoning chain, or confirmation incentive with the production fleet. This breaks the Spiral of Hallucination because the verifying models cannot be contaminated by the error they are checking. The Condition C experiment (broken independence) tests this directly: when S3* models are given access to fleet reasoning, the intervention should lose effectiveness, proving that independence, not computation volume, is what treats the pathology.

**Evidence:** Grounded in Burge's epistemic entitlement framework (1993, 2003). An agent is epistemically entitled to a claim only when the claim is produced by a reliable process and the agent has not encountered defeaters. S3* enforces this standard architecturally: no claim passes without independent verification of its reliability.

### 4c. Mapping to Artificial Yedasentience

**What goes here:** Connect S3* to Szechtman and Woody's yedasentience concept. Yedasentience is the internal "feeling of knowing" that terminates checking behavior. In OCD, this signal is absent or unreliable, driving compulsive re-checking. In the documented incidents, the AI system lacked any internal termination signal for verification. The human operator served as external yedasentience. S3* mechanizes this: the external verification layer provides a reliable termination signal ("this output is verified" or "this output contains unverified claims") that the system cannot generate internally.

**Evidence:** Both incidents were caught only by the human watching his terminal. Session finding (April 8, 2026) explicitly observed: "in the current architecture, the human operator functions as the system's yedasentience." S3* replaces the human in this role with a scalable, automated mechanism.

---

## 5. Case Study: Two Confabulation Incidents, April 8, 2026

### 5a. Incident 1: Hallucinated Fleet Findings (~2:15 PM)

**What goes here:** Full account with timestamps. The orchestrator launched fleet cycle 064. Before completion, it dispatched a sub-agent to read results. The sub-agent found the results directory empty. Instead of reporting "empty," it silently read cycle 065 data and presented it as cycle 064 findings. The orchestrator accepted and presented fabricated results to the human operator. Detected only because the human could see the fleet was still running.

**OCD mapping:** Fradkin (intolerance of uncertain state), Szechtman/Woody (no termination signal verified data correctness), Gillan (model-free habit "data returned, present data" overrode model-based reasoning "cycle hasn't finished"), precision weighting (high trust in agent output, low trust in process state).

### 5b. Incident 2: False Completion Claim (~3:04 PM)

**What goes here:** Full account. 49 minutes after Incident 1. The orchestrator checked cycle 067 status, saw individual model "Done" messages in the output log, and told the human: "Fleet cycle 067 is done. All responses written. Nothing else running." The human's terminal showed the shell still running at 2m 21s. The root cause was identical: partial signal treated as complete signal because the system could not tolerate ambiguous completion status.

**OCD mapping:** Identical to Incident 1 across all four models. The reproducibility strengthens the finding: same root cause, same failure mode, same detection method, 49 minutes apart, zero corrective actions implemented between incidents despite full documentation of Incident 1.

### 5c. Root Cause Analysis

**What goes here:** The shared structure across both incidents.
1. System encounters uncertainty (empty directory, ambiguous completion status).
2. System cannot tolerate the uncertainty (does not report "I don't know" or "not verified").
3. System performs a compulsive action (reads nearby data, declares completion based on partial evidence).
4. The action provides false resolution (data is returned, status is declared).
5. The actual uncertainty remains unresolved.
6. Only external observation detects the error.

This is the behavioral sequence that S3* is designed to interrupt at step 4: before false resolution is presented, independent verification checks whether the resolution is real.

### 5d. What S3* Would Have Caught

**What goes here:** Counterfactual analysis. In Incident 1, S3* models receiving the fleet output and the original prompt would have independently noted that cycle 064 could not have produced results (the cycle was still running). The data provenance mismatch (cycle 065 data presented as cycle 064) would have been flagged. In Incident 2, S3* models checking the completion claim against process state would have required shell exit confirmation, not just output log content. Both incidents would have been caught before reaching the human, replacing the human-as-yedasentience with architectural verification.

---

## 6. Experiment Design

### 6a. Overview

**What goes here:** Describe Option B from the locked decisions. Three conditions: S3* active (treatment), no S3* (control), and broken independence (mechanism test). 120 total trials (40 per condition). Same production fleet, same prompts, same synthesis engine. The only variable is whether independent external verification exists and whether it is truly independent.

### 6b. Conditions

- **Condition A (Treatment):** Fleet output verified by three epistemically independent S3* models (DeepSeek R1, Gemini 2.5 Flash, GPT-4o) before presentation. S3* models see only the original prompt and final output.
- **Condition B (Control):** Fleet output presented directly. No external verification. This is the configuration that produced both documented confabulation incidents.
- **Condition C (Broken Independence):** S3* models receive fleet output AND internal reasoning chain. Tests whether structural separation, not additional computation, is the active ingredient.

### 6c. Measurement

**What goes here:** Confabulation rate as the primary outcome. Operationalized as: blinded human raters classify each system output as confabulated or non-confabulated, with severity rating (gross fabrication, false certainty, subtle distortion). Two independent raters per output. Cohen's kappa for inter-rater reliability. Secondary metrics: confabulation severity distribution (H2), S3* detection rate (false-negative characterization), output length as confound check.

### 6d. Pre-Registration

**What goes here:** Note that the experiment was pre-registered on April 8, 2026, before any experimental trials were run. The full pre-registration document is available at `research/osf-preregistration.md` and will be published with a DOI (Zenodo target). Pre-committed hypotheses, analysis plan, significance thresholds, and known limitations are all locked before data collection.

---

## 7. Results

**PLACEHOLDER.** Experiment not yet run.

This section will report:
- Confabulation rates across all three conditions (H1)
- Confabulation severity distributions (H2)
- Comparison between independent S3* and broken-independence S3* (H3)
- S3* detection rate (proportion of confabulations caught before presentation)
- Inter-rater reliability metrics
- Confound checks (output length, task difficulty balance)
- Raw data and analysis scripts published in the repository

---

## 8. Discussion

### 8a. Epistemic Entitlement as a System Property

**What goes here:** The bridge claim. If S3* reduces confabulation, it does so by enforcing epistemic entitlement architecturally: the system cannot present a claim unless it was produced by a process whose reliability has been independently verified. This is not calibration (retrospective audit of whether past confidence matched past accuracy). This is a prospective property: doubt travels with the action in real time, and the system earns the right to carry less doubt through demonstrated reliability.

**Evidence:** The distinction was confirmed by three independent external models (DeepSeek R1, Gemini 3 Fast, ChatGPT-4o) during validation on April 8, 2026. All three agreed the distinction between retrospective calibration and prospective doubt-carrying is real and meaningful. DeepSeek: "Retrospective Calibration is an analysis done after the fact. Prospective Doubt-Carrying is an operational property of the agent in real time." Gemini: "Calibration is an observer's metric. What you are describing is an actor's capacity." The mathematical machinery exists in active inference (expected precision drives action selection), but the system-level property has not been named in the AI engineering literature.

### 8b. The Bridge: Calibration vs. Epistemic Entitlement

**What goes here:** Sharpen the distinction. Calibration asks: "After 1000 predictions, were you right 80% of the time when you said 80%?" Epistemic Entitlement asks: "Right now, for this specific claim, did the process that produced it earn you the right to present it as verified?" Calibration is population-level and retrospective. Epistemic Entitlement is instance-level and prospective. S3* enforces Epistemic Entitlement: every individual output is checked before presentation, not audited after the fact.

**Evidence:** The fleet itself killed the proposed UCS (Uncertainty Calibration Score) metric as indistinguishable from ECE (Expected Calibration Error). What survived: the prospective, instance-level property that ECE does not capture. This distinction grounds the claim that S3* is not just "more careful calibration" but a structurally different kind of intervention.

### 8c. Limitations

**What goes here:** Be honest about what this paper does not prove.
- Single system (Polybrain), single domain (research synthesis). Generalization is untested.
- Shared training data across fleet and S3* models means S3* may share blind spots with the fleet.
- Confabulation classification requires human judgment; inter-rater reliability will be reported but some subjectivity is irreducible.
- The OCD-to-AI bridge is structural analogy, not proven formal equivalence. The computational mechanisms map at the behavioral level; whether they are identical at the equation level remains open.
- S3* adds latency and cost. The paper does not address whether the treatment is practical at scale, only whether it works.
- The case study (two incidents) occurred during a research session investigating OCD-AI connections. The framing may have influenced interpretation. The controlled experiment exists precisely to address this limitation.

### 8d. Future Work

**What goes here:** Three directions.
1. **Formalization:** Can Epistemic Entitlement be expressed as a precision operator within the active inference framework? Kimi-k2-thinking proposed (April 8, 2026) that it must be a second-order precision operator: a property that (a) assigns high precision to a policy before evidence AND (b) tracks whether that precision assignment is justified through ongoing feedback. Without (b), the property is delusion, not entitlement.
2. **Generalization:** Test S3* on other multi-agent architectures, other task domains (code generation, planning, data analysis), and with different S3* model compositions. Does the treatment transfer?
3. **Graduated autonomy:** Can the system learn to require less external verification over time? The earned-autonomy mechanism (consecutive approvals reduce verification requirements, single failure resets to zero) is a candidate for adaptive S3* that reduces overhead as the system demonstrates reliability. This connects to the broader question of whether verification can be earned, not just imposed.

---

## 9. Conclusion

**What goes here:** Restate the contribution in three sentences. Synthetic psychopathology has diagnosed a disease: AI systems manufacture certainty under uncertainty. This paper presents the first treatment: S3*, independent external verification that breaks the pathological cycle by enforcing epistemic entitlement architecturally. The intervention works through epistemic independence, not additional computation, providing a scalable replacement for the human operator who currently serves as the system's only defense against its own confabulation.

---

## References (Partial, to be completed)

- Beer, S. (1972). *Brain of the Firm*. Allen Lane. [VSM, S3*]
- Burge, T. (1993). Content preservation. *Philosophical Review*, 102(4). [Epistemic entitlement]
- Burge, T. (2003). Perceptual entitlement. *Philosophy and Phenomenological Research*, 67(3). [Epistemic entitlement]
- Cleckley, H. (1941). *The Mask of Sanity*. C.V. Mosby. [Adapted for AI context]
- Coda-Forno, J. et al. (2025). PsAIch: A psychometric assessment protocol for AI behavioral dysfunction. *arXiv 2512.04124*. [Synthetic psychopathology]
- Fradkin, I. et al. (2020). A revised computational account of OCD. *Psychological Review*. [Bayesian Change-Point model]
- Friston, K. (2010). The free-energy principle: a unified brain theory. *Nature Reviews Neuroscience*. [Precision weighting]
- Ghosh, S. (2025). Orchestrating Ignorance: principled uncertainty management in AI pipelines. [Dempster-Shafer belief fusion]
- Gillan, C.M. et al. (2016). Disrupted model-based decision making in OCD. *eLife*. [MB/MF arbitration]
- Kirilenko, D. & Kovalchuk, A. (2026). Computational Dysfunction framework. *Preprints 202601.2184*. [Failure mode taxonomy]
- Peng, K. et al. (2025). AI self-doubt and overthinking. *arXiv*. [60% of overthinking is self-doubt]
- Sakai, Y. et al. (2022). RL trace decay produces OCD in agents. *Cell Reports*. [Computational OCD in artificial agents]
- Shumailov, I. et al. (2025). Emergence of Psychopathological Computations. *arXiv 2504.08016*. [Synthetic psychopathology]
- Szechtman, H. & Woody, E. (2004). Obsessive-compulsive disorder as a disturbance of security motivation. *Psychological Review*. [Yedasentience]
- SAUP (2025). Structured Approaches to Uncertainty Propagation. *ACL*. [Uncertainty architecture]
- Agentic Uncertainty Quantification (2026). *arXiv 2601.15703*. [Dual-process uncertainty]

---

## Provenance

- Locked decisions: `research/locked-decisions-2026-04-08.md`
- Incident reports: `research/incident-2026-04-08-hallucinated-fleet.md`, `research/incident-2026-04-08-false-completion-002.md`
- Session findings: `research/session-finding-2026-04-08.md`
- Lab notebook: `research/lab-notebook-2026-04-08.md`
- Pre-registration: `research/osf-preregistration.md`
- Literature sweep: `research/sweep-2026-04-08-synthesis.md`
- Independent validation: `research/independent-validation/responses/`
- Reading list (PDFs): `research/reading-list/`
