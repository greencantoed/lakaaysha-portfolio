#!/usr/bin/env python3
"""
Film reel editing helper built on ffmpeg/ffprobe.

Subcommands:
- inspect: Print source metadata and stream details.
- cut: Export a precise clip from a source.
- assemble-cutlist: Build a reel from a CSV cut list.
- film-look: Apply grain/flicker/weave grading for analog style.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass
class EncodeSettings:
    video_codec: str
    audio_codec: str
    crf: int
    preset: str
    audio_bitrate: str
    fps: float | None
    width: int | None
    height: int | None


@dataclass
class CutSegment:
    source: Path
    start: str
    end: str
    label: str


def fail(message: str) -> None:
    print(f"[ERROR] {message}", file=sys.stderr)
    sys.exit(1)


def ensure_tools() -> None:
    for binary in ("ffmpeg", "ffprobe"):
        if shutil.which(binary) is None:
            fail(
                f"'{binary}' is not installed or not in PATH. Install ffmpeg before using this skill."
            )


def run_cmd(cmd: list[str], dry_run: bool = False) -> None:
    print(f"$ {shlex.join(cmd)}")
    if dry_run:
        return
    result = subprocess.run(cmd)
    if result.returncode != 0:
        raise RuntimeError(f"Command failed with exit code {result.returncode}")


def resolve_input(path_value: str, base_dir: Path | None = None) -> Path:
    input_path = Path(path_value).expanduser()
    if not input_path.is_absolute() and base_dir is not None:
        input_path = base_dir / input_path
    input_path = input_path.resolve()
    if not input_path.exists():
        fail(f"Input not found: {input_path}")
    return input_path


def resolve_output(path_value: str) -> Path:
    output_path = Path(path_value).expanduser().resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    return output_path


def parse_ratio(value: str | None) -> float | None:
    if not value or value == "0/0":
        return None
    if "/" not in value:
        try:
            return float(value)
        except ValueError:
            return None
    numerator, denominator = value.split("/", 1)
    try:
        num = float(numerator)
        den = float(denominator)
    except ValueError:
        return None
    if den == 0:
        return None
    return num / den


def parse_timecode(value: str) -> float | None:
    value = value.strip()
    if re.fullmatch(r"\d+(?:\.\d+)?", value):
        return float(value)

    parts = value.split(":")
    if len(parts) == 2:
        minutes, seconds = parts
        if re.fullmatch(r"\d+", minutes) and re.fullmatch(r"\d+(?:\.\d+)?", seconds):
            return int(minutes) * 60 + float(seconds)
    if len(parts) == 3:
        hours, minutes, seconds = parts
        if (
            re.fullmatch(r"\d+", hours)
            and re.fullmatch(r"\d+", minutes)
            and re.fullmatch(r"\d+(?:\.\d+)?", seconds)
        ):
            return int(hours) * 3600 + int(minutes) * 60 + float(seconds)
    return None


def validate_time_range(start: str, end: str) -> None:
    start_seconds = parse_timecode(start)
    end_seconds = parse_timecode(end)
    if start_seconds is None or end_seconds is None:
        return
    if end_seconds <= start_seconds:
        fail(f"Invalid time range: end ({end}) must be greater than start ({start}).")


def probe_media(path: Path) -> dict[str, Any]:
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-show_streams",
        "-show_format",
        "-print_format",
        "json",
        str(path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        fail(f"ffprobe failed for '{path}': {result.stderr.strip()}")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        fail(f"Could not parse ffprobe JSON output: {exc}")
    return {}


def print_probe_summary(probe: dict[str, Any]) -> None:
    fmt = probe.get("format", {})
    streams = probe.get("streams", [])
    video_stream = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio_stream = next((s for s in streams if s.get("codec_type") == "audio"), None)

    duration = fmt.get("duration", "unknown")
    size = fmt.get("size", "unknown")
    bit_rate = fmt.get("bit_rate", "unknown")
    format_name = fmt.get("format_name", "unknown")

    print("Container")
    print(f"  format      : {format_name}")
    print(f"  duration(s) : {duration}")
    print(f"  size(bytes) : {size}")
    print(f"  bitrate     : {bit_rate}")

    if video_stream:
        fps = parse_ratio(video_stream.get("avg_frame_rate"))
        width = video_stream.get("width", "unknown")
        height = video_stream.get("height", "unknown")
        codec = video_stream.get("codec_name", "unknown")
        print("Video")
        print(f"  codec       : {codec}")
        print(f"  resolution  : {width}x{height}")
        print(f"  fps         : {fps if fps is not None else 'unknown'}")
    else:
        print("Video")
        print("  none")

    if audio_stream:
        codec = audio_stream.get("codec_name", "unknown")
        sample_rate = audio_stream.get("sample_rate", "unknown")
        channels = audio_stream.get("channels", "unknown")
        print("Audio")
        print(f"  codec       : {codec}")
        print(f"  sample rate : {sample_rate}")
        print(f"  channels    : {channels}")
    else:
        print("Audio")
        print("  none")


def build_encode_settings(args: argparse.Namespace) -> EncodeSettings:
    return EncodeSettings(
        video_codec=args.video_codec,
        audio_codec=args.audio_codec,
        crf=args.crf,
        preset=args.preset,
        audio_bitrate=args.audio_bitrate,
        fps=args.fps,
        width=args.width,
        height=args.height,
    )


def build_video_filter(settings: EncodeSettings) -> str | None:
    filters: list[str] = []
    if settings.width is not None or settings.height is not None:
        if settings.width is None or settings.height is None:
            fail("Set both --width and --height together.")
        filters.append(
            "scale="
            f"{settings.width}:{settings.height}:force_original_aspect_ratio=decrease,"
            f"pad={settings.width}:{settings.height}:(ow-iw)/2:(oh-ih)/2"
        )
    if settings.fps is not None:
        filters.append(f"fps={settings.fps}")
    if not filters:
        return None
    return ",".join(filters)


def build_encode_flags(settings: EncodeSettings) -> list[str]:
    return [
        "-c:v",
        settings.video_codec,
        "-crf",
        str(settings.crf),
        "-preset",
        settings.preset,
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        settings.audio_codec,
        "-b:a",
        settings.audio_bitrate,
        "-movflags",
        "+faststart",
    ]


def sanitize_label(label: str, index: int) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_-]+", "-", label.strip()).strip("-").lower()
    if cleaned:
        return cleaned
    return f"clip-{index:03d}"


def concat_file_line(path: Path) -> str:
    escaped = str(path).replace("'", "'\\''")
    return f"file '{escaped}'\n"


def read_cutlist(cutlist_path: Path, default_source: Path | None) -> list[CutSegment]:
    segments: list[CutSegment] = []
    with cutlist_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            fail("Cutlist CSV is missing a header row.")

        fieldnames = {name.strip().lower() for name in reader.fieldnames if name}
        if "start" not in fieldnames or "end" not in fieldnames:
            fail("Cutlist CSV must include at least 'start' and 'end' columns.")

        for index, row in enumerate(reader, start=1):
            normalized = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
            if not any(normalized.values()):
                continue

            source_value = normalized.get("source", "")
            if source_value:
                source = resolve_input(source_value, cutlist_path.parent)
            elif default_source:
                source = default_source
            else:
                fail(
                    f"Row {index}: no source provided. Add a 'source' column or pass --default-source."
                )

            start = normalized.get("start", "")
            end = normalized.get("end", "")
            if not start or not end:
                fail(f"Row {index}: both start and end are required.")
            validate_time_range(start, end)

            label = normalized.get("label", f"clip-{index:03d}")
            segments.append(CutSegment(source=source, start=start, end=end, label=label))

    if not segments:
        fail("Cutlist produced zero segments after parsing.")
    return segments


def create_temp_workspace(temp_dir: str | None, keep_temp: bool) -> tuple[Path, tempfile.TemporaryDirectory[str] | None]:
    if temp_dir:
        base = Path(temp_dir).expanduser().resolve()
        base.mkdir(parents=True, exist_ok=True)
        if keep_temp:
            temp_path = Path(tempfile.mkdtemp(prefix="reel-assemble-", dir=base))
            return temp_path, None
        temp_obj = tempfile.TemporaryDirectory(prefix="reel-assemble-", dir=base)
        return Path(temp_obj.name), temp_obj

    if keep_temp:
        temp_path = Path(tempfile.mkdtemp(prefix="reel-assemble-"))
        return temp_path, None

    temp_obj = tempfile.TemporaryDirectory(prefix="reel-assemble-")
    return Path(temp_obj.name), temp_obj


def cmd_inspect(args: argparse.Namespace) -> None:
    input_path = resolve_input(args.input)
    probe = probe_media(input_path)
    if args.json:
        print(json.dumps(probe, indent=2))
        return
    print_probe_summary(probe)


def cmd_cut(args: argparse.Namespace) -> None:
    settings = build_encode_settings(args)
    input_path = resolve_input(args.input)
    output_path = resolve_output(args.output)
    validate_time_range(args.start, args.end)

    if args.copy_streams:
        if any(
            [
                settings.fps is not None,
                settings.width is not None,
                settings.height is not None,
            ]
        ):
            fail("--copy-streams cannot be used with --fps/--width/--height.")
        cmd = [
            "ffmpeg",
            "-y",
            "-v",
            "warning",
            "-ss",
            args.start,
            "-to",
            args.end,
            "-i",
            str(input_path),
            "-c",
            "copy",
            "-movflags",
            "+faststart",
            str(output_path),
        ]
        run_cmd(cmd, dry_run=args.dry_run)
        return

    cmd = [
        "ffmpeg",
        "-y",
        "-v",
        "warning",
        "-i",
        str(input_path),
        "-ss",
        args.start,
        "-to",
        args.end,
    ]
    video_filter = build_video_filter(settings)
    if video_filter:
        cmd.extend(["-vf", video_filter])
    cmd.extend(build_encode_flags(settings))
    cmd.append(str(output_path))
    run_cmd(cmd, dry_run=args.dry_run)


def cmd_assemble_cutlist(args: argparse.Namespace) -> None:
    settings = build_encode_settings(args)
    cutlist_path = resolve_input(args.cutlist)
    output_path = resolve_output(args.output)
    default_source = resolve_input(args.default_source) if args.default_source else None
    segments = read_cutlist(cutlist_path, default_source)

    temp_dir, temp_obj = create_temp_workspace(args.temp_dir, args.keep_temp)
    print(f"[INFO] Working directory: {temp_dir}")
    try:
        rendered_segments: list[Path] = []
        for index, segment in enumerate(segments, start=1):
            segment_name = f"{index:04d}_{sanitize_label(segment.label, index)}.mp4"
            segment_path = temp_dir / segment_name

            cmd = [
                "ffmpeg",
                "-y",
                "-v",
                "warning",
                "-i",
                str(segment.source),
                "-ss",
                segment.start,
                "-to",
                segment.end,
            ]
            video_filter = build_video_filter(settings)
            if video_filter:
                cmd.extend(["-vf", video_filter])
            cmd.extend(build_encode_flags(settings))
            cmd.append(str(segment_path))
            run_cmd(cmd, dry_run=args.dry_run)
            rendered_segments.append(segment_path)

        concat_manifest = temp_dir / "concat-list.txt"
        concat_manifest.write_text(
            "".join(concat_file_line(path) for path in rendered_segments),
            encoding="utf-8",
        )

        concat_cmd = [
            "ffmpeg",
            "-y",
            "-v",
            "warning",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_manifest),
        ]
        if args.final_reencode:
            concat_cmd.extend(build_encode_flags(settings))
        else:
            concat_cmd.extend(["-c", "copy", "-movflags", "+faststart"])
        concat_cmd.append(str(output_path))
        run_cmd(concat_cmd, dry_run=args.dry_run)

    finally:
        if temp_obj is not None:
            temp_obj.cleanup()
        elif args.keep_temp:
            print(f"[INFO] Kept temporary files in {temp_dir}")


def build_film_look_filter(args: argparse.Namespace, settings: EncodeSettings) -> str:
    filters: list[str] = []

    if args.flicker > 0:
        eq_filter = (
            f"eq=contrast={args.contrast}:saturation={args.saturation}:gamma={args.gamma}:"
            f"brightness={args.flicker}*sin(2*PI*t*1.15)"
        )
    else:
        eq_filter = f"eq=contrast={args.contrast}:saturation={args.saturation}:gamma={args.gamma}"
    filters.append(eq_filter)

    if args.weave > 0:
        pad = max(8, int(round(args.weave * 8)))
        half_pad = pad // 2
        filters.append(
            f"crop=iw-{pad}:ih-{pad}:x={half_pad}+{args.weave}*sin(2*PI*t*0.8):"
            f"y={half_pad}+{args.weave}*cos(2*PI*t*1.1)"
        )
        filters.append(f"scale=iw+{pad}:ih+{pad}")

    if args.grain > 0:
        filters.append(f"noise=alls={args.grain}:allf=t+u")

    if args.vignette:
        filters.append("vignette=PI/5")

    base_filter = build_video_filter(settings)
    if base_filter:
        filters.append(base_filter)

    return ",".join(filters)


def cmd_film_look(args: argparse.Namespace) -> None:
    settings = build_encode_settings(args)
    input_path = resolve_input(args.input)
    output_path = resolve_output(args.output)

    filter_chain = build_film_look_filter(args, settings)

    cmd = [
        "ffmpeg",
        "-y",
        "-v",
        "warning",
        "-i",
        str(input_path),
        "-vf",
        filter_chain,
    ]
    cmd.extend(build_encode_flags(settings))
    cmd.append(str(output_path))
    run_cmd(cmd, dry_run=args.dry_run)


def add_common_encode_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--video-codec", default="libx264")
    parser.add_argument("--audio-codec", default="aac")
    parser.add_argument("--audio-bitrate", default="192k")
    parser.add_argument("--crf", type=int, default=18)
    parser.add_argument("--preset", default="medium")
    parser.add_argument("--fps", type=float, default=None)
    parser.add_argument("--width", type=int, default=None)
    parser.add_argument("--height", type=int, default=None)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Film reel editor helpers based on ffmpeg.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    inspect_parser = subparsers.add_parser("inspect", help="Show metadata for a media file.")
    inspect_parser.add_argument("input", help="Input media path.")
    inspect_parser.add_argument(
        "--json",
        action="store_true",
        help="Print full ffprobe JSON instead of a short summary.",
    )
    inspect_parser.set_defaults(func=cmd_inspect)

    cut_parser = subparsers.add_parser("cut", help="Export a clip from an input file.")
    cut_parser.add_argument("--input", required=True, help="Input media path.")
    cut_parser.add_argument("--output", required=True, help="Output media path.")
    cut_parser.add_argument("--start", required=True, help="Start time (e.g. 00:00:12.3).")
    cut_parser.add_argument("--end", required=True, help="End time (e.g. 00:00:18.9).")
    cut_parser.add_argument(
        "--copy-streams",
        action="store_true",
        help="Use stream copy for speed (less precise cuts).",
    )
    cut_parser.add_argument("--dry-run", action="store_true", help="Print commands only.")
    add_common_encode_args(cut_parser)
    cut_parser.set_defaults(func=cmd_cut)

    assemble_parser = subparsers.add_parser(
        "assemble-cutlist",
        help="Render each cut in a CSV and concatenate them into one reel.",
    )
    assemble_parser.add_argument("--cutlist", required=True, help="CSV with source/start/end/label.")
    assemble_parser.add_argument("--output", required=True, help="Output media path.")
    assemble_parser.add_argument(
        "--default-source",
        default=None,
        help="Fallback source file when cutlist rows omit source.",
    )
    assemble_parser.add_argument(
        "--temp-dir",
        default=None,
        help="Directory where temporary segment files are stored.",
    )
    assemble_parser.add_argument(
        "--keep-temp",
        action="store_true",
        help="Keep temporary segment files for debugging.",
    )
    assemble_parser.add_argument(
        "--final-reencode",
        action="store_true",
        help="Re-encode the final concat output instead of stream-copy.",
    )
    assemble_parser.add_argument("--dry-run", action="store_true", help="Print commands only.")
    add_common_encode_args(assemble_parser)
    assemble_parser.set_defaults(func=cmd_assemble_cutlist)

    look_parser = subparsers.add_parser("film-look", help="Apply analog film-style grading.")
    look_parser.add_argument("--input", required=True, help="Input media path.")
    look_parser.add_argument("--output", required=True, help="Output media path.")
    look_parser.add_argument(
        "--grain",
        type=int,
        default=18,
        help="Noise strength (0-100).",
    )
    look_parser.add_argument(
        "--flicker",
        type=float,
        default=0.02,
        help="Brightness flicker amplitude (0.0-0.2).",
    )
    look_parser.add_argument(
        "--weave",
        type=float,
        default=1.2,
        help="Gate-weave position jitter in pixels.",
    )
    look_parser.add_argument("--contrast", type=float, default=1.08)
    look_parser.add_argument("--saturation", type=float, default=1.04)
    look_parser.add_argument("--gamma", type=float, default=0.96)
    look_parser.add_argument(
        "--vignette",
        action="store_true",
        help="Add subtle vignette darkening near edges.",
    )
    look_parser.add_argument("--dry-run", action="store_true", help="Print commands only.")
    add_common_encode_args(look_parser)
    look_parser.set_defaults(func=cmd_film_look)

    return parser


def main() -> None:
    ensure_tools()
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
    except RuntimeError as exc:
        fail(str(exc))


if __name__ == "__main__":
    main()
