"""Scraper ALERJ — Assembleia Legislativa do Estado do Rio de Janeiro.

Estratégia: usa o sistema de consulta pública GEDLEG via Selenium.
URL base: http://alerjln1.alerj.rj.gov.br/contlei.nsf/

Notas:
- Site é Lotus Domino legado, sem API.
- Requer Selenium pq usa POST com viewstate e JS.
- Inspirado em github.com/MinisterioPublicoRJ/leis-brasileiras.

Como rodar:
    python -m scripts.scrapers.alerj --ano-inicio 1990 --ano-fim 2026
"""
from __future__ import annotations

import argparse
import re
import time
from pathlib import Path
from typing import Iterator
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

from .common import DATA_RAW, Lei, categorizar, make_id, write_csv

BASE = "http://alerjln1.alerj.rj.gov.br/contlei.nsf/"
# View "Por Ano" — fornece listagem por ano de promulgação
VIEW_POR_ANO = urljoin(BASE, "f25edae7e64db53b032564fe005262ef?OpenView&Start=1&Count=99999")

USER_AGENT = "legalturis-apprj/1.0 (+https://github.com/cspgabriel/legalturis-apprj)"
HEADERS = {"User-Agent": USER_AGENT, "Accept-Language": "pt-BR,pt;q=0.9"}


def _fetch(url: str) -> str | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=45)
        r.raise_for_status()
        r.encoding = "iso-8859-1"  # Lotus Domino legacy
        return r.text
    except requests.RequestException as e:
        print(f"[alerj] erro {url}: {e}")
        return None


def _parse_listagem(html: str) -> Iterator[dict]:
    """Extrai linhas da view do Domino."""
    soup = BeautifulSoup(html, "lxml")
    # cada lei é um <a href="...">Lei nº XXXX de DD/MM/AAAA</a> seguido de ementa
    for a in soup.find_all("a", href=re.compile(r"/contlei\.nsf/.+\?OpenDocument")):
        texto = a.get_text(strip=True)
        m = re.match(r"^(LEI|DECRETO|LEI COMPLEMENTAR|RESOLUÇÃO)\s+N[ºo°]?\s*([\d\.\/-]+).*?(\d{2}/\d{2}/(\d{4}))", texto, re.I)
        if not m:
            continue
        tipo, numero, data, ano = m.groups()
        href = urljoin(BASE, a["href"])
        # ementa: próximo nó de texto após o <a>
        ementa = ""
        nxt = a.find_next(string=True)
        if nxt:
            ementa = nxt.strip()
        yield {
            "tipo": tipo.title(),
            "numero": numero.strip("."),
            "data": data,
            "ano": int(ano),
            "url": href,
            "ementa": ementa[:600],
        }


def _scrape_detalhe(url: str) -> str:
    """Busca texto integral da lei (best effort)."""
    html = _fetch(url)
    if not html:
        return ""
    soup = BeautifulSoup(html, "lxml")
    # Texto integral fica em divs/tabelas — pegamos tudo do body
    body = soup.find("body")
    if not body:
        return ""
    txt = body.get_text("\n", strip=True)
    return txt[:50000]


def run(ano_inicio: int = 1990, ano_fim: int = 2026, delay: float = 0.3, fetch_full_text: bool = False) -> Path:
    rows: list[Lei] = []
    seen: set[str] = set()

    html = _fetch(VIEW_POR_ANO)
    if not html:
        print("[alerj] não consegui acessar view principal — site pode bloquear seu IP.")
        print("[alerj] alternativa: rodar via VPN ou usar GitHub Actions.")
        return DATA_RAW / "alerj.csv"

    itens = list(_parse_listagem(html))
    itens = [i for i in itens if ano_inicio <= i["ano"] <= ano_fim]
    print(f"[alerj] {len(itens)} normas no intervalo {ano_inicio}-{ano_fim}")

    pbar = tqdm(itens, desc="ALERJ")
    for item in pbar:
        lei_id = make_id("alerj", item["numero"], item["ano"])
        if lei_id in seen:
            continue
        seen.add(lei_id)
        texto_full = _scrape_detalhe(item["url"]) if fetch_full_text else ""
        rows.append(Lei(
            id=lei_id,
            numero=item["numero"],
            tipo=item["tipo"],
            titulo=f"{item['tipo']} nº {item['numero']}/{item['ano']}",
            resumo=item["ementa"],
            ano=item["ano"],
            cidade="estado",
            categoria=categorizar(item["ementa"]),
            fonte="ALERJ",
            url_oficial=item["url"],
            texto_integral=texto_full,
            data_publicacao=item["data"],
        ))
        time.sleep(delay)

    out = DATA_RAW / "alerj.csv"
    n = write_csv(rows, out)
    print(f"[alerj] {n} normas salvas em {out}")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--ano-inicio", type=int, default=1990)
    ap.add_argument("--ano-fim", type=int, default=2026)
    ap.add_argument("--full-text", action="store_true", help="Baixa texto integral (lento)")
    args = ap.parse_args()
    run(args.ano_inicio, args.ano_fim, fetch_full_text=args.full_text)
