class LegiRJ {
    constructor() {
        this.leis = LEIS_RJ;
        this.filteredLeis = [...this.leis];
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.render();
        this.loadAds();
    }

    cacheElements() {
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.typeFilter = document.getElementById('typeFilter');
        this.yearFilter = document.getElementById('yearFilter');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.resultsList = document.getElementById('resultsList');
        this.resultsCount = document.getElementById('resultsCount');
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modalBody');
        this.closeBtn = document.querySelector('.close');
    }

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.typeFilter.addEventListener('change', () => this.applyFilters());
        this.yearFilter.addEventListener('change', () => this.applyFilters());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    applyFilters() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const category = this.categoryFilter.value;
        const type = this.typeFilter.value;
        const year = this.yearFilter.value;

        this.filteredLeis = this.leis.filter(lei => {
            const matchSearch =
                lei.titulo.toLowerCase().includes(searchTerm) ||
                lei.numero.toLowerCase().includes(searchTerm) ||
                lei.categoria.toLowerCase().includes(searchTerm);

            const matchCategory = !category || lei.categoria === category;
            const matchType = !type || lei.tipo.toLowerCase() === type.toLowerCase();
            const matchYear = !year || lei.ano.toString() === year;

            return matchSearch && matchCategory && matchType && matchYear;
        });

        this.render();
    }

    clearFilters() {
        this.searchInput.value = '';
        this.categoryFilter.value = '';
        this.typeFilter.value = '';
        this.yearFilter.value = '';
        this.filteredLeis = [...this.leis];
        this.render();
    }

    render() {
        this.updateResultsCount();
        this.renderLeis();
        this.loadAds();
    }

    updateResultsCount() {
        const count = this.filteredLeis.length;
        this.resultsCount.textContent = `${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }

    renderLeis() {
        if (this.filteredLeis.length === 0) {
            this.resultsList.innerHTML = '<div class="loading">Nenhuma lei encontrada. Tente ajustar os filtros.</div>';
            return;
        }

        this.resultsList.innerHTML = this.filteredLeis.map(lei => this.createLeiCard(lei)).join('');
        this.attachCardListeners();
    }

    createLeiCard(lei) {
        return `
            <div class="lei-card" data-id="${lei.id}">
                <h3>${lei.numero} - ${lei.titulo}</h3>
                <div class="lei-meta">
                    <span class="badge badge-tipo">${lei.tipo}</span>
                    <span class="badge badge-categoria">${this.getCategoryLabel(lei.categoria)}</span>
                    <span class="badge badge-ano">${lei.ano}</span>
                </div>
                <p class="lei-resumo">${lei.resumo}</p>
                <div class="lei-actions">
                    <button class="btn-ler" data-id="${lei.id}">📖 Ler Completo</button>
                    <button class="btn-compartilhar" onclick="app.shareText('${lei.numero} - ${lei.titulo}')">📤 Compartilhar</button>
                </div>
            </div>
        `;
    }

    getCategoryLabel(category) {
        const labels = {
            tributaria: 'Tributária',
            ambiental: 'Ambiental',
            trabalhista: 'Trabalhista',
            administrativa: 'Administrativa',
            penal: 'Penal',
            civil: 'Civil',
            comercial: 'Comercial',
            saude: 'Saúde',
            educacao: 'Educação',
            urbanismo: 'Urbanismo'
        };
        return labels[category] || category;
    }

    attachCardListeners() {
        document.querySelectorAll('.btn-ler').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const lei = this.leis.find(l => l.id === id);
                if (lei) this.openModal(lei);
            });
        });
    }

    openModal(lei) {
        this.modalBody.innerHTML = `
            <button class="close" onclick="app.closeModal()">&times;</button>
            ${lei.conteudo}
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
                <p><strong>Lei nº ${lei.numero}</strong></p>
                <p>Tipo: ${lei.tipo} | Categoria: ${this.getCategoryLabel(lei.categoria)} | Ano: ${lei.ano}</p>
                <p style="font-size: 0.9rem; color: #666;">Publicado em: ${lei.data}</p>
            </div>
        `;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.loadAds();
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    shareText(text) {
        if (navigator.share) {
            navigator.share({
                title: 'LegiRJ',
                text: text,
                url: window.location.href
            }).catch(err => console.log('Erro ao compartilhar:', err));
        } else {
            const url = `${text} - ${window.location.href}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    alert('✅ Copiado para a área de transferência!');
                });
            }
        }
    }

    loadAds() {
        if (window.adsbygoogle) {
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.log('AdSense não carregado');
            }
        }
    }
}

// Inicializa a aplicação
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LegiRJ();
});
