// ============================================
// scripts/merge-into-data.js
// ============================================
// Lê data/raw/*.csv (saída dos scrapers Python) e anexa
// as leis novas em data-for-generation.js seguindo EXATAMENTE
// o schema das 55 leis existentes.
//
// - Mantém todas as leis curadas existentes (ID 1-55)
// - Adiciona apenas leis que não existem (dedup por numero+ano+cidade)
// - Filtra só tipos jurídicos válidos (Lei, Decreto, LC, Resolução)
// - Numero precisa ter formato válido (não pode ser código de catálogo)
//
// Uso:
//   node scripts/merge-into-data.js                 # dry-run, mostra quantas serão adicionadas
//   node scripts/merge-into-data.js --apply         # escreve no arquivo
// ============================================

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, "data", "raw");
const TARGET = path.join(ROOT, "data-for-generation.js");

// ---- Cidades válidas (vindas do schema atual) ----
const CIDADES_VALIDAS = new Set([
  "estado", "rio", "niteroi", "sao-goncalo", "duque-caxias", "nova-iguacu",
  "belford-roxo", "campos", "petropolis", "volta-redonda", "mage", "itaborai",
  "marica", "macae", "cabo-frio", "nova-friburgo", "teresopolis", "angra",
  "resende", "barra-mansa"
]);

