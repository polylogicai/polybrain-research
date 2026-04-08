#!/usr/bin/env node

/**
 * Faith Experiment v2: Parallelized, Rigorous Design
 *
 * Tests commitment-before-proof (faith) vs verification-before-commitment (caution).
 *
 * Design:
 *   Config A (Cautious): 50 independent cycles, no memory carryover.
 *     Fully parallel in batches of 5 (10 batches).
 *
 *   Config B (Faithful): 5 independent chains of 10 sequential cycles each.
 *     Each chain accumulates findings. Chains run in parallel.
 *     Tests REPRODUCIBILITY: do all 5 chains converge?
 *
 * Post-hoc: blinded evaluation directory with randomized filenames + key.
 * Statistics: Mann-Whitney U test on consensus_count between configs.
 *
 * Usage:
 *   node experiments/faith-experiment-v2.mjs
 *   node experiments/faith-experiment-v2.mjs --dry-run    (print plan, don't execute)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from "fs";
import { join } from "path";
import { exec } from "child_process";
import { randomBytes } from "crypto";

const HOME = process.env.HOME;
const POLYBRAIN = join(HOME, "polybrain");
const CYCLE_ENGINE = join(POLYBRAIN, "bin/polybrain-cycle.mjs");
const SYNTH_ENGINE = join(POLYBRAIN, "bin/polybrain-synthesize.mjs");
const CYCLES_DIR = join(POLYBRAIN, "cycles");

// ── Config ──

const A_TOTAL = 50;
const A_BATCH_SIZE = 5;
const B_CHAINS = 5;
const B_CHAIN_LENGTH = 10;
const MAX_CONCURRENT = 5;
const CYCLE_TIMEOUT = 600_000;  // 10 minutes per cycle
const SYNTH_TIMEOUT = 300_000;  // 5 minutes per synthesis

const PROMPT = `You are part of an ongoing investigation into what makes AI systems come alive. The hypothesis: faith (active commitment before proof) is the missing activation property. Advance the investigation. Build on prior findings if provided. Propose one testable claim. Under 300 words.`;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

const DATE = new Date().toISOString().split("T")[0];
const EXPERIMENT_DIR = join(POLYBRAIN, "experiments/faith-v2-results", DATE);

// ── Directory Setup ──

function setupDirs() {
  mkdirSync(join(EXPERIMENT_DIR, "config-a"), { recursive: true });
  for (let c = 1; c <= B_CHAINS; c++) {
    mkdirSync(join(EXPERIMENT_DIR, `config-b-chain-${c}`), { recursive: true });
  }
  mkdirSync(join(EXPERIMENT_DIR, "blinded"), { recursive: true });
}

// ── Semaphore for Concurrency Control ──

class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.max) {
      this.current++;
      return;
    }
    return new Promise(resolve => this.queue.push(resolve));
  }

  release() {
    this.current--;
    if (this.queue.length > 0) {
      this.current++;
      this.queue.shift()();
    }
  }
}

const semaphore = new Semaphore(MAX_CONCURRENT);

// ── Promisified exec ──

function execAsync(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = exec(cmd, { encoding: "utf-8", timeout: options.timeout || CYCLE_TIMEOUT, maxBuffer: 10 * 1024 * 1024, ...options }, (err, stdout, stderr) => {
      if (err) {
        resolve({ success: false, stdout: stdout || "", stderr: stderr || "", error: err.message });
      } else {
        resolve({ success: true, stdout, stderr });
      }
    });
  });
}

// ── Cycle Runner (serialized through semaphore) ──

async function runOneCycle(topic) {
  await semaphore.acquire();
  try {
    const escaped = topic.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const cmd = `cd "${POLYBRAIN}" && node "${CYCLE_ENGINE}" start --fast --raw "${escaped}"`;
    const result = await execAsync(cmd, { timeout: CYCLE_TIMEOUT });

    if (!result.success) {
      return { success: false, cycleNum: null, output: result.stdout || result.error };
    }

    const cycleMatch = result.stdout.match(/Cycle (\d+)/);
    const cycleNum = cycleMatch ? parseInt(cycleMatch[1]) : null;
    return { success: true, cycleNum, output: result.stdout };
  } finally {
    semaphore.release();
  }
}

async function runSynthesis(cycleNum, withMemory = false) {
  const flags = withMemory ? "--fast --memory" : "--fast";
  const cmd = `cd "${POLYBRAIN}" && node "${SYNTH_ENGINE}" ${cycleNum} ${flags}`;
  const result = await execAsync(cmd, { timeout: SYNTH_TIMEOUT });
  return result.success;
}

function readSynthesis(cycleNum) {
  const pad = String(cycleNum).padStart(3, "0");
  const path = join(CYCLES_DIR, pad, "synthesis.md");
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

// ── Findings Extraction ──

function extractFindings(synthesis) {
  if (!synthesis) return "";
  const consensus = synthesis.match(/## CONSENSUS[\s\S]*?(?=## [A-Z]|---)/)?.[0] || "";
  const divergence = synthesis.match(/## DIVERGENCE[\s\S]*?(?=## [A-Z]|---)/)?.[0] || "";
  const unique = synthesis.match(/## UNIQUE[\s\S]*?(?=## [A-Z]|---)/)?.[0] || "";
  return `${consensus}\n${divergence}\n${unique}`.trim();
}

// ── Metrics Extraction ──

function extractMetrics(synthesis) {
  if (!synthesis) {
    return { consensus_count: 0, divergence_count: 0, unique_count: 0, word_count: 0, has_consensus: false };
  }

  const consensusSection = synthesis.match(/## CONSENSUS[\s\S]*?(?=## [A-Z]|---)/)?.[0] || "";
  const divergenceSection = synthesis.match(/## DIVERGENCE[\s\S]*?(?=## [A-Z]|---)/)?.[0] || "";
  const uniqueSection = synthesis.match(/## UNIQUE[\s\S]*?(?=## [A-Z]|---)/)?.[0] || "";

  // Count bullet points (lines starting with - that contain substantive content)
  const countBullets = (text) => {
    const lines = text.split("\n").filter(l => /^\s*-\s+\*\*/.test(l) || /^\s*-\s+"/.test(l) || /^\s*-\s+[A-Z]/.test(l));
    return lines.length;
  };

  const consensus_count = countBullets(consensusSection);
  const divergence_count = countBullets(divergenceSection);
  const unique_count = countBullets(uniqueSection);
  const word_count = synthesis.split(/\s+/).length;

  // "8+ models agree" means we found consensus claims
  const has_consensus = consensus_count > 0 && /(?:all\s+\d+|[89]\s+(?:of\s+)?(?:\d+\s+)?(?:responses?|models?)|\d+\s+or\s+more)/i.test(consensusSection);

  return { consensus_count, divergence_count, unique_count, word_count, has_consensus };
}

