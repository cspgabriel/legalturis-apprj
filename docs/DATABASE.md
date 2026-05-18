# Banco de Dados — LegalTuris RJ

## Visão geral

Banco JSON chunked, 100% estático, servido pelo GitHub Pages.
Sem backend, sem auth, sem custos.

Cliente faz `fetch()` direto dos arquivos sob `/api/leis-bulk/`.

## Estrutura

```
api/leis-bulk/
├── index.json                # metadados globais + facetas
├── page-001.json             # até 500 leis por arquivo
├── page-002.json
├── ...
├── search-index.json         # índice invertido (token → [ids])
├── by-cidade/
│   ├── estado.json           # { cidade, total, ids: [...] }
│   ├── rio.json
│   └── ...
└── by-categoria/
    ├── ambiental.json
    ├── tributaria.json
    └── ...
```

## Schema de uma lei

```ts
type Lei = {
  id: string;             // sha1(fonte|numero|ano)[:16] — estável entre rescrapes
  numero: string;         // "9.064", "8.890/2024"
  tipo: string;           // "Lei" | "Decreto" | "Lei Complementar" | ...
  titulo: string;         // ementa curta ou nome legal
  resumo: string;         // descrição completa (até 600 chars)
  ano: number;            // ano de promulgação
  cidade: string;         // "estado" | "rio" | "niteroi" | ... | "federal-rj"
  categoria: string;      // "ambiental" | "tributaria" | "saude" | ...
  fonte: string;          // "LexML" | "ALERJ" | "CMRJ" | "curadoria-legirj"
  url_oficial: string;    // link pra fonte primária (LexML/ALERJ/etc)
  texto_integral: string; // opcional, até 50KB
  data_publicacao: string;// "YYYY-MM-DD" ou texto livre
  situacao: string;       // "vigente" (default) | "revogada" | "suspensa"
  slug: string;           // pra URLs amigáveis
};
```

## index.json

```jsonc
{
  "version": "2.0",
  "generated_at": "2026-05-18T22:32:35Z",
  "total": 286,
  "chunk_size": 500,
  "pages": 1,
  "page_template": "page-{N:03d}.json",
  "fontes":    { "LexML": 246, "curadoria-legirj": 40 },
  "anos":      { "2025": 23, "2024": 38, ... },
  "cidades":   { "estado": 13, "rio": 5, ... },
  "categorias":{ "administrativa": 244, "ambiental": 8, ... }
}
```

## search-index.json

Índice invertido leve. Tokens ≥3 chars, sem acentos, lowercase.
Cada token aponta pra até 500 IDs (cap pra não inflar).

```json
{
  "icms":      ["a1b2...", "c3d4..."],
  "ambiental": ["e5f6...", ...],
  ...
}
```

Cliente combina via interseção (AND): query `"ICMS São Gonçalo"` →
`tokens["icms"] ∩ tokens["sao"] ∩ tokens["goncalo"]`.

Fallback: se token não tá indexado, faz scan linear in-memory após `loadAll()`.

## Como popular

### 1. Rodar scrapers

```bash
pip install -r scripts/requirements.txt

# tudo
python -m scripts.run_all

# só LexML (funciona em qualquer rede)
python -m scripts.scrapers.lexml --max 5000

# ALERJ (precisa rede sem bloqueio)
python -m scripts.scrapers.alerj --ano-inicio 1990 --ano-fim 2026

# Câmara Rio
python -m scripts.scrapers.camara_rio
```

Saída: `data/raw/<fonte>.csv`

### 2. Consolidar + gerar banco

```bash
python -m scripts.pipeline.build_db --chunk 500
```

Lê todos os CSVs em `data/raw/`, deduplica por id, escreve `api/leis-bulk/`.

### 3. Commit

```bash
git add api/leis-bulk data/raw
git commit -m "data: refresh banco de leis"
git push
```

## Cliente JS — `db-client.js`

```js
const db = new LeiDB();
await db.init();

// Busca paginada
const res = await db.search({
  termo: "ICMS",
  cidade: "estado",
  categoria: "tributaria",
  ano: 2024,
  page: 1,
  pageSize: 20,
});
// → { total, page, pages, pageSize, leis: [...] }

// Por id
const lei = await db.get("a1b2c3d4...");

// Facetas pra dropdowns
const f = db.facets(); // { cidades, categorias, anos, fontes }
```

## Limitações conhecidas

- **LexML** não retorna ementa nos resultados de busca → `resumo` fica vazio
  para boa parte das leis. Precisaria de uma segunda requisição por URN
  (custoso). Solução: rodar o scraper de detalhes em batch separado.
- **ALERJ** bloqueia IPs residenciais/cloud. Roda em GitHub Actions com
  Selenium ou via VPN doméstica.
- **Câmara Rio** também usa Lotus Domino legado, mesma limitação.
- Sem suporte a busca booleana avançada (OR, NOT) — só AND implícito.

## Roadmap

- [ ] Workflow GitHub Actions com Selenium pra ALERJ + Câmara Rio
- [ ] Enriquecimento das ementas LexML (fetch detalhe por URN)
- [ ] Detecção de revogações (cross-reference entre leis)
- [ ] Suporte a outros municípios (Niterói, Petrópolis, ...)
- [ ] Migrar pra SQLite + sql.js se acervo passar de ~50k normas
