# Cutlist CSV Format

Use `assemble-cutlist` with a UTF-8 CSV that includes headers.

## Required columns

- `start`: Clip in-point (`seconds`, `MM:SS`, or `HH:MM:SS.mmm`)
- `end`: Clip out-point (`seconds`, `MM:SS`, or `HH:MM:SS.mmm`)

## Optional columns

- `source`: Source media path for this row
- `label`: Human-readable label used in temporary file names

If `source` is omitted, pass `--default-source /path/to/source.mov`.

## Example

```csv
source,start,end,label
./rushes/day1_camA.mov,00:00:05.000,00:00:11.200,opening-look
./rushes/day1_camA.mov,00:00:28.500,00:00:34.200,reaction
./rushes/day2_camB.mov,00:01:12.000,00:01:19.900,closing
```

## Usage

```bash
scripts/reel_editor.py assemble-cutlist \
  --cutlist selects.csv \
  --output exports/reel_v01.mp4 \
  --width 1920 \
  --height 1080 \
  --fps 24
```
