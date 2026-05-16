const LEIS_RJ = [
    {
        id: 1,
        numero: "9.064",
        tipo: "Lei",
        titulo: "Institui o Programa Estadual de Microcrédito",
        categoria: "comercial",
        ano: 2024,
        data: "15/01/2024",
        resumo: "Institui o Programa Estadual de Microcrédito para apoio a micro e pequenas empresas do Estado do Rio de Janeiro.",
        conteudo: `
            <h2>Lei nº 9.064 de 15 de janeiro de 2024</h2>
            <p>Institui o Programa Estadual de Microcrédito para apoio a micro e pequenas empresas do Estado do Rio de Janeiro.</p>
            <h3>CAPÍTULO I - DAS DISPOSIÇÕES GERAIS</h3>
            <p><strong>Art. 1º</strong> Fica instituído o Programa Estadual de Microcrédito, destinado a apoiar o desenvolvimento de micro e pequenas empresas no Estado do Rio de Janeiro.</p>
            <p><strong>Art. 2º</strong> O programa objetiva:</p>
            <ul>
                <li>Ampliar o acesso ao crédito para micro e pequenas empresas;</li>
                <li>Promover a inclusão econômica e financeira;</li>
                <li>Estimular a geração de emprego e renda;</li>
                <li>Fortalecer o desenvolvimento econômico estadual.</li>
            </ul>
            <p><strong>Art. 3º</strong> Serão beneficiárias do programa as micro e pequenas empresas que atendam aos critérios estabelecidos em regulamentação específica.</p>
        `
    },
    {
        id: 2,
        numero: "8.756",
        tipo: "Decreto",
        titulo: "Regulamenta a Lei de Proteção Ambiental",
        categoria: "ambiental",
        ano: 2023,
        data: "10/06/2023",
        resumo: "Regulamenta a implementação da Lei de Proteção Ambiental do Estado do Rio de Janeiro.",
        conteudo: `
            <h2>Decreto nº 8.756 de 10 de junho de 2023</h2>
            <p>Regulamenta a Lei de Proteção Ambiental do Estado do Rio de Janeiro.</p>
            <h3>CAPÍTULO I - DISPOSIÇÕES PRELIMINARES</h3>
            <p><strong>Art. 1º</strong> Este Decreto regulamenta a aplicação das disposições relativas à proteção ambiental no Estado do Rio de Janeiro.</p>
            <p><strong>Art. 2º</strong> A proteção ambiental envolve:</p>
            <ul>
                <li>Conservação da biodiversidade;</li>
                <li>Preservação de áreas verdes;</li>
                <li>Controle da poluição;</li>
                <li>Educação ambiental.</li>
            </ul>
        `
    },
    {
        id: 3,
        numero: "9.045",
        tipo: "Lei",
        titulo: "Lei de Incentivo à Inovação Tecnológica",
        categoria: "comercial",
        ano: 2024,
        data: "20/02/2024",
        resumo: "Cria incentivos para empresas de tecnologia e startups que se instalem no Estado do Rio de Janeiro.",
        conteudo: `
            <h2>Lei nº 9.045 de 20 de fevereiro de 2024</h2>
            <p>Cria incentivos para empresas de tecnologia e startups no Estado do Rio de Janeiro.</p>
            <h3>DOS INCENTIVOS FISCAIS</h3>
            <p><strong>Art. 1º</strong> As empresas de tecnologia que se instalarem no Estado do Rio de Janeiro poderão usufruir dos seguintes incentivos:</p>
            <ul>
                <li>Redução do ICMS em até 75% pelo período de 10 anos;</li>
                <li>Isenção de IPVA para equipamentos;</li>
                <li>Crédito presumido de IPI.</li>
            </ul>
        `
    },
    {
        id: 4,
        numero: "8.890",
        tipo: "Resolução",
        titulo: "Normas de Funcionamento dos Espaços Públicos",
        categoria: "administrativa",
        ano: 2023,
        data: "05/08/2023",
        resumo: "Estabelece normas para o funcionamento e utilização de espaços públicos no Estado.",
        conteudo: `
            <h2>Resolução nº 8.890 de 5 de agosto de 2023</h2>
            <p>Estabelece normas para funcionamento de espaços públicos.</p>
            <p><strong>Art. 1º</strong> Os espaços públicos devem ser utilizados de forma a garantir a segurança e o bem-estar da população.</p>
        `
    },
    {
        id: 5,
        numero: "9.102",
        tipo: "Lei",
        titulo: "Código de Saúde Pública Estadual",
        categoria: "saude",
        ano: 2024,
        data: "01/03/2024",
        resumo: "Estabelece normas de saúde pública para todo o Estado do Rio de Janeiro.",
        conteudo: `
            <h2>Lei nº 9.102 de 1º de março de 2024</h2>
            <p>Código de Saúde Pública Estadual.</p>
            <p><strong>Art. 1º</strong> A saúde é direito fundamental do povo.</p>
        `
    },
    {
        id: 6,
        numero: "8.765",
        tipo: "Decreto",
        titulo: "Estabelece Diretrizes de Urbanismo",
        categoria: "urbanismo",
        ano: 2023,
        data: "12/07/2023",
        resumo: "Define as diretrizes para planejamento urbano e desenvolvimento das cidades do RJ.",
        conteudo: `
            <h2>Decreto nº 8.765 de 12 de julho de 2023</h2>
            <p>Diretrizes de Urbanismo para o Estado do Rio de Janeiro.</p>
        `
    },
    {
        id: 7,
        numero: "8.945",
        tipo: "Portaria",
        titulo: "Regulamenta Contratações Públicas",
        categoria: "administrativa",
        ano: 2023,
        data: "22/09/2023",
        resumo: "Normas para processos de contratação pelo Estado do Rio de Janeiro.",
        conteudo: `
            <h2>Portaria nº 8.945 de 22 de setembro de 2023</h2>
            <p>Regulamenta contratações públicas.</p>
        `
    },
    {
        id: 8,
        numero: "9.010",
        tipo: "Lei",
        titulo: "Lei de Defesa do Consumidor Estadual",
        categoria: "comercial",
        ano: 2024,
        data: "10/01/2024",
        resumo: "Complementa o Código de Defesa do Consumidor no âmbito estadual.",
        conteudo: `
            <h2>Lei nº 9.010 de 10 de janeiro de 2024</h2>
            <p>Lei de Defesa do Consumidor Estadual.</p>
        `
    },
    {
        id: 9,
        numero: "8.850",
        tipo: "Lei",
        titulo: "Lei de Proteção ao Patrimônio Cultural",
        categoria: "administrativa",
        ano: 2023,
        data: "15/05/2023",
        resumo: "Protege e preserva o patrimônio histórico e cultural do Estado.",
        conteudo: `
            <h2>Lei nº 8.850 de 15 de maio de 2023</h2>
            <p>Proteção ao Patrimônio Cultural.</p>
        `
    },
    {
        id: 10,
        numero: "9.080",
        tipo: "Decreto",
        titulo: "Normas de Educação Estadual",
        categoria: "educacao",
        ano: 2024,
        data: "28/02/2024",
        resumo: "Estabelece normas gerais para a educação no Estado do Rio de Janeiro.",
        conteudo: `
            <h2>Decreto nº 9.080 de 28 de fevereiro de 2024</h2>
            <p>Normas de Educação Estadual.</p>
        `
    }
];