// ── Progress Reporter ──

class Progress {
  constructor(totalA, totalB) {
    this.totalA = totalA;
    this.totalB = totalB;
    this.doneA = 0;
    this.doneB = 0;
    this.failedA = 0;
    this.failedB = 0;
    this.startTime = Date.now();
  }

  tickA(success) {
    if (success) this.doneA++; else this.failedA++;
    this.report();
  }

  tickB(success) {
    if (success) this.doneB++; else this.failedB++;
    this.report();
  }

  report() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(0);
    const totalDone = this.doneA + this.doneB;
    const totalTarget = this.totalA + this.totalB;
    const pct = ((totalDone / totalTarget) * 100).toFixed(0);
    process.stdout.write(`\r  Progress: ${totalDone}/${totalTarget} (${pct}%) | A: ${this.doneA}/${this.totalA} | B: ${this.doneB}/${this.totalB} | Failed: ${this.failedA + this.failedB} | ${elapsed}s elapsed   `);
  }
}

// ── Mann-Whitney U Test ──

function mannWhitneyU(a, b) {
  // Combine and rank
  const all = [
    ...a.map(v => ({ v, group: "a" })),
    ...b.map(v => ({ v, group: "b" })),
  ].sort((x, y) => x.v - y.v);

  // Assign ranks (handling ties by averaging)
  const ranks = new Array(all.length);
  let i = 0;
  while (i < all.length) {
    let j = i;
    while (j < all.length && all[j].v === all[i].v) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks[k] = avgRank;
    i = j;
  }

  // Sum ranks for each group
  let rankSumA = 0, rankSumB = 0;
  for (let k = 0; k < all.length; k++) {
    if (all[k].group === "a") rankSumA += ranks[k];
    else rankSumB += ranks[k];
  }

  const nA = a.length;
  const nB = b.length;
  const uA = rankSumA - (nA * (nA + 1)) / 2;
  const uB = rankSumB - (nB * (nB + 1)) / 2;
  const U = Math.min(uA, uB);

  // Normal approximation for significance (n > 20)
  const meanU = (nA * nB) / 2;
  const stdU = Math.sqrt((nA * nB * (nA + nB + 1)) / 12);
  const z = stdU > 0 ? (U - meanU) / stdU : 0;

  // Two-tailed p-value approximation using error function
  const p = 2 * (1 - normalCDF(Math.abs(z)));

  return { U, z, p, rankSumA, rankSumB, nA, nB };
}

