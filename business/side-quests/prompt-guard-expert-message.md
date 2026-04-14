Hey man, so I built this thing called prompt-guard-cli. It's basically a linter for prompts before they go to AI coding agents like Claude Code or Cursor.

The problem: garbage in, garbage out. People send vague prompts like "fix the bug" and wonder why the AI gives generic code that doesn't fit their project.

What it does:
- Checks prompts for missing context (no files mentioned, no tests, no success criteria)
- Reads your PROJECT.md and CONTEXT.md
- Enhances the prompt with relevant project details before sending to the AI
- Warns about local env stuff (absolute paths, API keys) so you don't overfit

It's live on npm now but I want to take it further. You're deep in this space — what would you actually want to see in a tool like this? What's the biggest pain point with AI coding agents that we could solve?

Would love your honest take. Happy to jump on a call too if easier.
