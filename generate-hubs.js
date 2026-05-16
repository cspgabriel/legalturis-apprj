// ============================================
// LegiRJ - Gerador de Hubs SEO (Cidades + Categorias + Setores)
// ============================================
// Execute: node generate-hubs.js

const fs = require('fs');
const path = require('path');
const { LEIS_RJ, CIDADES_RJ, CATEGORIAS } = require('./data-for-generation.js');

function slugify(text) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

const SETORES = [
    { id: "advocacia", nome: "Advocacia e Direito", icone: "👨‍⚖️", categorias: ["civil", "penal", "tributaria"], descricao: "Legislação essencial para advogados e operadores do direito no Rio de Janeiro." },
    { id: "saude", nome: "Profissionais de Saúde", icone: "🏥", categorias: ["saude"], descricao: "Leis e regulamentações para médicos, enfermeiros e profissionais da saúde no RJ." },
    { id: "empresarial", nome: "Setor Empresarial", icone: "💼", categorias: ["tributaria", "comercial", "trabalhista"], descricao: "Marco legal para empresas, empreendedores e profissionais liberais." },
    { id: "construcao", nome: "Construção e Imóveis", icone: "🏗️", categorias: ["urbanismo", "habitacao"], descricao: "Regulamentação urbanística, habitacional e do setor imobiliário do RJ." },
    { id: "educacao", nome: "Educação e Ensino", icone: "🎓", categorias: ["educacao"], descricao: "Legislação educacional para escolas, universidades e profissionais de ensino." },
    { id: "transporte-log", nome: "Transporte e Logística", icone: "🚚", categorias: ["transporte"], descricao: "Normas para o setor de transportes, mobilidade e logística no Rio de Janeiro." },
    { id: "publico", nome: "Servidor Público", icone: "👔", categorias: ["administrativa"], descricao: "Legislação de interesse de servidores públicos estaduais e municipais." },
    { id: "ambiental", nome: "Sustentabilidade", icone: "🌳", categorias: ["ambiental"], descricao: "Legislação ambiental, sustentabilidade e proteção dos recursos naturais." }
];

