# OpenClaw: Bring Your Own API Key (Apr 2026)

As of Apr 7, 2026, Anthropic no longer lets a Claude Code subscription fund Claude usage inside third-party harnesses like OpenClaw. Source: Ben's Bites, *No Claude for Claws*, Apr 7 2026.

## What changed
- Claude models are still available in OpenClaw.
- They now require either pay-as-you-go billing inside OpenClaw, or your own `ANTHROPIC_API_KEY`.
- Anthropic offered a one-time credit equal to one month of subscription as a transition.

## What to do
1. Generate a personal API key at https://console.anthropic.com/settings/keys.
2. In OpenClaw, set `ANTHROPIC_API_KEY` in your env or per-project settings.
3. (Optional) Enable PAYG billing in OpenClaw if you'd rather not manage a key.
4. Claim the one-month transition credit if you used a CC subscription previously.

## Why this doc exists
Mission Control's onboarding previously implied a CC subscription was enough to drive OpenClaw. That's no longer true. This file is the canonical pointer.
