// ============================================
// LegiRJ Premium - Sistema de Assinatura
// ============================================

const PREMIUM_PLANS = {
    mensal: {
        nome: 'Premium Mensal',
        preco: 29.90,
        precoOld: 49.90,
        periodo: 'mês',
        features: ['Sem anúncios', 'Relatórios mensais', 'Alertas personalizados', 'Downloads PDF', 'API de consulta']
    },
    anual: {
        nome: 'Premium Anual',
        preco: 215.28,
        precoOld: 358.80,
        periodo: 'ano',
        features: ['Tudo do mensal', '40% de desconto', 'Bônus de 2 meses']
    },
    profissional: {
        nome: 'Profissional',
        preco: 79.90,
        precoOld: null,
        periodo: 'mês',
        features: ['Tudo do Premium', '5 usuários', 'White-label', 'API ilimitada', 'Consultor dedicado']
    }
};

class Premium {
    constructor() {
        this.user = this.loadUser();
        this.selectedPlan = null;
        this.init();
    }

    init() {
        this.applyTheme();
        this.updateNavUI();
    }

    applyTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }

    loadUser() {
        try {
            return JSON.parse(localStorage.getItem('legirj_user') || 'null');
        } catch {
            return null;
        }
    }

    saveUser(user) {
        localStorage.setItem('legirj_user', JSON.stringify(user));
        this.user = user;
    }

    updateNavUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.user) {
            loginBtn.innerHTML = `<span>👤</span> ${this.user.name || 'Minha Conta'}`;
        }
    }

    isPremium() {
        return this.user && this.user.plan && this.user.plan !== 'free';
    }

    /* ===== SUBSCRIBE FLOW ===== */
    subscribe(planType) {
        this.selectedPlan = planType;
        this.openCheckout(planType);
    }

    openCheckout(planType) {
        const plan = PREMIUM_PLANS[planType];
        if (!plan) return;

        const modal = document.getElementById('checkoutModal');
        const body = document.getElementById('checkoutBody');

        body.innerHTML = `
            <h2>🚀 Finalizar Assinatura</h2>
            <p class="checkout-desc">Você está a um passo de desbloquear recursos exclusivos</p>

            <div class="checkout-plan-summary">
                <h3>${plan.nome}</h3>
                <div class="comparison-price" style="font-size: 1.75rem; text-align: left;">
                    ${plan.precoOld ? `<span class="price-old">R$ ${plan.precoOld.toFixed(2).replace('.', ',')}</span>` : ''}
                    R$ ${plan.preco.toFixed(2).replace('.', ',')}<small>/${plan.periodo}</small>
                </div>
                <ul style="margin-top: 1rem; padding-left: 1.25rem;">
                    ${plan.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
            </div>

            <form class="checkout-form" onsubmit="premium.processPayment(event)">
                <div class="form-group">
                    <label>Nome completo</label>
                    <input type="text" id="checkoutName" required placeholder="Seu nome">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="checkoutEmail" required placeholder="seu@email.com">
                </div>
                <div class="form-group">
                    <label>CPF</label>
                    <input type="text" id="checkoutCpf" required placeholder="000.000.000-00" maxlength="14">
                </div>

                <div class="form-group">
                    <label>Forma de Pagamento</label>
                    <div class="payment-methods">
                        <div class="payment-method active" data-method="card" onclick="premium.selectPayment('card', this)">
                            💳<br>Cartão
                        </div>
                        <div class="payment-method" data-method="pix" onclick="premium.selectPayment('pix', this)">
                            🔲<br>PIX
                        </div>
                        <div class="payment-method" data-method="boleto" onclick="premium.selectPayment('boleto', this)">
                            📋<br>Boleto
                        </div>
                    </div>
                </div>

                <div id="cardFields">
                    <div class="form-group">
                        <label>Número do cartão</label>
                        <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>Validade</label>
                            <input type="text" id="cardExpiry" placeholder="MM/AA" maxlength="5">
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="text" id="cardCvv" placeholder="000" maxlength="4">
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn-comparison-premium" style="margin-top: 1rem;">
                    🔒 Confirmar Pagamento - R$ ${plan.preco.toFixed(2).replace('.', ',')}
                </button>
                <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 1rem;">
                    🔐 Pagamento 100% seguro. Cancele quando quiser.
                </p>
            </form>
        `;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeCheckout() {
        const modal = document.getElementById('checkoutModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    selectPayment(method, el) {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        el.classList.add('active');
        const cardFields = document.getElementById('cardFields');
        cardFields.style.display = method === 'card' ? 'block' : 'none';
    }

    processPayment(e) {
        e.preventDefault();
        const name = document.getElementById('checkoutName').value;
        const email = document.getElementById('checkoutEmail').value;

        this.showToast('🔄 Processando pagamento...');

        setTimeout(() => {
            const user = {
                name,
                email,
                plan: this.selectedPlan,
                planName: PREMIUM_PLANS[this.selectedPlan].nome,
                subscribedAt: new Date().toISOString(),
                nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                alerts: [],
                reports: this.generateReports(),
                stats: { leisLidas: 0, favoritos: 0, alertas: 0, downloads: 0 }
            };
            this.saveUser(user);
            this.showToast('🎉 Bem-vindo ao Premium!');
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1500);
        }, 2000);
    }

    /* ===== TRIAL ===== */
    startTrial(e) {
        e.preventDefault();
        const email = document.getElementById('trialEmail').value;
        this.showToast('🎁 Iniciando seu período gratuito...');

        setTimeout(() => {
            const user = {
                name: email.split('@')[0],
                email,
                plan: 'trial',
                planName: 'Premium (Trial 7 dias)',
                trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                subscribedAt: new Date().toISOString(),
                alerts: [],
                reports: this.generateReports(),
                stats: { leisLidas: 0, favoritos: 0, alertas: 0, downloads: 0 }
            };
            this.saveUser(user);
            this.showToast('🚀 Trial ativado! Bem-vindo ao Premium!');
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1500);
        }, 1500);
    }

    generateReports() {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'];
        return months.map((m, i) => ({
            id: `report-${i}`,
            month: m,
            year: 2026,
            title: `Relatório Legislativo - ${m} 2026`,
            summary: `Resumo das principais leis publicadas em ${m}. Análise de impacto e tendências.`,
            createdAt: new Date(2026, i + 1, 1).toISOString()
        }));
    }

    /* ===== NEWSLETTER ===== */
    subscribeNewsletter(email) {
        const subs = JSON.parse(localStorage.getItem('legirj_newsletter') || '[]');
        if (subs.includes(email)) {
            this.showToast('📧 Você já está inscrito!');
            return;
        }
        subs.push(email);
        localStorage.setItem('legirj_newsletter', JSON.stringify(subs));
        this.showToast('✅ Inscrição realizada com sucesso!');
    }

    /* ===== TOAST ===== */
    showToast(msg) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    /* ===== LOGOUT ===== */
    logout() {
        if (confirm('Deseja realmente sair?')) {
            localStorage.removeItem('legirj_user');
            this.user = null;
            window.location.href = './';
        }
    }
}

const premium = new Premium();

if (typeof window !== 'undefined') {
    window.premium = premium;
}