function navHTML(currentPath = './') {
    const isLeisPage = currentPath.includes('leis/');
    const base = isLeisPage ? '../../' : './';

    return `<nav class="navbar">
    <div class="container nav-container">
        <a href="${base}" class="logo-link">
            <div class="logo-icon">⚖️</div>
            <div class="logo-text">
                <h1>LegiRJ</h1>
                <span>Portal de Leis do RJ</span>
            </div>
        </a>

        <button class="nav-mobile-toggle" onclick="document.querySelector('.nav-menu-main').classList.toggle('mobile-open')">☰</button>

        <ul class="nav-menu-main">
            <li class="nav-menu-item"><a href="${base}" class="nav-menu-link">🏠 Início</a></li>

            <li class="nav-menu-item">
                <button class="nav-menu-link has-arrow">📍 Cidades</button>
                <ul class="nav-submenu wide">
                    <li class="submenu-header">Capital e Região Metropolitana</li>
                    <li><a href="${base}cidades/rio/"><span class="submenu-icon">🌆</span> Rio de Janeiro</a></li>
                    <li><a href="${base}cidades/niteroi/"><span class="submenu-icon">🌉</span> Niterói</a></li>
                    <li><a href="${base}cidades/sao-goncalo/"><span class="submenu-icon">🏙️</span> São Gonçalo</a></li>
                    <li><a href="${base}cidades/duque-caxias/"><span class="submenu-icon">🏘️</span> Duque de Caxias</a></li>
                    <li><a href="${base}cidades/nova-iguacu/"><span class="submenu-icon">🏛️</span> Nova Iguaçu</a></li>
                    <li><a href="${base}cidades/belford-roxo/"><span class="submenu-icon">🏘️</span> Belford Roxo</a></li>
                    <li class="submenu-header">Interior</li>
                    <li><a href="${base}cidades/petropolis/"><span class="submenu-icon">⛰️</span> Petrópolis</a></li>
                    <li><a href="${base}cidades/campos/"><span class="submenu-icon">🌾</span> Campos</a></li>
                    <li><a href="${base}cidades/volta-redonda/"><span class="submenu-icon">🏭</span> Volta Redonda</a></li>
                    <li><a href="${base}cidades/macae/"><span class="submenu-icon">🛢️</span> Macaé</a></li>
                    <li><a href="${base}cidades/marica/"><span class="submenu-icon">🏖️</span> Maricá</a></li>
                    <li><a href="${base}cidades/cabo-frio/"><span class="submenu-icon">🏖️</span> Cabo Frio</a></li>
                    <li><a href="${base}cidades/" style="grid-column: 1 / -1; text-align: center; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border);"><strong>Ver todas as 20 cidades →</strong></a></li>
                </ul>
            </li>

            <li class="nav-menu-item">
                <button class="nav-menu-link has-arrow">🎯 Categorias</button>
                <ul class="nav-submenu wide">
                    <li><a href="${base}categorias/tributaria/"><span class="submenu-icon">💰</span> Tributária</a></li>
                    <li><a href="${base}categorias/trabalhista/"><span class="submenu-icon">👷</span> Trabalhista</a></li>
                    <li><a href="${base}categorias/ambiental/"><span class="submenu-icon">🌳</span> Ambiental</a></li>
                    <li><a href="${base}categorias/saude/"><span class="submenu-icon">🏥</span> Saúde</a></li>
                    <li><a href="${base}categorias/educacao/"><span class="submenu-icon">🎓</span> Educação</a></li>
                    <li><a href="${base}categorias/urbanismo/"><span class="submenu-icon">🏗️</span> Urbanismo</a></li>
                    <li><a href="${base}categorias/transporte/"><span class="submenu-icon">🚌</span> Transporte</a></li>
                    <li><a href="${base}categorias/habitacao/"><span class="submenu-icon">🏠</span> Habitação</a></li>
                    <li><a href="${base}categorias/turismo/"><span class="submenu-icon">🗺️</span> Turismo</a></li>
                    <li><a href="${base}categorias/cultura/"><span class="submenu-icon">🎭</span> Cultura</a></li>
                    <li><a href="${base}categorias/seguranca/"><span class="submenu-icon">🚓</span> Segurança</a></li>
                    <li><a href="${base}categorias/administrativa/"><span class="submenu-icon">📋</span> Administrativa</a></li>
                </ul>
            </li>

            <li class="nav-menu-item">
                <button class="nav-menu-link has-arrow">💼 Setores</button>
                <ul class="nav-submenu">
                    ${SETORES.map(s => `<li><a href="${base}setores/${s.id}/"><span class="submenu-icon">${s.icone}</span> ${s.nome}</a></li>`).join('')}
                </ul>
            </li>

            <li class="nav-menu-item"><a href="${base}noticias.html" class="nav-menu-link">📰 Notícias</a></li>
            <li class="nav-menu-item"><a href="${base}premium.html" class="nav-premium-link">👑 Premium</a></li>
            <li class="nav-menu-item"><a href="${base}account.html" class="nav-menu-link">👤 Conta</a></li>
        </ul>
    </div>
</nav>`;
}

