// ============================================
// LegiRJ - Notícias Jurídicas (Lógica)
// ============================================

class NoticiasApp {
    constructor() {
        this.noticias = NOTICIAS;
        this.fontes = FONTES_NOTICIAS;
        this.categorias = CATEGORIAS_NOTICIAS;
        this.filtered = [...this.noticias];
        this.currentPage = 1;
        this.perPage = 12;
        this.init();
    }

    init() {
        this.applyTheme();
        this.cacheElements();
        this.renderHeroFontes();
        this.populateFilters();
        this.renderCheckboxes();
        this.bindEvents();
        this.applyFilters();
        this.loadSavedAlertas();
    }

    applyTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }

    cacheElements() {
        this.search = document.getElementById('searchNoticias');
        this.filtroFonte = document.getElementById('filtroFonte');
        this.filtroCat = document.getElementById('filtroCategoria');
        this.clearBtn = document.getElementById('clearFiltrosNoticias');
        this.grid = document.getElementById('noticiasGrid');
        this.count = document.getElementById('countNoticias');
        this.pagination = document.getElementById('paginacaoNoticias');
        this.alertasModal = document.getElementById('alertasModal');
    }

    renderHeroFontes() {
        const c = document.getElementById('heroFontes');
        if (!c) return;
        c.innerHTML = this.fontes.map(f =>
            `<span class="fonte-badge-hero">${f.icone} ${f.nome}</span>`
        ).join('');
    }

    populateFilters() {
        this.fontes.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = `${f.icone} ${f.nome} - ${f.nomeCompleto}`;
            this.filtroFonte.appendChild(opt);
        });
        this.categorias.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.icone} ${c.nome}`;
            this.filtroCat.appendChild(opt);
        });
    }

    renderCheckboxes() {
        const cFontes = document.getElementById('checkboxFontes');
        const cCats = document.getElementById('checkboxCategorias');
        if (cFontes) {
            cFontes.innerHTML = this.fontes.map(f => `
                <label>
                    <input type="checkbox" name="fonte" value="${f.id}" checked>
                    ${f.icone} ${f.nome}
                </label>
            `).join('');
        }
        if (cCats) {
            cCats.innerHTML = this.categorias.map(c => `
                <label>
                    <input type="checkbox" name="categoria" value="${c.id}" checked>
                    ${c.icone} ${c.nome}
                </label>
            `).join('');
        }
    }

    bindEvents() {
        this.search.addEventListener('input', () => this.applyFilters());
        this.filtroFonte.addEventListener('change', () => this.applyFilters());
        this.filtroCat.addEventListener('change', () => this.applyFilters());
        this.clearBtn.addEventListener('click', () => this.clearFilters());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAlertasModal();
        });
    }

    applyFilters() {
        const q = this.search.value.toLowerCase().trim();
        const fonte = this.filtroFonte.value;
        const cat = this.filtroCat.value;

        this.filtered = this.noticias.filter(n => {
            if (fonte && n.fonte !== fonte) return false;
            if (cat && n.categoria !== cat) return false;
            if (q) {
                const text = `${n.titulo} ${n.resumo} ${n.tags.join(' ')}`.toLowerCase();
                if (!text.includes(q)) return false;
            }
            return true;
        });

        this.filtered.sort((a, b) => new Date(b.data) - new Date(a.data));
        this.currentPage = 1;
        this.render();
    }

    clearFilters() {
        this.search.value = '';
        this.filtroFonte.value = '';
        this.filtroCat.value = '';
        this.applyFilters();
    }

    render() {
        const total = this.filtered.length;
        this.count.textContent = `${total} notícia${total === 1 ? '' : 's'}`;

        if (total === 0) {
            this.grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>Nenhuma notícia encontrada</h3>
                    <p style="color: var(--text-muted);">Tente ajustar os filtros</p>
                </div>
            `;
            this.pagination.innerHTML = '';
            return;
        }

        const start = (this.currentPage - 1) * this.perPage;
        const items = this.filtered.slice(start, start + this.perPage);

        this.grid.innerHTML = items.map(n => this.cardHTML(n)).join('');
        this.renderPagination();
    }

    cardHTML(n) {
        const fonte = this.fontes.find(f => f.id === n.fonte);
        const cat = this.categorias.find(c => c.id === n.categoria);
        const data = new Date(n.data).toLocaleDateString('pt-BR');

        return `
            <article class="noticia-card" style="--fonte-cor: ${fonte?.cor || '#1e3a8a'}">
                <div class="noticia-header">
                    <span class="noticia-fonte">${fonte?.icone} ${fonte?.nome}</span>
                    <span class="noticia-data">${data}</span>
                </div>
                <h3 class="noticia-titulo">${n.titulo}</h3>
                <p class="noticia-resumo">${n.resumo}</p>
                <div class="noticia-tags">
                    <span class="noticia-tag">${cat?.icone} ${cat?.nome}</span>
                    ${n.tags.slice(0, 2).map(t => `<span class="noticia-tag">#${t}</span>`).join('')}
                </div>
                <div class="noticia-actions">
                    <a href="${n.link}" target="_blank" rel="noopener noreferrer">🔗 Ler na fonte</a>
                    <button onclick="noticias.share(${n.id})">📤 Compartilhar</button>
                </div>
            </article>
        `;
    }

    renderPagination() {
        const total = Math.ceil(this.filtered.length / this.perPage);
        if (total <= 1) { this.pagination.innerHTML = ''; return; }

        let html = `<button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="noticias.goToPage(${this.currentPage - 1})">←</button>`;
        for (let i = 1; i <= total; i++) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="noticias.goToPage(${i})">${i}</button>`;
        }
        html += `<button class="page-btn" ${this.currentPage === total ? 'disabled' : ''} onclick="noticias.goToPage(${this.currentPage + 1})">→</button>`;
        this.pagination.innerHTML = html;
    }

    goToPage(p) {
        this.currentPage = p;
        this.render();
        window.scrollTo({ top: this.grid.offsetTop - 100, behavior: 'smooth' });
    }

    share(id) {
        const n = this.noticias.find(x => x.id === id);
        if (!n) return;
        const text = `${n.titulo}\n\n${n.resumo}`;
        if (navigator.share) {
            navigator.share({ title: n.titulo, text, url: n.link });
        } else {
            navigator.clipboard?.writeText(`${text}\n${n.link}`);
            this.showToast('✅ Link copiado!');
        }
    }

    /* ===== ALERTAS ===== */
    openAlertasModal() {
        this.alertasModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeAlertasModal() {
        this.alertasModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    loadSavedAlertas() {
        try {
            const saved = JSON.parse(localStorage.getItem('legirj_alertas_noticias') || 'null');
            if (!saved) return;
            document.getElementById('alertasEmail').value = saved.email || '';
            document.getElementById('alertasFreq').value = saved.freq || 'semanal';
            document.getElementById('alertasKeywords').value = saved.keywords || '';
            document.getElementById('alertasPush').checked = saved.push !== false;

            document.querySelectorAll('input[name="fonte"]').forEach(cb => {
                cb.checked = !saved.fontes || saved.fontes.includes(cb.value);
            });
            document.querySelectorAll('input[name="categoria"]').forEach(cb => {
                cb.checked = !saved.categorias || saved.categorias.includes(cb.value);
            });
        } catch {}
    }

    salvarAlertas(e) {
        e.preventDefault();
        const email = document.getElementById('alertasEmail').value;
        const freq = document.getElementById('alertasFreq').value;
        const keywords = document.getElementById('alertasKeywords').value;
        const push = document.getElementById('alertasPush').checked;
        const fontes = [...document.querySelectorAll('input[name="fonte"]:checked')].map(c => c.value);
        const categorias = [...document.querySelectorAll('input[name="categoria"]:checked')].map(c => c.value);

        const config = { email, freq, keywords, push, fontes, categorias, savedAt: new Date().toISOString() };
        localStorage.setItem('legirj_alertas_noticias', JSON.stringify(config));

        const freqLabel = {
            diaria: 'diariamente',
            semanal: 'toda segunda-feira',
            mensal: 'todo dia 1 do mês',
            instantaneo: 'assim que publicado'
        }[freq];

        const resumo = document.getElementById('alertasResumo');
        resumo.innerHTML = `
            ✅ <strong>Alertas configurados!</strong><br>
            Você receberá notícias de <strong>${fontes.length} fonte(s)</strong>
            sobre <strong>${categorias.length} área(s)</strong>
            no email <strong>${email}</strong> <strong>${freqLabel}</strong>.
        `;

        this.showToast('🔔 Alertas configurados com sucesso!');
        if (push && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        setTimeout(() => this.closeAlertasModal(), 2000);
    }

    showToast(msg) {
        let toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

const noticias = new NoticiasApp();
window.noticias = noticias;
