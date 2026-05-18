// ============================================
// LegiRJ - Aplicação Principal
// ============================================

class LegiRJ {
    constructor() {
        this.leis = LEIS_RJ;
        this.cidades = CIDADES_RJ;
        this.categorias = CATEGORIAS;
        this.filteredLeis = [...this.leis];
        this.currentPage = 1;
        this.perPage = 12;
        this.viewMode = 'grid';
        this.favorites = this.loadFavorites();
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.cacheElements();
        this.renderCidades();
        this.renderCategorias();
        this.renderLeiRecentes();
        this.renderLeisMaisVisualizadas();
        this.populateFilters();
        this.renderFooterCidades();
        this.bindEvents();
        this.updateStats();
        this.render();
        this.updateFavoritesCount();
        this.setupPWA();
        this.handleUrlParams();
        this.applyPremiumState();
    }

    applyPremiumState() {
        if (typeof premium !== 'undefined' && premium.isPremium()) {
            document.querySelectorAll('.ad-banner').forEach(ad => ad.style.display = 'none');
            const banner = document.querySelector('.premium-banner-cta');
            if (banner) banner.parentElement.style.display = 'none';
        }
    }

    /* ===== PWA INSTALL ===== */
    setupPWA() {
        this.deferredPrompt = null;
        const installBtn = document.getElementById('installBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            if (installBtn) {
                installBtn.style.display = 'inline-flex';
                installBtn.addEventListener('click', () => this.installPWA());
            }
        });

        window.addEventListener('appinstalled', () => {
            this.showToast('🎉 App instalado com sucesso!');
            if (installBtn) installBtn.style.display = 'none';
            this.deferredPrompt = null;
        });

        // Detecta se já está instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            if (installBtn) installBtn.style.display = 'none';
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            this.showToast('💡 Use o menu do navegador para instalar');
            return;
        }
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            this.showToast('🎉 Instalando o app...');
        }
        this.deferredPrompt = null;
    }

    handleUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        const cidade = params.get('cidade');

        if (action === 'favorites') {
            setTimeout(() => this.showFavorites(), 500);
        }
        if (action === 'search') {
            setTimeout(() => this.searchInput.focus(), 500);
        }
        if (cidade) {
            this.cidadeFilter.value = cidade;
            this.applyFilters();
        }
    }

    cacheElements() {
        this.searchInput = document.getElementById('searchInput');
        this.cidadeFilter = document.getElementById('cidadeFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.typeFilter = document.getElementById('typeFilter');
        this.yearFilter = document.getElementById('yearFilter');
        this.sortBy = document.getElementById('sortBy');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.resultsList = document.getElementById('resultsList');
        this.resultsCount = document.getElementById('resultsCount');
        this.pagination = document.getElementById('pagination');
        this.cidadesGrid = document.getElementById('cidadesGrid');
        this.categoriasGrid = document.getElementById('categoriasGrid');
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modalBody');
        this.toast = document.getElementById('toast');
        this.loadingBar = document.getElementById('loadingBar');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.favoritesBtn = document.getElementById('favoritesBtn');
        this.favoritesCount = document.getElementById('favoritesCount');
        this.shareAppBtn = document.getElementById('shareAppBtn');
    }

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.applyFilters());
        this.cidadeFilter.addEventListener('change', () => this.applyFilters());
        this.categoryFilter.addEventListener('change', () => this.applyFilters());
        this.typeFilter.addEventListener('change', () => this.applyFilters());
        this.yearFilter.addEventListener('change', () => this.applyFilters());
        this.sortBy.addEventListener('change', () => this.applyFilters());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        if (this.favoritesBtn) this.favoritesBtn.addEventListener('click', () => this.showFavorites());
        if (this.shareAppBtn) this.shareAppBtn.addEventListener('click', () => this.shareApp('native'));

        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.searchInput.value = tag.dataset.search;
                this.applyFilters();
                this.scrollToResults();
            });
        });

        document.querySelector('.btn-search').addEventListener('click', () => {
            this.applyFilters();
            this.scrollToResults();
        });

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.viewMode = btn.dataset.view;
                this.resultsList.classList.toggle('list-view', this.viewMode === 'list');
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.key === '/' && document.activeElement !== this.searchInput) {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    populateFilters() {
        this.cidades.forEach(cidade => {
            const opt = document.createElement('option');
            opt.value = cidade.id;
            opt.textContent = `${cidade.icone} ${cidade.nome}`;
            this.cidadeFilter.appendChild(opt);
        });

        this.categorias.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = `${cat.icone} ${cat.nome}`;
            this.categoryFilter.appendChild(opt);
        });
    }

    renderCidades() {
        const counts = {};
        this.leis.forEach(l => counts[l.cidade] = (counts[l.cidade] || 0) + 1);

        this.cidadesGrid.innerHTML = this.cidades.map(cidade => `
            <div class="cidade-card" data-cidade="${cidade.id}">
                <div class="cidade-icon">${cidade.icone}</div>
                <div class="cidade-nome">${cidade.nome}</div>
                <div class="cidade-count">${counts[cidade.id] || 0} leis</div>
            </div>
        `).join('');

        this.cidadesGrid.querySelectorAll('.cidade-card').forEach(card => {
            card.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                this.cidadesGrid.querySelectorAll('.cidade-card').forEach(c => c.classList.remove('active'));
                if (!isActive) {
                    card.classList.add('active');
                    this.cidadeFilter.value = card.dataset.cidade;
                } else {
                    this.cidadeFilter.value = '';
                }
                this.applyFilters();
                this.scrollToResults();
            });
        });
    }

    renderCategorias() {
        this.categoriasGrid.innerHTML = this.categorias.map(cat => `
            <div class="categoria-card" data-categoria="${cat.id}" style="--cat-cor: ${cat.cor}">
                <span class="categoria-icon">${cat.icone}</span>
                <div class="categoria-nome">${cat.nome}</div>
            </div>
        `).join('');

        this.categoriasGrid.querySelectorAll('.categoria-card').forEach(card => {
            card.addEventListener('click', () => {
                const cat = this.categorias.find(c => c.id === card.dataset.categoria);
                const isActive = card.classList.contains('active');
                this.categoriasGrid.querySelectorAll('.categoria-card').forEach(c => {
                    c.classList.remove('active');
                    c.style.background = '';
                });
                if (!isActive) {
                    card.classList.add('active');
                    card.style.background = cat.cor;
                    this.categoryFilter.value = card.dataset.categoria;
                } else {
                    this.categoryFilter.value = '';
                }
                this.applyFilters();
                this.scrollToResults();
            });
        });
    }

    renderFooterCidades() {
        const footerCidades = document.getElementById('footerCidades');
        if (!footerCidades) return;
        footerCidades.innerHTML = this.cidades.slice(0, 6).map(c =>
            `<li><a href="#" onclick="app.filterByCidade('${c.id}'); return false;">${c.icone} ${c.nome}</a></li>`
        ).join('');
    }

    renderLeiRecentes() {
        const container = document.getElementById('leisRecentes');
        if (!container) return;

        const recentes = [...this.leis].sort((a, b) => {
            const dateA = new Date(a.data.split('/').reverse().join('-'));
            const dateB = new Date(b.data.split('/').reverse().join('-'));
            return dateB - dateA;
        }).slice(0, 6);

        container.innerHTML = recentes.map(lei => this.createFeaturedCard(lei)).join('');
        this.attachFeaturedListeners(container);
    }

    renderLeisMaisVisualizadas() {
        const container = document.getElementById('leisMaisVisualizadas');
        if (!container) return;

        const populares = [...this.leis].sort(() => Math.random() - 0.5).slice(0, 6);
        container.innerHTML = populares.map(lei => this.createFeaturedCard(lei)).join('');
        this.attachFeaturedListeners(container);
    }

    createFeaturedCard(lei) {
        const cidade = this.cidades.find(c => c.id === lei.cidade);
        const categoria = this.categorias.find(c => c.id === lei.categoria);

        return `
            <div class="lei-card-featured" data-id="${lei.id}">
                <div class="lei-numero">${lei.numero}</div>
                <h3 class="lei-title">${lei.titulo}</h3>
                <p class="lei-resumo">${lei.resumo.substring(0, 100)}...</p>
                <div class="lei-meta">
                    <span class="badge badge-cidade">${cidade?.icone || '🏛️'}</span>
                    <span class="badge badge-tipo">${categoria?.icone || '📋'}</span>
                    <span class="badge badge-ano">📅 ${lei.ano}</span>
                </div>
            </div>
        `;
    }

    attachFeaturedListeners(container) {
        container.querySelectorAll('.lei-card-featured').forEach(card => {
            card.addEventListener('click', () => {
                const lei = this.leis.find(l => l.id === parseInt(card.dataset.id));
                if (lei) this.openLeiPage(lei);
            });
        });
    }

    filterByCidade(id) {
        this.cidadeFilter.value = id;
        this.applyFilters();
        this.scrollToResults();
    }

    updateStats() {
        document.getElementById('totalLeis').textContent = this.leis.length;
        document.getElementById('totalCidades').textContent = this.cidades.length;
        document.getElementById('totalCategorias').textContent = this.categorias.length;
        this.animateCount('totalLeis', this.leis.length);
        this.animateCount('totalCidades', this.cidades.length);
        this.animateCount('totalCategorias', this.categorias.length);
    }

    animateCount(id, target) {
        const el = document.getElementById(id);
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current;
        }, 30);
    }

    applyFilters() {
        this.showLoading();
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const cidade = this.cidadeFilter.value;
        const category = this.categoryFilter.value;
        const type = this.typeFilter.value;
        const year = this.yearFilter.value;

        this.filteredLeis = this.leis.filter(lei => {
            const matchSearch = !searchTerm ||
                lei.titulo.toLowerCase().includes(searchTerm) ||
                lei.numero.toLowerCase().includes(searchTerm) ||
                lei.resumo.toLowerCase().includes(searchTerm) ||
                lei.categoria.toLowerCase().includes(searchTerm) ||
                this.getCidadeNome(lei.cidade).toLowerCase().includes(searchTerm);

            return matchSearch &&
                (!cidade || lei.cidade === cidade) &&
                (!category || lei.categoria === category) &&
                (!type || lei.tipo.toLowerCase() === type.toLowerCase()) &&
                (!year || lei.ano.toString() === year);
        });

        this.sortLeis();
        this.currentPage = 1;
        this.render();
        this.hideLoading();
    }

    sortLeis() {
        const sort = this.sortBy.value;
        switch (sort) {
            case 'recent':
                this.filteredLeis.sort((a, b) => b.ano - a.ano || b.id - a.id);
                break;
            case 'oldest':
                this.filteredLeis.sort((a, b) => a.ano - b.ano || a.id - b.id);
                break;
            case 'title':
                this.filteredLeis.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'number':
                this.filteredLeis.sort((a, b) => a.numero.localeCompare(b.numero));
                break;
        }
    }

    clearFilters() {
        this.searchInput.value = '';
        this.cidadeFilter.value = '';
        this.categoryFilter.value = '';
        this.typeFilter.value = '';
        this.yearFilter.value = '';
        this.sortBy.value = 'recent';
        this.cidadesGrid.querySelectorAll('.cidade-card').forEach(c => c.classList.remove('active'));
        this.categoriasGrid.querySelectorAll('.categoria-card').forEach(c => {
            c.classList.remove('active');
            c.style.background = '';
        });
        this.applyFilters();
        this.showToast('🔄 Filtros limpos');
    }

    render() {
        this.updateResultsCount();
        this.renderLeis();
        this.renderPagination();
        this.loadAds();
    }

    updateResultsCount() {
        const count = this.filteredLeis.length;
        this.resultsCount.textContent = `${count} ${count === 1 ? 'lei' : 'leis'}`;
    }

    renderLeis() {
        if (this.filteredLeis.length === 0) {
            const term = (this.searchInput.value || '').trim();
            const lexmlUrl = 'https://www.lexml.gov.br/busca/search?'
                + 'f1-localidade=' + encodeURIComponent('Rio de Janeiro')
                + '&f1-tipoDocumento=' + encodeURIComponent('Legislação')
                + (term ? '&keyword=' + encodeURIComponent(term) : '');
            this.resultsList.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                    <h3 style="margin-bottom: 0.5rem; color: var(--text);">Nenhuma lei encontrada no nosso acervo curado</h3>
                    <p style="margin-bottom:1.25rem;">Tente outros termos — ou consulte o acervo oficial do LexML (~50 mil normas do RJ).</p>
                    <a href="${lexmlUrl}" target="_blank" rel="noopener"
                       style="display:inline-block;padding:0.75rem 1.5rem;background:#0066CC;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">
                       Buscar${term ? ' "' + term.replace(/"/g,'&quot;') + '"' : ''} no LexML.gov.br ↗
                    </a>
                </div>
            `;
            return;
        }

        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        const pageItems = this.filteredLeis.slice(start, end);

        this.resultsList.innerHTML = pageItems.map(lei => this.createLeiCard(lei)).join('');
        this.attachCardListeners();
    }

    createLeiCard(lei) {
        const cidade = this.cidades.find(c => c.id === lei.cidade);
        const categoria = this.categorias.find(c => c.id === lei.categoria);
        const isFav = this.favorites.includes(lei.id);

        return `
            <div class="lei-card" data-id="${lei.id}">
                <div class="lei-card-header">
                    <div>
                        <div class="lei-numero-label">${lei.tipo} Nº</div>
                        <div class="lei-numero">${lei.numero}</div>
                    </div>
                    <button class="btn-favorite ${isFav ? 'active' : ''}" data-id="${lei.id}" title="Favoritar">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </div>
                <h3 class="lei-title">${lei.titulo}</h3>
                <div class="lei-meta">
                    <span class="badge badge-cidade">${cidade?.icone || '🏛️'} ${cidade?.nome || 'Estado'}</span>
                    <span class="badge badge-tipo">${categoria?.icone || '📋'} ${categoria?.nome || lei.categoria}</span>
                    <span class="badge badge-ano">📅 ${lei.ano}</span>
                </div>
                <p class="lei-resumo">${lei.resumo}</p>
                <div class="lei-fonte">
                    <span class="lei-fonte-icon">✓</span>
                    <span><strong>Fonte:</strong> ${lei.fonte}</span>
                </div>
                <div class="lei-actions">
                    <button class="btn-ler" data-id="${lei.id}">📖 Ler Completo</button>
                    <button class="btn-compartilhar" data-id="${lei.id}">📤 Compartilhar</button>
                </div>
            </div>
        `;
    }

    attachCardListeners() {
        document.querySelectorAll('.lei-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-favorite') || e.target.closest('.btn-compartilhar')) return;
                const lei = this.leis.find(l => l.id === parseInt(card.dataset.id));
                if (lei) this.openLeiPage(lei);
            });
        });

        document.querySelectorAll('.btn-ler').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lei = this.leis.find(l => l.id === parseInt(btn.dataset.id));
                if (lei) this.openLeiPage(lei);
            });
        });

        document.querySelectorAll('.btn-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(parseInt(btn.dataset.id));
            });
        });

        document.querySelectorAll('.btn-compartilhar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lei = this.leis.find(l => l.id === parseInt(btn.dataset.id));
                if (lei) this.shareLei(lei);
            });
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredLeis.length / this.perPage);
        if (totalPages <= 1) { this.pagination.innerHTML = ''; return; }

        let html = `<button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="app.goToPage(${this.currentPage - 1})">←</button>`;

        const pages = this.getPagesToShow(totalPages);
        pages.forEach(p => {
            if (p === '...') {
                html += `<span class="page-btn" style="background: transparent; border: none;">...</span>`;
            } else {
                html += `<button class="page-btn ${p === this.currentPage ? 'active' : ''}" onclick="app.goToPage(${p})">${p}</button>`;
            }
        });

        html += `<button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="app.goToPage(${this.currentPage + 1})">→</button>`;
        this.pagination.innerHTML = html;
    }

    getPagesToShow(total) {
        if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
        const c = this.currentPage;
        if (c <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (c >= total - 3) return [1, '...', total-4, total-3, total-2, total-1, total];
        return [1, '...', c-1, c, c+1, '...', total];
    }

    goToPage(page) {
        this.currentPage = page;
        this.render();
        this.scrollToResults();
    }

    openModal(lei) {
        const cidade = this.cidades.find(c => c.id === lei.cidade);
        const categoria = this.categorias.find(c => c.id === lei.categoria);
        const isFav = this.favorites.includes(lei.id);

        this.modalBody.innerHTML = `
            <h2>${lei.tipo} Nº ${lei.numero}</h2>
            <h3 style="color: var(--text); margin-top: 0.5rem; font-size: 1.25rem;">${lei.titulo}</h3>

            <div class="lei-meta" style="margin: 1.5rem 0;">
                <span class="badge badge-cidade">${cidade?.icone} ${cidade?.nome}</span>
                <span class="badge badge-tipo">${categoria?.icone} ${categoria?.nome}</span>
                <span class="badge badge-ano">📅 ${lei.data}</span>
            </div>

            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <div class="label">Tipo</div>
                    <div class="value">${lei.tipo}</div>
                </div>
                <div class="modal-info-item">
                    <div class="label">Número</div>
                    <div class="value">${lei.numero}</div>
                </div>
                <div class="modal-info-item">
                    <div class="label">Ano</div>
                    <div class="value">${lei.ano}</div>
                </div>
                <div class="modal-info-item">
                    <div class="label">Publicação</div>
                    <div class="value">${lei.data}</div>
                </div>
                <div class="modal-info-item">
                    <div class="label">Autor</div>
                    <div class="value">${lei.autor}</div>
                </div>
                <div class="modal-info-item">
                    <div class="label">Município</div>
                    <div class="value">${cidade?.nome}</div>
                </div>
            </div>

            <h3>📋 Resumo</h3>
            <p>${lei.resumo}</p>

            <h3>📜 Conteúdo</h3>
            <div>${lei.conteudo}</div>

            <div class="modal-fonte-box">
                <h4>✓ Fonte Oficial</h4>
                <p style="margin: 0.25rem 0;"><strong>${lei.fonte}</strong></p>
                <p style="margin: 0.5rem 0;">
                    🔗 <a href="${lei.fonteUrl}" target="_blank" rel="noopener noreferrer">Consultar texto oficial</a>
                </p>
                ${cidade ? `<p style="margin: 0.25rem 0; font-size: 0.85rem; color: var(--text-muted);">Portal: <a href="${cidade.url}" target="_blank" rel="noopener">${cidade.url}</a></p>` : ''}
            </div>

            <div class="modal-actions">
                <button class="btn-primary" onclick="app.shareLei(${JSON.stringify(lei).replace(/"/g, '&quot;')})">
                    📤 Compartilhar
                </button>
                <button class="btn-secondary" onclick="app.toggleFavorite(${lei.id}); app.refreshModalFav(${lei.id})">
                    <span id="modalFavIcon">${isFav ? '⭐' : '☆'}</span>
                    <span id="modalFavText">${isFav ? 'Favorito' : 'Favoritar'}</span>
                </button>
                <a href="${lei.fonteUrl}" target="_blank" rel="noopener" class="btn-secondary">
                    🔗 Ver Original
                </a>
                <button class="btn-secondary" onclick="window.print()">
                    🖨️ Imprimir
                </button>
            </div>
        `;
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.loadAds();
    }

    refreshModalFav(id) {
        const isFav = this.favorites.includes(id);
        const icon = document.getElementById('modalFavIcon');
        const text = document.getElementById('modalFavText');
        if (icon) icon.textContent = isFav ? '⭐' : '☆';
        if (text) text.textContent = isFav ? 'Favorito' : 'Favoritar';
    }

    closeModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    openLeiPage(lei) {
        const slug = `${lei.numero}-${this.slugify(lei.titulo)}`;
        const base = window.location.pathname.replace(/\/leis\/.*$/, '/').replace(/\/index\.html$/, '/');
        const url = `${base}leis/${slug}/`;
        window.location.href = url;
    }

    /* ===== FAVORITOS ===== */
    loadFavorites() {
        try { return JSON.parse(localStorage.getItem('legirj_favorites') || '[]'); }
        catch { return []; }
    }

    saveFavorites() {
        localStorage.setItem('legirj_favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(id) {
        const idx = this.favorites.indexOf(id);
        if (idx === -1) {
            this.favorites.push(id);
            this.showToast('⭐ Adicionado aos favoritos!');
        } else {
            this.favorites.splice(idx, 1);
            this.showToast('☆ Removido dos favoritos');
        }
        this.saveFavorites();
        this.updateFavoritesCount();
        this.render();
    }

    updateFavoritesCount() {
        this.favoritesCount.textContent = this.favorites.length;
        if (this.favorites.length === 0) {
            this.favoritesCount.style.display = 'none';
        } else {
            this.favoritesCount.style.display = 'flex';
        }
    }

    showFavorites() {
        if (this.favorites.length === 0) {
            this.showToast('💡 Você ainda não tem favoritos');
            return;
        }
        this.searchInput.value = '';
        this.cidadeFilter.value = '';
        this.categoryFilter.value = '';
        this.typeFilter.value = '';
        this.yearFilter.value = '';
        this.filteredLeis = this.leis.filter(l => this.favorites.includes(l.id));
        this.currentPage = 1;
        this.render();
        this.scrollToResults();
        this.showToast(`⭐ Mostrando ${this.favorites.length} favoritos`);
    }

    /* ===== DARK MODE ===== */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        if (this.themeIcon) this.themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        this.showToast(this.theme === 'dark' ? '🌙 Modo escuro ativado' : '☀️ Modo claro ativado');
    }

    /* ===== COMPARTILHAR ===== */
    shareLei(lei) {
        const url = `${window.location.origin}${window.location.pathname}#lei-${lei.id}`;
        const text = `${lei.tipo} nº ${lei.numero} - ${lei.titulo}\n\n${lei.resumo}\n\nVeja no LegiRJ:`;

        if (navigator.share) {
            navigator.share({ title: 'LegiRJ - ' + lei.titulo, text, url })
                .catch(() => this.copyToClipboard(`${text} ${url}`));
        } else {
            this.copyToClipboard(`${text} ${url}`);
        }
    }

    shareApp(platform) {
        const url = window.location.href;
        const text = '⚖️ LegiRJ - O maior portal de Leis e Decretos do RJ! Mais de 55 leis catalogadas com fontes oficiais.';

        const links = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        };

        if (platform === 'native' && navigator.share) {
            navigator.share({ title: 'LegiRJ', text, url }).catch(() => this.copyToClipboard(url));
        } else if (links[platform]) {
            window.open(links[platform], '_blank', 'noopener,noreferrer,width=600,height=500');
        } else {
            this.copyToClipboard(url);
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('✅ Link copiado!');
            }).catch(() => this.showToast('❌ Erro ao copiar'));
        }
    }

    /* ===== TOAST ===== */
    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => this.toast.classList.remove('show'), 3000);
    }

    /* ===== LOADING ===== */
    showLoading() {
        this.loadingBar.style.width = '70%';
    }

    hideLoading() {
        this.loadingBar.style.width = '100%';
        setTimeout(() => { this.loadingBar.style.width = '0%'; }, 300);
    }

    /* ===== HELPERS ===== */
    getCidadeNome(id) {
        return this.cidades.find(c => c.id === id)?.nome || id;
    }

    scrollToResults() {
        const target = document.querySelector('.main-content');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    loadAds() {
        if (window.adsbygoogle) {
            try {
                document.querySelectorAll('.adsbygoogle:not([data-ad-status])').forEach(() => {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                });
            } catch (e) { /* silently fail */ }
        }
    }
}

// Inicializa
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LegiRJ();
});

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('✅ Service Worker registrado'))
            .catch(err => console.log('SW falhou:', err));
    });
}
