"""Scraper LexML via HTML search (SRU oficial está 404).

URL: https://www.lexml.gov.br/busca/search
Filtros: f1-localidade=Rio de Janeiro; f2-tipoDocumento=Legislação
Paginação: ;startDoc=N (incrementa de 20 em 20)
"""
from __future__ import annotations

import argparse
import re
import time
from pathlib import Path
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

from .common import DATA_RAW, Lei, categorizar, make_id, parse_ano, write_csv

BASE = "https://www.lexml.gov.br/busca/search"
PAGE_STEP = 20  # LexML retorna 20 por página
USER_AGENT = "legalturis-apprj/1.0 (+https://github.com/cspgabriel/legalturis-apprj)"
HEADERS = {"User-Agent": USER_AGENT, "Accept-Language": "pt-BR,pt;q=0.9"}


def _build_url(start: int, keyword: str = "estadual rio de janeiro") -> str:
    # LexML exige keyword. Filtramos por jurisdição no parser.
    kw = quote(keyword)
    return f"{BASE}?keyword={kw};startDoc={start}"


def _fetch(url: str) -> str | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        r.raise_for_status()
        return r.text
    except requests.RequestException as e:
        print(f"[lexml] {url}: {e}")
        return None


def _total_resultados(html: str) -> int:
    m = re.search(r"(\d[\d\.\s]*)\s*resultad", html, re.I)
    if not m:
        return 0
    return int(re.sub(r"[^\d]", "", m.group(1)))


def _parse_pagina(html: str):
    """LexML usa tabelas com <a href='/urn/urn:lex:...'>Titulo</a>.
    Para cada link único, montamos um registro extraindo metadados da URN.
    """
    # URN format: urn:lex:br:<jurisdicao>:<tipo>:<data>;<numero>
    pat = re.compile(
        r'<a\s+href="(/urn/urn:lex:br[^"]+)"[^>]*>(.*?)</a>',
        re.I | re.S,
    )
    seen_urns: set[str] = set()
    for m in pat.finditer(html):
        href, titulo_html = m.group(1), m.group(2)
        urn = href.rsplit("/", 1)[-1]
        if urn in seen_urns:
            continue
        seen_urns.add(urn)

        titulo = re.sub(r"<[^>]+>", "", titulo_html).strip()
        url_full = "https://www.lexml.gov.br" + href

        # Parse URN: urn:lex:br:federal:lei:1919-01-07;3674
        parts = urn.replace("urn:lex:br:", "").split(":")
        if len(parts) < 3:
            continue
        jurisdicao = parts[0]  # federal, rio.janeiro;estadual, etc
        tipo_urn = parts[1]
        resto = ":".join(parts[2:])  # 1919-01-07;3674
        if ";" not in resto:
            continue
        data_part, numero = resto.split(";", 1)
        numero = numero.split(";")[0].split("/")[0]

        ano_m = re.match(r"(\d{4})", data_part)
        ano = int(ano_m.group(1)) if ano_m else parse_ano(titulo) or 0
        if not ano or not numero:
            continue

        # Filtra só RJ: jurisdição contém rio.janeiro OU titulo menciona RJ
        if "rio.janeiro" not in jurisdicao and "rio de janeiro" not in titulo.lower():
            continue

        tipo_map = {
            "lei": "Lei",
            "lei.complementar": "Lei Complementar",
            "decreto": "Decreto",
            "decreto.lei": "Decreto-Lei",
            "resolucao": "Resolução",
            "portaria": "Portaria",
        }
        tipo = tipo_map.get(tipo_urn.lower(), tipo_urn.title())

        yield {
            "tipo": tipo,
            "numero": numero,
            "ano": ano,
            "titulo": titulo[:300],
            "ementa": "",
            "url": url_full,
            "jurisdicao": jurisdicao,
        }


KEYWORDS = [
    "estadual rio de janeiro",
    "decreto estadual rio de janeiro",
    "lei municipal rio de janeiro",
    "alerj",
    "niterói lei",
    "petrópolis lei",
    "duque de caxias lei",
    "campos goytacazes",
    "nova iguaçu lei",
    "são gonçalo lei",
]


def _cidade_from_jurisdicao(jur: str) -> str:
    if "rio.janeiro;municipal;rio.janeiro" in jur:
        return "rio"
    if "rio.janeiro;municipal;niteroi" in jur:
        return "niteroi"
    if "rio.janeiro;estadual" in jur or jur.startswith("rio.janeiro"):
        return "estado"
    return "federal-rj"


def run(max_records: int = 10000, delay: float = 0.4) -> Path:
    rows: list[Lei] = []
    seen: set[str] = set()
    per_keyword = max(200, max_records // len(KEYWORDS))

    for kw in KEYWORDS:
        print(f"\n[lexml] keyword: {kw!r}")
        start = 1
        pbar = tqdm(total=per_keyword, desc=f"  {kw[:25]}")
        while start <= per_keyword:
            html = _fetch(_build_url(start, kw))
            if not html:
                break
            novos_pagina = 0
            for item in _parse_pagina(html):
                lei_id = make_id("lexml", item["numero"], item["ano"])
                if lei_id in seen:
                    continue
                seen.add(lei_id)
                cidade = _cidade_from_jurisdicao(item.get("jurisdicao", ""))
                rows.append(Lei(
                    id=lei_id,
                    numero=item["numero"],
                    tipo=item["tipo"],
                    titulo=item["titulo"],
                    resumo=item["ementa"],
                    ano=item["ano"],
                    cidade=cidade,
                    categoria=categorizar(item["titulo"], item["ementa"]),
                    fonte="LexML",
                    url_oficial=item["url"],
                ))
                novos_pagina += 1
                pbar.update(1)
            if novos_pagina == 0:
                break
            start += PAGE_STEP
            time.sleep(delay)
        pbar.close()
        if len(rows) >= max_records:
            break

    out = DATA_RAW / "lexml.csv"
    n = write_csv(rows, out)
    print(f"\n[lexml] ✅ {n} normas únicas salvas em {out}")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--max", type=int, default=5000)
    args = ap.parse_args()
    run(max_records=args.max)