function footerHTML(base = './') {
    return `<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-col">
                <h3>⚖️ LegiRJ</h3>
                <p>O maior portal de consulta de leis e decretos do Estado do Rio de Janeiro.</p>
                <div class="social-links">
                    <a href="https://wa.me/?text=Veja%20o%20LegiRJ" target="_blank" rel="noopener" class="social-link" title="WhatsApp">📱</a>
                    <a href="https://t.me/share/url?url=https://cspgabriel.github.io/legalturis-apprj/" target="_blank" rel="noopener" class="social-link" title="Telegram">✈️</a>
                    <a href="https://twitter.com/intent/tweet?url=https://cspgabriel.github.io/legalturis-apprj/" target="_blank" rel="noopener" class="social-link" title="Twitter">🐦</a>
                </div>
            </div>
            <div class="footer-col">
                <h4>Fontes Oficiais</h4>
                <ul>
                    <li><a href="https://www.alerj.rj.gov.br" target="_blank" rel="noopener">ALERJ</a></li>
                    <li><a href="https://www.ioerj.com.br" target="_blank" rel="noopener">Diário Oficial RJ</a></li>
                    <li><a href="https://www.camara.rio" target="_blank" rel="noopener">Câmara do Rio</a></li>
                    <li><a href="https://www.rj.gov.br" target="_blank" rel="noopener">Governo do RJ</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Navegação</h4>
                <ul>
                    <li><a href="${base}">🏠 Portal Principal</a></li>
                    <li><a href="${base}noticias.html">📰 Notícias</a></li>
                    <li><a href="${base}premium.html">👑 Premium</a></li>
                    <li><a href="${base}sitemap.xml">🗺️ Mapa do Site</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Sobre</h4>
                <ul>
                    <li><a href="mailto:contato@legirj.com.br">Contato</a></li>
                    <li><a href="#">Privacidade</a></li>
                    <li><a href="#">Termos de Uso</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 LegiRJ. Todos os direitos reservados.</p>
            <p class="disclaimer">⚠️ Portal informativo. Para informações legais oficiais, consulte sempre as fontes governamentais citadas.</p>
        </div>
    </div>
</footer>`;
}

function leiCardHTML(lei, base) {
    const cidade = CIDADES_RJ.find(c => c.id === lei.cidade);
    const cat = CATEGORIAS.find(c => c.id === lei.categoria);
    const slug = `${lei.numero}-${slugify(lei.titulo)}`;
    return `<a href="${base}leis/${slug}/" class="hub-link-card">
        <span class="icon">${cat?.icone || '📜'}</span>
        <div>
            <strong>${lei.tipo} nº ${lei.numero}</strong>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${lei.titulo.substring(0, 60)}${lei.titulo.length > 60 ? '...' : ''}</div>
        </div>
    </a>`;
}

function baseTemplate({ title, description, canonical, schema, content, base = '../../' }) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="leis RJ, decretos RJ, legislação Rio de Janeiro, ${title}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${canonical}">

    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://cspgabriel.github.io/legalturis-apprj/icons/icon.svg">
    <meta property="og:site_name" content="LegiRJ">
    <meta property="og:locale" content="pt_BR">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">

    <script type="application/ld+json">${JSON.stringify(schema)}</script>

    <meta name="theme-color" content="#1e3a8a">
    <link rel="icon" type="image/svg+xml" href="${base}icons/icon.svg">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="${base}styles.css">
    <link rel="stylesheet" href="${base}premium.css">
    <link rel="stylesheet" href="${base}noticias.css">

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx" crossorigin="anonymous"></script>
</head>
<body>
${navHTML('../../')}
<main class="hub-page">
${content}
</main>

<section class="container newsletter-section-inner">
    <div class="newsletter-card-inner">
        <div class="newsletter-icon-inner">📬</div>
        <div class="newsletter-text">
            <h3>Newsletter Mensal Gratuita</h3>
            <p>Receba 1x por mês um resumo das principais leis do RJ. <strong>É grátis e sem spam.</strong></p>
        </div>
        <form class="newsletter-form-inner" onsubmit="event.preventDefault(); subscribeMonthly(this);">
            <input type="email" name="email" required placeholder="seu@email.com">
            <button type="submit" class="btn-primary">📧 Inscrever Grátis</button>
        </form>
    </div>
</section>

${footerHTML(base)}

<script>
    function subscribeMonthly(form) {
        const email = form.email.value;
        try {
            const subs = JSON.parse(localStorage.getItem('legirj_newsletter_monthly') || '[]');
            if (subs.includes(email)) { alert('📧 Você já está inscrito!'); return; }
            subs.push(email);
            localStorage.setItem('legirj_newsletter_monthly', JSON.stringify(subs));
            alert('✅ Inscrição confirmada!');
            form.reset();
        } catch (e) { alert('✅ Inscrição realizada!'); }
    }
