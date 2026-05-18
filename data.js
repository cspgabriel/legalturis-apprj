// ============================================
// LegiRJ - Base de Dados de Leis e Decretos
// ============================================
// Fontes Oficiais:
// - ALERJ: https://www.alerj.rj.gov.br
// - Diário Oficial do Estado do RJ: https://www.ioerj.com.br
// - Câmara Municipal do Rio: https://www.camara.rio
// - Prefeituras Municipais
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
    { id: "mage", nome: "Magé", fonte: "Câmara Municipal de Magé", icone: "🏘️", url: "https://www.cmmage.rj.gov.br" },
    { id: "itaborai", nome: "Itaboraí", fonte: "Câmara Municipal de Itaboraí", icone: "🏘️", url: "https://www.cmitaborai.rj.gov.br" },
    { id: "marica", nome: "Maricá", fonte: "Câmara Municipal de Maricá", icone: "🏖️", url: "https://www.cmmarica.rj.gov.br" },
    { id: "macae", nome: "Macaé", fonte: "Câmara Municipal de Macaé", icone: "🛢️", url: "https://www.cmmacae.rj.gov.br" },
    { id: "cabo-frio", nome: "Cabo Frio", fonte: "Câmara Municipal de Cabo Frio", icone: "🏖️", url: "https://www.cmcf.rj.gov.br" },
    { id: "nova-friburgo", nome: "Nova Friburgo", fonte: "Câmara Municipal de Nova Friburgo", icone: "🏔️", url: "https://www.cmnf.rj.gov.br" },
    { id: "teresopolis", nome: "Teresópolis", fonte: "Câmara Municipal de Teresópolis", icone: "🏔️", url: "https://www.cmteresopolis.rj.gov.br" },
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
    {
        id: 1, numero: "9.064", tipo: "Lei", cidade: "estado", categoria: "tributaria", ano: 2024, data: "15/01/2024",
        titulo: "Programa Estadual de Microcrédito Produtivo Orientado",
        resumo: "Institui o Programa Estadual de Microcrédito Produtivo Orientado, voltado à concessão de crédito a microempreendedores, autônomos e pequenas empresas no Estado do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 9.064/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Poder Executivo Estadual",
        conteudo: `<p>A Lei nº 9.064/2024 institui o Programa Estadual de Microcrédito Produtivo Orientado (PEMPO-RJ), com o objetivo de fomentar o desenvolvimento econômico e social do Estado do Rio de Janeiro por meio da concessão de crédito a empreendedores formais e informais de baixa renda. O programa é coordenado pela AGERIO (Agência de Fomento do Estado do Rio de Janeiro) e prevê parcerias com instituições financeiras públicas e privadas.</p>
        <p>Entre as principais características destacam-se: taxas de juros subsidiadas, prazos flexíveis de pagamento, garantia parcial via fundo estadual, acompanhamento técnico do empreendedor e capacitação em gestão financeira. O valor máximo do crédito é de R$ 21.000,00 por operação, podendo ser renovado conforme o desempenho do tomador. A lei também prevê incentivos especiais para mulheres empreendedoras, jovens e empresas localizadas em áreas de menor IDH.</p>`
    },
    {
        id: 2, numero: "9.130", tipo: "Lei", cidade: "estado", categoria: "ambiental", ano: 2024, data: "10/06/2024",
        titulo: "Política Estadual sobre Mudança do Clima e Desenvolvimento Sustentável",
        resumo: "Institui a Política Estadual sobre Mudança do Clima e Desenvolvimento Sustentável do Estado do Rio de Janeiro, estabelecendo metas de redução de emissões de gases de efeito estufa.",
        fonte: "ALERJ - Lei nº 9.130/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Meio Ambiente da ALERJ",
        conteudo: `<p>A Lei nº 9.130/2024 estabelece a Política Estadual sobre Mudança do Clima do Rio de Janeiro, alinhada ao Acordo de Paris e à Lei Federal nº 12.187/2009. O texto define metas obrigatórias de redução de emissões de gases de efeito estufa (GEE) em pelo menos 30% até 2030 (comparado a 2005) e neutralidade de carbono até 2050. A coordenação é exercida pela Secretaria de Estado do Ambiente e Sustentabilidade (SEAS).</p>
        <p>A lei cria instrumentos como o Inventário Estadual de Emissões, o Plano Estadual de Mitigação e Adaptação Climática, o Fundo Estadual de Mudanças Climáticas (FUNDCLIMA-RJ) e o mercado regulado de créditos de carbono. Além disso, prevê obrigações específicas para grandes emissores, incentivos fiscais para energias renováveis (solar, eólica, biomassa), exigência de relatórios anuais de sustentabilidade e mecanismos de transparência. Os municípios devem elaborar seus próprios planos locais de ação climática até 2027.</p>`
    },
    {
        id: 3, numero: "9.045", tipo: "Lei", cidade: "estado", categoria: "administrativa", ano: 2024, data: "20/02/2024",
        titulo: "Lei de Incentivo à Inovação Tecnológica do Estado do Rio de Janeiro",
        resumo: "Estabelece incentivos fiscais e marco regulatório para empresas de tecnologia, startups e pesquisa científica no Estado do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 9.045/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Ciência e Tecnologia da ALERJ",
        conteudo: `<p>A Lei nº 9.045/2024 institui o Marco Estadual de Inovação Tecnológica do Rio de Janeiro, regulamentando incentivos para empresas de base tecnológica, startups, ICTs (Instituições Científicas e Tecnológicas) e centros de pesquisa. A lei oferece redução de até 50% no ICMS para empresas certificadas como de inovação, isenção de IPVA para veículos elétricos utilizados em pesquisa e desconto progressivo no ITBI para imóveis adquiridos por parques tecnológicos.</p>
        <p>O texto também cria o Sistema Estadual de Inovação (SEI-RJ), que articula universidades, empresas e governo. Estabelece regras para encomendas tecnológicas, contratos públicos de inovação, bolsas para pesquisadores e ambientes regulatórios experimentais (sandboxes). Há linha de financiamento específica via FAPERJ (Fundação de Amparo à Pesquisa do RJ) para projetos inovadores em áreas estratégicas como biotecnologia, energia limpa, indústria 4.0 e economia criativa.</p>`
    },
    {
        id: 4, numero: "8.890", tipo: "Lei", cidade: "estado", categoria: "administrativa", ano: 2023, data: "05/08/2023",
        titulo: "Normas de Funcionamento dos Espaços Públicos Estaduais",
        resumo: "Disciplina o uso e funcionamento de praças, parques, áreas de lazer e espaços públicos sob administração do Estado do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 8.890/2023",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Administração Pública da ALERJ",
        conteudo: `<p>A Lei nº 8.890/2023 estabelece normas gerais para o uso, conservação e fiscalização dos espaços públicos administrados pelo Estado do Rio de Janeiro, incluindo parques estaduais, praças, áreas de lazer, monumentos históricos e espaços de convivência. A lei define horários de funcionamento, atividades permitidas e proibidas, regras para eventos, comércio ambulante e uso comercial dos espaços.</p>
        <p>A fiscalização é exercida pela Secretaria de Estado de Polícia Civil e órgãos ambientais, com aplicação de multas que variam de R$ 200 a R$ 50.000 conforme a gravidade da infração. A lei também regulamenta a realização de manifestações culturais, religiosas e esportivas, exigindo autorização prévia para eventos com mais de 100 pessoas. Estabelece responsabilidades dos organizadores quanto à limpeza, segurança e ressarcimento de danos ao patrimônio público.</p>`
    },
    {
        id: 5, numero: "9.102", tipo: "Lei", cidade: "estado", categoria: "saude", ano: 2024, data: "01/03/2024",
        titulo: "Código de Saúde Pública do Estado do Rio de Janeiro",
        resumo: "Atualiza e consolida o Código de Saúde Pública Estadual, definindo direitos dos usuários do SUS e organização da rede de atenção à saúde no RJ.",
        fonte: "ALERJ - Lei nº 9.102/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Secretaria Estadual de Saúde",
        conteudo: `<p>A Lei nº 9.102/2024 atualiza o Código de Saúde Pública do Estado do Rio de Janeiro, consolidando legislações anteriores e modernizando a regulação do Sistema Único de Saúde (SUS) no âmbito estadual. O código define direitos dos usuários como atendimento humanizado, acesso a medicamentos da lista RENAME, prazos máximos para consultas especializadas e cirurgias eletivas, e direito à segunda opinião médica.</p>
        <p>A lei organiza a Rede de Atenção à Saúde em níveis (primária, secundária e terciária), estabelece protocolos para emergências, regulamenta o transporte sanitário inter-hospitalar e cria o Ouvidor Geral do SUS-RJ. Também prevê programas de saúde mental, atenção à pessoa idosa, saúde da mulher, da criança e do adolescente, além de campanhas obrigatórias de vacinação. Define a Vigilância Sanitária Estadual e suas competências para fiscalizar estabelecimentos, alimentos e medicamentos.</p>`
    },
    {
        id: 6, numero: "8.765", tipo: "Lei", cidade: "estado", categoria: "urbanismo", ano: 2023, data: "12/07/2023",
        titulo: "Diretrizes de Política Urbana e Desenvolvimento Regional",
        resumo: "Estabelece as diretrizes para o desenvolvimento urbano sustentável e regional integrado do Estado do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 8.765/2023",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Assuntos Municipais da ALERJ",
        conteudo: `<p>A Lei nº 8.765/2023 estabelece as diretrizes gerais da política urbana do Estado do Rio de Janeiro, em consonância com o Estatuto da Cidade (Lei Federal nº 10.257/2001) e o Plano Diretor Estadual. Define princípios como função social da propriedade urbana, gestão democrática das cidades, ordenação do uso do solo, justiça social e direito à cidade. A lei orienta o planejamento integrado dos 92 municípios fluminenses.</p>
        <p>São criados instrumentos como o Sistema Estadual de Informações Urbanas, o Programa Estadual de Regularização Fundiária, o Fundo Estadual de Desenvolvimento Urbano e as Regiões Metropolitanas Integradas. A lei também estabelece padrões mínimos de mobilidade urbana, saneamento básico, habitação de interesse social e equipamentos públicos. Determina que municípios com mais de 50 mil habitantes elaborem ou atualizem seus planos diretores em até 24 meses.</p>`
    },
    {
        id: 7, numero: "9.200", tipo: "Lei", cidade: "estado", categoria: "transporte", ano: 2024, data: "15/05/2024",
        titulo: "Gratuidade no Transporte Público para Pessoas Idosas",
        resumo: "Regulamenta a gratuidade no transporte coletivo intermunicipal do Estado do Rio de Janeiro para pessoas com 60 anos ou mais.",
        fonte: "ALERJ - Lei nº 9.200/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão do Idoso e Defesa dos Direitos Humanos",
        conteudo: `<p>A Lei nº 9.200/2024 regulamenta a gratuidade no transporte coletivo intermunicipal de passageiros sob concessão estadual para pessoas com 60 anos ou mais, em cumprimento ao Estatuto do Idoso (Lei Federal nº 10.741/2003). A gratuidade abrange ônibus, trens, barcas e VLT operados pelas concessionárias estaduais, incluindo as linhas SuperVia, CCR Barcas e empresas do consórcio intermunicipal.</p>
        <p>Para usufruir do benefício, o idoso deve apresentar documento oficial com foto. A lei prevê reserva de 10% dos assentos para idosos e pessoas com deficiência. Estabelece também sanções para empresas que descumprirem a determinação: multas de R$ 5.000 a R$ 50.000, podendo chegar à cassação da concessão em casos recorrentes. A fiscalização é exercida pela DETRO-RJ (Departamento de Transportes Rodoviários) e pelo Procon Estadual, com canais de denúncia 24h.</p>`
    },
    {
        id: 8, numero: "9.180", tipo: "Lei", cidade: "estado", categoria: "seguranca", ano: 2024, data: "08/04/2024",
        titulo: "Programa Estadual de Segurança Pública Integrada",
        resumo: "Cria o Programa Estadual de Segurança Pública Integrada, articulando ações entre Polícia Militar, Polícia Civil, Corpo de Bombeiros e Guarda Municipal.",
        fonte: "ALERJ - Lei nº 9.180/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Segurança Pública da ALERJ",
        conteudo: `<p>A Lei nº 9.180/2024 institui o Programa Estadual de Segurança Pública Integrada (PESPI-RJ), com o objetivo de promover a atuação coordenada entre as diversas forças de segurança do Estado do Rio de Janeiro. O programa integra Polícia Militar, Polícia Civil, Polícia Penal, Corpo de Bombeiros Militar, Defesa Civil e Guardas Municipais, sob coordenação da Secretaria de Estado de Polícia Civil.</p>
        <p>Entre os instrumentos previstos estão: criação do Centro Integrado de Operações de Segurança Pública (CIOSP), padronização de procedimentos operacionais, compartilhamento de bancos de dados e inteligência, planos integrados em grandes eventos, capacitação conjunta e protocolos para gestão de crises. A lei também prevê programas de prevenção como o "Bairro Seguro", policiamento comunitário, monitoramento por câmeras com IA e estímulo à participação social via Conselhos de Segurança.</p>`
    },
    {
        id: 9, numero: "9.220", tipo: "Lei", cidade: "estado", categoria: "educacao", ano: 2024, data: "20/06/2024",
        titulo: "Plano Estadual de Educação Tecnológica",
        resumo: "Institui o Plano Estadual de Educação Tecnológica, prevendo expansão do ensino técnico e tecnológico nas escolas estaduais do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 9.220/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Secretaria Estadual de Educação",
        conteudo: `<p>A Lei nº 9.220/2024 institui o Plano Estadual de Educação Tecnológica (PEET-RJ), com vigência decenal (2024-2034), visando expandir significativamente a oferta de ensino técnico e tecnológico nas escolas estaduais. O plano estabelece metas de criação de 50.000 novas vagas em cursos técnicos integrados ao ensino médio até 2030, com foco em áreas estratégicas como tecnologia da informação, energias renováveis, logística, saúde e indústria 4.0.</p>
        <p>O texto prevê parcerias com SENAI, SENAC, IFRJ, CEFET e empresas privadas para oferta de cursos, estágios e residências profissionais. Estabelece também o Programa de Formação de Professores de Educação Profissional, modernização dos laboratórios das escolas técnicas, criação de itinerários formativos integrados e certificações intermediárias. A lei garante orçamento mínimo de 2% da receita corrente do Estado destinado especificamente à educação profissional.</p>`
    },
    {
        id: 10, numero: "8.950", tipo: "Lei", cidade: "estado", categoria: "tributaria", ano: 2023, data: "10/11/2023",
        titulo: "Regulamento do ICMS - Operações Internas e Interestaduais",
        resumo: "Atualiza o Regulamento do ICMS no Estado do Rio de Janeiro, definindo alíquotas, isenções e regimes especiais de tributação.",
        fonte: "ALERJ - Lei nº 8.950/2023",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Secretaria de Estado de Fazenda",
        conteudo: `<p>A Lei nº 8.950/2023 atualiza o Regulamento do Imposto sobre Operações relativas à Circulação de Mercadorias e sobre Prestações de Serviços de Transporte Interestadual e Intermunicipal e de Comunicação (ICMS) no Estado do Rio de Janeiro. Define alíquotas internas que variam de 7% (cesta básica) a 35% (combustíveis e bebidas alcoólicas), com alíquota geral de 20% para a maioria dos produtos e serviços.</p>
        <p>A lei consolida regras sobre substituição tributária, regimes especiais (Simples Nacional, RECOPI, ZPE), benefícios fiscais para setores estratégicos, créditos tributários e regime de apuração. Prevê isenções para produtos da agricultura familiar, medicamentos da lista do SUS, livros, jornais e periódicos. Também atualiza obrigações acessórias (NF-e, SPED, EFD) e estabelece o Programa de Conformidade Tributária (Nos Conformes-RJ), que oferece benefícios a contribuintes em situação regular.</p>`
    },
    {
        id: 11, numero: "270", tipo: "Lei Complementar", cidade: "rio", categoria: "urbanismo", ano: 2024, data: "10/02/2024",
        titulo: "Plano Diretor de Desenvolvimento Urbano Sustentável da Cidade do Rio de Janeiro",
        resumo: "Atualiza o Plano Diretor da Cidade do Rio de Janeiro, estabelecendo as diretrizes de uso e ocupação do solo urbano para os próximos dez anos.",
        fonte: "Câmara Municipal do Rio - Lei Complementar nº 270/2024",
        fonteUrl: "https://www.camara.rio/atividade-legislativa/legislacao",
        autor: "Prefeitura Municipal do Rio de Janeiro",
        conteudo: `<p>A Lei Complementar nº 270/2024 atualiza o Plano Diretor de Desenvolvimento Urbano Sustentável da Cidade do Rio de Janeiro, instrumento básico da política de desenvolvimento e expansão urbana. Define as diretrizes para uso, ocupação e parcelamento do solo nas 33 Regiões Administrativas, ordenando o crescimento da cidade conforme princípios de sustentabilidade, mobilidade urbana e habitação social.</p>
        <p>O plano divide a cidade em macrozonas (de ocupação assistida, de ocupação incentivada, de uso sustentável e de proteção integral) e define os Coeficientes de Aproveitamento (CA) máximos para cada zona. Cria também instrumentos como Outorga Onerosa do Direito de Construir, Transferência do Direito de Construir, Operações Urbanas Consorciadas, Estudo de Impacto de Vizinhança (EIV) e ZEIS (Zonas Especiais de Interesse Social). Estabelece metas de regularização fundiária, expansão da rede de transporte público e criação de áreas verdes.</p>`
    },
    {
        id: 12, numero: "7.508", tipo: "Lei", cidade: "rio", categoria: "ambiental", ano: 2024, data: "22/03/2024",
        titulo: "Programa Rio Mais Verde - Política Ambiental Municipal",
        resumo: "Institui o Programa Rio Mais Verde, com diretrizes para arborização urbana, gestão de resíduos, qualidade do ar e proteção de áreas verdes da cidade do Rio de Janeiro.",
        fonte: "Câmara Municipal do Rio - Lei nº 7.508/2024",
        fonteUrl: "https://www.camara.rio/atividade-legislativa/legislacao",
        autor: "Secretaria Municipal de Meio Ambiente e Clima",
        conteudo: `<p>A Lei nº 7.508/2024 cria o Programa Rio Mais Verde, consolidando a política ambiental do município do Rio de Janeiro. O programa estabelece a meta de plantio de 100 mil novas árvores até 2030, prioritariamente em bairros com menor cobertura arbórea, e prevê a recuperação de 500 hectares de áreas degradadas, com foco nas Reservas Biológicas Municipais e no Maciço da Tijuca.</p>
        <p>A lei regulamenta também a coleta seletiva obrigatória em todos os bairros, define metas progressivas de reciclagem (atingindo 30% dos resíduos até 2030), institui o Programa Lixo Zero, regula o descarte de eletrônicos e óleo de cozinha, e estabelece multas para descarte irregular. Cria a Rede de Monitoramento da Qualidade do Ar e o Plano Municipal de Adaptação Climática, com ações de prevenção a enchentes, deslizamentos e ilhas de calor urbano.</p>`
    },
    {
        id: 13, numero: "7.380", tipo: "Lei", cidade: "rio", categoria: "transporte", ano: 2023, data: "05/09/2023",
        titulo: "Plano de Mobilidade Urbana Sustentável da Cidade do Rio de Janeiro",
        resumo: "Estabelece o Plano de Mobilidade Urbana Sustentável (PMUS) da Cidade do Rio de Janeiro, priorizando transporte público, ciclovias e mobilidade ativa.",
        fonte: "Câmara Municipal do Rio - Lei nº 7.380/2023",
        fonteUrl: "https://www.camara.rio/atividade-legislativa/legislacao",
        autor: "Secretaria Municipal de Transportes",
        conteudo: `<p>A Lei nº 7.380/2023 institui o Plano de Mobilidade Urbana Sustentável (PMUS) da Cidade do Rio de Janeiro, em conformidade com a Lei Federal nº 12.587/2012. O plano prioriza o transporte coletivo, a mobilidade ativa (pedestres e ciclistas) e modos não motorizados, com diretrizes para os próximos 10 anos.</p>
        <p>Entre as metas estão: ampliação da malha cicloviária para 500 km até 2030, integração tarifária entre BRT, metrô, trem, barcas e VLT, redução de 30% nas emissões do transporte público pela frota elétrica, expansão das faixas exclusivas de ônibus e criação de Zonas de Tráfego Calmo em centros de bairro. A lei também regulamenta serviços de transporte por aplicativo, mototáxis e bicicletas compartilhadas, prevendo padrões mínimos de segurança e benefícios para operadores que utilizem veículos elétricos.</p>`
    },
    {
        id: 14, numero: "7.412", tipo: "Lei", cidade: "rio", categoria: "cultura", ano: 2023, data: "18/12/2023",
        titulo: "Lei de Fomento e Incentivo à Cultura Carioca",
        resumo: "Cria mecanismos de fomento, financiamento e proteção à produção cultural na cidade do Rio de Janeiro, incluindo o Fundo Municipal de Cultura.",
        fonte: "Câmara Municipal do Rio - Lei nº 7.412/2023",
        fonteUrl: "https://www.camara.rio/atividade-legislativa/legislacao",
        autor: "Secretaria Municipal de Cultura",
        conteudo: `<p>A Lei nº 7.412/2023 institui a Política Municipal de Cultura da Cidade do Rio de Janeiro, criando mecanismos de fomento e financiamento à produção cultural carioca. Cria o Fundo Municipal de Cultura (FUMCULT-RJ), com aporte mínimo anual de 1% da receita corrente do município, e estabelece editais públicos de seleção para projetos nas áreas de música, teatro, dança, audiovisual, literatura, artes visuais e patrimônio.</p>
        <p>A lei também moderniza o ISS-Cultura, permitindo que empresas direcionem até 3% do imposto devido a projetos culturais aprovados (modelo Lei Rouanet municipal). Prevê programas de difusão cultural em comunidades, apoio a equipamentos culturais (teatros, museus, bibliotecas), proteção ao patrimônio imaterial (samba, choro, capoeira, blocos de carnaval) e estímulo à economia criativa. Estabelece o Sistema Municipal de Informações Culturais e o Conselho Municipal de Política Cultural, com participação paritária da sociedade civil.</p>`
    },
    {
        id: 15, numero: "7.490", tipo: "Lei", cidade: "rio", categoria: "turismo", ano: 2024, data: "01/06/2024",
        titulo: "Programa Rio Cidade Turística - Promoção e Desenvolvimento do Turismo",
        resumo: "Estabelece o Programa Rio Cidade Turística, com diretrizes para promoção do turismo, qualificação profissional e infraestrutura turística no município.",
        fonte: "Câmara Municipal do Rio - Lei nº 7.490/2024",
        fonteUrl: "https://www.camara.rio/atividade-legislativa/legislacao",
        autor: "Secretaria Municipal de Turismo",
        conteudo: `<p>A Lei nº 7.490/2024 institui o Programa Rio Cidade Turística, política municipal de desenvolvimento do turismo na cidade do Rio de Janeiro. O programa estabelece metas de aumentar em 50% o número de turistas internacionais até 2030 e gerar 100 mil novos empregos diretos e indiretos no setor.</p>
        <p>São criados instrumentos como o Fundo Municipal de Turismo, o Cartão Rio Welcome (com descontos em atrações), o Plano de Sinalização Turística Multilíngue, programas de qualificação para guias e profissionais do setor, e o Selo Rio Sustentável para empreendimentos que adotam práticas ambientais responsáveis. A lei também prevê incentivos fiscais (redução de ISS) para hotéis e atrações que invistam em acessibilidade, segurança e modernização, além de regulamentar a hospedagem por aplicativo (Airbnb) com cadastro municipal obrigatório.</p>`
    },
    {
        id: 16, numero: "3.589", tipo: "Lei", cidade: "niteroi", categoria: "ambiental", ano: 2024, data: "15/04/2024",
        titulo: "Programa Niterói Sustentável - Política Ambiental Municipal",
        resumo: "Institui o Programa Niterói Sustentável, com ações de preservação ambiental, gestão de resíduos e desenvolvimento sustentável no município.",
        fonte: "Câmara Municipal de Niterói - Lei nº 3.589/2024",
        fonteUrl: "https://www.camaraniteroi.rj.gov.br/legislacao",
        autor: "Secretaria Municipal de Meio Ambiente, Recursos Hídricos e Sustentabilidade",
        conteudo: `<p>A Lei nº 3.589/2024 institui o Programa Niterói Sustentável, política municipal integrada de meio ambiente que consolida ações de preservação, recuperação ambiental e desenvolvimento sustentável. O programa estabelece metas para 2030: 50% dos resíduos reciclados, 30% da frota municipal eletrificada, plantio de 50 mil árvores e proteção integral das Áreas de Proteção Ambiental (APA) municipais.</p>
        <p>A lei regulamenta a coleta seletiva obrigatória em todos os bairros, cria o Programa Niterói Limpa, estabelece o Conselho Municipal de Meio Ambiente, e prevê instrumentos econômicos como o IPTU Verde (desconto para imóveis sustentáveis) e o Pagamento por Serviços Ambientais (PSA). Define áreas de proteção ambiental, regulamenta a Mata Atlântica municipal e estabelece o Plano Municipal de Adaptação Climática, com ênfase em proteção contra enchentes e ressacas.</p>`
    },
    {
        id: 17, numero: "3.612", tipo: "Lei", cidade: "niteroi", categoria: "habitacao", ano: 2024, data: "20/05/2024",
        titulo: "Programa Habitacional de Interesse Social - Niterói Habita",
        resumo: "Cria o Programa Niterói Habita, oferecendo subsídios e linhas de financiamento para famílias de baixa renda adquirirem moradia digna no município.",
        fonte: "Câmara Municipal de Niterói - Lei nº 3.612/2024",
        fonteUrl: "https://www.camaraniteroi.rj.gov.br/legislacao",
        autor: "Secretaria Municipal de Habitação e Regularização Fundiária",
        conteudo: `<p>A Lei nº 3.612/2024 institui o Programa Niterói Habita, política municipal de habitação de interesse social com a meta de produzir 5 mil unidades habitacionais em cinco anos. O programa atende famílias com renda de até 3 salários mínimos, com subsídios que podem chegar a 80% do valor do imóvel, dependendo da renda familiar e composição.</p>
        <p>A lei prevê parcerias com Caixa Econômica Federal, programa Minha Casa Minha Vida e construtoras privadas. Inclui também ações de regularização fundiária em favelas e loteamentos irregulares (Reurb), urbanização de comunidades, melhorias habitacionais (kit-reforma), aluguel social para famílias em situação de vulnerabilidade e acolhimento para situações de calamidade. Cria o Conselho Municipal de Habitação com participação social paritária e o Fundo Municipal de Habitação de Interesse Social (FMHIS-Niterói).</p>`
    },
    {
        id: 18, numero: "3.550", tipo: "Decreto", cidade: "niteroi", categoria: "transporte", ano: 2023, data: "10/10/2023",
        titulo: "Sistema Municipal de Transporte Aquaviário",
        resumo: "Regulamenta o transporte aquaviário municipal de Niterói, incluindo travessias entre os bairros oceânicos e da Região Metropolitana.",
        fonte: "Prefeitura Municipal de Niterói - Decreto nº 3.550/2023",
        fonteUrl: "https://www.niteroi.rj.gov.br/transparencia/legislacao/",
        autor: "Secretaria Municipal de Mobilidade Urbana",
        conteudo: `<p>O Decreto nº 3.550/2023 regulamenta o Sistema Municipal de Transporte Aquaviário de Niterói, integrando barcas e catamarãs municipais com as travessias intermunicipais existentes. O sistema atende rotas como Charitas-Centro, Praça XV-Centro Niterói e novas linhas para Itaipu, Itacoatiara e São Francisco.</p>
        <p>A regulamentação estabelece padrões de segurança, frequência mínima de viagens (a cada 30 minutos em horário de pico), tarifa social integrada com ônibus municipais e Metrô do Rio, gratuidade para idosos e PCDs, e acessibilidade obrigatória. Cria também o programa "Mar Carioca-Fluminense", integrando turismo e transporte com paradas em pontos turísticos, e a obrigatoriedade de embarcações com emissões controladas até 2028.</p>`
    },
    {
        id: 19, numero: "1.025", tipo: "Lei", cidade: "sao-goncalo", categoria: "educacao", ano: 2024, data: "12/03/2024",
        titulo: "Plano Municipal de Educação 2024-2034",
        resumo: "Aprova o Plano Municipal de Educação de São Gonçalo para o decênio 2024-2034, com metas para todos os níveis de ensino.",
        fonte: "Câmara Municipal de São Gonçalo - Lei nº 1.025/2024",
        fonteUrl: "https://www.saogoncalo.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Educação",
        conteudo: `<p>A Lei nº 1.025/2024 aprova o Plano Municipal de Educação (PME) de São Gonçalo para o decênio 2024-2034, em consonância com o Plano Nacional de Educação (PNE). O documento estabelece 20 metas estratégicas, incluindo universalização da educação infantil (creches e pré-escolas) para crianças de 0 a 5 anos até 2026, alfabetização de todas as crianças até o 2º ano do ensino fundamental, e ampliação do ensino em tempo integral.</p>
        <p>O plano prevê investimentos crescentes na educação, atingindo a meta constitucional de aplicação mínima de 25% da receita municipal. Inclui ações para valorização dos profissionais da educação (piso salarial, plano de carreira, formação continuada), modernização das escolas (laboratórios, bibliotecas, conectividade), inclusão de pessoas com deficiência (salas de recursos multifuncionais) e combate ao analfabetismo de jovens e adultos via EJA.</p>`
    },
    {
        id: 20, numero: "1.040", tipo: "Lei", cidade: "sao-goncalo", categoria: "saude", ano: 2024, data: "08/04/2024",
        titulo: "Programa Saúde da Família Expandido - São Gonçalo Saudável",
        resumo: "Expande a cobertura da Estratégia Saúde da Família em São Gonçalo, com criação de novas unidades e ampliação do atendimento.",
        fonte: "Câmara Municipal de São Gonçalo - Lei nº 1.040/2024",
        fonteUrl: "https://www.saogoncalo.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Saúde",
        conteudo: `<p>A Lei nº 1.040/2024 institui o Programa São Gonçalo Saudável, expandindo a Estratégia Saúde da Família (ESF) no município. A meta é ampliar a cobertura de 60% para 95% da população até 2027, com a criação de 30 novas Unidades Básicas de Saúde (UBS) e contratação de mais 200 Agentes Comunitários de Saúde.</p>
        <p>O programa também implementa o atendimento odontológico em todas as ESFs, ampliação dos NASF (Núcleos de Apoio à Saúde da Família) com nutricionistas, psicólogos e fisioterapeutas, programa de saúde mental comunitária, ações de prevenção e controle de doenças crônicas (hipertensão, diabetes) e atenção integral à saúde da mulher, criança, adolescente e idoso. Prevê integração com o SUS Estadual e Federal e telemedicina para áreas mais distantes.</p>`
    },
    {
        id: 21, numero: "2.890", tipo: "Lei", cidade: "duque-caxias", categoria: "comercial", ano: 2024, data: "20/06/2024",
        titulo: "Programa de Desenvolvimento do Polo Industrial de Duque de Caxias",
        resumo: "Estabelece incentivos fiscais e infraestrutura para empresas que se instalarem no Polo Industrial de Duque de Caxias.",
        fonte: "Câmara Municipal de Duque de Caxias - Lei nº 2.890/2024",
        fonteUrl: "https://www.duquedecaxias.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Desenvolvimento Econômico",
        conteudo: `<p>A Lei nº 2.890/2024 institui o Programa de Desenvolvimento do Polo Industrial de Duque de Caxias, oferecendo benefícios fiscais e logísticos para atrair investimentos ao município. Concede isenção de até 100% no ISS pelo prazo de 10 anos, redução do ITBI na aquisição de imóveis industriais e descontos progressivos no IPTU para empresas que gerem mais de 50 empregos diretos.</p>
        <p>O programa também prevê doação de terrenos públicos para implantação de novas indústrias, criação do Distrito Industrial Sustentável (com infraestrutura de saneamento, energia e logística), parcerias com SENAI e universidades para qualificação da mão de obra local, e priorização da contratação de moradores do município. A meta é gerar 20 mil empregos diretos até 2030, fortalecendo a vocação petroquímica, logística e siderúrgica de Caxias.</p>`
    },
    {
        id: 22, numero: "4.120", tipo: "Lei", cidade: "nova-iguacu", categoria: "saude", ano: 2024, data: "10/05/2024",
        titulo: "Modernização do Hospital Municipal e Rede de Saúde",
        resumo: "Autoriza investimentos para modernização do Hospital Municipal e ampliação da rede de saúde de Nova Iguaçu.",
        fonte: "Câmara Municipal de Nova Iguaçu - Lei nº 4.120/2024",
        fonteUrl: "https://www.novaiguacu.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Saúde",
        conteudo: `<p>A Lei nº 4.120/2024 autoriza investimento de R$ 150 milhões para modernização do Hospital Municipal e ampliação da rede municipal de saúde de Nova Iguaçu. O recurso será aplicado em obras de reforma e expansão do hospital, aquisição de equipamentos de alta complexidade (tomógrafo, ressonância magnética, hemodinâmica) e contratação de profissionais especializados.</p>
        <p>A lei também prevê a construção de três novas Unidades de Pronto Atendimento (UPAs), modernização das 60 UBS municipais com informatização integrada, criação do Centro de Especialidades Médicas e ampliação da Rede de Atenção Psicossocial (RAPS) com novos CAPS. Estabelece convênios com hospitais filantrópicos e universitários para garantir atendimento de alta complexidade aos cidadãos iguaçuanos.</p>`
    },
    {
        id: 23, numero: "8.825", tipo: "Lei", cidade: "campos", categoria: "comercial", ano: 2023, data: "15/11/2023",
        titulo: "Programa de Desenvolvimento da Cadeia Produtiva do Petróleo",
        resumo: "Estabelece incentivos para empresas da cadeia produtiva do petróleo e gás natural se instalarem em Campos dos Goytacazes.",
        fonte: "Câmara Municipal de Campos - Lei nº 8.825/2023",
        fonteUrl: "https://www.campos.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Desenvolvimento Econômico",
        conteudo: `<p>A Lei nº 8.825/2023 institui o Programa de Desenvolvimento da Cadeia Produtiva do Petróleo e Gás Natural em Campos dos Goytacazes, principal município produtor de petróleo do Brasil. O programa oferece incentivos fiscais e logísticos para empresas fornecedoras de bens e serviços para a indústria petrolífera (Bacia de Campos e Pré-Sal).</p>
        <p>São concedidos benefícios como isenção parcial ou total do ISS, descontos no ITBI, doação de terrenos no Polo Industrial e linhas de financiamento via Banco do Nordeste e BNDES. A lei também cria o Centro Tecnológico de Petróleo e Gás, em parceria com universidades, e o Programa de Qualificação Profissional para o setor. Prevê também investimentos para diversificar a economia local com energias renováveis, agroindústria e turismo, reduzindo a dependência exclusiva do petróleo.</p>`
    },
    {
        id: 24, numero: "8.220", tipo: "Lei", cidade: "petropolis", categoria: "turismo", ano: 2023, data: "18/08/2023",
        titulo: "Política Municipal de Turismo - Petrópolis Cidade Imperial",
        resumo: "Estabelece a política de desenvolvimento turístico de Petrópolis, valorizando o patrimônio histórico, cultural e natural.",
        fonte: "Câmara Municipal de Petrópolis - Lei nº 8.220/2023",
        fonteUrl: "https://www.petropolis.rj.gov.br/pmp/index.php/legislacao",
        autor: "Secretaria Municipal de Turismo",
        conteudo: `<p>A Lei nº 8.220/2023 institui a Política Municipal de Turismo de Petrópolis - Cidade Imperial, valorizando o riquíssimo patrimônio histórico, cultural e natural do município. Define como pilares estratégicos: o turismo histórico-cultural (Museu Imperial, Casa de Santos Dumont, Igrejas históricas), o turismo de natureza (Parque Nacional da Serra dos Órgãos), o turismo gastronômico e o turismo de eventos.</p>
        <p>A lei cria o Fundo Municipal de Turismo, instituiu o Selo Petrópolis Imperial para empresas comprometidas com qualidade, e prevê incentivos fiscais para hotéis, pousadas, restaurantes e atrações que invistam em preservação, acessibilidade e capacitação. Também regulamenta os roteiros turísticos oficiais, eventos como o Bauernfest e o Inverno Cultural, e estabelece parcerias com Embratur e Setur-RJ para promoção internacional do destino.</p>`
    },
    {
        id: 25, numero: "8.180", tipo: "Lei", cidade: "petropolis", categoria: "ambiental", ano: 2023, data: "22/06/2023",
        titulo: "Proteção da Mata Atlântica e Recuperação de Encostas",
        resumo: "Institui programa de proteção da Mata Atlântica petropolitana e recuperação de encostas, em resposta às tragédias de deslizamentos.",
        fonte: "Câmara Municipal de Petrópolis - Lei nº 8.180/2023",
        fonteUrl: "https://www.petropolis.rj.gov.br/pmp/index.php/legislacao",
        autor: "Secretaria Municipal de Meio Ambiente",
        conteudo: `<p>A Lei nº 8.180/2023 institui o Programa de Proteção da Mata Atlântica Petropolitana e Recuperação de Encostas, em resposta às tragédias de deslizamentos ocorridas no município. O programa prevê o mapeamento integral das áreas de risco, o reflorestamento de 1.000 hectares em cinco anos e a fiscalização rigorosa contra desmatamentos ilegais e ocupações em áreas de preservação permanente.</p>
        <p>A lei cria o Fundo Municipal de Recuperação Ambiental, financiado por compensações de impactos ambientais, multas e dotações orçamentárias. Prevê também a remoção voluntária de famílias de áreas de risco, com indenização justa e realocação em habitação de interesse social, programas de educação ambiental nas escolas e o Selo Verde Petropolitano para empreendimentos sustentáveis. Estabelece monitoramento contínuo via sensores e parceria com a Defesa Civil para alertas antecipados em períodos chuvosos.</p>`
    },
    {
        id: 26, numero: "5.640", tipo: "Lei", cidade: "volta-redonda", categoria: "trabalhista", ano: 2024, data: "10/03/2024",
        titulo: "Programa Municipal de Qualificação Profissional",
        resumo: "Cria o Programa Volta Redonda Qualifica, oferecendo cursos profissionalizantes gratuitos para trabalhadores em parceria com SENAI e SENAC.",
        fonte: "Câmara Municipal de Volta Redonda - Lei nº 5.640/2024",
        fonteUrl: "https://www.portalvr.com/transparencia/legislacao",
        autor: "Secretaria Municipal de Desenvolvimento Econômico e Trabalho",
        conteudo: `<p>A Lei nº 5.640/2024 cria o Programa Volta Redonda Qualifica, política municipal de qualificação profissional voltada para trabalhadores, jovens em busca do primeiro emprego e profissionais em transição de carreira. O programa oferece 5.000 vagas anuais em cursos gratuitos nas áreas de metalurgia, mecânica, soldagem, eletricidade, informática, administração e gastronomia.</p>
        <p>A iniciativa é desenvolvida em parceria com SENAI, SENAC, SEST/SENAT, IFRJ e universidades locais. Inclui também auxílio-transporte e auxílio-alimentação para os alunos de baixa renda, certificação reconhecida nacionalmente, intermediação de mão de obra com empresas da região e Programa Aprendiz Industrial para jovens. A meta é qualificar 25 mil trabalhadores até 2028, fortalecendo a vocação industrial e siderúrgica de Volta Redonda.</p>`
    },
    {
        id: 27, numero: "2.945", tipo: "Lei", cidade: "marica", categoria: "habitacao", ano: 2024, data: "05/07/2024",
        titulo: "Programa Habitacional Casa Própria Maricá",
        resumo: "Cria o Programa Casa Própria Maricá, com financiamento subsidiado para aquisição de moradia popular, utilizando recursos dos royalties do petróleo.",
        fonte: "Câmara Municipal de Maricá - Lei nº 2.945/2024",
        fonteUrl: "https://www.marica.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Habitação",
        conteudo: `<p>A Lei nº 2.945/2024 institui o Programa Habitacional Casa Própria Maricá, utilizando recursos dos royalties de petróleo (Bacia de Campos) para viabilizar a aquisição de moradia popular por famílias maricaenses de baixa renda. O programa oferece subsídios de até R$ 80 mil por unidade habitacional, complementando financiamentos do programa Minha Casa Minha Vida.</p>
        <p>A lei estabelece atendimento prioritário a famílias com renda de até 3 salários mínimos, idosos, pessoas com deficiência, mulheres chefes de família e famílias em situação de risco habitacional. Prevê a construção de 3.000 unidades habitacionais em cinco anos, com infraestrutura completa (saneamento, transporte, escola, posto de saúde), além de regularização fundiária em comunidades já estabelecidas. Está vinculado também ao programa Renda Básica de Cidadania (Mumbuca) já existente no município.</p>`
    },
    {
        id: 28, numero: "4.560", tipo: "Lei", cidade: "macae", categoria: "administrativa", ano: 2024, data: "15/04/2024",
        titulo: "Polo Tecnológico de Macaé - Capital do Petróleo",
        resumo: "Cria o Polo Tecnológico de Macaé, com incentivos para empresas de tecnologia, P&D e inovação ligadas ao setor de energia.",
        fonte: "Câmara Municipal de Macaé - Lei nº 4.560/2024",
        fonteUrl: "https://www.macae.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Desenvolvimento Econômico",
        conteudo: `<p>A Lei nº 4.560/2024 cria o Polo Tecnológico de Macaé, denominada "Capital Nacional do Petróleo", com foco em pesquisa, desenvolvimento e inovação no setor de energia (petróleo, gás natural e energias renováveis). O polo oferece incentivos fiscais para empresas de tecnologia, startups, ICTs e centros de P&D que se instalarem no município.</p>
        <p>Entre os benefícios estão: isenção de ISS por até 10 anos, doação de terrenos no campus tecnológico, parcerias com UFRJ-Macaé, UENF e IFF, programa de aceleração de startups (Macaé Tech) e linha de crédito específica via banco municipal. A lei prevê foco em áreas estratégicas como exploração offshore, monitoramento submarino, descomissionamento de plataformas, transição energética e digitalização da cadeia produtiva. A meta é atrair 200 empresas de tecnologia em cinco anos.</p>`
    },
    {
        id: 29, numero: "3.020", tipo: "Lei", cidade: "cabo-frio", categoria: "turismo", ano: 2023, data: "20/12/2023",
        titulo: "Plano de Desenvolvimento Turístico de Cabo Frio",
        resumo: "Estabelece o Plano de Desenvolvimento Turístico de Cabo Frio, com diretrizes para turismo sustentável, ordenamento das praias e qualificação do setor.",
        fonte: "Câmara Municipal de Cabo Frio - Lei nº 3.020/2023",
        fonteUrl: "https://www.cabofrio.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Turismo",
        conteudo: `<p>A Lei nº 3.020/2023 institui o Plano de Desenvolvimento Turístico de Cabo Frio para o decênio 2024-2034, valorizando o município como destino turístico de praias (Forte, Foguete, Peró), patrimônio histórico (Forte São Mateus, Casa Histórica), gastronomia e ecoturismo. Define metas de aumentar em 60% o número de visitantes até 2030 e gerar 15 mil novos empregos no setor.</p>
        <p>O plano regulamenta o ordenamento das praias (quiosques, ambulantes, salva-vidas), cria o Selo Cabo Frio Turismo de Qualidade, oferece incentivos fiscais para hotéis, pousadas e restaurantes que invistam em modernização e sustentabilidade, e estabelece o Plano de Sinalização Turística trilíngue. Prevê também ações de promoção internacional, calendário oficial de eventos (Carnaval, Festival de Verão, Festa de São Pedro) e programa de capacitação para trabalhadores do setor.</p>`
    },
    {
        id: 30, numero: "4.890", tipo: "Lei", cidade: "nova-friburgo", categoria: "ambiental", ano: 2024, data: "10/02/2024",
        titulo: "Proteção das Serras Friburguenses e Áreas de Mananciais",
        resumo: "Cria a Política Municipal de Proteção das Serras Friburguenses e dos mananciais hídricos, com áreas de preservação permanente.",
        fonte: "Câmara Municipal de Nova Friburgo - Lei nº 4.890/2024",
        fonteUrl: "https://www.novafriburgo.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Meio Ambiente",
        conteudo: `<p>A Lei nº 4.890/2024 institui a Política Municipal de Proteção das Serras Friburguenses, valorizando o patrimônio natural do município, situado na Região Serrana do Rio de Janeiro. Define áreas de proteção permanente, especialmente nas nascentes dos rios e cabeceiras de drenagem do sistema hidrográfico que abastece grande parte da região.</p>
        <p>A lei cria a APA (Área de Proteção Ambiental) Municipal do Macaé de Cima e Três Picos, expande os limites das unidades de conservação existentes, regulamenta o turismo de natureza (trilhas, ecoturismo, observação de aves) e estabelece o Programa de Pagamento por Serviços Ambientais (PSA-Friburgo), com incentivos econômicos a proprietários rurais que preservem florestas e mananciais. Prevê também a recuperação ambiental de áreas degradadas pelas chuvas de 2011 e o monitoramento da qualidade da água dos rios São João e Bengala.</p>`
    },
    {
        id: 31, numero: "3.120", tipo: "Lei", cidade: "teresopolis", categoria: "esporte", ano: 2024, data: "15/05/2024",
        titulo: "Teresópolis Capital do Esporte de Aventura",
        resumo: "Estabelece políticas de fomento ao esporte e turismo de aventura em Teresópolis, valorizando trilhas, montanhismo e esportes ao ar livre.",
        fonte: "Câmara Municipal de Teresópolis - Lei nº 3.120/2024",
        fonteUrl: "https://www.teresopolis.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Esportes e Lazer",
        conteudo: `<p>A Lei nº 3.120/2024 estabelece políticas de fomento ao esporte e turismo de aventura em Teresópolis, posicionando o município como "Capital do Esporte de Aventura" do Rio de Janeiro. Aproveitando a localização privilegiada na Serra dos Órgãos, a lei cria incentivos para montanhismo, escalada, trilhas, ciclismo, parapente, corridas de montanha e outros esportes ao ar livre.</p>
        <p>O programa inclui investimentos em sinalização e manutenção de trilhas, criação do Centro de Treinamento de Atletas de Aventura, calendário anual de eventos (corrida Petrópolis-Teresópolis, travessia Serra dos Órgãos), licenciamento de empresas de turismo de aventura, formação de guias certificados e parcerias com o ICMBio para uso recreativo do Parque Nacional. Também prevê programas escolares de iniciação esportiva e bolsa-atleta para jovens promessas do esporte teresopolitano.</p>`
    },
    {
        id: 32, numero: "3.456", tipo: "Lei", cidade: "angra", categoria: "ambiental", ano: 2024, data: "20/03/2024",
        titulo: "Programa de Proteção da Costa Verde e Baía da Ilha Grande",
        resumo: "Institui o Programa de Proteção da Costa Verde, com gestão integrada dos recursos marinhos, costeiros e turísticos da Baía da Ilha Grande.",
        fonte: "Câmara Municipal de Angra dos Reis - Lei nº 3.456/2024",
        fonteUrl: "https://www.angra.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Meio Ambiente e Pesca",
        conteudo: `<p>A Lei nº 3.456/2024 institui o Programa de Proteção da Costa Verde de Angra dos Reis, com gestão integrada dos recursos marinhos, costeiros e turísticos da Baía da Ilha Grande, um dos patrimônios naturais mais importantes do Brasil. O programa busca equilibrar a preservação ambiental com as atividades de turismo, pesca artesanal e ocupação urbana.</p>
        <p>A lei estabelece zoneamento marinho com áreas de proteção integral, uso sustentável e uso turístico controlado. Cria normas para fundeio de embarcações, ordenamento da pesca, monitoramento da qualidade da água, controle de espécies invasoras (peixe-leão) e proteção dos corais. Prevê também o Conselho Gestor da Baía da Ilha Grande, com participação de pescadores, ambientalistas, operadores turísticos e gestores públicos. Está alinhada com o Mosaico de Áreas Protegidas da Bocaina (federal) e o Plano de Gestão da Reserva da Biosfera da Mata Atlântica.</p>`
    },
    {
        id: 33, numero: "2.180", tipo: "Lei", cidade: "belford-roxo", categoria: "saude", ano: 2024, data: "12/02/2024",
        titulo: "Plano Municipal de Saúde 2024-2030 - Belford Roxo Saudável",
        resumo: "Aprova o Plano Municipal de Saúde de Belford Roxo, com metas de expansão da Atenção Primária e modernização da rede de saúde.",
        fonte: "Câmara Municipal de Belford Roxo - Lei nº 2.180/2024",
        fonteUrl: "https://www.belfordroxo.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Saúde",
        conteudo: `<p>A Lei nº 2.180/2024 aprova o Plano Municipal de Saúde de Belford Roxo para o período 2024-2030, denominado "Belford Roxo Saudável 2030". O plano estabelece como meta principal universalizar o acesso à Atenção Primária, alcançando 100% de cobertura da Estratégia Saúde da Família até 2027, com a construção de 25 novas Unidades Básicas de Saúde.</p>
        <p>O documento prevê também a construção de duas novas UPAs 24h, modernização do Hospital Municipal, criação do Centro Municipal de Especialidades Médicas com 15 especialidades, programa de saúde escolar em parceria com a Educação, expansão da Rede de Atenção Psicossocial (CAPS) e implementação do prontuário eletrônico integrado. Prevê investimentos contínuos em capacitação dos servidores, valorização dos profissionais e ampliação do quadro funcional via concursos públicos.</p>`
    },
    {
        id: 34, numero: "2.745", tipo: "Lei", cidade: "itaborai", categoria: "administrativa", ano: 2024, data: "08/04/2024",
        titulo: "Programa de Desenvolvimento Local - Itaboraí e Comperj",
        resumo: "Institui medidas de desenvolvimento local integradas ao Complexo Petroquímico do Rio (COMPERJ) em Itaboraí.",
        fonte: "Câmara Municipal de Itaboraí - Lei nº 2.745/2024",
        fonteUrl: "https://www.itaborai.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Desenvolvimento Econômico",
        conteudo: `<p>A Lei nº 2.745/2024 institui o Programa de Desenvolvimento Local de Itaboraí, integrado às operações do Complexo Petroquímico do Rio de Janeiro (COMPERJ). O programa visa potencializar os benefícios sociais e econômicos do empreendimento para a população local, capacitar mão de obra, fortalecer fornecedores municipais e diversificar a economia do município.</p>
        <p>Entre as ações previstas estão: criação do Centro de Qualificação Profissional Itaboraí-COMPERJ (em parceria com SENAI e Petrobras), programa de incentivo a fornecedores locais com facilidades fiscais, criação do Polo de Logística e Serviços para Petrobras e empresas terceirizadas, programa de empreendedorismo para moradores e investimentos em infraestrutura urbana (saneamento, transporte, saúde, educação). Estabelece também participação do município nos royalties e ICMS gerados pelo complexo, com recursos vinculados a obras e programas sociais.</p>`
    },
    {
        id: 35, numero: "1.890", tipo: "Lei", cidade: "mage", categoria: "ambiental", ano: 2023, data: "15/09/2023",
        titulo: "Proteção da Baía de Guanabara - Vertente de Magé",
        resumo: "Cria programa municipal de proteção da Baía de Guanabara, com saneamento, despoluição e proteção de manguezais.",
        fonte: "Câmara Municipal de Magé - Lei nº 1.890/2023",
        fonteUrl: "https://www.mage.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Meio Ambiente",
        conteudo: `<p>A Lei nº 1.890/2023 institui o Programa Municipal de Proteção da Baía de Guanabara - Vertente Magé, ações integradas para recuperação ambiental, saneamento básico e proteção dos manguezais que compõem o ecossistema mageense. O programa contempla a APA (Área de Proteção Ambiental) Guapimirim e parte do Mosaico Central Fluminense.</p>
        <p>Entre as ações estão: universalização do saneamento básico até 2030 (tratamento de 100% do esgoto), recuperação dos rios Macacu, Caceribu e Imboaçu, plantio de 200 hectares de manguezais, programas de educação ambiental nas escolas, monitoramento da qualidade da água via parceria com INEA, e regulamentação da pesca artesanal sustentável. A lei também estabelece o Conselho Municipal de Meio Ambiente com participação social paritária e prevê captação de recursos via Fundo de Recuperação da Baía de Guanabara (federal) e contrapartidas ambientais de empreendimentos petroquímicos.</p>`
    },
    {
        id: 36, numero: "3.890", tipo: "Lei", cidade: "resende", categoria: "comercial", ano: 2024, data: "20/04/2024",
        titulo: "Polo Automotivo de Resende - Incentivos Industriais",
        resumo: "Estabelece incentivos fiscais e infraestrutura para o Polo Automotivo de Resende, fortalecendo a vocação industrial do município.",
        fonte: "Câmara Municipal de Resende - Lei nº 3.890/2024",
        fonteUrl: "https://www.resende.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Desenvolvimento Econômico",
        conteudo: `<p>A Lei nº 3.890/2024 institui o Programa de Fortalecimento do Polo Automotivo de Resende, oferecendo incentivos fiscais e logísticos para empresas montadoras e fornecedoras da cadeia automotiva no município. Resende abriga unidades de produção da Volkswagen Caminhões e Ônibus (MAN) e Nissan, sendo um dos principais polos automotivos do Brasil.</p>
        <p>O programa concede isenção parcial ou total de ISS por 15 anos para novas indústrias, redução de IPTU para galpões industriais, doação de terrenos no Polo Industrial Roberto Silveira e financiamento para infraestrutura privada com retorno via incentivos fiscais. A lei prevê também o Centro de Excelência em Tecnologia Automotiva, parcerias com SENAI, Mauá e AEDB para qualificação profissional, programa de eletrificação de veículos urbanos e atração de fabricantes de baterias e veículos elétricos.</p>`
    },
    {
        id: 37, numero: "5.120", tipo: "Lei", cidade: "barra-mansa", categoria: "educacao", ano: 2024, data: "10/03/2024",
        titulo: "Programa Barra Mansa Tecnológica - Educação Profissional",
        resumo: "Cria o Programa Barra Mansa Tecnológica, voltado à educação profissional e tecnológica de jovens e adultos do município.",
        fonte: "Câmara Municipal de Barra Mansa - Lei nº 5.120/2024",
        fonteUrl: "https://www.barramansa.rj.gov.br/transparencia/legislacao",
        autor: "Secretaria Municipal de Educação",
        conteudo: `<p>A Lei nº 5.120/2024 institui o Programa Barra Mansa Tecnológica, política municipal de educação profissional e tecnológica voltada para jovens e adultos. Aproveitando a vocação industrial e siderúrgica do município (sede da CSN - Companhia Siderúrgica Nacional), o programa oferece 3.000 vagas anuais em cursos técnicos e tecnológicos gratuitos.</p>
        <p>Entre os cursos disponíveis estão: Metalurgia, Mecânica Industrial, Eletrotécnica, Manutenção Industrial, Logística, Informática, Administração e Gestão da Qualidade. O programa funciona em parceria com SENAI, IFRJ, UFF (campus Volta Redonda) e a própria CSN. Prevê também auxílio-transporte e auxílio-alimentação para alunos de baixa renda, intermediação de mão de obra com empresas locais, programa de empreendedorismo industrial e modernização das escolas técnicas municipais.</p>`
    },
    {
        id: 38, numero: "9.250", tipo: "Lei", cidade: "estado", categoria: "ambiental", ano: 2024, data: "01/07/2024",
        titulo: "Lei Estadual de Proteção e Defesa dos Direitos dos Animais",
        resumo: "Consolida normas estaduais de proteção animal, regulamentando o trato com animais domésticos, silvestres e exóticos.",
        fonte: "ALERJ - Lei nº 9.250/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Defesa dos Animais da ALERJ",
        conteudo: `<p>A Lei nº 9.250/2024 institui o Código Estadual de Proteção e Defesa dos Direitos dos Animais do Rio de Janeiro, consolidando legislações dispersas sobre o tema. Define os direitos fundamentais dos animais (vida, alimentação adequada, abrigo, assistência veterinária, livre de maus-tratos), criminaliza condutas como abandono e violência contra animais, e estabelece deveres dos tutores.</p>
        <p>A lei cria o Sistema Estadual de Registro de Animais (SERA-RJ), regulamenta criadouros e estabelecimentos comerciais, proíbe espetáculos com uso cruel de animais (vaquejadas, rinhas, circos com animais), institui o Selo Pet Friendly para empresas que aceitam animais, prevê castração gratuita massiva e centros de zoonoses adequados. Estabelece também o Disque Denúncia 0800 para crimes ambientais e contra animais, e a Polícia Ambiental Estadual com atribuições específicas para a proteção animal.</p>`
    },
    {
        id: 39, numero: "9.280", tipo: "Lei", cidade: "estado", categoria: "trabalhista", ano: 2024, data: "15/08/2024",
        titulo: "Programa Estadual Primeiro Emprego Jovem RJ",
        resumo: "Cria incentivos fiscais para contratação de jovens em primeiro emprego e estabelece programa de qualificação profissional juvenil.",
        fonte: "ALERJ - Lei nº 9.280/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Secretaria Estadual de Trabalho e Renda",
        conteudo: `<p>A Lei nº 9.280/2024 institui o Programa Estadual Primeiro Emprego Jovem RJ, voltado a jovens de 16 a 24 anos sem experiência formal de trabalho. O programa oferece subsídio mensal de até R$ 600 às empresas que contratarem jovens em primeiro emprego, pelo período de 12 meses, com vinculação à manutenção do empregado por no mínimo 24 meses.</p>
        <p>A lei prevê também isenção de ICMS para empresas que mantiverem percentual mínimo de 5% de jovens em seu quadro funcional, programa de qualificação profissional gratuita em parceria com SENAI, SENAC e Sistema S, bolsa-formação para jovens em situação de vulnerabilidade, intermediação de mão de obra via SINE-RJ e Programa Aprendiz Estadual. A meta é gerar 50 mil empregos para jovens até 2027, combatendo o desemprego juvenil estrutural no estado.</p>`
    },
    {
        id: 40, numero: "9.310", tipo: "Lei", cidade: "estado", categoria: "tributaria", ano: 2024, data: "10/09/2024",
        titulo: "Programa de Refinanciamento de Dívidas Tributárias - REFIS-RJ 2024",
        resumo: "Institui o REFIS-RJ 2024, programa de regularização de débitos tributários estaduais com descontos em multas e juros.",
        fonte: "ALERJ - Lei nº 9.310/2024",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Secretaria Estadual de Fazenda",
        conteudo: `<p>A Lei nº 9.310/2024 institui o Programa de Refinanciamento de Dívidas Tributárias do Estado do Rio de Janeiro - REFIS-RJ 2024, oferecendo aos contribuintes a oportunidade de regularizar débitos vencidos com a Fazenda Estadual com condições especiais. O programa abrange débitos de ICMS, IPVA, ITD (Imposto sobre Transmissão por Causa de Morte e Doação), Taxas Estaduais e contribuições.</p>
        <p>São oferecidas as seguintes condições: pagamento à vista com desconto de até 90% em multas e juros; parcelamento em até 60 parcelas mensais com desconto de até 70%; parcelamento em até 120 parcelas com desconto de até 50%. A adesão é facultativa e exige a desistência de eventuais ações judiciais e administrativas que questionem os débitos. O período de adesão é de 6 meses a partir da regulamentação, prorrogável uma única vez por mais 3 meses. Espera-se arrecadar mais de R$ 2 bilhões e regularizar 50 mil contribuintes inadimplentes.</p>`
    },
    {
        id: 41, numero: "LC-224", tipo: "Lei Complementar", cidade: "estado", categoria: "seguranca", ano: 2025, data: "15/01/2025",
        titulo: "Nova Lei Orgânica da Polícia Civil do Estado do Rio de Janeiro",
        resumo: "Reforma a estrutura de cargos, carreira e benefícios da Polícia Civil do RJ, unificando funções e instituindo auxílio-saúde, adicional noturno e novas regras de promoção.",
        fonte: "ALERJ - Lei Complementar nº 224/2025",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Governo do Estado do Rio de Janeiro",
        conteudo: `<p>A Lei Complementar nº 224/2025 promove uma reforma abrangente na Lei Orgânica da Polícia Civil do Estado do Rio de Janeiro (LC 204/22), com o objetivo de modernizar a estrutura organizacional da corporação, valorizar os profissionais da segurança pública e adequar as carreiras às exigências contemporâneas. O texto ratifica a unificação dos cargos de Inspetor de Polícia, Oficial de Cartório Policial e Investigador Policial em uma única carreira de Oficial de Polícia Civil de Nível Superior.</p>
        <p>A nova lei institui cinco benefícios para os integrantes da Polícia Civil: auxílio-saúde, auxílio-educação, adicional noturno, adicional de função e adicional de cargo de confiança para servidores que cuidam de dependentes com deficiência física ou intelectual. Estabelece jornada máxima de 40 horas semanais com pagamento de horas extraordinárias, cria novas regras para gratificações e promoções por merecimento, antiguidade, bravura e post-mortem. Prevê também concursos públicos regulares, plano de carreira transparente e programa de qualificação profissional obrigatória para todos os cargos.</p>`
    },
    {
        id: 42, numero: "7.820", tipo: "Lei", cidade: "rio", categoria: "civil", ano: 2025, data: "10/03/2025",
        titulo: "Programa de Assistência Integral às Mulheres Vítimas de Violência Sexual",
        resumo: "Institui o Programa de Assistência Integral às Mulheres Vítimas de Estupro no Município do Rio de Janeiro, com suporte psicológico, médico e jurídico.",
        fonte: "Câmara Municipal do Rio de Janeiro - Lei nº 7.820/2025",
        fonteUrl: "https://www.camara.rio/atividade-parlamentar/legislacao/municipal/leis-ordinarias",
        autor: "Comissão de Defesa dos Direitos da Mulher - Câmara Municipal",
        conteudo: `<p>A Lei nº 7.820/2025 institui o Programa de Assistência Integral às Mulheres Vítimas de Violência Sexual no Município do Rio de Janeiro, com base no PL 2.892-A/2024. O programa garante às mulheres que engravidaram em decorrência de violência sexual acesso a atendimento multidisciplinar e humanizado na rede pública municipal, incluindo apoio psicológico, assistência social, orientação jurídica e acompanhamento médico-ginecológico.</p>
        <p>A lei prevê o funcionamento de núcleos de atendimento especializados nas Unidades de Pronto Atendimento (UPAs) e hospitais municipais, com equipes treinadas para acolhimento sem julgamento. Estabelece também fluxo de atendimento integrado com delegacias especializadas (DEAM), Ministério Público e defensorias. Obriga a realização de capacitação anual dos profissionais de saúde em violência de gênero, define prazo máximo de 24 horas para o primeiro atendimento após denúncia e garante sigilo absoluto das informações das vítimas.</p>`
    },
    {
        id: 43, numero: "7.835", tipo: "Lei", cidade: "rio", categoria: "ambiental", ano: 2025, data: "20/03/2025",
        titulo: "Programa Recicla Rio - Gestão de Resíduos no Carnaval e Eventos de Massa",
        resumo: "Cria o Programa Recicla Rio, com coleta seletiva e destinação adequada de resíduos gerados durante o Carnaval e grandes eventos na cidade.",
        fonte: "Câmara Municipal do Rio de Janeiro - Lei nº 7.835/2025",
        fonteUrl: "https://www.camara.rio/atividade-parlamentar/legislacao/municipal/leis-ordinarias",
        autor: "Comissão de Meio Ambiente da Câmara Municipal do Rio",
        conteudo: `<p>A Lei nº 7.835/2025 cria o Programa Recicla Rio, política municipal de gestão de resíduos sólidos durante o Carnaval e outros grandes eventos realizados na cidade do Rio de Janeiro. O programa visa promover a coleta seletiva, a destinação adequada dos resíduos e a valorização dos catadores de materiais recicláveis, que historicamente têm papel central na limpeza da cidade.</p>
        <p>A lei determina que a Comlurb (Companhia Municipal de Limpeza Urbana) disponibilize equipes especializadas e pontos de coleta seletiva em todos os polos de Carnaval (Sambódromo, Cinelândia, Bairro de Fátima, Zona Sul). Exige que os organizadores de eventos com mais de 5.000 pessoas apresentem Plano de Gestão de Resíduos como condição para obtenção de alvará. Cria parcerias com cooperativas de catadores para coleta de materiais recicláveis, garantindo geração de renda. Prevê metas de reciclagem progressivas: 20% em 2025, 35% em 2027 e 50% em 2030. Inclui programa de educação ambiental em escolas sobre descarte consciente e impactos dos resíduos na Baía de Guanabara e praias cariocas.</p>`
    },
    {
        id: 44, numero: "7.840", tipo: "Lei", cidade: "rio", categoria: "educacao", ano: 2025, data: "26/03/2025",
        titulo: "Prioridade de Vagas em Creches para Filhos de Mulheres em Situação de Violência Doméstica",
        resumo: "Garante prioridade de matrícula ou transferência em creches e escolas da rede municipal para mulheres vítimas de violência doméstica e seus dependentes.",
        fonte: "Câmara Municipal do Rio de Janeiro - Lei nº 7.840/2025",
        fonteUrl: "https://www.camara.rio/atividade-parlamentar/legislacao/municipal/leis-ordinarias",
        autor: "Vereadores da Comissão de Educação e Comissão da Mulher",
        conteudo: `<p>A Lei nº 7.840/2025 garante prioridade de matrícula ou transferência em creches e instituições de ensino da rede pública municipal do Rio de Janeiro para filhos e dependentes de mulheres vítimas de violência doméstica e familiar. O dispositivo reconhece que o acesso à educação infantil é condição essencial para que a mulher em situação de violência possa buscar trabalho, renda e autonomia necessários para romper o ciclo de violência.</p>
        <p>A lei estabelece que a prioridade é válida independentemente da existência de vagas regulares, obrigando a Secretaria Municipal de Educação a criar cadastro reserva especial para esses casos. O prazo máximo para a efetivação da matrícula é de cinco dias úteis após a apresentação de medida protetiva ou boletim de ocorrência. A lei também veda a divulgação do endereço da escola para o agressor, em proteção às vítimas, e determina treinamento das equipes pedagógicas para identificação e encaminhamento adequado de situações de violência doméstica envolvendo alunos.</p>`
    },
    {
        id: 45, numero: "9.380", tipo: "Lei", cidade: "estado", categoria: "transporte", ano: 2025, data: "15/02/2025",
        titulo: "Ampliação do Passe Livre Intermunicipal para Estudantes de Áreas Afastadas",
        resumo: "Amplia o benefício do Passe Livre Intermunicipal para estudantes que necessitam de mais de um modal de transporte para chegar à escola em municípios do interior do RJ.",
        fonte: "ALERJ - Lei nº 9.380/2025",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Transportes e Educação da ALERJ",
        conteudo: `<p>A Lei nº 9.380/2025 amplia o Passe Livre Intermunicipal Estudantil do Estado do Rio de Janeiro, estendendo o benefício a alunos que residem em localidades rurais e periféricas que necessitam utilizar mais de um modal de transporte (ônibus intermunicipal + transporte complementar) para se deslocar até a instituição de ensino. Anteriormente, o benefício cobria apenas um único trecho de transporte.</p>
        <p>A medida beneficia estimadamente 120 mil estudantes de ensino médio e superior de municípios como Campos dos Goytacazes, Itaperuna, Miracema, Santo Antônio de Pádua, Bom Jesus do Itabapoana e outras cidades do Norte e Noroeste Fluminense. A lei estabelece cadastro único estadual de beneficiários, com renovação semestral mediante comprovação de matrícula e frequência escolar mínima de 75%. Determina ainda que as empresas de transporte conveniadas disponibilizem dados de uso do passe livre para controle e auditoria do programa pela Secretaria Estadual de Transportes.</p>`
    },
    {
        id: 46, numero: "9.350", tipo: "Lei", cidade: "estado", categoria: "transporte", ano: 2025, data: "05/02/2025",
        titulo: "Regulamentação de Veículos de Micromobilidade Elétrica no Estado do Rio de Janeiro",
        resumo: "Estabelece normas de circulação, segurança e registro para ciclomotores elétricos, motonetas elétricas, patinetes e bicicletas elétricas no Estado do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 9.350/2025",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Transportes e Mobilidade Urbana da ALERJ",
        conteudo: `<p>A Lei nº 9.350/2025 estabelece normas estaduais de circulação, segurança e responsabilidade para veículos de micromobilidade elétrica — ciclomotores elétricos, motonetas elétricas, patinetes eletrônicos, bicicletas elétricas e equipamentos de mobilidade individual autopropelidos — em complemento ao Código de Trânsito Brasileiro. A lei foi motivada pelo aumento expressivo de acidentes envolvendo esses veículos nas vias fluminenses.</p>
        <p>O texto torna obrigatório o uso de capacete homologado pelo INMETRO para condutores de ciclomotores e motonetas elétricas, além de colete ou tiras refletivas em circulação noturna. Estipula penalidades de R$ 500 a R$ 2.000 para condutores flagrados sem equipamentos de segurança, com pontuação na CNH e possibilidade de apreensão do veículo. Para empresas de aluguel de patinetes e bicicletas elétricas compartilhadas, exige disponibilização de capacetes, cadastro de usuários, geofencing obrigatório e seguro contra acidentes de terceiros. Determina ainda que os municípios com mais de 50 mil habitantes regulamentem espaços específicos de estacionamento e circulação para esses veículos.</p>`
    },
    {
        id: 47, numero: "9.400", tipo: "Lei", cidade: "estado", categoria: "administrativa", ano: 2025, data: "01/04/2025",
        titulo: "Marco Estadual de Inteligência Artificial e Inovação Digital do Rio de Janeiro",
        resumo: "Estabelece diretrizes para o uso ético, seguro e responsável de sistemas de inteligência artificial pela administração pública estadual e regula incentivos para empresas de IA.",
        fonte: "ALERJ - Lei nº 9.400/2025",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Ciência, Tecnologia e Inovação da ALERJ",
        conteudo: `<p>A Lei nº 9.400/2025 institui o Marco Estadual de Inteligência Artificial e Inovação Digital do Rio de Janeiro, estabelecendo princípios e diretrizes para o uso de sistemas de IA pela administração pública estadual e para o fomento do ecossistema de inovação digital fluminense. A lei é inspirada no Marco Regulatório Federal de IA (PL 2.338/2023) e nas melhores práticas internacionais de governança de IA.</p>
        <p>No âmbito público, a lei exige que sistemas de IA utilizados em decisões que afetem direitos dos cidadãos (concessão de benefícios, scoring de crédito público, vigilância, reconhecimento facial) sejam submetidos à avaliação de impacto algorítmico e ao controle do Comitê Estadual de Ética em IA. Garante aos cidadãos o direito de revisão humana de decisões automatizadas, explicação sobre o funcionamento dos algoritmos e proteção contra discriminação algorítmica. Para o setor privado, cria o Selo RJ-IA Responsável para empresas que adotem boas práticas, com benefícios fiscais (redução de ICMS), acesso preferencial a contratos públicos e apoio do ecossistema de inovação. Define ainda o Programa Estadual de Capacitação em IA para servidores públicos e jovens das redes estaduais de ensino.</p>`
    },
    {
        id: 48, numero: "3.650", tipo: "Lei", cidade: "niteroi", categoria: "urbanismo", ano: 2025, data: "20/02/2025",
        titulo: "Plano de Mobilidade Urbana Sustentável de Niterói 2025-2035",
        resumo: "Institui o Plano de Mobilidade Urbana Sustentável de Niterói, com diretrizes para ciclovias, transporte aquaviário, integração modal e redução de emissões.",
        fonte: "Câmara Municipal de Niterói - Lei nº 3.650/2025",
        fonteUrl: "https://www.camaraniteroi.rj.gov.br/legislacao",
        autor: "Secretaria Municipal de Urbanismo e Mobilidade de Niterói",
        conteudo: `<p>A Lei nº 3.650/2025 institui o Plano de Mobilidade Urbana Sustentável de Niterói (PMUS-Niterói) para o decênio 2025-2035, definindo diretrizes, metas e ações para tornar a cidade referência nacional em mobilidade limpa e integrada. O plano aproveita a vocação aquaviária de Niterói, sua topografia e o potencial das novas tecnologias de transporte.</p>
        <p>Entre as principais metas estão: ampliar a malha cicloviária de 45 km para 120 km até 2030; integrar as linhas de ferry-boat com ônibus elétricos e bicicletas compartilhadas; criar três novos terminais intermodais (Centro, São Francisco e Região Oceânica); proibir circulação de ônibus a diesel no Centro histórico até 2028; implantar sistema de bicicletas elétricas compartilhadas (e-bike) em parceria com operadoras privadas; e reduzir em 40% as emissões de carbono do setor de transporte até 2035. O plano também prevê calçadas acessíveis, sinalização universal, aplicativo integrado de mobilidade e zona de baixa emissão (ZBE) nas áreas de maior concentração de serviços.</p>`
    },
    {
        id: 49, numero: "3.390", tipo: "Lei", cidade: "duque-caxias", categoria: "saude", ano: 2024, data: "25/03/2024",
        titulo: "Programa Caxias Saudável - Expansão da Atenção Primária à Saúde",
        resumo: "Cria o Programa Caxias Saudável, com metas de expansão das Unidades Básicas de Saúde, ampliação do ESF e modernização da rede de saúde municipal.",
        fonte: "Câmara Municipal de Duque de Caxias - Lei nº 3.390/2024",
        fonteUrl: "https://www.cmdc.rj.gov.br",
        autor: "Secretaria Municipal de Saúde de Duque de Caxias",
        conteudo: `<p>A Lei nº 3.390/2024 cria o Programa Caxias Saudável, política municipal de fortalecimento da Atenção Primária à Saúde (APS) em Duque de Caxias, segundo maior município da Baixada Fluminense. O programa visa universalizar o acesso à Estratégia Saúde da Família (ESF), alcançando 90% de cobertura até 2026, com a construção e reforma de 20 Unidades Básicas de Saúde distribuídas pelos quatro distritos do município.</p>
        <p>O plano prevê contratação de 500 novos profissionais de saúde (médicos, enfermeiros, técnicos e agentes comunitários) via concurso público, implantação do prontuário eletrônico integrado em toda a rede municipal, criação do Centro de Especialidades Médicas com 20 especialidades, ampliação do programa de saúde bucal nas escolas, inauguração de três novos Centros de Atenção Psicossocial (CAPS) e construção de uma UPA 24h no 4º Distrito. Prevê ainda programa especial de atenção à saúde da mulher, da criança e do adolescente, e combate às endemias (dengue, chikungunya, zika) com reforço das equipes de vigilância epidemiológica.</p>`
    },
    {
        id: 50, numero: "9.360", tipo: "Lei", cidade: "estado", categoria: "saude", ano: 2025, data: "10/03/2025",
        titulo: "Programa Estadual de Saúde Mental e Atenção Psicossocial do Rio de Janeiro",
        resumo: "Institui o Programa Estadual de Saúde Mental, com expansão da Rede de Atenção Psicossocial, CAPS 24h e programa de saúde mental nas escolas.",
        fonte: "ALERJ - Lei nº 9.360/2025",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Secretaria Estadual de Saúde / Comissão de Saúde da ALERJ",
        conteudo: `<p>A Lei nº 9.360/2025 institui o Programa Estadual de Saúde Mental e Atenção Psicossocial do Rio de Janeiro (PROSMAPS-RJ), em resposta ao crescimento dos transtornos mentais, especialmente entre jovens e populações em situação de vulnerabilidade agravada pela pandemia de Covid-19 e pela crise socioeconômica. O programa fortalece a Rede de Atenção Psicossocial (RAPS) estadual, articulando CAPS, residências terapêuticas, Unidades de Acolhimento e leitos hospitalares especializados.</p>
        <p>A lei determina a criação de pelo menos um CAPS-III (funcionamento 24 horas) em todos os municípios com mais de 70 mil habitantes que ainda não dispõem desse serviço, além de ampliar o número de leitos de saúde mental em hospitais gerais. Institui o Programa Saúde Mental nas Escolas, com psicólogos e assistentes sociais nas unidades estaduais de ensino médio, e o Programa Prevenção ao Suicídio RJ, com linha direta de apoio e capacitação de professores e profissionais de saúde. Prevê também tratamento especializado para dependência química, integrado com política de redução de danos e reinserção social.</p>`
    },
    {
        id: 51, numero: "7.860", tipo: "Lei", cidade: "rio", categoria: "seguranca", ano: 2025, data: "15/04/2025",
        titulo: "Plataforma Digital de Proteção à Mulher Carioca",
        resumo: "Cria plataforma digital integrada de apoio e proteção a mulheres vítimas de violência doméstica no Município do Rio de Janeiro.",
        fonte: "Câmara Municipal do Rio de Janeiro - Lei nº 7.860/2025",
        fonteUrl: "https://www.camara.rio/atividade-parlamentar/legislacao/municipal/leis-ordinarias",
        autor: "Comissão de Defesa dos Direitos da Mulher - Câmara Municipal",
        conteudo: `<p>A Lei nº 7.860/2025 determina a criação da Plataforma Digital de Proteção à Mulher Carioca, sistema integrado e gratuito que conecta vítimas de violência doméstica aos serviços de proteção disponíveis no município. A plataforma, acessível por aplicativo e web, oferece botão de pânico com geolocalização, chat com assistente social 24h, mapeamento de serviços (CRAM, DEAM, abrigos, defensorias), acompanhamento online de medidas protetivas e canais seguros de denúncia.</p>
        <p>A lei garante sigilo absoluto dos dados das usuárias, com criptografia de ponta a ponta e armazenamento em servidores municipais, vedando compartilhamento com terceiros sem autorização judicial. Exige integração com o sistema da Polícia Civil, Ministério Público e Defensoria Pública Estadual para fluxo ágil de atendimento. Determina também que as servidoras públicas municipais com medidas protetivas de urgência tenham seus dados de lotação protegidos nos Portais da Transparência, impedindo que agressores as localizem. A Secretaria Municipal da Mulher é responsável pela gestão da plataforma, com relatórios públicos trimestrais de uso e efetividade.</p>`
    },
    {
        id: 52, numero: "1.780", tipo: "Lei", cidade: "sao-goncalo", categoria: "comercial", ano: 2024, data: "12/06/2024",
        titulo: "Programa de Regularização e Fomento ao Comércio Popular de São Gonçalo",
        resumo: "Regulamenta o comércio ambulante e popular em São Gonçalo, com cadastro municipal, zoneamento, capacitação e acesso a crédito para pequenos comerciantes.",
        fonte: "Câmara Municipal de São Gonçalo - Lei nº 1.780/2024",
        fonteUrl: "https://www.cmsg.rj.gov.br/legislacao",
        autor: "Secretaria Municipal de Desenvolvimento Econômico de São Gonçalo",
        conteudo: `<p>A Lei nº 1.780/2024 institui o Programa de Regularização e Fomento ao Comércio Popular de São Gonçalo, buscando formalizar e apoiar os milhares de vendedores ambulantes e pequenos comerciantes que exercem atividade econômica nas feiras, calçadões e espaços públicos do segundo maior município do estado. O programa cria o Cadastro Municipal do Comerciante Popular (CMCP), com emissão de credencial gratuita.</p>
        <p>A lei define zoneamento específico para o comércio ambulante, com áreas permitidas, restritas e proibidas, evitando conflitos com o tráfego e a acessibilidade. Oferece capacitação gratuita em gestão financeira, marketing digital, emissão de nota fiscal e higiene alimentar para vendedores de alimentos. Cria linha de microcrédito de até R$ 10.000 via banco municipal, com taxa de juros de 0,5% ao mês, destinada exclusivamente a cadastrados. Prevê ainda mutirão de formalização como MEI, com isenção de taxas municipais por 24 meses, e criação de Feiras do Povo nos bairros com menor cobertura de equipamentos comerciais formais.</p>`
    },
    {
        id: 53, numero: "9.210", tipo: "Lei", cidade: "campos", categoria: "administrativa", ano: 2024, data: "08/05/2024",
        titulo: "Fundo Municipal de Desenvolvimento de Campos dos Goytacazes",
        resumo: "Cria o Fundo Municipal de Desenvolvimento de Campos, vinculado aos royalties do petróleo, com destinação obrigatória para infraestrutura, educação e saúde.",
        fonte: "Câmara Municipal de Campos dos Goytacazes - Lei nº 9.210/2024",
        fonteUrl: "https://www.camaracampos.rj.gov.br/legislacao",
        autor: "Secretaria Municipal de Planejamento e Finanças de Campos",
        conteudo: `<p>A Lei nº 9.210/2024 cria o Fundo Municipal de Desenvolvimento de Campos dos Goytacazes (FUMDEC), destinado a concentrar e gerir os recursos provenientes dos royalties do petróleo e do gás natural recebidos pelo município. Campos dos Goytacazes é um dos maiores beneficiários de royalties do Brasil, recebendo anualmente valores bilionários em função da exploração da Bacia de Campos.</p>
        <p>A lei estabelece vinculação obrigatória dos recursos do FUMDEC: mínimo de 30% para infraestrutura urbana (saneamento, pavimentação, mobilidade), 25% para educação (construção e reforma de escolas, bolsas de estudo, qualificação profissional), 20% para saúde (hospitais, UBSs, equipamentos), 15% para habitação de interesse social e 10% para sustentabilidade ambiental e diversificação econômica. Cria Conselho Gestor com participação da sociedade civil para aprovação e fiscalização dos gastos, com publicidade total via portal de transparência. Define regras anti-cíclicas para proteger o fundo em anos de menor arrecadação de royalties, garantindo continuidade dos programas sociais.</p>`
    },
    {
        id: 54, numero: "9.420", tipo: "Lei", cidade: "estado", categoria: "habitacao", ano: 2025, data: "05/05/2025",
        titulo: "Programa Estadual Morar Bem RJ - Habitação de Interesse Social",
        resumo: "Cria o Programa Morar Bem RJ, voltado à construção de habitações populares, regularização fundiária e urbanização de assentamentos precários no Estado do Rio de Janeiro.",
        fonte: "ALERJ - Lei nº 9.420/2025",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Secretaria Estadual de Desenvolvimento Urbano e Habitação",
        conteudo: `<p>A Lei nº 9.420/2025 cria o Programa Estadual Morar Bem RJ, política pública habitacional integrada para reduzir o déficit habitacional do Estado do Rio de Janeiro — estimado em 500 mil unidades. O programa articula recursos estaduais com o Minha Casa Minha Vida federal, royalties do petróleo e parcerias público-privadas para viabilizar habitação digna a famílias de baixa renda.</p>
        <p>O Morar Bem RJ tem três eixos principais: construção de novas unidades habitacionais (meta de 100 mil unidades em dez anos), regularização fundiária urbana em comunidades informais consolidadas (com emissão de título de propriedade a moradores há mais de cinco anos) e urbanização de assentamentos precários com infraestrutura completa (água, esgoto, pavimentação, iluminação, coleta de lixo). Estabelece prioridade de atendimento a famílias com renda de até 2 salários mínimos, mulheres chefes de família, idosos, pessoas com deficiência e vítimas de desastres naturais. Cria o Fundo Estadual de Habitação de Interesse Social (FEHIS-RJ), com dotação mínima anual garantida em lei orçamentária, e o Conselho Estadual de Habitação com participação comunitária paritária.</p>`
    },
    {
        id: 55, numero: "9.390", tipo: "Lei", cidade: "estado", categoria: "trabalhista", ano: 2025, data: "20/04/2025",
        titulo: "Regulamentação do Trabalho por Plataformas Digitais no Estado do Rio de Janeiro",
        resumo: "Estabelece direitos e garantias aos trabalhadores de aplicativos de transporte, delivery e serviços no Estado do Rio de Janeiro, incluindo piso mínimo, seguro e benefícios.",
        fonte: "ALERJ - Lei nº 9.390/2025",
        fonteUrl: "https://www.alerj.rj.gov.br/Pagina/Atividade-Parlamentar/Pesquisa-Legislativa",
        autor: "Comissão de Trabalho e Emprego da ALERJ",
        conteudo: `<p>A Lei nº 9.390/2025 estabelece garantias mínimas para os trabalhadores por plataformas digitais no Estado do Rio de Janeiro — motoristas de aplicativo, entregadores e prestadores de serviços — em complemento à regulamentação federal do setor (Lei Federal nº 14.297/2022 e Marco Legal dos Motoristas de Aplicativo de 2024). A lei estadual avança nas proteções, adaptando-as à realidade fluminense, onde mais de 300 mil trabalhadores dependem dessas plataformas como fonte de renda principal.</p>
        <p>A lei garante: remuneração mínima equivalente a R$ 32 por hora efetivamente trabalhada (com atualização anual pelo INPC); seguro de acidente de trabalho obrigatório custeado pelas plataformas; acesso gratuito a plano de saúde coletivo com cobertura básica; limite de 8 horas diárias de conexão às plataformas (com pagamento de adicional para horas extras); direito a 15 dias de afastamento remunerado por ano em caso de doença ou acidente; mecanismo de contestação de desligamentos arbitrários e criação de ouvidoria estadual de plataformas digitais. As empresas que descumprirem a lei ficam sujeitas a multas de até R$ 500.000 e suspensão de operação no estado.</p>`
    }
];
