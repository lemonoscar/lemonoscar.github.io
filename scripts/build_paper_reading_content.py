#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "paper" / "articles"
OUTPUT = ROOT / "paper-reading-content.js"


def main() -> None:
    content = {}
    for path in sorted(ARTICLES_DIR.glob("*.md")):
        if path.name == "README.md":
            continue
        rel = path.relative_to(ROOT).as_posix()
        content[rel] = path.read_text(encoding="utf-8")

    payload = "window.PAPER_READING_CONTENT = " + json.dumps(
        content,
        ensure_ascii=False,
        separators=(",", ":"),
    ) + ";\n"
    OUTPUT.write_text(payload, encoding="utf-8")
    print(f"Wrote bundled note content for {len(content)} files to {OUTPUT.name}.")


if __name__ == "__main__":
    main()