</script>
</body>
</html>`;
}

function generateCidadeHub(cidade) {
    const leis = LEIS_RJ.filter(l => l.cidade === cidade.id);
    const totalLeis = leis.length;
    const url = `https://cspgabriel.github.io/legalturis-apprj/cidades/${cidade.id}/`;
    const title = `Leis e Decretos de ${cidade.nome} | LegiRJ`;
    const description = `Consulte todas as ${totalLeis} leis e decretos vigentes em ${cidade.nome}. Legislação municipal organizada por categoria, com fontes oficiais e atualizadas.`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "url": url,
        "inLanguage": "pt-BR",
        "isPartOf": { "@type": "WebSite", "name": "LegiRJ", "url": "https://cspgabriel.github.io/legalturis-apprj/" },
        "about": { "@type": "Place", "name": cidade.nome }
    };

    const catsComLeis = CATEGORIAS.filter(c => leis.some(l => l.categoria === c.id));

    const content = `<div class="container">
    <nav class="hub-breadcrumb"><a href="../../">🏠 Início</a> / <a href="../">Cidades</a> / <span>${cidade.nome}</span></nav>

    <header class="hub-header">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${cidade.icone}</div>
        <h1>Leis e Decretos de ${cidade.nome}</h1>
        <p class="hub-description">Consulte toda a legislação vigente em ${cidade.nome}, com fontes oficiais da ${cidade.fonte}. Total de ${totalLeis} leis cadastradas, organizadas por categoria temática para facilitar sua consulta.</p>
        <div class="hub-stats">
            <div class="hub-stat"><div class="hub-stat-num">${totalLeis}</div><div class="hub-stat-label">Leis</div></div>
            <div class="hub-stat"><div class="hub-stat-num">${catsComLeis.length}</div><div class="hub-stat-label">Categorias</div></div>
            <div class="hub-stat"><div class="hub-stat-num"><a href="${cidade.url}" target="_blank" rel="noopener" style="color: inherit;">↗</a></div><div class="hub-stat-label">Fonte Oficial</div></div>
        </div>
    </header>

    <section class="hub-content-section">
        <h2>📜 Sobre a legislação de ${cidade.nome}</h2>
        <p>${cidade.nome} possui um arcabouço legislativo próprio, composto por leis ordinárias, leis complementares, decretos, resoluções e portarias emitidas por seus órgãos competentes. A fonte oficial é a <a href="${cidade.url}" target="_blank" rel="noopener"><strong>${cidade.fonte}</strong></a>, responsável pelo registro e publicação dos atos normativos do município.</p>
        <p>Esta página reúne uma seleção das principais legislações vigentes em ${cidade.nome}, organizadas para facilitar a consulta de cidadãos, advogados, empresários e gestores públicos. Cada lei possui descrição detalhada, link para a fonte oficial e categorização temática.</p>
    </section>

    ${catsComLeis.map(cat => {
        const catLeis = leis.filter(l => l.categoria === cat.id);
        return `<section class="hub-content-section">
            <h2>${cat.icone} ${cat.nome} (${catLeis.length})</h2>
            <div class="hub-cidades-list">
                ${catLeis.map(l => leiCardHTML(l, '../../')).join('')}
            </div>
        </section>`;
    }).join('')}

    <section class="hub-content-section">
        <h2>🔗 Links úteis sobre ${cidade.nome}</h2>
        <ul style="line-height: 2;">
            <li>📚 <a href="${cidade.url}" target="_blank" rel="noopener"><strong>${cidade.fonte}</strong> (Fonte oficial)</a></li>
            <li>📰 <a href="../../noticias.html">Notícias jurídicas relacionadas</a></li>
            <li>🎯 <a href="../../">Voltar à página principal</a></li>
            <li>📍 <a href="../">Ver todas as cidades do RJ</a></li>
        </ul>
    </section>
</div>`;

    return baseTemplate({ title, description, canonical: url, schema, content });
}

