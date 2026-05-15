---
name: video-to-html
description: Use when the user wants to convert a screen recording (or any video walkthrough with narration) into a structured HTML document — transcript, keyframes linked to timestamps, and short GIFs for dynamic moments. Triggers on: "turn this video into a doc", "make a build log from this screen recording", "HTML report from my Loom", "extract keyframes and transcript from this video", or any video file (.mp4, .mov, .webm) handed in with a request to document, summarize, or build-log it. Output is a self-contained HTML file. Adapted from Ben's Bites 2026-05-14 tip.
---

# video-to-html

Turn a video into a structured HTML document.

## When to use

- Mohammed records a Loom of an automation he built for VC SaaS portfolio agentification → run skill → HTML one-pager that goes in the email/pitch (much higher response rate than a bare Loom link).
- Mohammed records a demo of an accounting agent for a dad's-firm prospect → run skill → polished HTML walkthrough.
- ArchTrack desktop tracker build-log → screen recording + voiceover → HTML doc that lives in arch-firm-dashboard/ or the Archtrack repo.
- Golf swing review video (his own footage from Sunday 5–6 hr golf sessions) → HTML breakdown with keyframes (later — TN visa means content stays unmonetized).
- Any feedback session he records talking through an agent's output → HTML report he can refer back to (the original Ben's Bites use case).

## Inputs

- A video file (.mp4, .mov, .webm) — typically a screen recording with voice narration.
- Optional: a one-line intent ("this is a pitch for X", "this is a build log of Y") to bias the action-checklist extraction.

## Output

Single self-contained HTML file at outputs/<video-basename>.html with:

1. Header — inferred title, date, source video filename.
2. Transcript — full speech-to-text of narration, paragraph-broken at natural pauses.
3. Keyframes — at each significant beat (scene change, narration-emphasized point, action shown), embed a still image with the timestamp anchored as a clickable link back to the original video.
4. GIFs — for dynamic moments (UI animation, mouse-path showing a workflow, swing motion), embed a short auto-generated GIF (≤ 3 seconds, ≤ 5 fps to stay light).
5. Actions checklist — at the bottom, a <ul class="actions"> of next-steps inferred from narration (e.g., "rebuild X", "fix Y", "send Loom to prospect Z").

## How to execute

1. Transcribe. ffmpeg + Whisper (or cheaper API from STACK.md — Qwen/Deepseek/Minimax — depending on $200/mo cap remaining for the month).
2. Identify keyframes. Scene-change detection: ffmpeg -vf "select=gt(scene\,0.3)". Cap at 12 keyframes per minute of video to keep HTML light.
3. Detect dynamic segments. Narration cues ("watch this", "see how") + 3+ consecutive motion-keyframes → mark as GIF candidate.
4. Render GIFs. ffmpeg -i input.mp4 -ss <start> -t <duration> -vf "fps=5,scale=720:-1" clip.gif
5. Assemble HTML. Inline images and GIFs as base64 so the HTML is portable to email / proposal contexts.
6. Save. outputs/<video-basename>.html. Echo absolute path back to the user.

## Token budget

- Whisper transcription: ~$0.006/min. For a 10-min Loom, ~$0.06.
- LLM inference for action-extraction + keyframe selection: ~2K input, ~500 output. ~$0.01 on Haiku.
- Total expected cost per video: <$0.10. Well within the $200/mo cap.

## Validation after each run

Print:
- Output HTML path
- Number of keyframes embedded
- Number of GIFs generated
- Estimated API cost

## Source

Adapted from Ben's Bites 2026-05-14 ("Agents feedback tip — all apps will become dev tools"). Ben's original use case was inverted (user records feedback FOR the agent). This skill inverts back to the more useful direction for Mohammed's workflow: agent produces a structured doc FROM the user's recording.
