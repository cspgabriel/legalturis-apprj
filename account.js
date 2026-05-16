// ============================================
// LegiRJ - Área do Assinante
// ============================================

class Account {
    constructor() {
        this.user = premium.user;
        this.init();
    }

    init() {
        if (!this.user) {
            document.getElementById('loginSection').style.display = 'flex';
            document.getElementById('accountSection').style.display = 'none';
            return;
        }

        this.populateUserData();
        this.bindTabs();
        this.renderOverview();
        this.renderReports();
        this.renderAlerts();
        this.renderFavorites();
        this.populateSettings();
        this.renderBilling();
        this.populateAlertForm();
        this.bindLogout();
    }

    populateUserData() {
        document.getElementById('userName').textContent = this.user.name;
        document.getElementById('userEmail').textContent = this.user.email;
        document.getElementById('userAvatar').textContent = this.user.name.charAt(0).toUpperCase();

        const planBadge = document.getElementById('userPlan');
        planBadge.textContent = this.user.planName || 'Gratuito';
        if (this.user.plan !== 'free') {
            planBadge.classList.add('premium');
        }

        // Hide upgrade button if already premium
        if (premium.isPremium()) {
            const upgradeBtn = document.getElementById('upgradeBtn');
            if (upgradeBtn) upgradeBtn.style.display = 'none';
        }
    }