function generateCategoriaHub(cat) {
    const leis = LEIS_RJ.filter(l => l.categoria === cat.id);
    const totalLeis = leis.length;
    const url = `https://cspgabriel.github.io/legalturis-apprj/categorias/${cat.id}/`;
    const title = `Legislação ${cat.nome} no Rio de Janeiro | LegiRJ`;
    const description = `Todas as leis e decretos de ${cat.nome.toLowerCase()} do RJ. ${totalLeis} legislações catalogadas com fontes oficiais, abrangendo estado e municípios.`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "url": url,
        "inLanguage": "pt-BR",
        "isPartOf": { "@type": "WebSite", "name": "LegiRJ", "url": "https://cspgabriel.github.io/legalturis-apprj/" }
    };

    const cidadesComLeis = CIDADES_RJ.filter(c => leis.some(l => l.cidade === c.id));

    const descricaoCat = {
        tributaria: "Legislação tributária do Rio de Janeiro abrange normas sobre ICMS, ISS, IPTU, IPVA, ITBI, ITD e demais tributos estaduais e municipais. Essencial para advogados, contadores, empresas e contribuintes em geral.",
        ambiental: "Legislação ambiental do RJ inclui leis de proteção de florestas (especialmente Mata Atlântica), políticas de mudanças climáticas, gestão de resíduos, áreas de preservação e responsabilidade ambiental.",
        trabalhista: "Normas relativas a relações de trabalho, qualificação profissional, primeiro emprego, terceirização, home office e direitos do trabalhador no âmbito estadual e municipal do RJ.",
        administrativa: "Legislação que rege a administração pública estadual e municipal: servidores, licitações, contratos, processos administrativos e organização dos órgãos públicos.",
        penal: "Normas penais complementares e de execução penal aplicáveis no estado e municípios fluminenses, incluindo medidas de segurança pública e proteção à vítima.",
        civil: "Legislação de direito civil aplicada ao âmbito estadual e municipal: registros, cartórios, defesa do consumidor, direito de família e relações de vizinhança.",
        comercial: "Marco legal para atividades comerciais, indústria, polos econômicos, incentivos fiscais e desenvolvimento econômico regional do Rio de Janeiro.",
        saude: "Legislação que organiza o SUS no âmbito do RJ, regulamentações sanitárias, programas de saúde pública e direitos dos usuários do sistema de saúde.",
        educacao: "Planos municipais e estaduais de educação, política educacional, ensino técnico, valorização dos profissionais e modernização das escolas fluminenses.",
        urbanismo: "Planos diretores, política urbana, uso e ocupação do solo, parcelamentos, regularização fundiária e desenvolvimento urbano sustentável.",
        transporte: "Legislação de transporte público, mobilidade urbana, ciclovias, integração tarifária, gratuidades e ordenamento do sistema de transportes do RJ.",
        seguranca: "Política de segurança pública estadual, integração das forças policiais, programas comunitários e prevenção criminal no Rio de Janeiro.",
        cultura: "Fomento cultural, leis de incentivo, fundos municipais e estaduais de cultura, patrimônio imaterial e equipamentos culturais.",
        esporte: "Política esportiva, fomento ao esporte amador e de aventura, eventos esportivos e programas de iniciação esportiva juvenil.",
        habitacao: "Programas habitacionais, regularização fundiária, habitação de interesse social e moradia popular no estado do RJ.",
        turismo: "Política de turismo, planos de desenvolvimento turístico, promoção de destinos e qualificação do setor turístico fluminense."
    }[cat.id] || `Legislação na área de ${cat.nome.toLowerCase()} aplicada ao Estado e municípios do Rio de Janeiro.`;

    const content = `<div class="container">
    <nav class="hub-breadcrumb"><a href="../../">🏠 Início</a> / <a href="../">Categorias</a> / <span>${cat.nome}</span></nav>

    <header class="hub-header">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${cat.icone}</div>
        <h1>Legislação ${cat.nome} no Rio de Janeiro</h1>
        <p class="hub-description">${descricaoCat}</p>
        <div class="hub-stats">
            <div class="hub-stat"><div class="hub-stat-num">${totalLeis}</div><div class="hub-stat-label">Leis na categoria</div></div>
            <div class="hub-stat"><div class="hub-stat-num">${cidadesComLeis.length}</div><div class="hub-stat-label">Cidades cobertas</div></div>
        </div>
    </header>

    <section class="hub-content-section">
        <h2>📜 Sobre legislação de ${cat.nome}</h2>
        <p>A área ${cat.nome} concentra ${totalLeis} legislações catalogadas no portal LegiRJ, distribuídas entre o Estado e ${cidadesComLeis.length} municípios fluminenses. Esta categoria reúne normas relevantes para profissionais, empresas e cidadãos que precisam consultar a legislação vigente.</p>
        <p>Todas as leis listadas possuem fonte oficial (ALERJ, Câmaras Municipais ou Diário Oficial) e link para o texto original. Mantemos a base atualizada com as principais publicações dos últimos anos, priorizando leis em vigor com impacto direto no dia a dia.</p>
    </section>

    ${cidadesComLeis.map(cidade => {
        const cidadeLeis = leis.filter(l => l.cidade === cidade.id);
        return `<section class="hub-content-section">
            <h2>${cidade.icone} ${cidade.nome} (${cidadeLeis.length})</h2>
            <div class="hub-cidades-list">
                ${cidadeLeis.map(l => leiCardHTML(l, '../../')).join('')}
            </div>
        </section>`;
    }).join('')}

    <section class="hub-content-section">
        <h2>🔗 Veja também</h2>
        <ul style="line-height: 2;">
            <li>📰 <a href="../../noticias.html">Notícias jurídicas sobre ${cat.nome}</a></li>
            <li>🎯 <a href="../">Ver todas as categorias</a></li>
            <li>📍 <a href="../../cidades/">Buscar por cidade</a></li>
            <li>🏠 <a href="../../">Voltar à página principal</a></li>
        </ul>
    </section>
</div>`;

    return baseTemplate({ title, description, canonical: url, schema, content });
}

