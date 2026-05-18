"""Utilidades compartilhadas entre scrapers."""
from __future__ import annotations

import csv
import hashlib
import re
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Iterable, Optional

from slugify import slugify

ROOT = Path(__file__).resolve().parents[2]
DATA_RAW = ROOT / "data" / "raw"
DATA_PROCESSED = ROOT / "data" / "processed"


@dataclass
class Lei:
    """Schema canônico de uma norma jurídica."""

    id: str
    numero: str
    tipo: str            # Lei, Decreto, LC, Portaria, etc.
    titulo: str
    resumo: str
    ano: int
    cidade: str          # estado | rio | niteroi | ... | federal-rj
    categoria: str       # ambiental, tributaria, administrativa, ...
    fonte: str           # ALERJ | CMRJ | LexML | ...
    url_oficial: str = ""
    texto_integral: str = ""
    data_publicacao: str = ""
    situacao: str = "vigente"
    slug: str = ""

    def __post_init__(self) -> None:
        if not self.slug:
            base = f"{self.numero}-{self.titulo}"
            self.slug = slugify(base)[:120]

    @classmethod
    def fieldnames(cls) -> list[str]:
        return list(cls.__dataclass_fields__.keys())


def make_id(fonte: str, numero: str, ano: int) -> str:
    raw = f"{fonte}|{numero}|{ano}".lower()
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


def categorizar(titulo: str, resumo: str = "") -> str:
    """Heurística simples baseada em palavras-chave."""
    texto = f"{titulo} {resumo}".lower()
    mapa = {
        "ambiental": ["ambient", "clima", "florest", "polui", "sustent", "agua", "residuo"],
        "tributaria": ["tribut", "icms", "iptu", "imposto", "taxa", "fiscal", "isencao"],
        "saude": ["saude", "sus", "hospital", "medic", "vacina", "sanitar"],
        "educacao": ["educac", "escola", "ensino", "professor", "aluno", "universid"],
        "trabalhista": ["trabalh", "servidor", "emprego", "salari", "carreira"],
        "urbanismo": ["urban", "edific", "constru", "zone", "plano diretor"],
        "transporte": ["transport", "trans", "metro", "onibus", "trem", "trafego"],
        "seguranca": ["segur", "polic", "bomb", "armas", "violencia"],
        "cultura": ["cultur", "patrimon", "histor", "tomb", "arte"],
        "social": ["social", "assistenc", "idoso", "crianca", "deficienc"],
    }
    for cat, kws in mapa.items():
        if any(kw in texto for kw in kws):
            return cat
    return "administrativa"


def parse_ano(texto: str) -> Optional[int]:
    m = re.search(r"(19|20)\d{2}", texto or "")
    return int(m.group(0)) if m else None


def write_csv(rows: Iterable[Lei], path: Path) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=Lei.fieldnames())
        writer.writeheader()
        for lei in rows:
            writer.writerow(asdict(lei))
            count += 1
    return count


def read_csv(path: Path) -> list[Lei]:
    if not path.exists():
        return []
    out: list[Lei] = []
    with path.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            row["ano"] = int(row["ano"]) if row.get("ano") else 0
            out.append(Lei(**row))
    return out
