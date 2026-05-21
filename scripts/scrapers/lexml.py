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

        # Parse URN. Formatos:
        #   urn:lex:br:federal:lei:1919-01-07;3674
        #   urn:lex:br:congresso.nacional:medida.provisoria;mpv:2024-05-07;1215
        #   urn:lex:br:rio.janeiro;estadual:lei:2024-01-15;9064
        parts = urn.replace("urn:lex:br:", "").split(":")
        if len(parts) < 3:
            continue
        jurisdicao = parts[0]
        tipo_urn = parts[1].split(";")[0]  # ignora subtipo após ;
        resto = ":".join(parts[2:])
        if ";" not in resto:
            continue
        # Pega último segmento como número, penúltimo como data
        segs = resto.split(";")
        numero = segs[-1].split("/")[0].strip()
        # Procura data
        data_part = ""
        for seg in segs:
            if re.match(r"^\d{4}-\d{2}-\d{2}$", seg) or re.match(r"^\d{4}$", seg):
                data_part = seg
                break

        ano_m = re.match(r"(\d{4})", data_part)
        ano = int(ano_m.group(1)) if ano_m else parse_ano(titulo) or 0
        if not ano or not numero:
            continue

        tipo_map = {
            "lei": "Lei",
            "lei.complementar": "Lei Complementar",
            "decreto": "Decreto",
            "decreto.lei": "Decreto-Lei",
            "resolucao": "Resolução",
            "portaria": "Portaria",
            "emenda.constitucional": "Emenda Constitucional",
            "medida.provisoria": "Medida Provisória",
        }
        tipo_low = tipo_urn.lower()
        # FILTRO CRÍTICO: só tipos legislativos (rejeita acordao, livro, artigo.revista, etc)
        if tipo_low not in tipo_map:
            continue
        tipo = tipo_map[tipo_low]

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
    # Variações que retornam mais resultados de LEGISLAÇÃO (não acórdãos)
    "lei estado rio de janeiro",
    "decreto estado rio de janeiro",
    "lei complementar rio de janeiro",
    "lei municipal niterói",
    "lei municipal petrópolis",
    "lei municipal duque caxias",
    "lei municipal são gonçalo",
    "lei municipal nova iguaçu",
    "lei municipal campos goytacazes",
    "lei municipal volta redonda",
    "lei municipal macaé",
    "lei municipal cabo frio",
    "lei municipal maricá",
    "decreto municipal rio de janeiro",
    "lei orgânica rio de janeiro",
    "decreto-lei estado rio de janeiro",
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
