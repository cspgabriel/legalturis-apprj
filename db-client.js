// ============================================
// LegalTuris — Cliente do banco JSON chunked
// ============================================
// Carrega api/leis-bulk/index.json + páginas sob demanda.
// API:
//   const db = new LeiDB();
//   await db.init();
//   const leis = await db.search({ termo, cidade, categoria, ano, page });
//   const lei  = await db.get(id);
// ============================================

(function (global) {
  "use strict";

  const BASE = "api/leis-bulk";

  function normalizar(s) {
    return (s || "")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ");
  }

  class LeiDB {
    constructor() {
      this.index = null;
      this.searchIndex = null;
      this.pageCache = new Map();
      this.byIdCache = new Map();
    }

    async init() {
      if (this.index) return this.index;
      const r = await fetch(`${BASE}/index.json`);
      if (!r.ok) throw new Error("index.json indisponível");
      this.index = await r.json();
      return this.index;
    }

    async _loadSearchIndex() {
      if (this.searchIndex) return this.searchIndex;
      const r = await fetch(`${BASE}/search-index.json`);
      if (r.ok) this.searchIndex = await r.json();
      return this.searchIndex || {};
    }

    async _loadPage(n) {
      if (this.pageCache.has(n)) return this.pageCache.get(n);
      const num = String(n).padStart(3, "0");
      const r = await fetch(`${BASE}/page-${num}.json`);
      if (!r.ok) return null;
      const data = await r.json();
      this.pageCache.set(n, data);
      for (const lei of data.leis) this.byIdCache.set(lei.id, lei);
      return data;
    }

    async loadAll() {
      await this.init();
      const all = [];
      for (let i = 1; i <= this.index.pages; i++) {
        const p = await this._loadPage(i);
        if (p) all.push(...p.leis);
      }
      return all;
    }

    async get(id) {
      if (this.byIdCache.has(id)) return this.byIdCache.get(id);
      await this.loadAll();
      return this.byIdCache.get(id) || null;
    }

    /**
     * @param {Object} opts
     * @param {string} [opts.termo]
     * @param {string} [opts.cidade]
     * @param {string} [opts.categoria]
     * @param {number|string} [opts.ano]
     * @param {string} [opts.tipo]
     * @param {number} [opts.page=1]
     * @param {number} [opts.pageSize=20]
     */
    async search(opts = {}) {
      await this.init();
      const all = await this.loadAll();
      let result = all;

      if (opts.termo) {
        const q = normalizar(opts.termo);
        const tokens = q.split(/\s+/).filter((t) => t.length >= 3);
        if (tokens.length) {
          const inv = await this._loadSearchIndex();
          let ids = null;
          for (const t of tokens) {
            const matching = new Set(inv[t] || []);
            // fallback: pesquisa fuzzy nos próprios objetos se token não indexado
            if (!matching.size) {
              for (const lei of all) {
                if (normalizar(`${lei.titulo} ${lei.resumo} ${lei.numero}`).includes(t)) {
                  matching.add(lei.id);
                }
              }
            }
            ids = ids ? new Set([...ids].filter((x) => matching.has(x))) : matching;
          }
          result = result.filter((l) => ids && ids.has(l.id));
        }
      }
      if (opts.cidade) result = result.filter((l) => l.cidade === opts.cidade);
      if (opts.categoria) result = result.filter((l) => l.categoria === opts.categoria);
      if (opts.tipo) result = result.filter((l) => (l.tipo || "").toLowerCase().includes(opts.tipo.toLowerCase()));
      if (opts.ano) result = result.filter((l) => Number(l.ano) === Number(opts.ano));

      const page = Math.max(1, opts.page || 1);
      const size = opts.pageSize || 20;
      const total = result.length;
      const pages = Math.ceil(total / size);
      const slice = result.slice((page - 1) * size, page * size);
      return { total, page, pages, pageSize: size, leis: slice };
    }

    facets() {
      if (!this.index) return null;
      return {
        cidades: this.index.cidades || {},
        categorias: this.index.categorias || {},
        anos: this.index.anos || {},
        fontes: this.index.fontes || {},
      };
    }
  }

  global.LeiDB = LeiDB;
  global.LeiDB_BASE = BASE;
})(typeof window !== "undefined" ? window : globalThis);
