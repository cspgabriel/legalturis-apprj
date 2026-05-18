"""Orquestrador: roda todos os scrapers + pipeline.

Uso:
    python -m scripts.run_all                  # tudo
    python -m scripts.run_all --skip alerj     # pula ALERJ (se IP bloqueado)
    python -m scripts.run_all --only lexml     # roda só LexML
"""
from __future__ import annotations

import argparse
import sys

from .pipeline import build_db
from .scrapers import alerj, camara_rio, lexml

SCRAPERS = {
    "lexml": lambda: lexml.run(max_records=10000),
    "alerj": lambda: alerj.run(),
    "camara_rio": lambda: camara_rio.run(),
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skip", nargs="*", default=[], choices=list(SCRAPERS.keys()))
    ap.add_argument("--only", nargs="*", default=[], choices=list(SCRAPERS.keys()))
    ap.add_argument("--no-build", action="store_true", help="só scraping, sem gerar JSON")
    args = ap.parse_args()

    targets = args.only if args.only else [k for k in SCRAPERS if k not in args.skip]

    for name in targets:
        print(f"\n{'='*60}\n▶ {name.upper()}\n{'='*60}")
        try:
            SCRAPERS[name]()
        except Exception as e:
            print(f"❌ {name} falhou: {e}")

    if not args.no_build:
        print(f"\n{'='*60}\n▶ PIPELINE\n{'='*60}")
        build_db.build()
    return 0


if __name__ == "__main__":
    sys.exit(main())