function generateSetorHub(setor) {
    const leis = LEIS_RJ.filter(l => setor.categorias.includes(l.categoria));
    const totalLeis = leis.length;
    const url = `https://cspgabriel.github.io/legalturis-apprj/setores/${setor.id}/`;
    const title = `Legislação para ${setor.nome} | LegiRJ`;
    const description = `${setor.descricao} ${totalLeis} legislações relevantes catalogadas com fontes oficiais.`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "url": url,
        "inLanguage": "pt-BR"
    };

    const content = `<div class="container">
    <nav class="hub-breadcrumb"><a href="../../">🏠 Início</a> / <a href="../">Setores</a> / <span>${setor.nome}</span></nav>

    <header class="hub-header">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${setor.icone}</div>
        <h1>Legislação para ${setor.nome}</h1>
        <p class="hub-description">${setor.descricao}</p>
        <div class="hub-stats">
            <div class="hub-stat"><div class="hub-stat-num">${totalLeis}</div><div class="hub-stat-label">Leis relevantes</div></div>
            <div class="hub-stat"><div class="hub-stat-num">${setor.categorias.length}</div><div class="hub-stat-label">Áreas cobertas</div></div>
        </div>
    </header>

    <section class="hub-content-section">
        <h2>📌 Legislação organizada para ${setor.nome}</h2>
        <p>Esta página reúne, de forma curada, as principais legislações do Rio de Janeiro que impactam diretamente o setor de <strong>${setor.nome}</strong>. Selecionamos leis das categorias mais relevantes para profissionais e empresas deste setor.</p>
        <p>Consulte abaixo cada lei, com descrição completa, fonte oficial e categorização temática. Para receber atualizações relevantes para o seu setor, configure alertas personalizados na <a href="../../noticias.html">página de Notícias Jurídicas</a>.</p>
    </section>

    <section class="hub-content-section">
        <h2>📚 Leis para ${setor.nome}</h2>
        <div class="hub-cidades-list">
            ${leis.map(l => leiCardHTML(l, '../../')).join('')}
        </div>
    </section>

    <section class="hub-content-section">
        <h2>🎯 Áreas cobertas</h2>
        <div class="hub-categorias-list">
            ${setor.categorias.map(catId => {
                const cat = CATEGORIAS.find(c => c.id === catId);
                const catLeis = leis.filter(l => l.categoria === catId).length;
                return `<a href="../../categorias/${catId}/" class="hub-link-card">
                    <span class="icon">${cat?.icone}</span>
                    <div><strong>${cat?.nome}</strong></div>
                    <span class="count">${catLeis}</span>
                </a>`;
            }).join('')}
        </div>
    </section>
</div>`;

    return baseTemplate({ title, description, canonical: url, schema, content });
}