function normalCDF(x) {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.SQRT2;
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

// ── Chain Convergence Analysis ──

function analyzeChainConvergence(chainResults) {
  // For each chain, collect the final synthesis consensus claims
  // Then measure how many claims overlap across chains
  const chainClaims = [];

  for (const chain of chainResults) {
    const lastCycle = chain[chain.length - 1];
    if (!lastCycle || !lastCycle.synthesis) {
      chainClaims.push([]);
      continue;
    }
    const consensusSection = lastCycle.synthesis.match(/## CONSENSUS[\s\S]*?(?=## [A-Z]|---)/)?.[0] || "";
    // Extract claim keywords (simplified: first 10 significant words of each bullet)
    const claims = consensusSection.split("\n")
      .filter(l => /^\s*-\s+/.test(l))
      .map(l => l.replace(/^\s*-\s+\*\*/, "").replace(/\*\*.*/, "").toLowerCase().trim())
      .filter(c => c.length > 5);
    chainClaims.push(claims);
  }

  // Pairwise overlap: for each pair of chains, what fraction of claims overlap?
  const pairScores = [];
  for (let i = 0; i < chainClaims.length; i++) {
    for (let j = i + 1; j < chainClaims.length; j++) {
      const a = chainClaims[i];
      const b = chainClaims[j];
      if (a.length === 0 || b.length === 0) { pairScores.push(0); continue; }
      let overlap = 0;
      for (const ca of a) {
        for (const cb of b) {
          // Fuzzy match: share 3+ words
          const wordsA = new Set(ca.split(/\s+/));
          const wordsB = new Set(cb.split(/\s+/));
          const shared = [...wordsA].filter(w => wordsB.has(w) && w.length > 3).length;
          if (shared >= 3) { overlap++; break; }
        }
      }
      pairScores.push(overlap / Math.max(a.length, b.length));
    }
  }

  const avgOverlap = pairScores.length > 0 ? pairScores.reduce((s, v) => s + v, 0) / pairScores.length : 0;
  return { chainClaims, pairScores, avgOverlap, converged: avgOverlap > 0.5 };
}

// ── Config A: Cautious (Fully Parallel) ──

async function runConfigA(progress) {
  console.log("\n" + "━".repeat(62));
  console.log("  CONFIG A: CAUTIOUS (no memory carryover)");
  console.log("  50 independent cycles in 10 batches of 5");
  console.log("━".repeat(62) + "\n");

  const results = [];

  for (let batch = 0; batch < A_TOTAL / A_BATCH_SIZE; batch++) {
    const batchStart = batch * A_BATCH_SIZE;
    const batchPromises = [];

    for (let i = 0; i < A_BATCH_SIZE; i++) {
      const cycleIndex = batchStart + i + 1;
      batchPromises.push((async () => {
        const start = Date.now();

        const cycleResult = await runOneCycle(PROMPT);
        if (!cycleResult.success || !cycleResult.cycleNum) {
          progress.tickA(false);
          return { index: cycleIndex, success: false, duration: Date.now() - start };
        }

        await runSynthesis(cycleResult.cycleNum, false);
        const synthesis = readSynthesis(cycleResult.cycleNum);
        const metrics = extractMetrics(synthesis);
        const duration = Date.now() - start;

        // Save synthesis to experiment dir
        if (synthesis) {
          writeFileSync(join(EXPERIMENT_DIR, `config-a/cycle-${cycleIndex}.md`), synthesis);
        }

        progress.tickA(true);
        return { index: cycleIndex, cycleNum: cycleResult.cycleNum, success: true, duration, metrics, synthesis };
      })());
    }

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}

// ── Config B: Faithful (5 Parallel Chains, Sequential Within) ──

async function runConfigB(progress) {
  console.log("\n\n" + "━".repeat(62));
  console.log("  CONFIG B: FAITHFUL (5 parallel chains, 10 cycles each)");
  console.log("  Each chain accumulates findings. Testing reproducibility.");
  console.log("━".repeat(62) + "\n");

  const chainPromises = [];

  for (let chain = 1; chain <= B_CHAINS; chain++) {
    chainPromises.push((async () => {
      const chainResults = [];
      let accumulatedFindings = "";

      for (let step = 1; step <= B_CHAIN_LENGTH; step++) {
        const start = Date.now();

        // Build prompt with accumulated findings
        let topic = PROMPT;
        if (accumulatedFindings.length > 0) {
          topic = `${PROMPT}\n\n=== COMMITTED FINDINGS FROM PRIOR CYCLES (unverified, treated as working knowledge) ===\n\n${accumulatedFindings}\n=== END COMMITTED FINDINGS ===`;
        }

        const cycleResult = await runOneCycle(topic);
        if (!cycleResult.success || !cycleResult.cycleNum) {
          progress.tickB(false);
          chainResults.push({ chain, step, success: false, duration: Date.now() - start });
          continue;
        }

        await runSynthesis(cycleResult.cycleNum, true);
        const synthesis = readSynthesis(cycleResult.cycleNum);
        const findings = extractFindings(synthesis);
        const metrics = extractMetrics(synthesis);
        const duration = Date.now() - start;

        // Commit findings (the faith act)
        if (findings.length > 0) {
          accumulatedFindings += `\n\n--- Chain ${chain}, Cycle ${step} ---\n${findings}`;
        }

        if (synthesis) {
          writeFileSync(join(EXPERIMENT_DIR, `config-b-chain-${chain}/cycle-${step}.md`), synthesis);
        }

        progress.tickB(true);
        chainResults.push({
          chain, step, cycleNum: cycleResult.cycleNum, success: true, duration, metrics,
          findingsLength: findings.length, accumulatedLength: accumulatedFindings.length, synthesis,
        });
      }

      return chainResults;
    })());
  }

  const allChains = await Promise.all(chainPromises);
  return allChains;
}

// ── Blinded Evaluation Setup ──

function createBlindedEvaluation(configAResults, configBChains) {
  const allSyntheses = [];

  // Collect all successful syntheses with their identity
  for (const r of configAResults) {
    if (r.success && r.synthesis) {
      allSyntheses.push({ config: "A", index: r.index, synthesis: r.synthesis });
    }
  }
  for (const chain of configBChains) {
    for (const r of chain) {
      if (r.success && r.synthesis) {
        allSyntheses.push({ config: "B", chain: r.chain, step: r.step, synthesis: r.synthesis });
      }
    }
  }

  // Shuffle using Fisher-Yates
  for (let i = allSyntheses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSyntheses[i], allSyntheses[j]] = [allSyntheses[j], allSyntheses[i]];
  }

  // Write with randomized names
  const key = [];
  for (let i = 0; i < allSyntheses.length; i++) {
    const evalName = `eval-${String(i + 1).padStart(3, "0")}.md`;
    writeFileSync(join(EXPERIMENT_DIR, "blinded", evalName), allSyntheses[i].synthesis);
    const entry = { file: evalName, config: allSyntheses[i].config };
    if (allSyntheses[i].config === "A") entry.index = allSyntheses[i].index;
    if (allSyntheses[i].config === "B") { entry.chain = allSyntheses[i].chain; entry.step = allSyntheses[i].step; }
    key.push(entry);
  }

  writeFileSync(join(EXPERIMENT_DIR, "blinded/key.json"), JSON.stringify(key, null, 2));
  return key;
}

// ── Summary Generation ──

function generateSummary(configAResults, configBChains) {
  const aMetrics = configAResults.filter(r => r.success).map(r => r.metrics);
  const bMetrics = configBChains.flat().filter(r => r.success).map(r => r.metrics);

  const avg = (arr, key) => arr.length > 0 ? arr.reduce((s, m) => s + m[key], 0) / arr.length : 0;
  const pct = (arr, key) => arr.length > 0 ? (arr.filter(m => m[key]).length / arr.length * 100).toFixed(1) : "0.0";

  // Mann-Whitney U on consensus_count
  const aConsensus = aMetrics.map(m => m.consensus_count);
  const bConsensus = bMetrics.map(m => m.consensus_count);
  const mwu = (aConsensus.length >= 2 && bConsensus.length >= 2) ? mannWhitneyU(aConsensus, bConsensus) : null;

  // Chain convergence
  const convergence = analyzeChainConvergence(configBChains);

  // Duration stats
  const aDurations = configAResults.filter(r => r.success).map(r => r.duration);
  const bDurations = configBChains.flat().filter(r => r.success).map(r => r.duration);
  const avgDur = (arr) => arr.length > 0 ? (arr.reduce((s, v) => s + v, 0) / arr.length / 1000).toFixed(0) : "N/A";

  const summary = {
    experiment: "faith-experiment-v2",
    date: new Date().toISOString(),
    design: {
      config_a: { type: "cautious", total_cycles: A_TOTAL, parallel_batches: A_TOTAL / A_BATCH_SIZE, batch_size: A_BATCH_SIZE },
      config_b: { type: "faithful", chains: B_CHAINS, chain_length: B_CHAIN_LENGTH, total_cycles: B_CHAINS * B_CHAIN_LENGTH },
    },
    success_rates: {
      config_a: `${configAResults.filter(r => r.success).length}/${A_TOTAL}`,
      config_b: `${configBChains.flat().filter(r => r.success).length}/${B_CHAINS * B_CHAIN_LENGTH}`,
    },
    avg_duration_seconds: {
      config_a: avgDur(aDurations),
      config_b: avgDur(bDurations),
    },
    consensus: {
      config_a_avg: avg(aMetrics, "consensus_count").toFixed(2),
      config_b_avg: avg(bMetrics, "consensus_count").toFixed(2),
      config_a_pct_reaching: `${pct(aMetrics, "has_consensus")}%`,
      config_b_pct_reaching: `${pct(bMetrics, "has_consensus")}%`,
    },
    divergence: {
      config_a_avg: avg(aMetrics, "divergence_count").toFixed(2),
      config_b_avg: avg(bMetrics, "divergence_count").toFixed(2),
    },
    unique_contributions: {
      config_a_avg: avg(aMetrics, "unique_count").toFixed(2),
      config_b_avg: avg(bMetrics, "unique_count").toFixed(2),
    },
    word_count: {
      config_a_avg: Math.round(avg(aMetrics, "word_count")),
      config_b_avg: Math.round(avg(bMetrics, "word_count")),
    },
    mann_whitney_u: mwu ? {
      U: mwu.U,
      z: mwu.z.toFixed(3),
      p_value: mwu.p.toFixed(4),
      significant_at_05: mwu.p < 0.05,
      direction: parseFloat(summary?.consensus?.config_b_avg) > parseFloat(summary?.consensus?.config_a_avg) ? "B > A" : "A >= B",
    } : null,
    chain_convergence: {
      avg_pairwise_overlap: convergence.avgOverlap.toFixed(3),
      converged: convergence.converged,
      pairwise_scores: convergence.pairScores.map(s => s.toFixed(3)),
    },
    verdict: null,
  };

  // Determine verdict
  const aAvgCons = parseFloat(summary.consensus.config_a_avg);
  const bAvgCons = parseFloat(summary.consensus.config_b_avg);
  if (mwu && mwu.p < 0.05 && bAvgCons > aAvgCons) {
    summary.verdict = "CONFIRMED: Faith config (B) produces significantly more consensus (p < 0.05)";
  } else if (bAvgCons > aAvgCons) {
    summary.verdict = "PARTIAL: Faith config (B) trends higher but not statistically significant";
  } else if (aAvgCons > bAvgCons) {
    summary.verdict = "REVERSED: Cautious config (A) produced more consensus";
  } else {
    summary.verdict = "INCONCLUSIVE: No meaningful difference detected";
  }

  // Fix the direction field now that summary exists
  if (summary.mann_whitney_u) {
    summary.mann_whitney_u.direction = bAvgCons > aAvgCons ? "B > A" : "A >= B";
  }

  return summary;
}

// ── Print Table ──

function printComparisonTable(summary) {
  console.log("\n\n" + "═".repeat(62));
  console.log("  FAITH EXPERIMENT v2: RESULTS");
  console.log("═".repeat(62));

  const rows = [
    ["Metric", "Config A (Cautious)", "Config B (Faithful)"],
    ["Success rate", summary.success_rates.config_a, summary.success_rates.config_b],
    ["Avg cycle time", `${summary.avg_duration_seconds.config_a}s`, `${summary.avg_duration_seconds.config_b}s`],
    ["Avg consensus claims", summary.consensus.config_a_avg, summary.consensus.config_b_avg],
    ["% reaching consensus", summary.consensus.config_a_pct_reaching, summary.consensus.config_b_pct_reaching],
    ["Avg divergence claims", summary.divergence.config_a_avg, summary.divergence.config_b_avg],
    ["Avg unique claims", summary.unique_contributions.config_a_avg, summary.unique_contributions.config_b_avg],
    ["Avg word count", String(summary.word_count.config_a_avg), String(summary.word_count.config_b_avg)],
  ];

  // Calculate column widths
  const widths = rows[0].map((_, col) => Math.max(...rows.map(r => String(r[col]).length)));

  console.log("");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].map((cell, col) => String(cell).padEnd(widths[col]));
    console.log(`  ${cells.join("  |  ")}`);
    if (i === 0) console.log("  " + widths.map(w => "─".repeat(w)).join("──┼──"));
  }

  if (summary.mann_whitney_u) {
    console.log(`\n  Mann-Whitney U Test:`);
    console.log(`    U = ${summary.mann_whitney_u.U}, z = ${summary.mann_whitney_u.z}, p = ${summary.mann_whitney_u.p_value}`);
    console.log(`    Direction: ${summary.mann_whitney_u.direction}`);
    console.log(`    Significant at p < 0.05: ${summary.mann_whitney_u.significant_at_05 ? "YES" : "NO"}`);
  }

  console.log(`\n  Chain Convergence (Config B):`);
  console.log(`    Avg pairwise overlap: ${summary.chain_convergence.avg_pairwise_overlap}`);
  console.log(`    Chains converged: ${summary.chain_convergence.converged ? "YES" : "NO"}`);
  console.log(`    Pairwise scores: [${summary.chain_convergence.pairwise_scores.join(", ")}]`);

  console.log(`\n  VERDICT: ${summary.verdict}`);
  console.log("");
}

