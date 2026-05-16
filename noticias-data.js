// ============================================
// LegiRJ - Notícias Jurídicas
// Fontes Oficiais: STJ, STF, ALERJ, OAB, CNJ, TJRJ
// ============================================

const FONTES_NOTICIAS = [
    { id: "stf", nome: "STF", nomeCompleto: "Supremo Tribunal Federal", icone: "⚖️", cor: "#1e3a8a", url: "https://portal.stf.jus.br" },
    { id: "stj", nome: "STJ", nomeCompleto: "Superior Tribunal de Justiça", icone: "🏛️", cor: "#7c3aed", url: "https://www.stj.jus.br" },
    { id: "cnj", nome: "CNJ", nomeCompleto: "Conselho Nacional de Justiça", icone: "📜", cor: "#059669", url: "https://www.cnj.jus.br" },
    { id: "tjrj", nome: "TJRJ", nomeCompleto: "Tribunal de Justiça do RJ", icone: "🏢", cor: "#dc2626", url: "https://www.tjrj.jus.br" },
    { id: "alerj", nome: "ALERJ", nomeCompleto: "Assembleia Legislativa do RJ", icone: "🏛️", cor: "#0891b2", url: "https://www.alerj.rj.gov.br" },
    { id: "oab", nome: "OAB-RJ", nomeCompleto: "OAB Rio de Janeiro", icone: "👨‍⚖️", cor: "#b45309", url: "https://www.oabrj.org.br" },
    { id: "tre", nome: "TRE-RJ", nomeCompleto: "Tribunal Regional Eleitoral", icone: "🗳️", cor: "#4338ca", url: "https://www.tre-rj.jus.br" },
    { id: "trt", nome: "TRT-RJ", nomeCompleto: "Tribunal Regional do Trabalho", icone: "👷", cor: "#be185d", url: "https://www.trt1.jus.br" }
];

const CATEGORIAS_NOTICIAS = [
    { id: "tributario", nome: "Tributário", icone: "💰" },
    { id: "trabalhista", nome: "Trabalhista", icone: "👷" },
    { id: "civil", nome: "Civil", icone: "📜" },
    { id: "penal", nome: "Penal", icone: "⚖️" },
    { id: "constitucional", nome: "Constitucional", icone: "📋" },
    { id: "ambiental", nome: "Ambiental", icone: "🌳" },
    { id: "consumidor", nome: "Consumidor", icone: "🛒" },
    { id: "eleitoral", nome: "Eleitoral", icone: "🗳️" }
];

