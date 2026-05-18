# Arquitetura — LegalTuris RJ

## Stack

100% estático. Sem backend. Sem build step.

- HTML + CSS vanilla
- JS vanilla (sem framework)
- Banco JSON chunked (GitHub Pages)
- Service Worker (PWA, offline-first)
- Python 3.10+ apenas pra scrapers (offline, não roda em produção)

## Camadas

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐ │
│  │ index.html   │ │ buscar.html  │ │ lei.html?id=X   │ │
│  │ (curadoria)  │ │ (busca full) │ │ (detalhe lei)   │ │
│  └──────┬───────┘ └──────┬───────┘ └────────┬────────┘ │
│         │                │                  │           │
│         └─────────── db-client.js ──────────┘           │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │ fetch()
                           ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub Pages (CDN)                                     │
│  api/leis-bulk/                                         │
│    ├ index.json         (~2 KB)                         │
│    ├ page-001.json      (~150 KB / 500 leis)            │
│    ├ search-index.json  (~50 KB)                        │
│    └ by-cidade/, by-categoria/                          │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ commit + push
┌─────────────────────────────────────────────────────────┐
│  Pipeline local (Python)                                │
│  scripts/scrapers/  → data/raw/*.csv                    │
│  scripts/pipeline/  → api/leis-bulk/*.json              │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ scrape
                           │
                  ┌────────┴────────┐
                  │  LexML / ALERJ  │
                  │  CMRJ / outros  │
                  └─────────────────┘
```

## Páginas

| Página | Função |
|---|---|
| `index.html` | Landing curada (40 leis destaque) + hero search |
| `buscar.html` | Busca full no acervo (286+ leis), filtros, paginação |
| `lei.html?id=X` | Detalhe dinâmico de qualquer lei do acervo |
| `leis/<slug>/` | Páginas estáticas geradas pelas 40 leis curadas (SEO) |
| `categorias/` | Hubs por categoria (SEO) |
| `cidades/` | Hubs por cidade (SEO) |
| `setores/` | Hubs por setor profissional (SEO) |
| `noticias.html` | Notícias jurídicas do RJ |
| `premium.html` | Página de assinatura |
| `account.html` | Conta do usuário |

## Roteamento

GitHub Pages serve flat. Dois padrões coexistem:

1. **SEO-friendly estático**: `/leis/9.064-microcredito/` (40 leis curadas).
   Gerado via `generate-pages.js` antes do commit.

2. **Dinâmico via JS**: `/lei.html?id=abc123` (todas as 286+ leis).
   Renderiza qualquer lei do `api/leis-bulk` sem precisar gerar pasta.

A página `buscar.html` linka sempre via `lei.html?id=...` (forma dinâmica).
Hubs de SEO continuam usando URLs estáticas.

## Cache / Performance

- Páginas: cacheadas pelo SW (`sw.js`) — offline-first
- `api/leis-bulk/*.json`: cache-busted via `?v=<timestamp>` se necessário
- Search index: lazy load (só carrega quando user digita)
- Pages: lazy load (carrega chunk on demand quando user pagina)

## SEO

- Sitemap em `sitemap.xml` (gerado pelo `generate-pages.js`)
- JSON-LD `Legislation` injetado dinamicamente em `lei.html`
- Open Graph + Twitter Cards em todas as páginas
- `<title>` e `<meta description>` populados em runtime nas dinâmicas

## Limitações

- Buscar acervo completo carrega todas as páginas (`db.loadAll()`).
  OK até ~10k leis. Acima disso, migrar pra SQLite + sql.js.
- Sem busca full-text em texto integral (só título + resumo).
- Sem auth, sem comentários, sem favoritos persistidos no server.

## Como rodar local

```bash
# servir o site
python -m http.server 8000
# acessa http://localhost:8000

# popular o banco
pip install -r scripts/requirements.txt
python -m scripts.run_all
```
