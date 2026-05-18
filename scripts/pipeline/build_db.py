"""Pipeline: CSVs brutos -> banco JSON chunked publicável.

Saída:
    api/leis-bulk/index.json         — metadados + paginação
    api/leis-bulk/page-001.json      — 500 leis/página
    api/leis-bulk/page-002.json
    ...
    api/leis-bulk/by-cidade/<id>.json — índices por cidade (só ids)
    api/leis-bulk/by-categoria/<id>.json
    api/leis-bulk/search-index.json  — índice invertido leve pra busca client

Uso:
    python -m scripts.pipeline.build_db [--chunk 500]
"""
from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from dataclasses import asdict
from pathlib import Path

from ..scrapers.common import DATA_RAW, Lei, read_csv

ROOT = Path(__file__).resolve().parents[2]
API_DIR = ROOT / "api" / "leis-bulk"


def normalizar(texto: str) -> str:
    """Remove acentos + lowercase pra busca."""
    import unicodedata
    nfkd = unicodedata.normalize("NFKD", texto or "")
    s = "".join(c for c in nfkd if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9\s]", " ", s)


def consolidar() -> list[Lei]:
    """Lê todos os CSVs em data/raw e deduplica por id."""
    todas: dict[str, Lei] = {}
    for csv in sorted(DATA_RAW.glob("*.csv")):
        print(f"[pipeline] lendo {csv.name}...")
        for lei in read_csv(csv):
            todas[lei.id] = lei  # último vence em caso de conflito
    print(f"[pipeline] total consolidado: {len(todas)}")
    # ordena por ano desc, depois número
    return sorted(todas.values(), key=lambda l: (-l.ano, l.numero))


def build_search_index(leis: list[Lei]) -> dict:
    """Índice invertido simples: termo -> [ids]."""
    inv: dict[str, list[str]] = defaultdict(list)
    for lei in leis:
        blob = f"{lei.numero} {lei.titulo} {lei.resumo}"
        for token in set(normalizar(blob).split()):
            if len(token) >= 3:
                inv[token].append(lei.id)
    # limita a tokens com até 500 referências pra não inflar
    return {k: v[:500] for k, v in inv.items()}


def build(chunk_size: int = 500) -> None:
    leis = consolidar()
    if not leis:
        print("[pipeline] ⚠️  Nenhuma lei encontrada em data/raw/ — rode os scrapers primeiro.")
        return

    API_DIR.mkdir(parents=True, exist_ok=True)
    (API_DIR / "by-cidade").mkdir(exist_ok=True)
    (API_DIR / "by-categoria").mkdir(exist_ok=True)

    # paginação
    total = len(leis)
    pages = (total + chunk_size - 1) // chunk_size
    for i in range(pages):
        chunk = leis[i * chunk_size:(i + 1) * chunk_size]
        page_data = {
            "page": i + 1,
            "of": pages,
            "count": len(chunk),
            "leis": [asdict(l) for l in chunk],
        }
        out = API_DIR / f"page-{i+1:03d}.json"
        out.write_text(json.dumps(page_data, ensure_ascii=False), encoding="utf-8")
    print(f"[pipeline] {pages} páginas escritas em {API_DIR}")

    # índices secundários (lista de ids por bucket — leve)
    by_cidade: dict[str, list[str]] = defaultdict(list)
    by_cat: dict[str, list[str]] = defaultdict(list)
    by_ano: dict[int, int] = defaultdict(int)
    by_fonte: dict[str, int] = defaultdict(int)
    for lei in leis:
        by_cidade[lei.cidade].append(lei.id)
        by_cat[lei.categoria].append(lei.id)
        by_ano[lei.ano] += 1
        by_fonte[lei.fonte] += 1

    for cid, ids in by_cidade.items():
        (API_DIR / "by-cidade" / f"{cid}.json").write_text(
            json.dumps({"cidade": cid, "total": len(ids), "ids": ids}, ensure_ascii=False),
            encoding="utf-8",
        )
    for cat, ids in by_cat.items():
        (API_DIR / "by-categoria" / f"{cat}.json").write_text(
            json.dumps({"categoria": cat, "total": len(ids), "ids": ids}, ensure_ascii=False),
            encoding="utf-8",
        )

    # search index
    inv = build_search_index(leis)
    (API_DIR / "search-index.json").write_text(
        json.dumps(inv, ensure_ascii=False), encoding="utf-8"
    )
    print(f"[pipeline] search index: {len(inv)} tokens")

    # índice principal
    index = {
        "version": "2.0",
        "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "total": total,
        "chunk_size": chunk_size,
        "pages": pages,
        "page_template": "page-{N:03d}.json",
        "fontes": dict(by_fonte),
        "anos": dict(sorted(by_ano.items(), reverse=True)),
        "cidades": {k: len(v) for k, v in by_cidade.items()},
        "categorias": {k: len(v) for k, v in by_cat.items()},
    }
    (API_DIR / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[pipeline] ✅ index.json gerado | {total} leis | {pages} páginas")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--chunk", type=int, default=500)
    args = ap.parse_args()
    build(args.chunk)
