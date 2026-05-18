"""Scraper Câmara Municipal do Rio de Janeiro.

Sistema LeisMunicipais (mantido por terceiros, mas espelha o oficial):
- https://www.leismunicipais.com.br/legislacao-municipal/3/leis-de-rio-de-janeiro

Sistema oficial:
- http://aplicnt.camara.rj.gov.br/APL/Legislativos/contlei.nsf/PorAno

Estratégia: paginação simples por ano via URL.
"""
from __future__ import annotations

import argparse
import re
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

from .common import DATA_RAW, Lei, categorizar, make_id, write_csv

BASE = "http://aplicnt.camara.rj.gov.br/APL/Legislativos/contlei.nsf/"
URL_POR_ANO = urljoin(BASE, "PorAno?OpenView&Start=1&Count=99999")

USER_AGENT = "legalturis-apprj/1.0 (+https://github.com/cspgabriel/legalturis-apprj)"
HEADERS = {"User-Agent": USER_AGENT, "Accept-Language": "pt-BR,pt;q=0.9"}


def _fetch(url: str) -> str | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=45)
        r.raise_for_status()
        r.encoding = "iso-8859-1"
        return r.text
    except requests.RequestException as e:
        print(f"[camara-rio] erro {url}: {e}")
        return None


def _parse(html: str):
    soup = BeautifulSoup(html, "lxml")
    for a in soup.find_all("a", href=re.compile(r"/APL/.+\?OpenDocument")):
        texto = a.get_text(strip=True)
        m = re.match(r"^(LEI|DECRETO|LEI COMPLEMENTAR|RESOLUÇÃO)\s+(?:N[ºo°]?\s*)?([\d\.\/-]+).*?(\d{4})", texto, re.I)
        if not m:
            continue
        tipo, numero, ano = m.groups()
        href = urljoin(BASE, a["href"])
        nxt = a.find_next(string=True)
        ementa = nxt.strip() if nxt else ""
        yield {
            "tipo": tipo.title(),
            "numero": numero.strip("."),
            "ano": int(ano),
            "url": href,
            "ementa": ementa[:600],
        }


def run(ano_inicio: int = 1990, ano_fim: int = 2026, delay: float = 0.3) -> Path:
    rows: list[Lei] = []
    seen: set[str] = set()

    html = _fetch(URL_POR_ANO)
    if not html:
        print("[camara-rio] view inacessível — IP pode estar bloqueado.")
        return DATA_RAW / "camara_rio.csv"

    itens = [i for i in _parse(html) if ano_inicio <= i["ano"] <= ano_fim]
    print(f"[camara-rio] {len(itens)} normas no intervalo")

    for item in tqdm(itens, desc="CMRJ"):
        lei_id = make_id("cmrj", item["numero"], item["ano"])
        if lei_id in seen:
            continue
        seen.add(lei_id)
        rows.append(Lei(
            id=lei_id,
            numero=item["numero"],
            tipo=item["tipo"],
            titulo=f"{item['tipo']} nº {item['numero']}/{item['ano']} (Município RJ)",
            resumo=item["ementa"],
            ano=item["ano"],
            cidade="rio",
            categoria=categorizar(item["ementa"]),
            fonte="CMRJ",
            url_oficial=item["url"],
        ))
        time.sleep(delay)

    out = DATA_RAW / "camara_rio.csv"
    n = write_csv(rows, out)
    print(f"[camara-rio] {n} normas salvas em {out}")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--ano-inicio", type=int, default=1990)
    ap.add_argument("--ano-fim", type=int, default=2026)
    args = ap.parse_args()
    run(args.ano_inicio, args.ano_fim)
