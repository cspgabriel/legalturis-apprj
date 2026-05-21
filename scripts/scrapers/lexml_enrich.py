"""Enriquecedor LexML: pega CSV bruto, faz fetch da página de detalhe
de cada URN e extrai:

- Ementa (resumo oficial da norma)
- Apelido (nome popular, se houver)
- URLs das fontes oficiais (Planalto, Câmara, Senado, ALERJ, Diário Oficial)

Saída: data/raw/lexml-enriched.csv (substitui lexml.csv após sucesso)

Uso:
    python -m scripts.scrapers.lexml_enrich --max-rows 1000 --delay 0.4

Rate limit: 0.4s entre requests (3000 normas ≈ 20min).
"""
from __future__ import annotations

import argparse
import csv
import re
import time
from dataclasses import asdict
from pathlib import Path

import requests
from tqdm import tqdm

from .common import DATA_RAW, Lei, parse_ano

USER_AGENT = "legalturis-apprj/1.0 (+https://github.com/cspgabriel/legalturis-apprj)"
HEADERS = {"User-Agent": USER_AGENT, "Accept-Language": "pt-BR,pt;q=0.9"}


def _fetch(url: str) -> str | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        return r.text
    except requests.RequestException:
        return None


# Padrões de extração da página detalhada
# Estrutura: <div class="row">...rótulo...valor...</div>
RE_FIELD = re.compile(
    r'<div[^>]*class="col-[a-z]+-2[^"]*"[^>]*>\s*([^<]+?)\s*</div>\s*<div[^>]*class="col-[a-z]+-(?:10|9|6)[^"]*"[^>]*>(.*?)</div>',
    re.S | re.I,
)
RE_TAG = re.compile(r"<[^>]+>")
RE_LINK = re.compile(r'href="(https?://[^"]+)"', re.I)


def _clean(html: str) -> str:
    txt = RE_TAG.sub(" ", html)
    txt = txt.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
    return re.sub(r"\s+", " ", txt).strip()


def _parse_detail(html: str) -> dict:
    """Extrai campos da página de detalhe LexML.

    A página não tem <table>: usa <div class="row"> com pares col-2 / col-10.
    Trabalhamos sobre o texto plano, cortando os campos pelos rótulos.
    """
    out: dict = {"ementa": "", "apelido": "", "fontes": [], "data": ""}

    # Texto plano completo (sem tags)
    body_m = re.search(r"<body[^>]*>(.*?)</body>", html, re.S | re.I)
    body = body_m.group(1) if body_m else html
    body = re.sub(r"<script.*?</script>", "", body, flags=re.S | re.I)
    body = re.sub(r"<style.*?</style>", "", body, flags=re.S | re.I)
    text = _clean(body)

    # Rótulos conhecidos no LexML: Localidade, Autoridade, Título, Data,
    # Apelido, Ementa, Nome Uniforme, Projeto de Origem, Publicação Oficial, etc.
    # Para extrair "ementa", pega tudo entre "Ementa" e o próximo rótulo conhecido.
    PROXIMOS = r"(?:Nome Uniforme|Mais detalhes|Projeto de Origem|Publicação Oficial|Outras Publicações|Apelido|Localidade|Autoridade|Título|Data)"
    m = re.search(rf"\bEmenta\s+(.+?)\s+{PROXIMOS}", text, re.I)
    if m:
        out["ementa"] = m.group(1).strip()[:1500]

    # Apelido: "Apelido <nome>" — pega só o nome (não o ECLI "LEI-XXXX-AAAA")
    # Aceita apenas se: curto (≤80 chars), começa com letra, NÃO é data
    m = re.search(rf"\bApelido\s+(.+?)\s+{PROXIMOS}", text, re.I)
    if m:
        ap = m.group(1).strip()
        if "," in ap:
            ap = ap.split(",")[-1].strip()
        # rejeita ECLI, datas, ementas longas
        rejeita = (
            re.match(r"^[A-Z\-]+\d", ap)  # LEI-XXXX
            or re.match(r"^(?:de\s+)?\d", ap)  # "de 31 de agosto de 2001"
            or len(ap) > 80
            or re.search(r"\b(?:institui|dispõe|fixa|cria|estabelece|altera|regulamenta)\b", ap.lower())
        )
        if not rejeita and len(ap) >= 4:
            out["apelido"] = ap

    m = re.search(rf"\bData\s+([\d/\-]+)\s+", text)
    if m:
        out["data"] = m.group(1)

    # Fontes oficiais — links pra órgãos
    fontes_padrao = re.compile(
        r"(planalto\.gov\.br|legis\.senado\.leg\.br|camara\.leg\.br|camara\.gov\.br|alerj\.rj\.gov\.br|in\.gov\.br|imprensaoficial)",
        re.I,
    )
    seen = set()
    for link in RE_LINK.findall(html):
        if "lexml.gov.br" in link or "linker" in link:
            continue
        if fontes_padrao.search(link):
            link = link.replace("&amp;", "&")
            if link not in seen:
                seen.add(link)
                out["fontes"].append(link)

    return out


