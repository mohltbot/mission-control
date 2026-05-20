#!/usr/bin/env node
/**
 * acceptmarkdown-check.mjs
 *
 * Agent-readability health check for Mohammed's public surfaces.
 *
 * Inspired by acceptmarkdown.com (Ben's Bites 2026-04-21) — checks whether
 * a site returns content agents can actually parse.
 *
 * Run:
 *   node scripts/acceptmarkdown-check.mjs
 *   node scripts/acceptmarkdown-check.mjs --out reports/acceptmd-$(date +%F).md
 *
 * For each configured URL, the script fetches the page with an
 * agent-like UA and checks:
 *   1. Does a `/<path>.md` or `/<path>/llms.txt` companion exist?
 *   2. Does the HTML use semantic tags (article, main, h1..h3)?
 *   3. Is there structured data (application/ld+json)?
 *   4. Does robots.txt allow agent user-agents?
 *   5. Is Content-Type sensible (text/html; charset=utf-8)?
 *
 * Output: a short markdown report Mohammed can skim in 30 seconds.
 *
 * No dependencies beyond Node 20+ (uses built-in fetch).
 */

import { writeFile } from "node:fs/promises";
import { argv, exit } from "node:process";

const TARGETS = [
  {
    label: "ArchTrack production",
    url: "https://archtrack.live/",
    why: "Employee-tracking SaaS — needs to be agent-readable for future integrations & SEO-for-agents",
  },
  {
    label: "OpenClaw Debugger Fiverr gig",
    url: "https://www.fiverr.com/s/pdV71PR",
    why: "Main debugger lead surface — agents scraping Fiverr for service matches should be able to parse it",
  },
  {
    label: "Accounting/Automation Fiverr gig",
    url: "https://www.fiverr.com/s/DBA4Y0a",
    why: "Secondary Fiverr surface — same rationale",
  },
  {
    label: "Mission Control repo",
    url: "https://github.com/mohltbot/mission-control",
    why: "Public repo — GitHub serves its own markdown but good baseline check",
  },
];

const AGENT_UAS = [
  "Mozilla/5.0 (compatible; ClaudeBot/1.0; +https://www.anthropic.com/bot)",
  "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)",
];

const HEADERS = {
  "User-Agent": AGENT_UAS[0],
  Accept: "text/markdown, text/html;q=0.9, */*;q=0.5",
};

const TIMEOUT_MS = 15000;

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(t);
  }
}

async function checkMarkdownCompanion(baseUrl) {
  const u = new URL(baseUrl);
  const candidates = [
    new URL(u.pathname.replace(/\/$/, "") + ".md", u).toString(),
    new URL("/llms.txt", u).toString(),
    new URL("/llms-full.txt", u).toString(),
  ];
  const results = [];
  for (const c of candidates) {
    try {
      const r = await fetchWithTimeout(c, { headers: HEADERS });
      results.push({
        url: c,
        ok: r.ok,
        status: r.status,
        contentType: r.headers.get("content-type") || "",
      });
    } catch (e) {
      results.push({ url: c, ok: false, status: 0, contentType: "", err: e.message });
    }
  }
  return results;
}

async function checkRobots(baseUrl) {
  const u = new URL(baseUrl);
  const robotsUrl = new URL("/robots.txt", u).toString();
  try {
    const r = await fetchWithTimeout(robotsUrl, { headers: HEADERS });
    if (!r.ok) return { url: robotsUrl, found: false, blocksAgents: null };
    const text = await r.text();
    const lower = text.toLowerCase();
    const blocked = [];
    for (const ua of ["claudebot", "gptbot", "anthropic-ai", "ccbot"]) {
      const idx = lower.indexOf("user-agent: " + ua);
      if (idx !== -1) {
        const slice = lower.slice(idx, idx + 400);
        if (/\ndisallow:\s*\/\s*(\n|$)/.test(slice)) blocked.push(ua);
      }
    }
    return { url: robotsUrl, found: true, blocksAgents: blocked };
  } catch (e) {
    return { url: robotsUrl, found: false, blocksAgents: null, err: e.message };
  }
}

