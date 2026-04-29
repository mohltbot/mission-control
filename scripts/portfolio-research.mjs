#!/usr/bin/env node
/**
 * portfolio-research.mjs
 *
 * VC SaaS portfolio research one-pager generator.
 *
 * Inspired by `webpull` (Ben's Bites 2026-04-28 "Builders" issue) — pulls a
 * SaaS company's public surfaces into a clean markdown research one-pager
 * scoped to the questions Mohammed actually answers when agentifying a
 * portfolio company.
 *
 * Project: VC SaaS Portfolio Agentification (#5 in PROJECTS.md). Mohammed
 * has 16 companies to research. Stated cost is ~4 hours each. This script
 * collapses the discovery half of that to ~30 seconds + a human polish pass.
 *
 * Run:
 *   node scripts/portfolio-research.mjs https://acmesoft.com
 *   node scripts/portfolio-research.mjs https://acmesoft.com --out business/vc-saas-portfolio/research/acmesoft.md
 *
 * For each target the script:
 *   1. Fetches /, /pricing, /integrations, /docs, /api, /security, /about (best-effort, 404s ignored)
 *   2. Strips HTML to plain text (lightweight; no deps)
 *   3. Scans for stack signals — payment, CRM, support, analytics, auth, infra
 *      providers Mohammed already knows iPaaS patterns for
 *   4. Extracts pricing hints, integration list, API surface signals
 *   5. Emits a structured one-pager keyed to Mohammed's agentification template:
 *        Overview · Pricing · Integrations · Stack signals · Likely automation
 *        gaps · Suggested iPaaS workflow seeds · Open questions for the call
 *
 * Output is intentionally a *seed*, not a finished brief — Mohammed
 * confirms / annotates before turning it into a Loom + iPaaS workflow.
 *
 * No external deps. Node 20+ (built-in fetch, AbortSignal.timeout).
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { argv, exit, stdout } from "node:process";

const PATHS_TO_TRY = [
  "/",
  "/pricing",
  "/plans",
  "/integrations",
  "/integrations/",
  "/docs",
  "/developers",
  "/api",
  "/security",
  "/about",
];

const STACK_SIGNALS = {
  payments: ["stripe", "braintree", "adyen", "paddle", "chargebee", "recurly"],
  crm: ["salesforce", "hubspot", "pipedrive", "attio", "close.com"],
  support: ["zendesk", "intercom", "freshdesk", "front", "helpscout"],
  analytics: ["segment", "mixpanel", "amplitude", "posthog", "heap"],
  auth: ["auth0", "okta", "workos", "clerk", "supertokens"],
  email: ["sendgrid", "mailgun", "postmark", "resend", "customer.io"],
  data: ["snowflake", "databricks", "bigquery", "redshift", "fivetran", "airbyte"],
  ipaas_competitors: ["zapier", "make.com", "n8n", "workato", "tray.io"],
  infra: ["aws", "gcp", "azure", "vercel", "render", "fly.io", "cloudflare"],
  realtime: ["pusher", "ably", "websocket", "kafka"],
};

const TIMEOUT_MS = 8000;
const UA = "Mozilla/5.0 (compatible; MohltPortfolioResearch/1.0; autonomous; portfolio-research.mjs)";

function log(msg) {
  process.stderr.write(`[portfolio-research] ${msg}\n`);
}

async function fetchPath(base, path) {
  const url = new URL(path, base).href;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return { url, status: res.status, text: "" };
    const text = await res.text();
    return { url, status: res.status, text };
  } catch (err) {
    return { url, status: 0, text: "", error: String(err?.message || err) };
  }
}

function htmlToText(html) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|li|h[1-6]|tr|br)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findSignals(text) {
  const lc = text.toLowerCase();
  const found = {};
  for (const [bucket, kws] of Object.entries(STACK_SIGNALS)) {
    const hits = kws.filter((kw) => lc.includes(kw));
    if (hits.length) found[bucket] = hits;
  }
  return found;
}

function extractPricingHints(text) {
  const lines = text.split("\n");
  const dollarLines = lines.filter((l) => /\$\s?\d/.test(l) && l.length < 200).slice(0, 8);
  const tierWords = lines
    .filter((l) => /\b(free|starter|pro|business|enterprise|team)\b/i.test(l) && l.length < 120)
    .slice(0, 6);
  return [...new Set([...dollarLines, ...tierWords])].map((l) => l.trim()).filter(Boolean);
}

function extractIntegrationsHints(text) {
  // crude: look for lines listing well-known SaaS names near the word "integration"
  const lc = text.toLowerCase();
  const idx = lc.indexOf("integration");
  if (idx === -1) return [];
  const window = text.slice(Math.max(0, idx - 200), idx + 1500);
  const allKws = Object.values(STACK_SIGNALS).flat();
  return [...new Set(allKws.filter((kw) => window.toLowerCase().includes(kw)))];
}

function automationGapHypotheses(signals) {
  const gaps = [];
  if (signals.crm && signals.support) {
    gaps.push(
      "CRM⇄support agent: when a support ticket is opened by a high-ARR account, auto-update CRM owner & raise priority (n8n or Workato)."
    );
  }
  if (signals.payments) {
    gaps.push(
      `Failed-payment recovery agent: dunning flow tied to ${signals.payments[0]} webhooks → email + CSM Slack ping.`
    );
  }
  if (signals.crm && !signals.ipaas_competitors) {
    gaps.push(
      "No iPaaS in stack — likely manual CRM hygiene; pitch an n8n/Zapier-managed deduper + activity logger as a thin wedge."
    );
  }
  if (signals.support) {
    gaps.push(
      `Inbound ticket triage agent (Claude harness) — auto-tag/route ${signals.support[0]} tickets by intent + suggest macros.`
    );
  }
  if (signals.analytics) {
    gaps.push(
      `Weekly product-pulse digest from ${signals.analytics[0]} — agent summarises retention deltas, posts to a Slack channel.`
    );
  }
  if (signals.email) {
    gaps.push(
      `Lifecycle email author: agent drafts onboarding sequences from ${signals.email[0]} performance data — human approves before send.`
    );
  }
  if (!gaps.length) {
    gaps.push(
      "No high-confidence gap from public surfaces — needs a 15-min discovery call to identify month-end / data-handoff pain."
    );
  }
  return gaps;
}

function suggestedIpaasSeeds(signals) {
  const seeds = [];
  if (signals.crm?.length) {
    seeds.push(`n8n: ${signals.crm[0]} → enrichment (Clearbit/Apollo) → write back → Slack notify owner.`);
  }
  if (signals.payments?.length) {
    seeds.push(
      `n8n: ${signals.payments[0]} subscription.deleted → cancellation reason classifier (Claude) → CRM activity + retention task.`
    );
  }
  if (signals.support?.length) {
    seeds.push(
      `n8n: ${signals.support[0]} new ticket → Claude triage → tag + draft reply → human review queue.`
    );
  }
  if (!seeds.length) {
    seeds.push(
      "Default seed: webhook → Claude classifier → Slack/email digest. Refine after discovery call."
    );
  }
  return seeds;
}

function openQuestions(target) {
  return [
    "What's the highest-volume manual workflow your CSMs do weekly?",
    "Where does data leave your product (CSV exports, Slack pastes, manual reports) — those are agent wedges.",
    "Which integration on your roadmap have you postponed twice — we can ship it as an agentified workflow first.",
    "What's the close-of-month pain — finance team handoffs, revenue recognition, dunning?",
    `For ${target.host}: do you already pay an iPaaS today (Zapier/Make/Workato)? If yes, what doesn't it solve?`,
  ];
}

function renderReport({ target, fetched, signals, integrations, pricingHints, gaps, seeds, questions }) {
  const today = new Date().toISOString().slice(0, 10);
  const fetchedTable = fetched
    .map((f) => `| ${new URL(f.url).pathname || "/"} | ${f.status || "ERR"} | ${f.text ? f.text.length : 0} chars |`)
    .join("\n");
  const signalLines = Object.entries(signals)
    .map(([bucket, hits]) => `- **${bucket}** — ${hits.join(", ")}`)
    .join("\n") || "- *No known stack signals matched. Hand-audit recommended.*";
  return `# ${target.host} — agentification research seed

> Generated ${today} by \`scripts/portfolio-research.mjs\` from public surfaces.
> Treat as a *seed* — confirm with a 15-min discovery call before pitching.

**Target:** ${target.url}

## Surfaces fetched

| Path | Status | Size |
|------|--------|------|
${fetchedTable}

## Stack signals (from public HTML)

${signalLines}

## Pricing hints

${pricingHints.length ? pricingHints.map((p) => `- ${p}`).join("\n") : "- *No clear public pricing surface — likely sales-led.*"}

## Integrations referenced near "integration"

${integrations.length ? integrations.map((i) => `- ${i}`).join("\n") : "- *None detected on shallow crawl.*"}

## Likely automation gaps

${gaps.map((g) => `- ${g}`).join("\n")}

## Suggested iPaaS workflow seeds

${seeds.map((s) => `- ${s}`).join("\n")}

## Open questions for the discovery call

${questions.map((q) => `- ${q}`).join("\n")}

---
*Next steps:* pick the seed with the highest pain × lowest integration cost, prototype in n8n (~4 hrs), Loom the result, send to the VC. Update PROJECTS.md count when done.
`;
}

async function research(input) {
  let baseUrl;
  try {
    baseUrl = new URL(input.startsWith("http") ? input : `https://${input}`);
  } catch (err) {
    log(`bad URL: ${input}`);
    exit(2);
  }
  const target = { url: baseUrl.href, host: baseUrl.host };
  log(`crawling ${target.host} …`);
  const fetched = [];
  let combinedText = "";
  for (const p of PATHS_TO_TRY) {
    const r = await fetchPath(baseUrl, p);
    fetched.push(r);
    if (r.text) combinedText += "\n\n" + htmlToText(r.text);
  }
  const signals = findSignals(combinedText);
  const integrations = extractIntegrationsHints(combinedText);
  const pricingHints = extractPricingHints(combinedText);
  const gaps = automationGapHypotheses(signals);
  const seeds = suggestedIpaasSeeds(signals);
  const questions = openQuestions(target);
  return renderReport({ target, fetched, signals, integrations, pricingHints, gaps, seeds, questions });
}

async function main() {
  const args = argv.slice(2);
  if (!args.length || args.includes("--help") || args.includes("-h")) {
    stdout.write(
      "Usage: node scripts/portfolio-research.mjs <url> [--out <path>]\n" +
        "  e.g. node scripts/portfolio-research.mjs https://acmesoft.com --out business/vc-saas-portfolio/research/acmesoft.md\n"
    );
    exit(0);
  }
  const url = args[0];
  const outIdx = args.indexOf("--out");
  const outPath = outIdx > -1 ? args[outIdx + 1] : null;
  const md = await research(url);
  if (outPath) {
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, md, "utf8");
    log(`wrote ${outPath}`);
  } else {
    stdout.write(md);
  }
}

main().catch((err) => {
  log(`fatal: ${err?.stack || err}`);
  exit(1);
});
