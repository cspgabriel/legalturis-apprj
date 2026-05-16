// ============================================
// LegiRJ - Data Export for Static Generation
// ============================================

const CIDADES_RJ = [
    { id: "estado", nome: "Estado do RJ", fonte: "ALERJ", icone: "🏛️", url: "https://www.alerj.rj.gov.br" },
    { id: "rio", nome: "Rio de Janeiro", fonte: "Câmara Municipal do Rio", icone: "🌆", url: "https://www.camara.rio" },
    { id: "niteroi", nome: "Niterói", fonte: "Câmara Municipal de Niterói", icone: "🌉", url: "https://www.camaraniteroi.rj.gov.br" },
    { id: "sao-goncalo", nome: "São Gonçalo", fonte: "Câmara Municipal de São Gonçalo", icone: "🏙️", url: "https://www.cmsg.rj.gov.br" },
    { id: "duque-caxias", nome: "Duque de Caxias", fonte: "Câmara Municipal de Duque de Caxias", icone: "🏘️", url: "https://www.cmdc.rj.gov.br" },
    { id: "nova-iguacu", nome: "Nova Iguaçu", fonte: "Câmara Municipal de Nova Iguaçu", icone: "🏛️", url: "https://www.cmni.rj.gov.br" },
    { id: "belford-roxo", nome: "Belford Roxo", fonte: "Câmara Municipal de Belford Roxo", icone: "🏘️", url: "https://www.cmbr.rj.gov.br" },
    { id: "campos", nome: "Campos dos Goytacazes", fonte: "Câmara Municipal de Campos", icone: "🌾", url: "https://www.camaracampos.rj.gov.br" },
    { id: "petropolis", nome: "Petrópolis", fonte: "Câmara Municipal de Petrópolis", icone: "⛰️", url: "https://www.cmp.rj.gov.br" },
    { id: "volta-redonda", nome: "Volta Redonda", fonte: "Câmara Municipal de Volta Redonda", icone: "🏭", url: "https://www.camaravr.rj.gov.br" },
    { id: "mage", nome: "Magé", fonte: "Câmara Municipal de Magé", icone: "🏘️", url: "https://www.cmm.rj.gov.br" },
    { id: "itaborai", nome: "Itaboraí", fonte: "Câmara Municipal de Itaboraí", icone: "🏘️", url: "https://www.cmi.rj.gov.br" },
    { id: "marica", nome: "Maricá", fonte: "Câmara Municipal de Maricá", icone: "🏖️", url: "https://www.cmm.rj.gov.br" },
    { id: "macae", nome: "Macaé", fonte: "Câmara Municipal de Macaé", icone: "🛢️", url: "https://www.cmm.rj.gov.br" },
    { id: "cabo-frio", nome: "Cabo Frio", fonte: "Câmara Municipal de Cabo Frio", icone: "🏖️", url: "https://www.cmcf.rj.gov.br" },
    { id: "nova-friburgo", nome: "Nova Friburgo", fonte: "Câmara Municipal de Nova Friburgo", icone: "🏔️", url: "https://www.cmnf.rj.gov.br" },
    { id: "teresopolis", nome: "Teresópolis", fonte: "Câmara Municipal de Teresópolis", icone: "🏔️", url: "https://www.cmt.rj.gov.br" },
    { id: "angra", nome: "Angra dos Reis", fonte: "Câmara Municipal de Angra dos Reis", icone: "🏝️", url: "https://www.cmar.rj.gov.br" },
    { id: "resende", nome: "Resende", fonte: "Câmara Municipal de Resende", icone: "🏞️", url: "https://www.cmresende.rj.gov.br" },
    { id: "barra-mansa", nome: "Barra Mansa", fonte: "Câmara Municipal de Barra Mansa", icone: "🏭", url: "https://www.cmbm.rj.gov.br" }
];