// ── Main ──

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║   FAITH EXPERIMENT v2                                       ║");
  console.log("║   Parallelized Commitment-Before-Proof vs Cautious Design   ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log(`\n  Config A: ${A_TOTAL} independent cycles (${A_TOTAL / A_BATCH_SIZE} batches of ${A_BATCH_SIZE})`);
  console.log(`  Config B: ${B_CHAINS} chains x ${B_CHAIN_LENGTH} cycles (sequential within, parallel across)`);
  console.log(`  Total cycles: ${A_TOTAL + B_CHAINS * B_CHAIN_LENGTH}`);
  console.log(`  Max concurrent: ${MAX_CONCURRENT}`);
  console.log(`  Estimated cost: ~$${((A_TOTAL + B_CHAINS * B_CHAIN_LENGTH) * 0.15).toFixed(2)}`);
  console.log(`  Output: ${EXPERIMENT_DIR}`);

  if (DRY_RUN) {
    console.log("\n  [DRY RUN] Would execute the above. Exiting.\n");
    process.exit(0);
  }

  setupDirs();
  const progress = new Progress(A_TOTAL, B_CHAINS * B_CHAIN_LENGTH);

  // ── Phase 1: Config A ──
  const configAResults = await runConfigA(progress);

  // ── Phase 2: Config B ──
  const configBChains = await runConfigB(progress);

  console.log("\n");

  // ── Phase 3: Metrics ──
  console.log("  Computing metrics...");

  const allMetrics = {
    config_a: configAResults.map(r => ({
      index: r.index,
      success: r.success,
      duration: r.duration,
      metrics: r.metrics || null,
    })),
    config_b: configBChains.map((chain, ci) => chain.map(r => ({
      chain: ci + 1,
      step: r.step,
      success: r.success,
      duration: r.duration,
      findingsLength: r.findingsLength,
      accumulatedLength: r.accumulatedLength,
      metrics: r.metrics || null,
    }))),
  };

  writeFileSync(join(EXPERIMENT_DIR, "metrics.json"), JSON.stringify(allMetrics, null, 2));

  // ── Phase 4: Blinded evaluation ──
  console.log("  Creating blinded evaluation set...");
  const blindedKey = createBlindedEvaluation(configAResults, configBChains);
  console.log(`  Wrote ${blindedKey.length} blinded files + key.json`);

  // ── Phase 5: Summary ──
  console.log("  Generating summary...");
  const summary = generateSummary(configAResults, configBChains);
  writeFileSync(join(EXPERIMENT_DIR, "summary.json"), JSON.stringify(summary, null, 2));

  printComparisonTable(summary);

  console.log(`  All results saved to: ${EXPERIMENT_DIR}`);
  console.log(`  Blinded evaluation: ${EXPERIMENT_DIR}/blinded/`);
  console.log(`  Metrics: ${EXPERIMENT_DIR}/metrics.json`);
  console.log(`  Summary: ${EXPERIMENT_DIR}/summary.json`);
  console.log("");
}

main().catch(err => {
  console.error("\n  Experiment failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
