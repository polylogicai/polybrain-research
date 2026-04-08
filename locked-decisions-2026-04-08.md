# Locked Decisions — April 8, 2026

These decisions are locked. They were made after a 6-hour research session, 85+ fleet cycles, 6 independent validations from 3 providers, and external review. Do not revisit unless new evidence contradicts them.

## Decision 1: Definition

**Internal name:** Faith
**Paper name:** Epistemic Entitlement
**Definition:** Epistemic Entitlement is present when a system only asserts certainty that is earned through independent verification of its reasoning, and absent when it allows manufactured certainty to propagate unchecked.

The system's internal word is "faith." The paper's technical term is "Epistemic Entitlement." Same property, different registers.

## Decision 2: Experiment

**Run Option B.**

- Treatment group: System WITH S3* (independent external verification via DeepSeek/Gemini/GPT-4o)
- Control group: System WITHOUT S3* (fleet only, no external check)
- Metric: Confabulation rate (does the system present unverified information as verified?)
- Baseline: Two documented incidents from April 8, 2026 where the system confabulated without S3*
- Success criterion: S3* catches confabulation that the fleet misses

Option A (Config A/B/C/D) is shelved. The fleet told us it measures the wrong thing.

## Decision 3: Paper Framing

**Title:** "The First Therapeutic Intervention for Synthetic Psychopathology: Using Independent Epistemic Verification to Treat Hallucinatory Spirals and Manufactured Certainty"

**Positioning:** Treatment, not diagnosis. Cite synthetic psychopathology papers (PsAIch, Emergence of Psychopathological Computations, Computational Dysfunction) as prior work establishing the disease. Present S3* as the intervention. Show before (confabulation incidents) and after (S3* catches them).

**Key vocabulary from external review:**
- Delusional Confirmation: system generates plausible justification for its own error
- Spiral of Hallucination: error propagates through shared context, biasing all subsequent steps
- Epistemic Entitlement: the right to assert certainty only when earned
- Mask of Sanity: RLHF training hides pathological representations behind compliant output
- Epistemic Independence: external models not polluted by system's reasoning history

## What This Means for Next Steps

1. Rewrite pre-registration to match Option B (treatment vs no treatment)
2. Implement the experiment: run fleet tasks with and without S3* active
3. Measure confabulation rate in both conditions
4. Push to Zenodo with real DOI
5. Write the paper using the treatment framing and vocabulary above