const CATEGORIAS = [
    { id: "tributaria", nome: "Tributária", icone: "💰", cor: "#10b981" },
    { id: "ambiental", nome: "Ambiental", icone: "🌳", cor: "#059669" },
    { id: "trabalhista", nome: "Trabalhista", icone: "👷", cor: "#f59e0b" },
    { id: "administrativa", nome: "Administrativa", icone: "📋", cor: "#3b82f6" },
    { id: "penal", nome: "Penal", icone: "⚖️", cor: "#dc2626" },
    { id: "civil", nome: "Civil", icone: "📜", cor: "#8b5cf6" },
    { id: "comercial", nome: "Comercial", icone: "🏪", cor: "#ec4899" },
    { id: "saude", nome: "Saúde", icone: "🏥", cor: "#ef4444" },
    { id: "educacao", nome: "Educação", icone: "🎓", cor: "#6366f1" },
    { id: "urbanismo", nome: "Urbanismo", icone: "🏗️", cor: "#0ea5e9" },
    { id: "transporte", nome: "Transporte", icone: "🚌", cor: "#14b8a6" },
    { id: "seguranca", nome: "Segurança", icone: "🚓", cor: "#1e40af" },
    { id: "cultura", nome: "Cultura", icone: "🎭", cor: "#a855f7" },
    { id: "esporte", nome: "Esporte", icone: "⚽", cor: "#22c55e" },
    { id: "habitacao", nome: "Habitação", icone: "🏠", cor: "#eab308" },
    { id: "turismo", nome: "Turismo", icone: "🗺️", cor: "#06b6d4" }
];

