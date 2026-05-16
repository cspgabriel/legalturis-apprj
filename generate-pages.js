// ============================================
// LegiRJ - Gerador de Páginas Estáticas
// ============================================
// Execute: node generate-pages.js

const fs = require('fs');
const path = require('path');

// Importar dados (simular o import)
const leiData = require('./data-for-generation.js');

const LEIS = leiData.LEIS_RJ;
const CIDADES = leiData.CIDADES_RJ;
const CATEGORIAS = leiData.CATEGORIAS;

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getCidadeNome(id) {
  return CIDADES.find(c => c.id === id)?.nome || id;
}

function getCategoriaNome(id) {
  return CATEGORIAS.find(c => c.id === id)?.nome || id;
}

function generateSchema(lei) {
  const cidade = CIDADES.find(c => c.id === lei.cidade);
  return {
    "@context": "https://schema.org",
    "@type": "LegalDocument",
    "name": lei.titulo,
    "description": lei.resumo,
    "text": lei.conteudo,
    "documentType": lei.tipo,
    "datePublished": lei.data,
    "author": {
      "@type": "Organization",
      "name": lei.autor,
      "url": lei.fonteUrl
    },
    "jurisdiction": {
      "@type": "Place",
      "name": cidade?.nome || "Estado do Rio de Janeiro"
    },
    "url": `https://cspgabriel.github.io/legalturis-apprj/leis/${lei.numero}-${slugify(lei.titulo)}/`,
    "mainEntity": {
      "@type": "Thing",
      "name": lei.numero,
      "identifier": lei.numero
    }
  };
}