function inspectHtml(html) {
  const hasArticle = /<article\b/i.test(html);
  const hasMain = /<main\b/i.test(html);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLd = /<script[^>]+application\/ld\+json/i.test(html);
  const clientSideHeavy = /id=["']root["']|id=["']__next["']/i.test(html) &&
    !hasArticle && h1Count === 0;
  return { hasArticle, hasMain, h1Count, jsonLd, clientSideHeavy };
}

async function checkTarget(t) {
  const out = { label: t.label, url: t.url, why: t.why };
  try {
    const r = await fetchWithTimeout(t.url, { headers: HEADERS });
    out.status = r.status;
    out.contentType = r.headers.get("content-type") || "";
    if (r.ok && out.contentType.includes("text/html")) {
      const html = await r.text();
      out.html = inspectHtml(html);
      out.bytes = html.length;
    }
  } catch (e) {
    out.err = e.message;
  }
  out.md = await checkMarkdownCompanion(t.url);
  out.robots = await checkRobots(t.url);
  return out;
}

function score(r) {
  let s = 0;
  if (r.status && r.status < 400) s++;
  if (r.html && (r.html.hasArticle || r.html.hasMain || r.html.h1Count > 0)) s++;
  if (r.html && r.html.jsonLd) s++;
  if (r.md && r.md.some((m) => m.ok)) s++;
  if (r.robots && r.robots.found && (!r.robots.blocksAgents || r.robots.blocksAgents.length === 0)) s++;
  return s;
}

function renderReport(results) {
  const date = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push(`# acceptmarkdown-style check — ${date}`);
  lines.push("");
  lines.push("Agent-readability check for Mohammed's public surfaces.");
  lines.push("Inspired by acceptmarkdown.com (Ben's Bites 2026-04-21).");
  lines.push("");
  lines.push("| Target | Score | HTTP | Semantic HTML | JSON-LD | MD/llms.txt | Agent-friendly robots |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const r of results) {
    const s = score(r);
    const semantic = r.html ? (r.html.hasArticle || r.html.hasMain ? "yes" : r.html.h1Count > 0 ? "h1 only" : "no") : "n/a";
    const jsonLd = r.html ? (r.html.jsonLd ? "yes" : "no") : "n/a";
    const mdHit = r.md ? (r.md.find((m) => m.ok)?.url || "no") : "n/a";
    const robots = r.robots
      ? r.robots.found
        ? r.robots.blocksAgents && r.robots.blocksAgents.length > 0
          ? `BLOCKS: ${r.robots.blocksAgents.join(", ")}`
          : "ok"
        : "no robots.txt"
      : "n/a";
    lines.push(
      `| ${r.label} | ${s}/5 | ${r.status || "err"} | ${semantic} | ${jsonLd} | ${mdHit} | ${robots} |`
    );
  }
  lines.push("");
  lines.push("## Per-target notes");
  lines.push("");
  for (const r of results) {
    lines.push(`### ${r.label}`);
    lines.push(`- URL: ${r.url}`);
    lines.push(`- Why it matters: ${r.why}`);
    if (r.err) lines.push(`- ⚠ Fetch error: ${r.err}`);
    if (r.html && r.html.clientSideHeavy) {
      lines.push("- ⚠ Page looks client-side-rendered with no pre-rendered content. Agents without JS will see nothing.");
    }
    if (r.md) {
      const hit = r.md.find((m) => m.ok);
      if (hit) lines.push(`- ✓ Markdown companion found: ${hit.url}`);
      else lines.push("- No /.md, /llms.txt, or /llms-full.txt companion — consider adding one.");
    }
    if (r.robots && r.robots.blocksAgents && r.robots.blocksAgents.length > 0) {
      lines.push(`- ⚠ robots.txt disallows: ${r.robots.blocksAgents.join(", ")} — agents scraping for lead-gen won't index this.`);
    }
    lines.push("");
  }
  lines.push("## Recommended wiring");
  lines.push("");
  lines.push("1. For any target scoring <= 3/5, add at least one of:");
  lines.push("   - An `/llms.txt` file at site root (plain-text description of site content for agents).");
  lines.push("   - Pre-rendered HTML with an `<article>` and a single `<h1>`.");
  lines.push("   - A `.md` variant of key pages (archtrack.live/features.md, etc.).");
  lines.push("2. Re-run this check monthly; add to mission-control cron if it becomes routine.");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const outArg = argv.indexOf("--out");
  const outPath = outArg !== -1 ? argv[outArg + 1] : null;

  const results = [];
  for (const t of TARGETS) {
    process.stderr.write(`checking ${t.label} ... `);
    const r = await checkTarget(t);
    process.stderr.write(`score ${score(r)}/5\n`);
    results.push(r);
  }
  const report = renderReport(results);
  if (outPath) {
    await writeFile(outPath, report, "utf8");
    process.stderr.write(`wrote ${outPath}\n`);
  } else {
    process.stdout.write(report);
  }
}

main().catch((e) => {
  console.error(e);
  exit(1);
});