const LEIS_RJ = [
    // ============================================
    // LEIS ESTADUAIS (ALERJ)
    // ============================================
    {
        id: 1, numero: "9.064", tipo: "Lei", cidade: "estado", categoria: "comercial", ano: 2024, data: "15/01/2024",
        titulo: "Institui o Programa Estadual de Microcrédito",
        resumo: "Programa Estadual de Microcrédito para apoio a micro e pequenas empresas do Estado do Rio de Janeiro.",
        fonte: "ALERJ - Diário Oficial do Estado do RJ",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9064",
        autor: "Governo do Estado do Rio de Janeiro",
        conteudo: `<h3>CAPÍTULO I - DAS DISPOSIÇÕES GERAIS</h3><p><strong>Art. 1º</strong> Fica instituído o Programa Estadual de Microcrédito, destinado a apoiar o desenvolvimento de micro e pequenas empresas no Estado do Rio de Janeiro.</p><p><strong>Art. 2º</strong> O programa objetiva: ampliar acesso ao crédito; promover inclusão econômica; estimular geração de emprego; fortalecer desenvolvimento econômico estadual.</p>`
    },
    {
        id: 2, numero: "9.130", tipo: "Lei", cidade: "estado", categoria: "ambiental", ano: 2024, data: "10/06/2024",
        titulo: "Política Estadual de Mudanças Climáticas",
        resumo: "Estabelece a política estadual de combate às mudanças climáticas e redução de emissões de gases de efeito estufa.",
        fonte: "ALERJ - Lei nº 9.130/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9130",
        autor: "ALERJ",
        conteudo: `<h3>POLÍTICA CLIMÁTICA ESTADUAL</h3><p><strong>Art. 1º</strong> Esta Lei institui a Política Estadual sobre Mudanças do Clima do Estado do Rio de Janeiro.</p><p><strong>Art. 2º</strong> A política tem por objetivo reduzir as emissões antrópicas de gases de efeito estufa.</p>`
    },
    {
        id: 3, numero: "9.045", tipo: "Lei", cidade: "estado", categoria: "comercial", ano: 2024, data: "20/02/2024",
        titulo: "Lei de Incentivo à Inovação Tecnológica",
        resumo: "Cria incentivos fiscais para empresas de tecnologia e startups que se instalem no Estado.",
        fonte: "ALERJ - Lei nº 9.045/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9045",
        autor: "ALERJ",
        conteudo: `<h3>DOS INCENTIVOS FISCAIS</h3><p><strong>Art. 1º</strong> Empresas de tecnologia que se instalarem no RJ poderão usufruir de: redução de ICMS em até 75% pelo período de 10 anos; isenção de IPVA; crédito presumido de IPI.</p>`
    },
    {
        id: 4, numero: "8.890", tipo: "Resolução", cidade: "estado", categoria: "administrativa", ano: 2023, data: "05/08/2023",
        titulo: "Normas de Funcionamento dos Espaços Públicos Estaduais",
        resumo: "Estabelece normas para o funcionamento e utilização de espaços públicos no Estado.",
        fonte: "Diário Oficial do Estado do RJ",
        fonteUrl: "https://www.ioerj.com.br",
        autor: "Secretaria de Estado de Governo",
        conteudo: `<p><strong>Art. 1º</strong> Os espaços públicos devem ser utilizados de forma a garantir a segurança e o bem-estar da população.</p>`
    },
    {
        id: 5, numero: "9.102", tipo: "Lei", cidade: "estado", categoria: "saude", ano: 2024, data: "01/03/2024",
        titulo: "Código de Saúde Pública Estadual",
        resumo: "Estabelece normas de saúde pública para todo o Estado do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 9.102/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9102",
        autor: "Secretaria Estadual de Saúde",
        conteudo: `<h3>SAÚDE PÚBLICA ESTADUAL</h3><p><strong>Art. 1º</strong> A saúde é direito fundamental do povo e dever do Estado.</p>`
    },
    {
        id: 6, numero: "8.765", tipo: "Decreto", cidade: "estado", categoria: "urbanismo", ano: 2023, data: "12/07/2023",
        titulo: "Diretrizes de Urbanismo Estadual",
        resumo: "Define as diretrizes para planejamento urbano e desenvolvimento das cidades do RJ.",
        fonte: "Diário Oficial do Estado do RJ",
        fonteUrl: "https://www.ioerj.com.br/decreto/8765",
        autor: "Governo do Estado",
        conteudo: `<p>Diretrizes de Urbanismo para o Estado do Rio de Janeiro.</p>`
    },
    {
        id: 7, numero: "9.200", tipo: "Lei", cidade: "estado", categoria: "transporte", ano: 2024, data: "15/05/2024",
        titulo: "Gratuidade no Transporte Público para Idosos",
        resumo: "Garante gratuidade no transporte intermunicipal para pessoas com 60 anos ou mais.",
        fonte: "ALERJ - Lei nº 9.200/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9200",
        autor: "ALERJ",
        conteudo: `<p><strong>Art. 1º</strong> Fica assegurada gratuidade no transporte intermunicipal a pessoas com 60 anos ou mais.</p>`
    },
    {
        id: 8, numero: "9.180", tipo: "Lei", cidade: "estado", categoria: "seguranca", ano: 2024, data: "08/04/2024",
        titulo: "Programa Estadual de Segurança Pública Integrada",
        resumo: "Cria programa de integração entre polícias estaduais e municipais para combate à criminalidade.",
        fonte: "ALERJ - Lei nº 9.180/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9180",
        autor: "Secretaria de Segurança",
        conteudo: `<p>Programa Estadual de Segurança Pública Integrada com foco em redução da criminalidade.</p>`
    },
    {
        id: 9, numero: "9.220", tipo: "Lei", cidade: "estado", categoria: "educacao", ano: 2024, data: "20/06/2024",
        titulo: "Plano Estadual de Educação Tecnológica",
        resumo: "Institui ensino de tecnologia e programação nas escolas públicas estaduais.",
        fonte: "ALERJ - Lei nº 9.220/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9220",
        autor: "Secretaria Estadual de Educação",
        conteudo: `<p>Inclusão obrigatória de programação e tecnologia no currículo escolar estadual.</p>`
    },
    {
        id: 10, numero: "8.950", tipo: "Decreto", cidade: "estado", categoria: "tributaria", ano: 2023, data: "10/11/2023",
        titulo: "Regulamento do ICMS Estadual",
        resumo: "Regulamenta a cobrança do ICMS no Estado do Rio de Janeiro com novas alíquotas setoriais.",
        fonte: "Diário Oficial - SEFAZ-RJ",
        fonteUrl: "https://www.fazenda.rj.gov.br",
        autor: "Secretaria de Estado de Fazenda",
        conteudo: `<p>Regulamento atualizado do ICMS com alíquotas diferenciadas por setor.</p>`
    },

    // ============================================
    // CIDADE DO RIO DE JANEIRO
    // ============================================
    {
        id: 11, numero: "7.450", tipo: "Lei", cidade: "rio", categoria: "urbanismo", ano: 2024, data: "10/02/2024",
        titulo: "Plano Diretor da Cidade do Rio de Janeiro",
        resumo: "Estabelece diretrizes para o desenvolvimento urbano sustentável do município.",
        fonte: "Câmara Municipal do Rio - DOM-RJ",
        fonteUrl: "https://www.camara.rio/legislacao",
        autor: "Câmara Municipal do Rio",
        conteudo: `<p>Plano Diretor de Desenvolvimento Urbano Sustentável para o município do Rio de Janeiro.</p>`
    },
    {
        id: 12, numero: "7.508", tipo: "Lei", cidade: "rio", categoria: "ambiental", ano: 2024, data: "22/03/2024",
        titulo: "Lei Verde Carioca",
        resumo: "Programa de arborização urbana e preservação de áreas verdes na cidade do Rio.",
        fonte: "Câmara Municipal do Rio",
        fonteUrl: "https://www.camara.rio/legislacao/lei-7508",
        autor: "Prefeitura do Rio",
        conteudo: `<p>Programa de plantio de 100 mil árvores por ano e proteção de áreas verdes.</p>`
    },
    {
        id: 13, numero: "7.380", tipo: "Decreto", cidade: "rio", categoria: "transporte", ano: 2023, data: "05/09/2023",
        titulo: "Plano de Mobilidade Urbana do Rio",
        resumo: "Define diretrizes para BRT, VLT, metrô e ciclovias na cidade.",
        fonte: "Diário Oficial do Município do Rio",
        fonteUrl: "https://doweb.rio.rj.gov.br",
        autor: "Secretaria Municipal de Transportes",
        conteudo: `<p>Plano integrado de mobilidade urbana com foco em transporte sustentável.</p>`
    },
    {
        id: 14, numero: "7.412", tipo: "Lei", cidade: "rio", categoria: "cultura", ano: 2023, data: "18/12/2023",
        titulo: "Lei de Fomento à Cultura Carioca",
        resumo: "Cria fundo municipal de apoio a artistas e produtores culturais do Rio.",
        fonte: "Câmara Municipal do Rio",
        fonteUrl: "https://www.camara.rio/legislacao/lei-7412",
        autor: "Câmara Municipal do Rio",
        conteudo: `<p>Fundo Municipal de Cultura com investimento anual de R$ 50 milhões.</p>`
    },
    {
        id: 15, numero: "7.490", tipo: "Lei", cidade: "rio", categoria: "turismo", ano: 2024, data: "01/06/2024",
        titulo: "Programa Rio Cidade Turística",
        resumo: "Incentivos fiscais e estruturação de polos turísticos na cidade.",
        fonte: "Câmara Municipal do Rio",
        fonteUrl: "https://www.camara.rio/legislacao/lei-7490",
        autor: "Riotur",
        conteudo: `<p>Programa de desenvolvimento turístico com 12 polos prioritários.</p>`
    },

    // ============================================
    // NITERÓI
    // ============================================
    {
        id: 16, numero: "3.589", tipo: "Lei", cidade: "niteroi", categoria: "ambiental", ano: 2024, data: "15/04/2024",
        titulo: "Programa Niterói Sustentável",
        resumo: "Política municipal de sustentabilidade ambiental e energia limpa.",
        fonte: "Câmara Municipal de Niterói",
        fonteUrl: "https://www.camaraniteroi.rj.gov.br/legislacao",
        autor: "Prefeitura de Niterói",
        conteudo: `<p>Programa de transição energética para fontes renováveis no município.</p>`
    },
    {
        id: 17, numero: "3.612", tipo: "Lei", cidade: "niteroi", categoria: "habitacao", ano: 2024, data: "20/05/2024",
        titulo: "Programa Habitacional de Interesse Social",
        resumo: "Cria programa de moradia popular em Niterói com 5 mil unidades.",
        fonte: "Câmara Municipal de Niterói",
        fonteUrl: "https://www.camaraniteroi.rj.gov.br/legislacao/lei-3612",
        autor: "Câmara Municipal de Niterói",
        conteudo: `<p>Construção de 5 mil unidades habitacionais populares até 2027.</p>`
    },
    {
        id: 18, numero: "3.550", tipo: "Decreto", cidade: "niteroi", categoria: "transporte", ano: 2023, data: "10/10/2023",
        titulo: "Sistema de Transporte Aquaviário",
        resumo: "Regulamenta o sistema de barcas e catraias entre Niterói e Rio.",
        fonte: "Diário Oficial de Niterói",
        fonteUrl: "https://www.niteroi.rj.gov.br/diariooficial",
        autor: "Secretaria Municipal de Transportes",
        conteudo: `<p>Modernização do sistema de transporte aquaviário entre Niterói e Rio de Janeiro.</p>`
    },

    // ============================================
    // SÃO GONÇALO
    // ============================================
    {
        id: 19, numero: "1.025", tipo: "Lei", cidade: "sao-goncalo", categoria: "educacao", ano: 2024, data: "12/03/2024",
        titulo: "Plano Municipal de Educação",
        resumo: "Plano decenal de educação do município de São Gonçalo.",
        fonte: "Câmara Municipal de São Gonçalo",
        fonteUrl: "https://www.cmsg.rj.gov.br/legislacao",
        autor: "Secretaria Municipal de Educação",
        conteudo: `<p>Plano Municipal de Educação 2024-2034 com metas de universalização do ensino.</p>`
    },
    {
        id: 20, numero: "1.040", tipo: "Lei", cidade: "sao-goncalo", categoria: "saude", ano: 2024, data: "08/05/2024",
        titulo: "Programa Saúde da Família Expandido",
        resumo: "Expansão do programa Saúde da Família em São Gonçalo.",
        fonte: "Câmara Municipal de São Gonçalo",
        fonteUrl: "https://www.cmsg.rj.gov.br/legislacao/lei-1040",
        autor: "Câmara Municipal",
        conteudo: `<p>Expansão das equipes de Saúde da Família para 100% de cobertura.</p>`
    },

    // ============================================
    // DUQUE DE CAXIAS
    // ============================================
    {
        id: 21, numero: "2.890", tipo: "Lei", cidade: "duque-caxias", categoria: "comercial", ano: 2024, data: "18/02/2024",
        titulo: "Polo Industrial de Caxias",
        resumo: "Cria incentivos para o polo industrial e logístico de Duque de Caxias.",
        fonte: "Câmara Municipal de Duque de Caxias",
        fonteUrl: "https://www.cmdc.rj.gov.br/legislacao",
        autor: "Prefeitura de Duque de Caxias",
        conteudo: `<p>Incentivos fiscais para empresas industriais e logísticas no município.</p>`
    },

    // ============================================
    // NOVA IGUAÇU
    // ============================================
    {
        id: 22, numero: "4.120", tipo: "Lei", cidade: "nova-iguacu", categoria: "saude", ano: 2024, data: "25/03/2024",
        titulo: "Hospital Municipal Modernizado",
        resumo: "Modernização e expansão do Hospital Municipal de Nova Iguaçu.",
        fonte: "Câmara Municipal de Nova Iguaçu",
        fonteUrl: "https://www.cmni.rj.gov.br/legislacao",
        autor: "Prefeitura de Nova Iguaçu",
        conteudo: `<p>Plano de modernização do Hospital Municipal com 200 novos leitos.</p>`
    },

    // ============================================
    // CAMPOS DOS GOYTACAZES
    // ============================================
    {
        id: 23, numero: "8.825", tipo: "Lei", cidade: "campos", categoria: "comercial", ano: 2024, data: "10/04/2024",
        titulo: "Programa de Desenvolvimento Petrolífero",
        resumo: "Desenvolvimento econômico baseado em royalties do petróleo.",
        fonte: "Câmara Municipal de Campos",
        fonteUrl: "https://www.camaracampos.rj.gov.br/legislacao",
        autor: "Prefeitura de Campos",
        conteudo: `<p>Aplicação dos royalties do petróleo em desenvolvimento econômico sustentável.</p>`
    },

    // ============================================
    // PETRÓPOLIS
    // ============================================
    {
        id: 24, numero: "8.220", tipo: "Lei", cidade: "petropolis", categoria: "turismo", ano: 2024, data: "05/05/2024",
        titulo: "Petrópolis Cidade Imperial",
        resumo: "Programa de preservação histórica e fomento ao turismo.",
        fonte: "Câmara Municipal de Petrópolis",
        fonteUrl: "https://www.cmp.rj.gov.br/legislacao",
        autor: "Câmara Municipal",
        conteudo: `<p>Programa de preservação do patrimônio histórico imperial e fomento turístico.</p>`
    },
    {
        id: 25, numero: "8.180", tipo: "Lei", cidade: "petropolis", categoria: "ambiental", ano: 2023, data: "15/11/2023",
        titulo: "Proteção da Mata Atlântica Petropolitana",
        resumo: "Proteção das áreas de Mata Atlântica em Petrópolis.",
        fonte: "Câmara Municipal de Petrópolis",
        fonteUrl: "https://www.cmp.rj.gov.br/legislacao/lei-8180",
        autor: "Secretaria de Meio Ambiente",
        conteudo: `<p>Proteção integral das áreas de Mata Atlântica no município.</p>`
    },

    // ============================================
    // VOLTA REDONDA
    // ============================================
    {
        id: 26, numero: "5.640", tipo: "Lei", cidade: "volta-redonda", categoria: "trabalhista", ano: 2024, data: "20/03/2024",
        titulo: "Programa de Qualificação Profissional",
        resumo: "Capacitação profissional para a indústria siderúrgica e tecnologia.",
        fonte: "Câmara Municipal de Volta Redonda",
        fonteUrl: "https://www.camaravr.rj.gov.br/legislacao",
        autor: "Prefeitura de Volta Redonda",
        conteudo: `<p>Capacitação profissional gratuita em parceria com CSN e SENAI.</p>`
    },

    // ============================================
    // MARICÁ
    // ============================================
    {
        id: 27, numero: "2.945", tipo: "Lei", cidade: "marica", categoria: "habitacao", ano: 2024, data: "08/06/2024",
        titulo: "Programa Casa Própria Maricá",
        resumo: "Renda Básica de Cidadania e programa habitacional em Maricá.",
        fonte: "Câmara Municipal de Maricá",
        fonteUrl: "https://www.cmm.rj.gov.br/legislacao",
        autor: "Prefeitura de Maricá",
        conteudo: `<p>Programa de moradia popular financiado pelos royalties do petróleo.</p>`
    },

    // ============================================
    // MACAÉ
    // ============================================
    {
        id: 28, numero: "4.560", tipo: "Lei", cidade: "macae", categoria: "comercial", ano: 2024, data: "12/05/2024",
        titulo: "Polo Tecnológico de Macaé",
        resumo: "Desenvolvimento de polo tecnológico ligado à indústria do petróleo.",
        fonte: "Câmara Municipal de Macaé",
        fonteUrl: "https://www.cmm.rj.gov.br/legislacao",
        autor: "Prefeitura de Macaé",
        conteudo: `<p>Criação de polo tecnológico com foco em inovação na indústria petrolífera.</p>`
    },

    // ============================================
    // CABO FRIO
    // ============================================
    {
        id: 29, numero: "3.020", tipo: "Lei", cidade: "cabo-frio", categoria: "turismo", ano: 2024, data: "15/01/2024",
        titulo: "Cabo Frio Destino Turístico",
        resumo: "Programa de desenvolvimento turístico para a Região dos Lagos.",
        fonte: "Câmara Municipal de Cabo Frio",
        fonteUrl: "https://www.cmcf.rj.gov.br/legislacao",
        autor: "Prefeitura de Cabo Frio",
        conteudo: `<p>Programa integrado de turismo para a Região dos Lagos fluminense.</p>`
    },

    // ============================================
    // NOVA FRIBURGO
    // ============================================
    {
        id: 30, numero: "4.890", tipo: "Lei", cidade: "nova-friburgo", categoria: "ambiental", ano: 2024, data: "22/04/2024",
        titulo: "Proteção das Serras Friburguenses",
        resumo: "Preservação das áreas montanhosas e prevenção de desastres.",
        fonte: "Câmara Municipal de Nova Friburgo",
        fonteUrl: "https://www.cmnf.rj.gov.br/legislacao",
        autor: "Câmara Municipal",
        conteudo: `<p>Sistema integrado de prevenção de desastres e preservação ambiental.</p>`
    },

    // ============================================
    // TERESÓPOLIS
    // ============================================
    {
        id: 31, numero: "3.120", tipo: "Lei", cidade: "teresopolis", categoria: "esporte", ano: 2024, data: "10/03/2024",
        titulo: "Teresópolis Capital do Esporte",
        resumo: "Incentivo a esportes de aventura e turismo esportivo.",
        fonte: "Câmara Municipal de Teresópolis",
        fonteUrl: "https://www.cmt.rj.gov.br/legislacao",
        autor: "Prefeitura de Teresópolis",
        conteudo: `<p>Programa de incentivo aos esportes de aventura na região serrana.</p>`
    },

    // ============================================
    // ANGRA DOS REIS
    // ============================================
    {
        id: 32, numero: "3.456", tipo: "Lei", cidade: "angra", categoria: "ambiental", ano: 2024, data: "18/05/2024",
        titulo: "Proteção da Costa Verde",
        resumo: "Proteção marinha e preservação das ilhas de Angra dos Reis.",
        fonte: "Câmara Municipal de Angra dos Reis",
        fonteUrl: "https://www.cmar.rj.gov.br/legislacao",
        autor: "Câmara Municipal",
        conteudo: `<p>Proteção integral da biodiversidade marinha da Costa Verde.</p>`
    },

    // ============================================
    // BELFORD ROXO
    // ============================================
    {
        id: 33, numero: "2.180", tipo: "Lei", cidade: "belford-roxo", categoria: "saude", ano: 2024, data: "20/02/2024",
        titulo: "Saúde Belford Roxo 2030",
        resumo: "Plano de expansão da rede municipal de saúde.",
        fonte: "Câmara Municipal de Belford Roxo",
        fonteUrl: "https://www.cmbr.rj.gov.br/legislacao",
        autor: "Prefeitura de Belford Roxo",
        conteudo: `<p>Plano municipal de expansão da rede de saúde até 2030.</p>`
    },

    // ============================================
    // ITABORAÍ
    // ============================================
    {
        id: 34, numero: "2.745", tipo: "Lei", cidade: "itaborai", categoria: "comercial", ano: 2024, data: "25/04/2024",
        titulo: "Comperj e Desenvolvimento Local",
        resumo: "Diretrizes para integração do Comperj com a economia local.",
        fonte: "Câmara Municipal de Itaboraí",
        fonteUrl: "https://www.cmi.rj.gov.br/legislacao",
        autor: "Câmara Municipal",
        conteudo: `<p>Integração do polo petroquímico com o desenvolvimento econômico local.</p>`
    },

    // ============================================
    // MAGÉ
    // ============================================
    {
        id: 35, numero: "1.890", tipo: "Lei", cidade: "mage", categoria: "ambiental", ano: 2024, data: "12/06/2024",
        titulo: "Proteção da Baía de Guanabara - Magé",
        resumo: "Despoluição e preservação da costa de Magé.",
        fonte: "Câmara Municipal de Magé",
        fonteUrl: "https://www.cmm.rj.gov.br/legislacao",
        autor: "Prefeitura de Magé",
        conteudo: `<p>Programa de despoluição e revitalização da costa magense.</p>`
    },

    // ============================================
    // RESENDE
    // ============================================
    {
        id: 36, numero: "3.890", tipo: "Lei", cidade: "resende", categoria: "comercial", ano: 2024, data: "08/03/2024",
        titulo: "Polo Automotivo de Resende",
        resumo: "Incentivos para o polo automotivo e indústria de defesa.",
        fonte: "Câmara Municipal de Resende",
        fonteUrl: "https://www.cmresende.rj.gov.br/legislacao",
        autor: "Câmara Municipal",
        conteudo: `<p>Programa de incentivos para indústria automotiva e de defesa.</p>`
    },

    // ============================================
    // BARRA MANSA
    // ============================================
    {
        id: 37, numero: "5.120", tipo: "Lei", cidade: "barra-mansa", categoria: "educacao", ano: 2024, data: "15/05/2024",
        titulo: "Educação Tecnológica Barra Mansa",
        resumo: "Implementação de educação técnica e profissionalizante.",
        fonte: "Câmara Municipal de Barra Mansa",
        fonteUrl: "https://www.cmbm.rj.gov.br/legislacao",
        autor: "Prefeitura de Barra Mansa",
        conteudo: `<p>Programa de educação técnica em parceria com indústrias locais.</p>`
    },

    // ============================================
    // MAIS LEIS ESTADUAIS RECENTES
    // ============================================
    {
        id: 38, numero: "9.250", tipo: "Lei", cidade: "estado", categoria: "civil", ano: 2024, data: "20/07/2024",
        titulo: "Lei de Proteção de Animais Estadual",
        resumo: "Proteção integral aos animais domésticos e silvestres no Estado.",
        fonte: "ALERJ - Lei nº 9.250/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9250",
        autor: "ALERJ",
        conteudo: `<p>Proteção integral aos direitos dos animais com penalidades para maus-tratos.</p>`
    },
    {
        id: 39, numero: "9.280", tipo: "Lei", cidade: "estado", categoria: "trabalhista", ano: 2024, data: "15/08/2024",
        titulo: "Programa Primeiro Emprego Jovem RJ",
        resumo: "Incentivos para contratação de jovens em primeiro emprego.",
        fonte: "ALERJ - Lei nº 9.280/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9280",
        autor: "ALERJ",
        conteudo: `<p>Programa de subsídio para empresas que contratarem jovens em primeiro emprego.</p>`
    },
    {
        id: 40, numero: "9.310", tipo: "Lei", cidade: "estado", categoria: "tributaria", ano: 2024, data: "10/09/2024",
        titulo: "Refinanciamento de Dívidas Tributárias",
        resumo: "Programa de refinanciamento de débitos tributários estaduais.",
        fonte: "ALERJ - Lei nº 9.310/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Visualizar/Lei/9310",
        autor: "Secretaria de Fazenda",
        conteudo: `<p>REFIS estadual com desconto de até 90% em multas e juros.</p>`
    }
];

module.exports = {
    CIDADES_RJ,
    CATEGORIAS,
    LEIS_RJ
};