const NOTICIAS = [
    {
        id: 1, fonte: "stf", categoria: "tributario", data: "2026-05-15",
        titulo: "STF mantém constitucionalidade da contribuição sobre receitas decorrentes de exportações",
        resumo: "Plenário do Supremo decidiu pela validade da incidência da contribuição previdenciária sobre receitas decorrentes de exportações realizadas por empresas rurais.",
        link: "https://portal.stf.jus.br",
        tags: ["contribuição", "exportação", "previdenciária"]
    },
    {
        id: 2, fonte: "stj", categoria: "consumidor", data: "2026-05-14",
        titulo: "STJ define prazo para devolução de valores pagos por consumidor em caso de atraso na entrega",
        resumo: "Segunda Seção pacificou entendimento sobre o prazo prescricional para pleitear devolução de valores em compras com atraso superior a 30 dias.",
        link: "https://www.stj.jus.br",
        tags: ["consumidor", "devolução", "prescrição"]
    },
    {
        id: 3, fonte: "alerj", categoria: "tributario", data: "2026-05-13",
        titulo: "ALERJ aprova projeto que reduz ICMS para empresas de tecnologia no RJ",
        resumo: "Em segunda votação, deputados estaduais aprovaram redução da alíquota de ICMS para empresas do setor de tecnologia estabelecidas no estado.",
        link: "https://www.alerj.rj.gov.br",
        tags: ["ICMS", "tecnologia", "incentivo fiscal"]
    },
    {
        id: 4, fonte: "tjrj", categoria: "civil", data: "2026-05-12",
        titulo: "TJRJ implementa novo sistema de mediação digital para conflitos de consumo",
        resumo: "Tribunal lança plataforma online para resolução de disputas entre consumidores e empresas, com prazo médio de 30 dias.",
        link: "https://www.tjrj.jus.br",
        tags: ["mediação", "digital", "consumidor"]
    },
    {
        id: 5, fonte: "cnj", categoria: "constitucional", data: "2026-05-11",
        titulo: "CNJ publica novo manual de boas práticas para processos digitais",
        resumo: "Conselho atualiza diretrizes sobre tramitação eletrônica e uso de inteligência artificial no Poder Judiciário.",
        link: "https://www.cnj.jus.br",
        tags: ["processo digital", "IA", "boas práticas"]
    },
    {
        id: 6, fonte: "stf", categoria: "trabalhista", data: "2026-05-10",
        titulo: "Supremo julga tese sobre terceirização em atividade-fim de bancos",
        resumo: "STF analisa recurso extraordinário sobre limites da terceirização nas instituições financeiras brasileiras.",
        link: "https://portal.stf.jus.br",
        tags: ["terceirização", "bancos", "trabalhista"]
    },
    {
        id: 7, fonte: "trt", categoria: "trabalhista", data: "2026-05-09",
        titulo: "TRT-RJ uniformiza jurisprudência sobre home office e direito à desconexão",
        resumo: "Pleno do tribunal aprova súmula garantindo direito à desconexão em regime de teletrabalho.",
        link: "https://www.trt1.jus.br",
        tags: ["home office", "desconexão", "teletrabalho"]
    },
    {
        id: 8, fonte: "stj", categoria: "civil", data: "2026-05-08",
        titulo: "STJ decide que herdeiro pode renunciar à herança sem prejudicar credores",
        resumo: "Terceira Turma definiu critérios para análise da fraude contra credores em renúncia de herança.",
        link: "https://www.stj.jus.br",
        tags: ["herança", "renúncia", "credores"]
    },
    {
        id: 9, fonte: "oab", categoria: "constitucional", data: "2026-05-07",
        titulo: "OAB-RJ promove ciclo de debates sobre IA no Direito",
        resumo: "Seccional fluminense organiza eventos com especialistas para discutir uso ético da inteligência artificial na advocacia.",
        link: "https://www.oabrj.org.br",
        tags: ["IA", "advocacia", "ética"]
    },
    {
        id: 10, fonte: "tre", categoria: "eleitoral", data: "2026-05-06",
        titulo: "TRE-RJ inicia preparação para eleições municipais de 2028",
        resumo: "Tribunal anuncia cronograma de cadastramento biométrico e capacitação de mesários para o próximo pleito.",
        link: "https://www.tre-rj.jus.br",
        tags: ["eleições", "biometria", "capacitação"]
    },
    {
        id: 11, fonte: "stf", categoria: "penal", data: "2026-05-05",
        titulo: "STF reconhece repercussão geral em caso sobre crimes contra a honra praticados na internet",
        resumo: "Tribunal vai definir competência para julgamento de crimes de injúria, calúnia e difamação cometidos online.",
        link: "https://portal.stf.jus.br",
        tags: ["crimes virtuais", "honra", "repercussão geral"]
    },
    {
        id: 12, fonte: "alerj", categoria: "ambiental", data: "2026-05-04",
        titulo: "Assembleia aprova lei de proteção da Mata Atlântica fluminense",
        resumo: "Nova legislação estadual cria fundo de R$ 50 milhões para projetos de recuperação ambiental no RJ.",
        link: "https://www.alerj.rj.gov.br",
        tags: ["Mata Atlântica", "fundo ambiental", "recuperação"]
    },
    {
        id: 13, fonte: "stj", categoria: "tributario", data: "2026-05-03",
        titulo: "STJ pacifica entendimento sobre ICMS na base de cálculo do PIS e COFINS",
        resumo: "Primeira Seção aprova tese vinculante para modulação dos efeitos da decisão sobre exclusão do ICMS.",
        link: "https://www.stj.jus.br",
        tags: ["ICMS", "PIS", "COFINS"]
    },
    {
        id: 14, fonte: "tjrj", categoria: "consumidor", data: "2026-05-02",
        titulo: "TJRJ condena banco por cobrança indevida de tarifas em conta inativa",
        resumo: "Decisão da 25ª Câmara Cível garante restituição em dobro de valores cobrados de cliente sem movimentação.",
        link: "https://www.tjrj.jus.br",
        tags: ["banco", "tarifas", "restituição"]
    },
    {
        id: 15, fonte: "cnj", categoria: "constitucional", data: "2026-05-01",
        titulo: "CNJ amplia uso de processo eletrônico em todos os tribunais",
        resumo: "Resolução determina digitalização completa de processos em todas as instâncias até dezembro de 2026.",
        link: "https://www.cnj.jus.br",
        tags: ["processo eletrônico", "digitalização"]
    },
    {
        id: 16, fonte: "stf", categoria: "constitucional", data: "2026-04-30",
        titulo: "Plenário STF: aprovada PEC que altera regras de aposentadoria de magistrados",
        resumo: "Proposta de emenda constitucional modifica idade mínima e tempo de serviço para juízes federais.",
        link: "https://portal.stf.jus.br",
        tags: ["PEC", "magistrados", "aposentadoria"]
    },
    {
        id: 17, fonte: "stj", categoria: "trabalhista", data: "2026-04-29",
        titulo: "STJ define que motorista de aplicativo não tem vínculo empregatício",
        resumo: "Terceira Turma confirma jurisprudência sobre natureza autônoma da prestação de serviços de transporte por aplicativo.",
        link: "https://www.stj.jus.br",
        tags: ["aplicativo", "motorista", "vínculo"]
    },
    {
        id: 18, fonte: "alerj", categoria: "tributario", data: "2026-04-28",
        titulo: "Sancionada lei que cria programa de refinanciamento de dívidas estaduais",
        resumo: "Refis RJ 2026 permite parcelamento em até 60 vezes com desconto de até 90% em multas e juros.",
        link: "https://www.alerj.rj.gov.br",
        tags: ["Refis", "parcelamento", "dívidas"]
    },
    {
        id: 19, fonte: "tjrj", categoria: "civil", data: "2026-04-27",
        titulo: "TJRJ regulamenta uso de plataforma digital para audiências virtuais",
        resumo: "Provimento atualiza normas para realização de audiências por videoconferência nas varas cíveis fluminenses.",
        link: "https://www.tjrj.jus.br",
        tags: ["audiência virtual", "videoconferência"]
    },
    {
        id: 20, fonte: "oab", categoria: "constitucional", data: "2026-04-26",
        titulo: "OAB-RJ lança programa de assistência jurídica para microempreendedores",
        resumo: "Iniciativa oferece consultoria gratuita para MEIs em parceria com escritórios de advocacia voluntários.",
        link: "https://www.oabrj.org.br",
        tags: ["MEI", "assistência jurídica", "voluntariado"]
    },
    {
        id: 21, fonte: "stf", categoria: "ambiental", data: "2026-04-25",
        titulo: "STF reforça responsabilidade objetiva por danos ambientais",
        resumo: "Tribunal confirma que dano ambiental gera obrigação de reparar independente de culpa, em precedente vinculante.",
        link: "https://portal.stf.jus.br",
        tags: ["dano ambiental", "responsabilidade objetiva"]
    },
    {
        id: 22, fonte: "trt", categoria: "trabalhista", data: "2026-04-24",
        titulo: "TRT-RJ condena empresa por jornada exaustiva e assédio moral",
        resumo: "Decisão fixa indenização de R$ 80 mil por danos morais a trabalhador submetido a metas abusivas.",
        link: "https://www.trt1.jus.br",
        tags: ["assédio moral", "jornada", "indenização"]
    },
    {
        id: 23, fonte: "stj", categoria: "penal", data: "2026-04-23",
        titulo: "STJ define critérios para conversão de pena privativa em restritiva de direitos",
        resumo: "Sexta Turma estabelece parâmetros para análise da progressão de regime e substituição de penas.",
        link: "https://www.stj.jus.br",
        tags: ["pena", "progressão", "restritiva"]
    },
    {
        id: 24, fonte: "cnj", categoria: "constitucional", data: "2026-04-22",
        titulo: "CNJ aprova selo de qualidade para serviços extrajudiciais",
        resumo: "Cartórios e tabelionatos poderão obter certificação que atesta qualidade dos serviços prestados ao cidadão.",
        link: "https://www.cnj.jus.br",
        tags: ["cartórios", "selo", "qualidade"]
    },
    {
        id: 25, fonte: "alerj", categoria: "trabalhista", data: "2026-04-21",
        titulo: "Aprovado projeto de incentivo ao primeiro emprego para jovens",
        resumo: "Programa estadual oferece subsídio para empresas que contratarem trabalhadores de 18 a 24 anos em primeiro emprego.",
        link: "https://www.alerj.rj.gov.br",
        tags: ["primeiro emprego", "jovem", "subsídio"]
    },
    {
        id: 26, fonte: "stf", categoria: "civil", data: "2026-04-20",
        titulo: "STF julga validade de casamento de pessoas do mesmo sexo realizados no exterior",
        resumo: "Tribunal confirma reconhecimento automático de uniões homoafetivas celebradas em outros países.",
        link: "https://portal.stf.jus.br",
        tags: ["casamento", "homoafetivo", "exterior"]
    },
    {
        id: 27, fonte: "stj", categoria: "tributario", data: "2026-04-19",
        titulo: "STJ decide que stock options não integram base de cálculo do INSS",
        resumo: "Primeira Turma considera natureza mercantil dos planos de opção de compra de ações para executivos.",
        link: "https://www.stj.jus.br",
        tags: ["stock options", "INSS", "ações"]
    },
    {
        id: 28, fonte: "tjrj", categoria: "penal", data: "2026-04-18",
        titulo: "TJRJ instala vara especializada em violência contra mulher em Niterói",
        resumo: "Nova unidade judicial atenderá exclusivamente casos previstos na Lei Maria da Penha na região metropolitana.",
        link: "https://www.tjrj.jus.br",
        tags: ["Maria da Penha", "vara especializada", "Niterói"]
    },
    {
        id: 29, fonte: "tre", categoria: "eleitoral", data: "2026-04-17",
        titulo: "TRE-RJ moderniza sistema de transmissão de votos para próximas eleições",
        resumo: "Tribunal investe R$ 15 milhões em infraestrutura tecnológica para garantir agilidade na apuração.",
        link: "https://www.tre-rj.jus.br",
        tags: ["urnas", "transmissão", "tecnologia"]
    },
    {
        id: 30, fonte: "oab", categoria: "trabalhista", data: "2026-04-16",
        titulo: "OAB-RJ apresenta cartilha sobre direitos trabalhistas no trabalho remoto",
        resumo: "Material educativo orienta advogados sobre as principais questões do home office pós-pandemia.",
        link: "https://www.oabrj.org.br",
        tags: ["home office", "cartilha", "direitos"]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NOTICIAS, FONTES_NOTICIAS, CATEGORIAS_NOTICIAS };
}