function generateLeiPage(lei) {
  const cidade = CIDADES.find(c => c.id === lei.cidade);
  const categoria = CATEGORIAS.find(c => c.id === lei.categoria);
  const slug = `${lei.numero}-${slugify(lei.titulo)}`;
  const url = `https://cspgabriel.github.io/legalturis-apprj/leis/${slug}/`;

  const schema = generateSchema(lei);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>${lei.tipo} nº ${lei.numero} - ${lei.titulo} | LegiRJ</title>
    <meta name="description" content="${lei.resumo}">
    <meta name="keywords" content="${lei.tipo}, lei, decreto, ${cidade?.nome || 'Rio de Janeiro'}, ${categoria?.nome || ''}, ${lei.numero}">
    <meta name="author" content="LegiRJ">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="language" content="Portuguese">
    <meta name="revisit-after" content="7 days">
    <meta name="canonical" href="${url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${lei.tipo} nº ${lei.numero} - ${lei.titulo}">
    <meta property="og:description" content="${lei.resumo}">
    <meta property="og:image" content="https://cspgabriel.github.io/legalturis-apprj/icons/icon.svg">
    <meta property="og:site_name" content="LegiRJ">
    <meta property="og:locale" content="pt_BR">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${lei.tipo} nº ${lei.numero} - ${lei.titulo}">
    <meta name="twitter:description" content="${lei.resumo}">
    <meta name="twitter:image" content="https://cspgabriel.github.io/legalturis-apprj/icons/icon.svg">

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
    </script>

    <!-- Additional Meta -->
    <meta name="theme-color" content="#1e3a8a">
    <link rel="icon" type="image/svg+xml" href="../../icons/icon.svg">
    <link rel="stylesheet" href="../../styles.css">

    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx" crossorigin="anonymous"></script>
</head>
<body>
    <nav class="navbar">
        <div class="container nav-container">
            <a href="../../" class="logo-link">
                <div class="logo-icon">⚖️</div>
                <div class="logo-text">
                    <h1>LegiRJ</h1>
                    <span>Portal de Leis</span>
                </div>
            </a>
            <div class="nav-actions">
                <button class="btn-icon" onclick="window.history.back()" title="Voltar">←</button>
                <a href="../../" class="btn-primary">🏠 Início</a>
            </div>
        </div>
    </nav>

    <main class="lei-page container">
        <div class="breadcrumb">
            <a href="../../">LegiRJ</a> /
            <a href="../../#cidade=${lei.cidade}">${cidade?.nome || 'Estado'}</a> /
            <span>${lei.titulo}</span>
        </div>

        <article class="lei-article">
            <header class="lei-header">
                <div class="lei-badges">
                    <span class="badge badge-tipo">${lei.tipo}</span>
                    <span class="badge badge-categoria">${categoria?.icone} ${categoria?.nome}</span>
                    <span class="badge badge-ano">📅 ${lei.ano}</span>
                </div>

                <h1>${lei.titulo}</h1>

                <div class="lei-info">
                    <div class="info-item">
                        <strong>Lei nº</strong>
                        <span>${lei.numero}</span>
                    </div>
                    <div class="info-item">
                        <strong>Tipo</strong>
                        <span>${lei.tipo}</span>
                    </div>
                    <div class="info-item">
                        <strong>Data</strong>
                        <span>${lei.data}</span>
                    </div>
                    <div class="info-item">
                        <strong>Município</strong>
                        <span>${cidade?.nome || 'Estado do RJ'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Categoria</strong>
                        <span>${categoria?.nome}</span>
                    </div>
                </div>
            </header>

            <div class="ad-banner">
                <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" data-ad-slot="xxxxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>
            </div>

            <section class="lei-resumo">
                <h2>📋 Resumo</h2>
                <p>${lei.resumo}</p>
            </section>

            <section class="lei-content">
                <h2>📜 Conteúdo Completo</h2>
                <div class="content-text">
                    ${lei.conteudo}
                </div>
            </section>

            <section class="lei-fonte">
                <h2>✓ Fonte Oficial</h2>
                <div class="fonte-box">
                    <p><strong>${lei.fonte}</strong></p>
                    <p>Autor: ${lei.autor}</p>
                    <p><a href="${lei.fonteUrl}" target="_blank" rel="noopener noreferrer">🔗 Consultar Texto Oficial</a></p>
                </div>
            </section>

            <div class="ad-banner">
                <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" data-ad-slot="xxxxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>
            </div>

            <section class="lei-actions">
                <button class="btn-primary" onclick="app.shareLei(${JSON.stringify(lei).replace(/"/g, '&quot;')})">📤 Compartilhar</button>
                <button class="btn-secondary" onclick="app.toggleFavorite(${lei.id})">⭐ Favoritar</button>
                <button class="btn-secondary" onclick="window.print()">🖨️ Imprimir</button>
            </section>
        </article>

        <aside class="related-leis">
            <h3>📚 Leis Relacionadas</h3>
            <div id="relatedList"></div>
        </aside>
    </main>

    <footer class="footer">
        <div class="container">
            <p>© 2026 LegiRJ. Portal de Leis do Rio de Janeiro.</p>
            <p><a href="../../privacy">Privacidade</a> | <a href="../../terms">Termos</a></p>
        </div>
    </footer>

    <style>
        .lei-page { padding: 3rem 0; }
        .breadcrumb { margin-bottom: 2rem; color: var(--text-muted); }
        .breadcrumb a { color: var(--primary); text-decoration: none; }
        .lei-article { background: var(--bg); border-radius: var(--radius-md); padding: 2.5rem; }
        .lei-header { margin-bottom: 2.5rem; }
        .lei-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .lei-header h1 { font-size: 2rem; margin-bottom: 1.5rem; line-height: 1.2; }
        .lei-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius); }
        .info-item strong { display: block; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem; }
        .info-item span { font-weight: 600; }
        .lei-resumo, .lei-content, .lei-fonte { margin: 2.5rem 0; }
        .lei-resumo h2, .lei-content h2, .lei-fonte h2 { font-size: 1.35rem; margin-bottom: 1rem; color: var(--primary); }
        .content-text { line-height: 1.8; color: var(--text-secondary); }
        .content-text h3 { margin: 1.5rem 0 0.75rem; }
        .content-text ul { margin: 1rem 0 1rem 2rem; }
        .fonte-box { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1)); padding: 1.25rem; border-radius: var(--radius); border-left: 4px solid var(--success); }
        .fonte-box a { color: var(--primary); font-weight: 600; }
        .lei-actions { display: flex; gap: 0.75rem; margin: 2rem 0; flex-wrap: wrap; }
        .lei-actions button { padding: 0.75rem 1.5rem; }
        .related-leis { margin-top: 3rem; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-md); }
        .related-leis h3 { margin-bottom: 1rem; }
        @media (max-width: 768px) {
            .lei-article { padding: 1.5rem; }
            .lei-header h1 { font-size: 1.5rem; }
            .lei-info { grid-template-columns: 1fr; }
        }
    </style>

    <script>
        // Mock app object for single page
        window.app = {
            shareLei: (lei) => {
                const text = \`\${lei.tipo} nº \${lei.numero} - \${lei.titulo}\\n\\n\${lei.resumo}\\n\\nVeja em:\`;
                const url = window.location.href;
                if (navigator.share) {
                    navigator.share({ title: lei.titulo, text, url });
                } else {
                    navigator.clipboard.writeText(\`\${text} \${url}\`);
                    alert('✅ Link copiado!');
                }
            },
            toggleFavorite: (id) => {
                alert('⭐ Use o app completo para gerenciar favoritos!');
            }
        };

        // Load related laws
        document.addEventListener('DOMContentLoaded', () => {
            const relatedList = document.getElementById('relatedList');
            relatedList.innerHTML = '<p>Navegue pelo <a href="../../">app completo</a> para ver leis relacionadas</p>';
        });
    </script>
</body>
</html>`;
}

function main() {
  console.log('🔄 Gerando páginas para', LEIS.length, 'leis...');

  // Criar diretório de leis
  const leisDir = path.join(__dirname, 'leis');
  if (!fs.existsSync(leisDir)) fs.mkdirSync(leisDir, { recursive: true });

  // Gerar página para cada lei
  LEIS.forEach(lei => {
    const slug = `${lei.numero}-${slugify(lei.titulo)}`;
    const leiDir = path.join(leisDir, slug);

    if (!fs.existsSync(leiDir)) fs.mkdirSync(leiDir, { recursive: true });

    const html = generateLeiPage(lei);
    fs.writeFileSync(path.join(leiDir, 'index.html'), html);

    console.log(`✅ ${lei.numero} - ${lei.titulo}`);
  });

  // Gerar sitemap dinâmico
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

  // Gerar JSON API
  const api = generateAPI();
  fs.writeFileSync(path.join(__dirname, 'api', 'leis.json'), api);

  console.log('✅ Pronto! Páginas geradas com sucesso');
}

function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  xml += '<url><loc>https://cspgabriel.github.io/legalturis-apprj/</loc><lastmod>2026-05-16</lastmod><priority>1.0</priority></url>\n';

  LEIS.forEach(lei => {
    const slug = `${lei.numero}-${slugify(lei.titulo)}`;
    const url = `https://cspgabriel.github.io/legalturis-apprj/leis/${slug}/`;
    xml += `<url><loc>${url}</loc><lastmod>${lei.data}</lastmod><priority>0.8</priority></url>\n`;
  });

  xml += '</urlset>';
  return xml;
}

function generateAPI() {
  return JSON.stringify({
    version: "1.0",
    total: LEIS.length,
    leis: LEIS.map(l => ({
      id: l.id,
      numero: l.numero,
      tipo: l.tipo,
      titulo: l.titulo,
      resumo: l.resumo,
      categoria: l.categoria,
      cidade: l.cidade,
      ano: l.ano,
      url: `https://cspgabriel.github.io/legalturis-apprj/leis/${l.numero}-${slugify(l.titulo)}/`
    }))
  }, null, 2);
}

if (require.main === module) {
  main();
}

module.exports = { slugify, generateLeiPage, generateSitemap, generateAPI };