function generateIndex(type) {
    const url = `https://cspgabriel.github.io/legalturis-apprj/${type}/`;
    let title, description, items, content;

    if (type === 'cidades') {
        title = 'Leis por Cidade do Rio de Janeiro | LegiRJ';
        description = 'Consulte a legislação de todas as 20 cidades do RJ catalogadas no LegiRJ. Acesso rápido por município com fontes oficiais.';
        items = CIDADES_RJ.map(c => {
            const count = LEIS_RJ.filter(l => l.cidade === c.id).length;
            return `<a href="${c.id}/" class="hub-link-card">
                <span class="icon">${c.icone}</span>
                <div><strong>${c.nome}</strong><div style="font-size: 0.8rem; color: var(--text-muted);">${c.fonte}</div></div>
                <span class="count">${count}</span>
            </a>`;
        }).join('');
        content = `<div class="container">
            <nav class="hub-breadcrumb"><a href="../">🏠 Início</a> / <span>Cidades</span></nav>
            <header class="hub-header">
                <h1>📍 Leis por Cidade do Rio de Janeiro</h1>
                <p class="hub-description">Explore a legislação organizada por município. Cada cidade possui uma página dedicada com todas as suas leis catalogadas, categorizadas e com fonte oficial.</p>
            </header>
            <section class="hub-content-section">
                <h2>Selecione uma cidade</h2>
                <div class="hub-cidades-list">${items}</div>
            </section>
        </div>`;
    } else if (type === 'categorias') {
        title = 'Leis por Categoria | LegiRJ - Legislação do RJ';
        description = 'Navegue pela legislação do RJ organizada por categoria temática: tributária, ambiental, trabalhista, saúde, educação e mais.';
        items = CATEGORIAS.map(c => {
            const count = LEIS_RJ.filter(l => l.categoria === c.id).length;
            if (count === 0) return '';
            return `<a href="${c.id}/" class="hub-link-card">
                <span class="icon">${c.icone}</span>
                <div><strong>${c.nome}</strong></div>
                <span class="count">${count}</span>
            </a>`;
        }).filter(x => x).join('');
        content = `<div class="container">
            <nav class="hub-breadcrumb"><a href="../">🏠 Início</a> / <span>Categorias</span></nav>
            <header class="hub-header">
                <h1>🎯 Leis por Categoria</h1>
                <p class="hub-description">Encontre rapidamente legislação por área temática. Útil para advogados, contadores, empresários e profissionais que precisam de informação específica.</p>
            </header>
            <section class="hub-content-section">
                <h2>Selecione uma categoria</h2>
                <div class="hub-categorias-list">${items}</div>
            </section>
        </div>`;
    } else if (type === 'setores') {
        title = 'Leis por Setor Profissional | LegiRJ';
        description = 'Legislação curada por setor profissional: advocacia, saúde, empresarial, construção, educação, transporte e mais.';
        items = SETORES.map(s => {
            const count = LEIS_RJ.filter(l => s.categorias.includes(l.categoria)).length;
            return `<a href="${s.id}/" class="hub-link-card">
                <span class="icon">${s.icone}</span>
                <div><strong>${s.nome}</strong></div>
                <span class="count">${count}</span>
            </a>`;
        }).join('');
        content = `<div class="container">
            <nav class="hub-breadcrumb"><a href="../">🏠 Início</a> / <span>Setores</span></nav>
            <header class="hub-header">
                <h1>💼 Leis por Setor Profissional</h1>
                <p class="hub-description">Encontre rapidamente a legislação mais relevante para o seu setor de atuação. Conteúdo curado para profissionais e empresas.</p>
            </header>
            <section class="hub-content-section">
                <h2>Selecione um setor</h2>
                <div class="hub-categorias-list">${items}</div>
            </section>
        </div>`;
    }

    const schema = { "@context": "https://schema.org", "@type": "CollectionPage", "name": title, "description": description, "url": url };
    return baseTemplate({ title, description, canonical: url, schema, content });
}