const CIDADES_FONTE = {
  "estado": { fonte: "ALERJ", url: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa" },
  "rio": { fonte: "Câmara Municipal do Rio", url: "https://www.camara.rio" },
  "niteroi": { fonte: "Câmara Municipal de Niterói", url: "https://www.camaraniteroi.rj.gov.br" },
  "sao-goncalo": { fonte: "Câmara Municipal de São Gonçalo", url: "https://www.cmsg.rj.gov.br" },
  "duque-caxias": { fonte: "Câmara Municipal de Duque de Caxias", url: "https://www.cmdc.rj.gov.br" },
  "nova-iguacu": { fonte: "Câmara Municipal de Nova Iguaçu", url: "https://www.cmni.rj.gov.br" },
  "belford-roxo": { fonte: "Câmara Municipal de Belford Roxo", url: "https://www.cmbr.rj.gov.br" },
  "campos": { fonte: "Câmara Municipal de Campos", url: "https://www.camaracampos.rj.gov.br" },
  "petropolis": { fonte: "Câmara Municipal de Petrópolis", url: "https://www.cmp.rj.gov.br" },
  "volta-redonda": { fonte: "Câmara Municipal de Volta Redonda", url: "https://www.camaravr.rj.gov.br" },
  "mage": { fonte: "Câmara Municipal de Magé", url: "https://www.cmmage.rj.gov.br" },
  "itaborai": { fonte: "Câmara Municipal de Itaboraí", url: "https://www.cmitaborai.rj.gov.br" },
  "marica": { fonte: "Câmara Municipal de Maricá", url: "https://www.cmmarica.rj.gov.br" },
  "macae": { fonte: "Câmara Municipal de Macaé", url: "https://www.cmmacae.rj.gov.br" },
  "cabo-frio": { fonte: "Câmara Municipal de Cabo Frio", url: "https://www.cmcf.rj.gov.br" },
  "nova-friburgo": { fonte: "Câmara Municipal de Nova Friburgo", url: "https://www.cmnf.rj.gov.br" },
  "teresopolis": { fonte: "Câmara Municipal de Teresópolis", url: "https://www.cmteresopolis.rj.gov.br" },
  "angra": { fonte: "Câmara Municipal de Angra dos Reis", url: "https://www.cmar.rj.gov.br" },
  "resende": { fonte: "Câmara Municipal de Resende", url: "https://www.cmresende.rj.gov.br" },
  "barra-mansa": { fonte: "Câmara Municipal de Barra Mansa", url: "https://www.cmbm.rj.gov.br" },
};

// ---- Tipos jurídicos aceitos ----
const TIPOS_VALIDOS = new Set([
  "Lei", "Lei Complementar", "Decreto", "Decreto-Lei",
  "Resolução", "Portaria", "Emenda Constitucional", "Medida Provisória"
]);

// ---- CSV parser simples (suporta aspas) ----
function parseCsv(text) {
  const lines = [];
  let cur = "", row = [], inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQuote) {
      if (c === '"' && n === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuote = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQuote = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); lines.push(row); row = []; cur = ""; }
      else if (c === "\r") { /* skip */ }
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); lines.push(row); }
  const header = lines.shift();
  return lines.filter(r => r.length === header.length).map(r => {
    const obj = {};
    header.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
}

function normalizarTipo(t) {
  const x = (t || "").toLowerCase().trim();
  if (x.startsWith("lei complementar")) return "Lei Complementar";
  if (x.startsWith("decreto-lei")) return "Decreto-Lei";
  if (x.startsWith("decreto")) return "Decreto";
  if (x === "lei") return "Lei";
  if (x.startsWith("resol")) return "Resolução";
  if (x.startsWith("portaria")) return "Portaria";
  if (x.startsWith("emenda")) return "Emenda Constitucional";
  if (x.startsWith("medida prov")) return "Medida Provisória";
  return null;
}

function numeroValido(num) {
  if (!num) return false;
  // Aceita: "9.064", "9064", "1.234/2024", "12345"
  // Rejeita: "1000480170" (10+ dígitos sem ponto = código catálogo LexML)
  const s = String(num).replace(/[^\d.\/-]/g, "");
  if (!s) return false;
  if (s.length > 8 && !s.includes(".") && !s.includes("/")) return false;
  return /^\d/.test(s);
}

function getCategoria(catRaw) {
  // Categorias válidas que o site usa
  const validas = new Set(["tributaria","ambiental","trabalhista","administrativa","comercial","saude","educacao","urbanismo","transporte","habitacao","turismo","cultura","seguranca","social","esporte"]);
  return validas.has(catRaw) ? catRaw : "administrativa";
}

function dataAprox(ano, dataPub) {
  if (dataPub && /^\d{4}-\d{2}-\d{2}$/.test(dataPub)) {
    const [y, m, d] = dataPub.split("-");
    return `${d}/${m}/${y}`;
  }
  return `01/01/${ano}`;
}

function nomeFonteOficial(url) {
  if (!url) return "Fonte oficial";
  if (url.includes("planalto.gov.br")) return "Presidência da República / Planalto";
  if (url.includes("senado.leg.br") || url.includes("senado.gov.br")) return "Senado Federal";
  if (url.includes("camara.leg.br") || url.includes("camara.gov.br")) return "Câmara dos Deputados";
  if (url.includes("alerj.rj.gov.br")) return "ALERJ";
  if (url.includes("in.gov.br")) return "Diário Oficial da União";
  if (url.includes("lexml.gov.br")) return "LexML";
  return "Fonte oficial";
}

function gerarConteudo(lei) {
  const cidadeFonte = CIDADES_FONTE[lei.cidade] || { fonte: "Fonte oficial", url: lei.url_oficial };
  const fonteNome = nomeFonteOficial(lei.url_oficial);
  const resumo = lei.resumo || `${lei.tipo} nº ${lei.numero}/${lei.ano} — norma indexada via LexML.`;
  const lexmlBackup = lei.texto_integral && lei.texto_integral.includes("lexml.gov.br")
    ? lei.texto_integral
    : "";

  let linksHtml = `<p><strong>Fonte oficial:</strong> <a href="${escapeAttr(lei.url_oficial)}" target="_blank" rel="noopener">${escapeHtml(fonteNome)}</a></p>`;
  if (lexmlBackup) {
    linksHtml += `\n        <p><strong>Metadados completos:</strong> <a href="${escapeAttr(lexmlBackup)}" target="_blank" rel="noopener">Ficha LexML</a></p>`;
  }

  return `<p>${escapeHtml(resumo)}</p>
        ${linksHtml}
        <p><em>Norma indexada automaticamente a partir do acervo LexML.gov.br. Para o texto integral atualizado, consulte diretamente a fonte oficial. Eventuais revogações ou alterações posteriores podem não estar refletidas nesta ficha.</em></p>`;
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function escapeAttr(s) {
  return String(s || "").replace(/"/g, "&quot;");
}
function escapeJsString(s) {
  return String(s || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${");
}
function escapeJsDouble(s) {
  // Para strings entre aspas DUPLAS: escapa \, ", e quebras de linha
  return String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

// ---- Carrega data-for-generation.js sem executar todo o arquivo ----
function carregarExistentes() {
  const src = fs.readFileSync(TARGET, "utf-8");
  const start = src.indexOf("const LEIS_RJ = [");
  if (start < 0) throw new Error("LEIS_RJ não encontrado");
  const arrStart = src.indexOf("[", start);
  let depth = 0, end = arrStart;
  for (let i = arrStart; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  const arrSrc = src.slice(arrStart, end + 1);
  return new Function("return " + arrSrc + ";")();
}

// ---- Constrói chave de dedup ----
function chave(lei) {
  return `${lei.numero}|${lei.ano}|${lei.cidade}`;
}

// ---- Carrega CSVs ----
// Prefere lexml-enriched.csv se existir; senão usa lexml.csv.
// Sempre ignora seed.csv (são as 40 leis curadas, já estão no data-for-generation).
function carregarCsvs() {
  const out = [];
  const enrichedPath = path.join(RAW_DIR, "lexml-enriched.csv");
  const usarEnriched = fs.existsSync(enrichedPath);
  if (usarEnriched) console.log("  ✅ usando lexml-enriched.csv (ementas + URLs oficiais)");
  for (const f of fs.readdirSync(RAW_DIR)) {
    if (!f.endsWith(".csv")) continue;
    if (f === "seed.csv") continue;
    if (usarEnriched && f === "lexml.csv") continue; // pula bruto se temos enriched
    const text = fs.readFileSync(path.join(RAW_DIR, f), "utf-8");
    const rows = parseCsv(text);
    console.log(`  ${f}: ${rows.length} linhas`);
    out.push(...rows);
  }
  return out;
}

// ---- Filtra e converte ----
function filtrarConverter(rows, existentes) {
  const existKeys = new Set(existentes.map(chave));
  const novas = [];
  let nextId = Math.max(...existentes.map(l => l.id)) + 1;
  const seen = new Set();

  let rejTipo = 0, rejNumero = 0, rejCidade = 0, rejDup = 0, rejSemTitulo = 0, rejSemEmenta = 0, rejSemFonte = 0;

  // Padrão "lei federal genérica" — títulos no formato "Lei nº 123, de DD de mes de AAAA"
  // sem indicação de tema. São indexáveis mas pouco úteis sem fetch do texto integral.
  // Marcamos como menos prioritárias mas ainda aceitamos pra ampliar acervo.
  const TITULO_GENERICO = /^(Lei|Decreto|Decreto-Lei|Lei Complementar|Medida Provisória|Resolução)(\s+Complementar)?\s+n[ºo°]?\s*[\d\.\/-]+(?:,?\s+de\s+\d+º?\s+de\s+\w+\s+de\s+\d{4})?$/i;

  for (const r of rows) {
    const tipo = normalizarTipo(r.tipo);
    if (!tipo || !TIPOS_VALIDOS.has(tipo)) { rejTipo++; continue; }
    if (!numeroValido(r.numero)) { rejNumero++; continue; }
    if (!r.titulo || r.titulo.length < 10) { rejSemTitulo++; continue; }

    // CRÍTICO: precisa ter ementa real (resumo enriched) — senão sem conteúdo de valor
    const resumo = (r.resumo || "").trim();
    if (resumo.length < 30) { rejSemEmenta++; continue; }

    // CRÍTICO: precisa de fonte oficial NÃO-LexML (Senado/Câmara/Planalto/ALERJ)
    const urlOf = (r.url_oficial || "").trim();
    const fonteOk = urlOf && !urlOf.includes("lexml.gov.br");
    if (!fonteOk) { rejSemFonte++; continue; }

    // Mapeia cidade — federal-rj não é cidade válida do site
    let cidade = r.cidade;
    if (cidade === "federal-rj") cidade = "estado"; // norma federal aplicável ao RJ → encaixa em "estado"
    if (!CIDADES_VALIDAS.has(cidade)) { rejCidade++; continue; }

    const numero = String(r.numero).replace(/\.0$/, "");
    const ano = parseInt(r.ano, 10);
    const k = `${numero}|${ano}|${cidade}`;
    if (existKeys.has(k) || seen.has(k)) { rejDup++; continue; }
    seen.add(k);

    const cidadeFonte = CIDADES_FONTE[cidade] || { fonte: "Fonte oficial", url: "" };
    const fonteNome = nomeFonteOficial(urlOf);
    const lei = {
      id: nextId++,
      numero,
      tipo,
      cidade,
      categoria: getCategoria(r.categoria),
      ano,
      data: dataAprox(ano, r.data_publicacao),
      titulo: r.titulo.replace(/\s+/g, " ").trim().slice(0, 200),
      resumo: resumo.slice(0, 500),
      fonte: `${fonteNome} - ${tipo} nº ${numero}/${ano}`,
      fonteUrl: urlOf,
      autor: fonteNome,
      conteudo: gerarConteudo({ ...r, tipo, numero, ano, cidade, resumo, url_oficial: urlOf, texto_integral: r.texto_integral }),
    };
    novas.push(lei);
  }

  console.log(`\nFiltros aplicados:`);
  console.log(`  rejeitadas por tipo inválido:        ${rejTipo}`);
  console.log(`  rejeitadas por número inválido:      ${rejNumero}`);
  console.log(`  rejeitadas por cidade inválida:      ${rejCidade}`);
  console.log(`  rejeitadas por título ausente:       ${rejSemTitulo}`);
  console.log(`  rejeitadas por ementa < 30 chars:    ${rejSemEmenta}`);
  console.log(`  rejeitadas por sem fonte oficial:    ${rejSemFonte}`);
  console.log(`  rejeitadas por duplicata:            ${rejDup}`);
  console.log(`  ✅ aceitas:                          ${novas.length}`);
  return novas;
}

// ---- Serializa lei no formato do arquivo ----
function serializarLei(lei) {
  // Strings entre aspas duplas (padrão do arquivo). escapeJsDouble escapa \, ", \n.
  return `    {
        id: ${lei.id}, numero: "${escapeJsDouble(lei.numero)}", tipo: "${lei.tipo}", cidade: "${lei.cidade}", categoria: "${lei.categoria}", ano: ${lei.ano}, data: "${lei.data}",
        titulo: "${escapeJsDouble(lei.titulo)}",
        resumo: "${escapeJsDouble(lei.resumo)}",
        fonte: "${escapeJsDouble(lei.fonte)}",
        fonteUrl: "${escapeJsDouble(lei.fonteUrl)}",
        autor: "${escapeJsDouble(lei.autor)}",
        conteudo: \`${escapeJsString(lei.conteudo)}\`
    }`;
}

// ---- Escreve novo data-for-generation.js ----
function escreverArquivo(existentes, novas) {
  const original = fs.readFileSync(TARGET, "utf-8");
  // Encontra fechamento do array LEIS_RJ: `];` que aparece antes do module.exports
  const endMarker = /\n\];\s*\n\s*module\.exports/;
  const m = original.match(endMarker);
  if (!m) throw new Error("não consegui localizar fim do array LEIS_RJ");
  const idx = m.index;
  const novasBlocos = novas.map(serializarLei).join(",\n");
  const head = original.slice(0, idx);
  const tail = original.slice(idx);
  // Adiciona uma vírgula após a última lei existente (se necessário) e injeta novas
  const novoConteudo = `${head},\n    // ============================================\n    // Leis adicionadas automaticamente (LexML)\n    // ============================================\n${novasBlocos}${tail}`;
  fs.writeFileSync(TARGET, novoConteudo, "utf-8");
  console.log(`\n✅ ${TARGET} atualizado: ${existentes.length} + ${novas.length} = ${existentes.length + novas.length} leis`);
}

// ---- Main ----
function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Modo: ${apply ? "APPLY" : "dry-run"}\n`);
  console.log("Lendo data/raw/*.csv...");
  const rows = carregarCsvs();
  console.log(`\nTotal de linhas brutas: ${rows.length}`);
  console.log("\nCarregando existentes em data-for-generation.js...");
  const existentes = carregarExistentes();
  console.log(`  ${existentes.length} leis curadas`);
  console.log("\nFiltrando e convertendo...");
  const novas = filtrarConverter(rows, existentes);

  if (novas.length === 0) {
    console.log("Nada a adicionar.");
    return;
  }
  if (!apply) {
    console.log("\nExemplos das primeiras 3 novas:");
    novas.slice(0, 3).forEach(l => {
      console.log(`  - [${l.id}] ${l.tipo} nº ${l.numero}/${l.ano} (${l.cidade}, ${l.categoria}): ${l.titulo.slice(0, 80)}`);
    });
    console.log("\nRode com --apply pra escrever no arquivo.");
    return;
  }
  escreverArquivo(existentes, novas);
}

main();
