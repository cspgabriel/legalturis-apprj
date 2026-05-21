// ============================================
// scripts/sync-from-generation.cjs
// ============================================
// Após merge-into-data + generate-pages, sincroniza:
// - data.js (usado pelo index.html runtime)
// - api/leis.json (API pública)
// - sitemap.xml (SEO)
//
// data-for-generation.js é a fonte da verdade.
// ============================================

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function carregarFonte() {
  const src = fs.readFileSync(path.join(ROOT, "data-for-generation.js"), "utf-8");
  const start = src.indexOf("const LEIS_RJ = [");
  const arrStart = src.indexOf("[", start);
  let depth = 0, end = arrStart;
  for (let i = arrStart; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  return new Function("return " + src.slice(arrStart, end + 1) + ";")();
}

function slugify(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function syncDataJs(leis) {
  // data.js é usado pelo index.html — mesmo shape do data-for-generation mas
  // sem `conteudo` (modal carrega via fetch ou usa resumo). Vamos manter o
  // mesmo shape pra consistência.
  const srcOriginal = fs.readFileSync(path.join(ROOT, "data-for-generation.js"), "utf-8");
  // troca apenas o header do comentário
  const out = srcOriginal.replace(
    /^\/\/ ===.*?===\s*\n\/\/ LegiRJ.*?\n/s,
    `// ============================================\n// LegiRJ - Base de Dados (gerada automaticamente)\n// Sincronizada a partir de data-for-generation.js\n// ${new Date().toISOString()}\n// ============================================\n`
  );
  fs.writeFileSync(path.join(ROOT, "data.js"), out, "utf-8");
  console.log(`  data.js: ${leis.length} leis`);
}

function syncApiJson(leis) {
  const out = {
    version: "2.0",
    total: leis.length,
    generated_at: new Date().toISOString(),
    leis: leis.map(l => ({
      id: l.id,
      numero: l.numero,
      tipo: l.tipo,
      titulo: l.titulo,
      resumo: l.resumo,
      categoria: l.categoria,
      cidade: l.cidade,
      ano: l.ano,
      fonte: l.fonte,
      fonteUrl: l.fonteUrl,
      url: `https://cspgabriel.github.io/legalturis-apprj/leis/${l.numero}-${slugify(l.titulo)}/`,
    })),
  };
  fs.writeFileSync(path.join(ROOT, "api", "leis.json"), JSON.stringify(out, null, 2), "utf-8");
  console.log(`  api/leis.json: ${leis.length} leis`);
}

function syncSitemap(leis) {
  const BASE = "https://cspgabriel.github.io/legalturis-apprj";
  const hoje = new Date().toISOString().split("T")[0];
  const urls = [
    { loc: `${BASE}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${BASE}/noticias.html`, priority: "0.8", changefreq: "weekly" },
    { loc: `${BASE}/premium.html`, priority: "0.6", changefreq: "monthly" },
  ];
  for (const lei of leis) {
    urls.push({
      loc: `${BASE}/leis/${lei.numero}-${slugify(lei.titulo)}/`,
      priority: "0.7",
      changefreq: "monthly",
    });
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${hoje}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf-8");
  console.log(`  sitemap.xml: ${urls.length} URLs`);
}

function main() {
  console.log("Sincronizando arquivos a partir de data-for-generation.js...\n");
  const leis = carregarFonte();
  console.log(`Total: ${leis.length} leis\n`);
  syncDataJs(leis);
  syncApiJson(leis);
  syncSitemap(leis);
  console.log("\n✅ Sync completo.");
}

main();