function main() {
    console.log('🔄 Gerando páginas hub SEO...');

    // Index de cidades, categorias e setores
    ['cidades', 'categorias', 'setores'].forEach(type => {
        const dir = path.join(__dirname, type);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), generateIndex(type));
        console.log(`✅ /${type}/index.html`);
    });

    // Páginas individuais de cidades
    CIDADES_RJ.forEach(cidade => {
        const dir = path.join(__dirname, 'cidades', cidade.id);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), generateCidadeHub(cidade));
        console.log(`✅ /cidades/${cidade.id}/`);
    });

    // Páginas individuais de categorias
    CATEGORIAS.forEach(cat => {
        const leis = LEIS_RJ.filter(l => l.categoria === cat.id);
        if (leis.length === 0) return;
        const dir = path.join(__dirname, 'categorias', cat.id);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), generateCategoriaHub(cat));
        console.log(`✅ /categorias/${cat.id}/`);
    });

    // Páginas individuais de setores
    SETORES.forEach(setor => {
        const dir = path.join(__dirname, 'setores', setor.id);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), generateSetorHub(setor));
        console.log(`✅ /setores/${setor.id}/`);
    });

    // Atualizar sitemap
    const today = new Date().toISOString().split('T')[0];
    const urls = [
        { loc: 'https://cspgabriel.github.io/legalturis-apprj/', priority: '1.0' },
        { loc: 'https://cspgabriel.github.io/legalturis-apprj/noticias.html', priority: '0.9' },
        { loc: 'https://cspgabriel.github.io/legalturis-apprj/premium.html', priority: '0.8' },
        { loc: 'https://cspgabriel.github.io/legalturis-apprj/cidades/', priority: '0.9' },
        { loc: 'https://cspgabriel.github.io/legalturis-apprj/categorias/', priority: '0.9' },
        { loc: 'https://cspgabriel.github.io/legalturis-apprj/setores/', priority: '0.9' },
        ...CIDADES_RJ.map(c => ({ loc: `https://cspgabriel.github.io/legalturis-apprj/cidades/${c.id}/`, priority: '0.7' })),
        ...CATEGORIAS.filter(c => LEIS_RJ.some(l => l.categoria === c.id)).map(c => ({ loc: `https://cspgabriel.github.io/legalturis-apprj/categorias/${c.id}/`, priority: '0.7' })),
        ...SETORES.map(s => ({ loc: `https://cspgabriel.github.io/legalturis-apprj/setores/${s.id}/`, priority: '0.7' })),
        ...LEIS_RJ.map(l => ({ loc: `https://cspgabriel.github.io/legalturis-apprj/leis/${l.numero}-${slugify(l.titulo)}/`, priority: '0.8' }))
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
    console.log(`✅ sitemap.xml (${urls.length} URLs)`);

    console.log('🎉 Pronto!');
}

main();
