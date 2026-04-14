---
name: film-reel-video-editor
description: Edit and finish film-reel style videos with ffmpeg automation. Use when requests involve cutting .mp4/.mov/.mxf footage into reels, assembling selects from a cutlist, applying analog film-look treatment (grain/flicker/gate-weave), inspecting media metadata, or exporting review/festival screener deliverables.
---

# Film Reel Video Editor

## Overview

Use this skill to execute reel-focused post workflows quickly from the terminal with deterministic scripts.
Run the bundled `scripts/reel_editor.py` commands instead of rewriting ffmpeg command chains per request.

## Prerequisites

- Ensure `ffmpeg` and `ffprobe` are installed and in `PATH`.
- Keep source media paths explicit.
- Prefer exporting to `.mp4` unless the user asks for a different container.

## Workflow

1. Inspect footage and confirm frame rate, duration, and audio streams.
2. Build selects with `cut` or from a CSV using `assemble-cutlist`.
3. Apply look pass with `film-look` only after structural edits are final.
4. Export the final reel with target resolution/frame rate settings.

## Quick Start

Inspect:

```bash
scripts/reel_editor.py inspect input/reel_source.mov
```

Cut one segment:

```bash
scripts/reel_editor.py cut \
  --input input/reel_source.mov \
  --output exports/shot_010_take2.mp4 \
  --start 00:00:14.200 \
  --end 00:00:22.900 \
  --width 1920 \
  --height 1080 \
  --fps 24
```

Assemble from cutlist:

```bash
scripts/reel_editor.py assemble-cutlist \
  --cutlist selects.csv \
  --default-source input/reel_source.mov \
  --output exports/reel_v01.mp4 \
  --width 1920 \
  --height 1080 \
  --fps 24
```

Apply analog look:

```bash
scripts/reel_editor.py film-look \
  --input exports/reel_v01.mp4 \
  --output exports/reel_v01_filmlook.mp4 \
  --grain 20 \
  --flicker 0.02 \
  --weave 1.2 \
  --vignette
```

## Command Guide

### `inspect`

Use to inspect streams and confirm source properties before editing.
Use `--json` when another script needs full metadata.

### `cut`

Use for precise segment extraction.
Prefer default re-encode mode for accuracy.
Use `--copy-streams` only when speed matters more than frame-accurate boundaries.

### `assemble-cutlist`

Use to batch render selects and concatenate into one reel.
Load cutlist format rules from `references/cutlist-format.md`.
Use `--final-reencode` if concat stream-copy fails for edge cases.

### `film-look`

Use after structural edits are locked.
Tune:
- `--grain` to increase/decrease film noise.
- `--flicker` for lamp/gate brightness instability.
- `--weave` for subtle frame movement.

## References

- `references/cutlist-format.md`: CSV schema and examples for `assemble-cutlist`.
