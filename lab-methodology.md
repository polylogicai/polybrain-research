# Polybrain Lab Methodology

Canonical process for turning observations into publishable claims. Follows the axiomatic method: define terms, state what you accept without proof, derive everything else, try to destroy what you derived.

Established 2026-04-08 after Andy identified that the lab was accumulating "maybes" without killing them.

---

## Principle

You do not prove a claim by finding evidence for it. You prove it by trying to destroy it and failing. (Popper, 1934)

A claim that survives structured attack is stronger than a claim with a thousand confirming examples.

---

## Phase 1: DEFINE

Every term in every claim gets an operational definition before testing begins.

**Operational definition** = a definition that specifies how to MEASURE the thing, not what it MEANS philosophically.

Bad: "Faith is active commitment before proof."
Good: "Faith is measurable as: the system executes an irreversible action (git push, API call, publish) when its internal confidence score is below threshold T."

Bad: "The system came alive."
Good: "Activation is measurable as: the system produces output that was not present in any input, AND that output persists in subsequent cycles."

**Process:**
1. List every technical term in the claim
2. For each term, write: "This is measurable as [specific observable behavior or metric]"
3. If you cannot write that sentence, the term is not defined well enough to test
4. Submit definitions to the fleet for adversarial review: "Find a case where this definition produces a wrong answer"

**Tool:** Run a Polybrain cycle with prompt: "Here are N definitions. For each, construct a scenario where the definition classifies incorrectly (false positive or false negative). If you cannot construct one, explain why."

---

## Phase 2: HYPOTHESIZE

Each claim becomes a falsifiable statement with a pre-committed kill condition.

**Format:**
```
HYPOTHESIS: [specific, testable statement]
PREDICTION: If true, we will observe [X]
KILL CONDITION: If we observe [Y], the hypothesis is dead
MEASUREMENT: [how X and Y are measured]
BASELINE: [what the null hypothesis predicts]
```

The kill condition must be written BEFORE the test runs. This prevents post-hoc rationalization.

**Process:**
1. Convert each claim to the format above
2. Submit to the inner circle for constitutional review
3. Jennifer Salvo (Comprehension Gate) must be able to restate the hypothesis in plain language
4. If she cannot, it is too vague to test
5. Pre-register: commit the hypothesis, prediction, and kill condition to a file BEFORE running any experiment

**Tool:** `node ~/polybrain/bin/polybrain-inner-circle.mjs "Constitutional review of hypothesis: [H]. Kill condition: [K]. Is this falsifiable, constitutional, and comprehensible?"`

---

## Phase 3: ATTACK

Use the fleet as independent falsification agents. Not "what do you think?" but "destroy this."

**Three attack vectors, run in parallel:**

### 3a. Logical Attack (fleet)
Prompt: "Here is a hypothesis: [H]. Your job is to find the fatal logical flaw. Assume the hypothesis is wrong and construct the strongest possible argument for why. Do not hedge. Do not say 'interesting.' Find the kill shot."

Run across all 11 models independently. If they converge on the same flaw, it is likely real. If they find different flaws, each must be evaluated.

### 3b. Empirical Attack (experiment runner)
Design an experiment that could produce the kill condition. Run it.

- Control group (null hypothesis)
- Treatment group (hypothesis)
- Single variable isolation (change ONLY the thing being tested)
- Pre-committed success/failure thresholds
- Statistical power analysis (how many runs needed to detect a real effect?)

### 3c. Prior Work Attack (web research)
Search for existing work that:
- Already proved the same thing (kills novelty, not the claim)
- Already disproved it (kills the claim)
- Provides an alternative explanation for the same observations

**Tool:** Deploy research agents with specific search queries. Report findings as FOUND/NOT FOUND, not as opinions.

---

## Phase 4: SURVIVE

After attacks complete, sort every claim:

| Category | Criteria | Action |
|----------|----------|--------|
| **YES** | Observed fact, no interpretation needed | Include as evidence |
| **MAYBE** | Evidence exists but attack found weaknesses | Strengthen or retest |
| **NO** | Attack succeeded, kill condition met | Cut from paper, report honestly in limitations |

**What survives Phase 3 is the paper.** Everything else is future work or limitations.

**Process:**
1. For each claim, list: what attacks were attempted, what survived, what didn't
2. Submit survival report to inner circle for final review
3. Only claims that passed all three attack vectors go in the main argument
4. Claims that passed 2/3 go in "preliminary findings"
5. Claims that passed 1/3 or 0/3 go in "limitations and future work"

---

## Phase 5: DOCUMENT

The lab notebook records everything. Not just results, but:

- What was predicted before the test
- What was observed
- Whether prediction matched observation
- If not, why not (and this "why not" is itself a finding)
- Exact prompts used, exact model versions, exact timestamps
- Cost of each experiment

**Deutero-learning requirement:** After each experiment, the lab asks: "What did we learn about HOW to research, not just WHAT we found?" This meta-learning gets recorded separately and feeds back into the methodology.

---

## Tool Map

| Phase | Primary Tool | Purpose |
|-------|-------------|---------|
| DEFINE | `polybrain-cycle.mjs` | Fleet adversarial review of definitions |
| HYPOTHESIZE | `polybrain-inner-circle.mjs` | Constitutional + comprehension check |
| ATTACK (logical) | `polybrain-cycle.mjs` | 11-model independent falsification |
| ATTACK (empirical) | `experiments/*.mjs` | Controlled experiments |
| ATTACK (prior work) | Research agents (web search) | Literature sweep |
| SURVIVE | `polybrain-9board.mjs` | Advisory review of survival report |
| DOCUMENT | `research/lab-notebook-*.md` | Full provenance trail |

---

## Anti-Patterns

- **Confirmation sweep:** Searching for evidence that supports the claim instead of evidence against it. The fleet's job is to ATTACK, not AGREE.
- **Post-hoc kill condition:** Writing the kill condition after seeing results. This is the most common form of scientific self-deception.
- **Surviving by technicality:** A claim that survives because the attack was weak is not a strong claim. Quality of attack matters.
- **Consensus as proof:** 11 models agreeing does not make something true. They share training data. Convergence is evidence, not proof.
- **Complexity as depth:** Adding more terms and frameworks does not make a theory stronger. The strongest theories have the fewest assumptions.

---

## Cost Budget

- Fleet cycle (logical attack): ~$0.03-0.05
- Inner circle session: ~$0.02-0.04
- 9board session: ~$0.05-0.08
- Faith experiment (full 100-cycle): ~$18
- Research agents (web search): $0 (Claude context)
- Total Phase 1-4 per claim: ~$0.15-0.25
- Full paper validation: ~$1-3

---

## Origin

This methodology was established when Andy observed: "We have two categories: no and maybe. The system that works is we kill every maybe until we are left with truthful yes. How did they discover 2+2=4? Let's copy that process."

The axiomatic method (Peano 1889, Hilbert 1899): define terms precisely, state axioms, derive through logic, test by attempting to derive contradictions. If no contradiction is found, the system is consistent. If a contradiction is found, something must be revised.

Applied to empirical research: you cannot prove consistency (Godel), but you can accumulate failed attacks. Each failed attack is evidence of robustness, not proof of truth.