def enrich(input_csv: Path, output_csv: Path, max_rows: int | None, delay: float) -> None:
    rows: list[dict] = []
    with input_csv.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if max_rows:
        rows = rows[:max_rows]

    print(f"[enrich] processando {len(rows)} normas de {input_csv.name}")

    enriched: list[dict] = []
    ok, fail = 0, 0

    # Resume: se output já existe, carrega já processados (dedup por url_oficial original)
    processed_urls: set[str] = set()
    if output_csv.exists():
        with output_csv.open(encoding="utf-8") as f:
            for r in csv.DictReader(f):
                enriched.append(r)
                # Considera processada se tem ementa OU se url_oficial mudou (não-lexml)
                if len(r.get("resumo", "")) >= 30 or "lexml.gov.br" not in r.get("url_oficial", ""):
                    processed_urls.add(r.get("texto_integral") or r.get("url_oficial", ""))
        print(f"[enrich] resume: {len(processed_urls)} já processadas, continuando...")

    # Write incremental: flusha a cada 50 registros
    fieldnames = list(rows[0].keys()) if rows else []
    output_csv.parent.mkdir(parents=True, exist_ok=True)

    def flush():
        with output_csv.open("w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=fieldnames)
            w.writeheader()
            for row in enriched:
                w.writerow(row)

    pbar = tqdm(rows, desc="Enrichendo")
    for r in pbar:
        # Skip se já processado
        if r.get("url_oficial") in processed_urls:
            continue
        url = r.get("url_oficial", "")
        if not url:
            enriched.append(r)
            fail += 1
            continue
        html = _fetch(url)
        if not html:
            enriched.append(r)
            fail += 1
            continue

        meta = _parse_detail(html)

        # Atualiza apenas se conseguiu extrair algo significativo
        if meta["ementa"]:
            r["resumo"] = meta["ementa"]
        if meta["apelido"]:
            # apelido vira título mais informativo
            r["titulo"] = f"{r['tipo']} nº {r['numero']}/{r['ano']} — {meta['apelido']}"
        if meta["fontes"]:
            # primeira fonte oficial vira url_oficial; LexML vai pra texto_integral como backup
            r["texto_integral"] = r.get("url_oficial", "")  # mantém LexML como backup
            r["url_oficial"] = meta["fontes"][0]
        if meta["data"] and not r.get("data_publicacao"):
            r["data_publicacao"] = meta["data"]

        enriched.append(r)
        if meta["ementa"] or meta["fontes"]:
            ok += 1
        else:
            fail += 1

        pbar.set_postfix(ok=ok, fail=fail)
        # Flush a cada 50
        if (ok + fail) % 50 == 0:
            flush()
        time.sleep(delay)

    pbar.close()

    # Final flush
    if not enriched:
        return
    flush()

    print(f"\n[enrich] ✅ {output_csv}")
    print(f"  enriquecidas: {ok}")
    print(f"  sem dados:    {fail}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default=str(DATA_RAW / "lexml.csv"))
    ap.add_argument("--output", default=str(DATA_RAW / "lexml-enriched.csv"))
    ap.add_argument("--max-rows", type=int, default=None)
    ap.add_argument("--delay", type=float, default=0.4)
    args = ap.parse_args()
    enrich(Path(args.input), Path(args.output), args.max_rows, args.delay)
