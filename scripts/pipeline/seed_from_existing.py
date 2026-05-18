"""Seed inicial: converte api/leis.json (40 leis curadas) pro schema v2.

Roda uma vez pra ter dataset funcional antes do scraper completar.
"""
from __future__ import annotations

import json
from pathlib import Path

from ..scrapers.common import DATA_RAW, Lei, make_id, write_csv

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "api" / "leis.json"


def main() -> None:
    if not SRC.exists():
        print(f"⚠️  {SRC} não existe")
        return
    data = json.loads(SRC.read_text(encoding="utf-8"))
    rows: list[Lei] = []
    for item in data.get("leis", []):
        ano = int(item.get("ano", 0))
        numero = str(item.get("numero", ""))
        rows.append(Lei(
            id=make_id("seed", numero, ano),
            numero=numero,
            tipo=item.get("tipo", "Lei"),
            titulo=item.get("titulo", ""),
            resumo=item.get("resumo", ""),
            ano=ano,
            cidade=item.get("cidade", "estado"),
            categoria=item.get("categoria", "administrativa"),
            fonte="curadoria-legirj",
            url_oficial=item.get("url", ""),
        ))
    out = DATA_RAW / "seed.csv"
    n = write_csv(rows, out)
    print(f"✅ seed: {n} leis exportadas para {out}")


if __name__ == "__main__":
    main()
