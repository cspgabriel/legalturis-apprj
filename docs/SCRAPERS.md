# Scrapers — LegalTuris RJ

## Arquitetura

```
scripts/
├── requirements.txt           # deps Python 3.10+
├── run_all.py                 # orquestrador
├── scrapers/
│   ├── common.py              # Lei dataclass, csv I/O, categorização
│   ├── lexml.py               # LexML (federal + RJ) via HTML
│   ├── alerj.py               # ALERJ Lotus Domino (precisa rede livre)
│   └── camara_rio.py          # Câmara Municipal RJ (idem)
└── pipeline/
    ├── seed_from_existing.py  # converte api/leis.json antigo → CSV
    └── build_db.py            # CSVs → JSON chunked
```

## Fluxo

```
[fonte web]  →  scraper  →  data/raw/<fonte>.csv  →  pipeline  →  api/leis-bulk/*.json  →  cliente JS
```

## scrapers/common.py

`Lei` é a dataclass canônica. Ver schema em [`DATABASE.md`](DATABASE.md).

`make_id(fonte, numero, ano)` → SHA1 estável dos 3 campos (16 chars).
Permite re-scraping sem duplicar.

`categorizar(titulo, resumo)` → heurística de palavras-chave.
Mapeia para: ambiental, tributaria, saude, educacao, trabalhista,
urbanismo, transporte, seguranca, cultura, social, administrativa.

## scrapers/lexml.py

**Fonte**: <https://www.lexml.gov.br>

**Estratégia**: HTML scrape da busca (`/busca/search?keyword=...`).
SRU oficial documentado retorna 404, mesmo com queries do manual.

**Filtragem RJ**: parser inspeciona a URN (`urn:lex:br:rio.janeiro;estadual:...`)
e descarta o que não é RJ.

**Keywords usadas** (em rotação, dedup global por id):
- "estadual rio de janeiro"
- "decreto estadual rio de janeiro"
- "lei municipal rio de janeiro"
- "alerj"
- "niterói lei", "petrópolis lei", "duque de caxias lei", ...

Cada keyword puxa até `max_records // n_keywords` resultados.

**Rate limit**: 0.4s entre requests. Sem captcha observado.

**Volume real testado**: 246 normas únicas em 3000 max_records.
Limite prático ≈ 5000–10000 (após isso só duplicatas).

## scrapers/alerj.py

**Fonte**: <http://alerjln1.alerj.rj.gov.br/contlei.nsf/>

**Sistema**: Lotus Domino legado. View "Por Ano" retorna lista paginada.

**Limitação crítica**: o site bloqueia IPs cloud (Vercel, GitHub Actions
US, Cloudflare) e às vezes residenciais. Sintomas: 503, TLS handshake
fail, RemoteDisconnected.

**Workarounds**:
1. Rodar via VPN residencial brasileira
2. Selenium num runner self-hosted (não testado)
3. Usar o repo [`MinisterioPublicoRJ/leis-brasileiras`](https://github.com/MinisterioPublicoRJ/leis-brasileiras) que tem snapshots periódicos

**Schema retornado**: tipo, número, ano, ementa, URL detalhe.
Texto integral opcional (`--full-text`, lento).

## scrapers/camara_rio.py

**Fonte**: <http://aplicnt.camara.rj.gov.br/APL/Legislativos/contlei.nsf/>

Mesma arquitetura do ALERJ (Lotus Domino). Mesmas limitações de rede.

## pipeline/build_db.py

Lê todos os `data/raw/*.csv`, deduplica por `id` (última versão vence),
ordena por `(ano DESC, numero ASC)`, então:

1. Quebra em páginas de N (default 500) → `page-001.json`, `page-002.json`, ...
2. Constrói índice invertido (token → ids) → `search-index.json`
3. Constrói índices por cidade e por categoria → `by-cidade/*.json`, `by-categoria/*.json`
4. Escreve metadados em `index.json`

Idempotente. Roda em <2s pra 10k leis.

## Como adicionar uma nova fonte

1. Crie `scripts/scrapers/<nome>.py` seguindo o padrão de `lexml.py`:
   - Função `run(...)` retorna `Path` do CSV escrito
   - Use `Lei`, `make_id`, `categorizar`, `write_csv` de `common.py`
2. Adicione em `scripts/run_all.py` no dict `SCRAPERS`
3. Documente aqui a fonte, estratégia, limitações
4. Rode: `python -m scripts.scrapers.<nome>`
5. Pipeline: `python -m scripts.pipeline.build_db`
6. Commit `data/raw/<nome>.csv` + `api/leis-bulk/`

## Encoding

Console Windows é cp1252 por default. Sempre rode com:

```bash
PYTHONIOENCODING=utf-8 PYTHONUTF8=1 python -m scripts.<...>
```

Em PowerShell:
```powershell
$env:PYTHONIOENCODING="utf-8"; $env:PYTHONUTF8="1"
python -m scripts.run_all
```

## Ética / TOS

- Todos os sites raspados publicam leis sob domínio público (Art. 8º LDA).
- User-Agent identifica o projeto: `legalturis-apprj/1.0 (+url)`
- Rate-limit de 300–600ms entre requests
- Sem login/scraping de conteúdo restrito
- `robots.txt` respeitado quando publicado (LexML permite, ALERJ não tem)