    bindTabs() {
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.dashboard-pane').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`pane-${tab.dataset.tab}`).classList.add('active');
            });
        });
    }

    renderOverview() {
        const stats = this.user.stats || {};
        document.getElementById('statLeisLidas').textContent = stats.leisLidas || 0;
        document.getElementById('statFavoritos').textContent = stats.favoritos || JSON.parse(localStorage.getItem('legirj_favorites') || '[]').length;
        document.getElementById('statAlertas').textContent = (this.user.alerts || []).length;
        document.getElementById('statDownloads').textContent = stats.downloads || 0;

        const updates = [
            { icon: '📰', text: 'Lei nº 9.310 de Refinanciamento de Dívidas publicada', time: 'há 2 dias' },
            { icon: '⚖️', text: 'Decreto sobre habitação social atualizado', time: 'há 5 dias' },
            { icon: '🏛️', text: 'Nova lei ambiental do RJ entrou em vigor', time: 'há 1 semana' },
            { icon: '📋', text: 'Câmara do Rio publica resolução municipal', time: 'há 2 semanas' }
        ];

        document.getElementById('updatesList').innerHTML = updates.map(u => `
            <div class="update-item">
                <strong>${u.icon}</strong> ${u.text}
                <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem;">${u.time}</div>
            </div>
        `).join('');

        // Next report date
        const next = new Date();
        next.setMonth(next.getMonth() + 1);
        next.setDate(15);
        document.getElementById('nextReport').textContent = next.toLocaleDateString('pt-BR');
    }

    renderReports() {
        const isPremium = premium.isPremium();
        const locked = document.getElementById('reportsLocked');
        const content = document.getElementById('reportsContent');

        if (!isPremium) {
            locked.style.display = 'flex';
            content.style.display = 'none';
            return;
        }

        const reports = this.user.reports || [];
        const list = document.getElementById('reportsList');

        if (reports.length === 0) {
            list.innerHTML = '<p class="muted">Seus relatórios aparecerão aqui em breve.</p>';
            return;
        }

        list.innerHTML = reports.map(r => `
            <div class="report-card" onclick="account.openReport('${r.id}')">
                <div class="report-card-month">${r.month} ${r.year}</div>
                <div class="report-card-title">${r.title}</div>
                <p class="muted" style="font-size: 0.85rem; margin-top: 0.5rem;">${r.summary}</p>
                <button class="btn-secondary" style="margin-top: 1rem; width: 100%;">📥 Baixar PDF</button>
            </div>
        `).join('');
    }

    renderAlerts() {
        const isPremium = premium.isPremium();
        const locked = document.getElementById('alertsLocked');
        const content = document.getElementById('alertsContent');

        if (!isPremium) {
            locked.style.display = 'flex';
            content.style.display = 'none';
            return;
        }

        const alerts = this.user.alerts || [];
        const list = document.getElementById('alertsList');

        if (alerts.length === 0) {
            list.innerHTML = '<p class="muted">Você ainda não tem alertas configurados. Crie seu primeiro!</p>';
            return;
        }

        list.innerHTML = alerts.map((a, i) => `
            <div class="alert-item">
                <div class="alert-info">
                    <h4>🔔 ${a.name}</h4>
                    <span>Palavras-chave: ${a.keywords || 'Nenhuma'} · ${a.city || 'Todas cidades'} · ${a.category || 'Todas categorias'}</span>
                </div>
                <button class="btn-secondary" onclick="account.deleteAlert(${i})">🗑️ Excluir</button>
            </div>
        `).join('');
    }

    renderFavorites() {
        const favoriteIds = JSON.parse(localStorage.getItem('legirj_favorites') || '[]');
        const list = document.getElementById('favoritesListDash');

        if (favoriteIds.length === 0 || typeof LEIS_RJ === 'undefined') {
            list.innerHTML = '<p class="muted">Você ainda não tem favoritos. Acesse o portal e marque suas leis preferidas!</p>';
            return;
        }

        const favs = LEIS_RJ.filter(l => favoriteIds.includes(l.id));
        list.innerHTML = `<div class="reports-grid">${favs.map(lei => `
            <div class="report-card" onclick="window.location.href='leis/${lei.numero}-${this.slugify(lei.titulo)}/'">
                <div class="report-card-month">${lei.tipo} · ${lei.ano}</div>
                <div class="report-card-title">${lei.numero} - ${lei.titulo}</div>
                <p class="muted" style="font-size: 0.85rem; margin-top: 0.5rem;">${lei.resumo.substring(0, 100)}...</p>
            </div>
        `).join('')}</div>`;
    }

    slugify(text) {
        return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    }

    populateSettings() {
        document.getElementById('settingsName').value = this.user.name || '';
        document.getElementById('settingsEmail').value = this.user.email || '';
        document.getElementById('settingsPhone').value = this.user.phone || '';
        document.getElementById('settingsFreq').value = this.user.reportFreq || 'monthly';
        document.getElementById('settingsNewsletter').checked = this.user.newsletter !== false;
        document.getElementById('settingsPush').checked = this.user.push !== false;
    }

    saveSettings(e) {
        e.preventDefault();
        this.user.name = document.getElementById('settingsName').value;
        this.user.phone = document.getElementById('settingsPhone').value;
        this.user.reportFreq = document.getElementById('settingsFreq').value;
        this.user.newsletter = document.getElementById('settingsNewsletter').checked;
        this.user.push = document.getElementById('settingsPush').checked;
        premium.saveUser(this.user);
        this.populateUserData();
        premium.showToast('💾 Configurações salvas!');
    }

    renderBilling() {
        document.getElementById('billingPlan').textContent = this.user.planName || 'Gratuito';

        if (this.user.nextBilling) {
            const next = new Date(this.user.nextBilling);
            document.getElementById('billingDate').textContent = `Próxima cobrança: ${next.toLocaleDateString('pt-BR')}`;
        } else if (this.user.trialEnds) {
            const ends = new Date(this.user.trialEnds);
            document.getElementById('billingDate').textContent = `Trial termina em: ${ends.toLocaleDateString('pt-BR')}`;
        }

        // Mock billing history if premium
        if (premium.isPremium() && this.user.plan !== 'trial') {
            const list = document.getElementById('billingList');
            const today = new Date();
            const months = [0, 1, 2].map(i => {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 5);
                return {
                    date: d.toLocaleDateString('pt-BR'),
                    amount: PREMIUM_PLANS[this.user.plan]?.preco || 29.90,
                    status: '✓ Pago'
                };
            });
            list.innerHTML = `
                <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
                    ${months.map(m => `
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--radius);">
                            <span>${m.date}</span>
                            <span>R$ ${m.amount.toFixed(2).replace('.', ',')}</span>
                            <span style="color: var(--success);">${m.status}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    populateAlertForm() {
        const citySelect = document.getElementById('alertCity');
        const catSelect = document.getElementById('alertCategory');
        if (typeof CIDADES_RJ !== 'undefined' && citySelect) {
            CIDADES_RJ.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = `${c.icone} ${c.nome}`;
                citySelect.appendChild(opt);
            });
        }
        if (typeof CATEGORIAS !== 'undefined' && catSelect) {
            CATEGORIAS.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = `${c.icone} ${c.nome}`;
                catSelect.appendChild(opt);
            });
        }
    }

    newAlert() {
        if (!premium.isPremium()) {
            premium.showToast('🔒 Alertas são um recurso Premium');
            setTimeout(() => window.location.href = 'premium.html', 1500);
            return;
        }
        document.getElementById('alertModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeAlertModal() {
        document.getElementById('alertModal').classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    saveAlert(e) {
        e.preventDefault();
        const alert = {
            name: document.getElementById('alertName').value,
            keywords: document.getElementById('alertKeywords').value,
            city: document.getElementById('alertCity').value,
            category: document.getElementById('alertCategory').value,
            email: document.getElementById('alertEmail').checked,
            push: document.getElementById('alertPush').checked,
            sms: document.getElementById('alertSms').checked,
            createdAt: new Date().toISOString()
        };
        this.user.alerts = this.user.alerts || [];
        this.user.alerts.push(alert);
        premium.saveUser(this.user);
        this.renderAlerts();
        this.renderOverview();
        this.closeAlertModal();
        premium.showToast('🔔 Alerta criado com sucesso!');
        document.getElementById('alertForm').reset();
    }

    deleteAlert(idx) {
        if (!confirm('Excluir este alerta?')) return;
        this.user.alerts.splice(idx, 1);
        premium.saveUser(this.user);
        this.renderAlerts();
        this.renderOverview();
        premium.showToast('🗑️ Alerta excluído');
    }

    openReport(id) {
        if (!premium.isPremium()) {
            premium.showToast('🔒 Recurso Premium');
            return;
        }
        premium.showToast('📄 Abrindo relatório...');
    }

    previewReport() {
        premium.showToast('👁️ Carregando prévia do relatório...');
    }

    login(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const user = {
            name: email.split('@')[0],
            email,
            plan: 'free',
            planName: 'Gratuito',
            subscribedAt: new Date().toISOString(),
            alerts: [],
            stats: { leisLidas: 0, favoritos: 0, alertas: 0, downloads: 0 }
        };
        premium.saveUser(user);
        premium.showToast('✓ Login realizado!');
        setTimeout(() => location.reload(), 1000);
    }

    loginGoogle() {
        premium.showToast('🌐 Redirecionando para Google...');
        setTimeout(() => {
            const user = {
                name: 'Usuário Google',
                email: 'usuario@gmail.com',
                plan: 'free',
                planName: 'Gratuito',
                subscribedAt: new Date().toISOString(),
                alerts: [],
                stats: { leisLidas: 0, favoritos: 0, alertas: 0, downloads: 0 }
            };
            premium.saveUser(user);
            location.reload();
        }, 1500);
    }

    bindLogout() {
        const btn = document.getElementById('logoutBtn');
        if (btn) btn.addEventListener('click', () => premium.logout());
    }
}

const account = new Account();
window.account = account;
