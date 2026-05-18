# LegalTuris RJ — Portal de Leis e Decretos do Rio de Janeiro

> **Status v2.0**: Banco JSON chunked com 286+ normas indexadas (LexML + curadoria),
> busca client-side com filtros e paginação, página de detalhe dinâmica.
> Pipeline de scraping Python documentado em [`docs/SCRAPERS.md`](docs/SCRAPERS.md).

## 🔥 O que tem aqui

- **Site estático** (`index.html`, `buscar.html`, `lei.html?id=X`) — sem backend
- **Banco JSON chunked** em `api/leis-bulk/` — escala até ~50k leis sem migração
- **Cliente JS** (`db-client.js`) — fetch sob demanda, índice invertido, paginação
- **Scrapers Python** (`scripts/scrapers/`) — LexML (funciona), ALERJ + CMRJ (rede-dependente)
- **Pipeline de build** (`scripts/pipeline/`) — consolida CSVs → JSON chunked
- **GitHub Actions** (`.github/workflows/refresh-leis.yml`) — refresh semanal automático

## 📚 Documentação

| Doc | Assunto |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Stack, camadas, roteamento, cache |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Schema, formatos JSON, cliente JS |
| [`docs/SCRAPERS.md`](docs/SCRAPERS.md) | Como funciona cada fonte, limitações, como adicionar nova |

## 🚀 Quick start

```bash
# Servir site local
python -m http.server 8000

# Popular banco (LexML — funciona em qualquer rede)
pip install -r scripts/requirements.txt
PYTHONUTF8=1 python -m scripts.scrapers.lexml --max 5000
PYTHONUTF8=1 python -m scripts.pipeline.seed_from_existing
PYTHONUTF8=1 python -m scripts.pipeline.build_db
```

---

## 📋 Descrição

LegiRJ é uma aplicação web para consulta de leis, decretos, resoluções e portarias do Estado do Rio de Janeiro. A plataforma oferece:

- 🔍 **Busca avançada** por número, título e conteúdo
- 📂 **Filtros por categoria** (Tributária, Ambiental, Trabalhista, etc.)
- 📄 **Múltiplos tipos** de documentos legais
- 📅 **Filtro por ano** de publicação
- 📱 **Design responsivo** para mobile e desktop
- 💰 **Monetização** com Google AdSense

## 🚀 Funcionalidades

### Busca e Filtros
- Busca em tempo real por título, número ou categoria
- Filtros independentes por tipo, categoria e ano
- Visualização rápida de resultados

### Visualização
- Cards informativos com resumos das leis
- Modal completo com conteúdo integral
- Badges para identificar tipo, categoria e ano
- Paginação automática

### Compartilhamento
- Botão de compartilhamento para redes sociais
- Compatibilidade com Web Share API
- Fallback para copiar para área de transferência

## 💰 Google AdSense

A aplicação está preparada para monetização com Google AdSense em 3 locais:

1. **Header AdSense** - Banner no topo da página (320x50)
2. **Middle AdSense** - Anúncio entre a busca e resultados
3. **Modal AdSense** - Anúncio dentro do modal de detalhes

### Configurar AdSense

Substitua `ca-pub-xxxxxxxxxxxxxxxx` pelos seus IDs:

1. No arquivo `index.html`:
   - Linha 5: ID principal do AdSense
   - Linhas 19-20: Header Ad Slot
   - Linhas 73-76: Middle Ad Slot
   - Linhas 98-101: Modal Ad Slot

2. Após configurar, o AdSense iniciará exibição em 24-48 horas

## 🛠️ Estrutura do Projeto

```
legalturis-apprj/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js              # Lógica da aplicação
├── data.js             # Base de dados de leis (exemplo)
├── README.md           # Este arquivo
└── _config.yml         # Configuração Jekyll
```

## 📦 Dados das Leis

O arquivo `data.js` contém um array `LEIS_RJ` com estrutura:

```javascript
{
    id: 1,
    numero: "9.064",
    tipo: "Lei",
    titulo: "Institui o Programa...",
    categoria: "comercial",
    ano: 2024,
    data: "15/01/2024",
    resumo: "...",
    conteudo: "..."
}
```

### Categorias Disponíveis

- `tributaria` - Tributária
- `ambiental` - Ambiental
- `trabalhista` - Trabalhista
- `administrativa` - Administrativa
- `penal` - Penal
- `civil` - Civil
- `comercial` - Comercial
- `saude` - Saúde
- `educacao` - Educação
- `urbanismo` - Urbanismo

### Tipos de Documentos

- Lei
- Decreto
- Resolução
- Portaria

## 🌐 Deploy

A aplicação está pronta para deploy em:
- **GitHub Pages** - Hospedagem gratuita
- **Vercel** - Deploy automático
- **Netlify** - Hospedagem com CI/CD
- **Servidor web** - Qualquer servidor HTTP

## 📱 Responsividade

A aplicação é totalmente responsiva:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Dados Sensíveis

⚠️ Este é um portal informativo. Para informações legais precisas e binding, consulte:
- [ALERJ - Assembleia Legislativa do Estado do Rio de Janeiro](https://www.alerj.rj.gov.br)
- Imprensa Oficial do Estado do RJ

## 📈 SEO e Performance

- ✅ Meta tags configuradas
- ✅ Viewport responsivo
- ✅ CSS otimizado
- ✅ JavaScript minificável
- ✅ Lazy loading de anúncios

## 🎨 Customização

### Cores
Edite as variáveis CSS em `styles.css`:
```css
:root {
    --primary: #1e3a8a;
    --secondary: #3b82f6;
    --accent: #f59e0b;
}
```

### Fontes
Altere a família de fontes em `body` do CSS

## 📞 Suporte

Para adicionar mais leis ao banco de dados, edite o arquivo `data.js` seguindo a estrutura estabelecida.

## 📄 Licença

© 2026 LegiRJ - Todos os direitos reservados

---

**URL de Produção:** https://cspgabriel.github.io/legalturis-apprj
