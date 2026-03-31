# Interview Mode Skill

**Source:** Ben's Bites — "Agents should interview you" (late March 2026)
**Added:** 2026-03-30 by Mohlt (bens-bites-interview-mode-2026-03-30)

## What This Is

Before starting any complex task, the agent interviews the user to gather all necessary context upfront. This prevents mid-task clarifications, reduces back-and-forth, and produces better results.

**Ben's finding:** When he asked an agent to "interview me and get all the information you need to [task]", the agent asked ~20 targeted questions and showed strong ability to probe and clarify. The result: far better task outcomes vs. just diving in.

## When to Use

Use this pattern before:
- Starting a new Mission in Mission Control
- Building a new feature in ArchTrack
- Running any task that touches multiple systems
- Anything where requirements are ambiguous

## How to Invoke

Tell the agent:
```
Interview me and get all the information you need to [your task description here].
Don't start working until you've asked all your questions.
```

## The Pattern

```
You: Interview me and get all the information you need to build [X].
     Ask all your questions before starting any implementation.

Agent: [Asks 10-20 targeted questions covering:]
  - Goal: What success looks like
  - Constraints: Time, cost, tech stack preferences
  - Context: What's been tried before, what to avoid
  - Integrations: What other systems need to connect
  - Edge cases: Special requirements
  - Priority: What's most important if trade-offs required

You: [Answer all questions]

Agent: [Now has full context → produces much better output]
```

## Mission Control Integration

Add this to mission briefs for complex missions. Before Mission Control starts a new mission with many unknowns:

```markdown
## Pre-Mission Interview Required

Before proceeding, conduct a brief interview with Mohammed to clarify:
- [ ] Desired outcome (what does "done" look like?)
- [ ] Timeline and priority
- [ ] Available resources / constraints
- [ ] Connected systems and APIs needed
- [ ] Any previous attempts at this task

Use the interview-mode skill: "Interview me and get all the info you need to [mission goal]."
```

## OpenClaw Integration

For OpenClaw Debugger sessions, trigger an interview when:
1. A new debugging session starts with a vague error description
2. A feature request is ambiguous
3. The task spans multiple tools/services

```javascript
// Suggested trigger in OpenClaw
if (taskAmbiguityScore > 0.7) {
  triggerInterviewMode(task);
}
```

## Tips

- **Ask everything at once.** Don't trickle questions — ask all 10-20 upfront. Users prefer one batch over 20 interruptions.
- **Probe, don't assume.** If an answer is vague, follow up in the same question batch: "If X, what then? If Y, what then?"
- **End with confirmation.** After answers: "Based on your answers, here's my plan: [summary]. Does this match your intent?"
- **Less context = worse output.** The investment in an interview pays back 5x in fewer revision cycles.

## Example (from Ben's Bites)

> Ben asked an agent to "interview me and get all the information you need to build a side project tracker."
> The agent asked 20 questions including: What data needs to be tracked? What integrations? Mobile or web? Who else uses it? Budget? Timeline? Existing tools to connect?
> Result: The first implementation matched what Ben actually wanted, with zero revision cycles.
