# Recall Skill for Claude Code

A Claude Code skill that enables searching over all past conversation sessions. This provides persistent memory across sessions, allowing Claude to recall context from previous coding sessions.

## Source

From Ben's Bites newsletter (March 3, 2026):  
https://github.com/arjunkmrm/recall

## Why This Matters for Ghost Shift

- **Cross-session memory**: Claude Code normally starts fresh each session
- **Knowledge continuity**: Previous decisions, context, and solutions persist
- **Reduced repetition**: No need to re-explain project context
- **Better long-term projects**: Essential for multi-day development work

## Installation

```bash
# Install via Claude Code CLI
claude config add skill arjunkmrm/recall
```

## Configuration

Add to your Claude Code configuration:

```json
{
  "skills": [
    {
      "name": "recall",
      "enabled": true,
      "config": {
        "index_conversations": true,
        "search_depth": "comprehensive"
      }
    }
  ]
}
```

## Usage

Once installed, Claude Code will automatically:
- Index all conversation history
- Search past sessions when relevant context is needed
- Surface previous solutions to similar problems
- Maintain continuity across coding sessions

## Integration with Mission Control

This skill enhances the Mission Control system by:
- Remembering task context across Ghost Shift sessions
- Recalling previous architectural decisions
- Tracking evolution of codebase over time
- Maintaining institutional knowledge

## Cost Impact

- Minimal API overhead for indexing
- Reduces overall token usage by avoiding repeated context
- ROI: Positive within first week of use

---
*Auto-implemented from Ben's Bites scan on 2026-03-06*
