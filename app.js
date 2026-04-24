// App Logic - Final optimized for Multi-Select & USDC & Themes & Goals

// Safe Parse Helper to prevent crashes
const safeJsonParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing ${key}:`, e);
        return fallback;
    }
};

// Safe Element Value Helper
const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0;
};

// State management
let transactions = safeJsonParse('transactions', []);
let categories = safeJsonParse('categories', ['General', 'Comida', 'Transporte', 'Servicios', 'Salud', 'Ocio', 'Inversiones', 'Educación']);
let goals = safeJsonParse('goals', []);
let savingPolicy = safeJsonParse('savingPolicy', { mode: 'percentage', value: 10, frequency: 30 });
let currencyLock = safeJsonParse('currencyLock', { USD: false, USDT: false, USDC: false, EUR: false });
let editingId = null;
let editingGoalId = null;

// Gamification State
let userStats = safeJsonParse('userStats', {
    xp: 0,
    level: 1,
    unlockedLogros: [],
    streakInMonths: 0
});

// DOM Elements - Using getters for robustness if some IDs are missing
const elements = {
    // Stats
    get balLocal() { return document.getElementById('stat-balance-local'); },
    get balUsd() { return document.getElementById('stat-balance-usd'); },
    get balUsdt() { return document.getElementById('stat-balance-usdt'); },
    get balUsdc() { return document.getElementById('stat-balance-usdc'); },
    get balEur() { return document.getElementById('stat-balance-eur'); },
    get income() { return document.getElementById('stat-income'); },
    get expense() { return document.getElementById('stat-expense'); },
    get result() { return document.getElementById('stat-result'); },

    get list() { return document.getElementById('transactions-list'); },
    get form() { return document.getElementById('transaction-form'); },
    get modal() { return document.getElementById('modal'); },
    get modalCats() { return document.getElementById('modal-cats'); },
    get modalGoal() { return document.getElementById('modal-goal'); },
    get goalForm() { return document.getElementById('goal-form'); },
    get goalsList() { return document.getElementById('goals-list'); },
    get goalCurrency() { return document.getElementById('goal-currency'); },
    get goalTrackingMode() { return document.getElementById('goal-tracking-mode'); },
    get goalFeasibilityNotice() { return document.getElementById('goal-feasibility-notice'); },
    get goalManualAmount() { return document.getElementById('goal-manual-amount'); },
    get manualAmountGroup() { return document.getElementById('manual-amount-group'); },
    get goalTargetInput() { return document.getElementById('goal-target-amount'); },
    get modalOnboarding() { return document.getElementById('modal-onboarding'); },
    get libertyCommitment() { return document.getElementById('global-commitment-val'); },
    get libertyMargin() { return document.getElementById('global-free-margin-val'); },

    // Gamification & Coach UI
    get xpBarFill() { return document.getElementById('xp-bar-fill'); },
    get xpText() { return document.getElementById('xp-text'); },
    get userLevelName() { return document.getElementById('user-level-name'); },
    get userLevelVal() { return document.getElementById('user-level-val'); },
    get coachMessage() { return document.getElementById('coach-message'); },

    // Buttons
    get btnAdd() { return document.getElementById('btn-add-transaction'); },
    get btnAddGoal() { return document.getElementById('btn-add-goal'); },
    get btnCancel() { return document.getElementById('btn-cancel'); },
    get btnCancelGoal() { return document.getElementById('btn-cancel-goal'); },
    get btnReset() { return document.getElementById('btn-reset-filters'); },

    // Category Mgt
    get formCategorySelect() { return document.getElementById('form-category-select'); },
    get btnManageCatsForm() { return document.getElementById('btn-manage-cats-form'); },
    get btnManageCatsSidebar() { return document.getElementById('btn-manage-cats-sidebar'); },
    get btnCloseCats() { return document.getElementById('btn-close-cats'); },
    get btnAddCat() { return document.getElementById('btn-add-cat'); },
    get newCatInput() { return document.getElementById('new-cat-input'); },
    get catManageList() { return document.getElementById('cat-manage-list'); },

    // Filters
    get filterFlow() { return document.getElementById('filter-flow'); },
    get filterType() { return document.getElementById('filter-type'); },
    get filterPeriod() { return document.getElementById('filter-period'); },
    get filterDateStart() { return document.getElementById('filter-date-start'); },
    get filterDateEnd() { return document.getElementById('filter-date-end'); },
    get dateGroup() { return document.getElementById('date-range-container'); },

    // Filters (Custom Multi-Select Wrappers)
    get paymentOptions() { return document.getElementById('payment-options'); },
    get paymentTriggerText() { return document.getElementById('payment-trigger-text'); },
    get categoryOptions() { return document.getElementById('category-options'); },
    get categoryTriggerText() { return document.getElementById('category-trigger-text'); },

    // Goal Feasibility
    get feasibilityPeriod() { return document.getElementById('feasibility-period'); },

    // Global settings
    get localSymbols() { return document.querySelectorAll('.local-symbol'); },
    get currencyCode() { return document.getElementById('currency-code'); },
    get currencyView() { return document.getElementById('currency-view'); },
    get rateUsd() { return document.getElementById('rate-usd'); },
    get rateUsdt() { return document.getElementById('rate-usdt'); },
    get rateUsdc() { return document.getElementById('rate-usdc'); },
    get rateEur() { return document.getElementById('rate-eur'); },
    get currencyManager() { return document.getElementById('currency-manager'); },
    get nomadToggle() { return document.getElementById('nomad-toggle'); },
    get nomadFields() { return document.getElementById('nomad-form-fields'); },

    // Data Management
    get btnExport() { return document.getElementById('btn-export'); },
    get btnImportTrigger() { return document.getElementById('btn-import-trigger'); },
    get importInput() { return document.getElementById('import-input'); },
    get btnResetData() { return document.getElementById('btn-reset-data'); },

    get goalFrequency() { return document.getElementById('goal-frequency'); },
    get goalCustomDays() { return document.getElementById('goal-custom-days'); },

    // Currency Sync & Locks
    get btnSyncCurrency() { return document.getElementById('btn-sync-currency'); },
    get btnResetLocks() { return document.getElementById('btn-reset-locks'); },
    get locks() {
        return {
            USD: document.getElementById('lock-usd'),
            USDT: document.getElementById('lock-usdt'),
            USDC: document.getElementById('lock-usdc'),
            EUR: document.getElementById('lock-eur')
        };
    },

    // Help & Chat Assistant
    get helpChatForm() { return document.getElementById('help-chat-form'); },
    get helpChatInput() { return document.getElementById('help-chat-input'); },
    get helpChatMessages() { return document.getElementById('help-chat-messages'); },
    get helpChatModal() { return document.getElementById('help-chat-modal'); },
};
// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Critical UI First
    initHelpTrigger();
    initHelpChat();

    try {
        // 2. Data & Logic
        // Legacy support and Defaults
        if (document.querySelector('input[name="date"]')) {
            document.querySelector('input[name="date"]').valueAsDate = new Date();
        }

        const now = new Date();
        if (elements.filterDateStart) {
            elements.filterDateStart.valueAsDate = new Date(now.getFullYear(), now.getMonth(), 1);
            elements.filterDateEnd.valueAsDate = now;
        }

        // Restore Settings
        if (localStorage.getItem('currencySettings')) {
            try {
                const set = JSON.parse(localStorage.getItem('currencySettings'));
                if (elements.currencyCode) elements.currencyCode.value = set.code || '';
                if (elements.rateUsd) elements.rateUsd.value = set.usd || '';
                if (elements.rateUsdt) elements.rateUsdt.value = set.usdt || '';
                if (elements.rateUsdc) elements.rateUsdc.value = set.usdc || '';
                if (elements.rateEur) elements.rateEur.value = set.eur || '';
                if (elements.currencyView) elements.currencyView.value = set.view || 'LOCAL';

                if (set.rates) window.currencyRates = set.rates;
            } catch (e) { console.error("Error loading currency settings", e); }
        }

        // Ensure window.currencyRates is initialized
        if (!window.currencyRates) {
            window.currencyRates = { USD: 1200, EUR: 1300, USDT: 1200, USDC: 1200 };
            if (elements.rateUsd && elements.rateUsd.value) window.currencyRates['USD'] = parseFloat(elements.rateUsd.value);
        }

        // Load Persistence
        if (typeof loadSavingPolicy === 'function') loadSavingPolicy();

        // Theme
        const savedTheme = localStorage.getItem('appTheme') || 'nebula';
        if (savedTheme === 'custom') {
            const bg = localStorage.getItem('customBg');
            if (bg && typeof applyCustomTheme === 'function') applyCustomTheme(bg);
            else if (typeof setTheme === 'function') setTheme('nebula');
        } else if (typeof setTheme === 'function') {
            setTheme(savedTheme);
        }

        // Migration & Updates
        if (typeof migrateLegacyData === 'function') migrateLegacyData();
        if (typeof updateCurrencyLabels === 'function') updateCurrencyLabels();
        if (typeof populateCategorySelects === 'function') populateCategorySelects();
        if (typeof updateDashboard === 'function') updateDashboard();
        if (typeof updateGlobalMonitor === 'function') updateGlobalMonitor();
        if (typeof updateLockIndicators === 'function') updateLockIndicators();

        // Nomad Mode
        const isNomad = localStorage.getItem('nomadMode') === 'true';
        if (elements.nomadToggle) elements.nomadToggle.checked = isNomad;
        if (elements.nomadFields) elements.nomadFields.classList.toggle('hidden', !isNomad);

        // Global Click Listeners for Dropdowns
        document.addEventListener('click', (e) => {
            if (elements.paymentOptions && !e.target.closest('#payment-select-wrapper')) elements.paymentOptions.classList.add('hidden');
            if (elements.categoryOptions && !e.target.closest('#category-select-wrapper')) elements.categoryOptions.classList.add('hidden');
        });

        // Event Listeners Binding
        if (elements.btnAddGoal) {
            elements.btnAddGoal.addEventListener('click', () => {
                editingGoalId = null;
                elements.goalForm.reset();
                if (document.querySelector('#modal-goal h2')) document.querySelector('#modal-goal h2').textContent = 'Nuevo Objetivo';
                toggleGoalModeFields();
                openModal(elements.modalGoal);
            });
        }
        if (elements.btnCancelGoal) elements.btnCancelGoal.addEventListener('click', () => closeModal(elements.modalGoal));
        if (elements.goalForm) elements.goalForm.addEventListener('submit', handleGoalSubmit);

        // Goals Real-time Feedback
        ['input', 'change'].forEach(evt => {
            if (elements.goalForm) elements.goalForm.addEventListener(evt, checkGoalFeasibility);
        });
        if (elements.goalTrackingMode) {
            elements.goalTrackingMode.addEventListener('change', toggleGoalModeFields);
        }

        // Currency Locks
        ['usd', 'usdt', 'usdc', 'eur'].forEach(id => {
            const el = document.getElementById('rate-' + id);
            if (el) {
                el.addEventListener('change', () => {
                    currencyLock[id.toUpperCase()] = true;
                    localStorage.setItem('currencyLock', JSON.stringify(currencyLock));
                    updateLockIndicators();
                    updateDashboard();
                });
                if (currencyLock[id.toUpperCase()]) el.classList.add('input-locked');
            }
        });

        // PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(console.error);
        }

        // Data Management & API
        if (elements.btnExport) elements.btnExport.addEventListener('click', exportData);
        if (elements.btnImportTrigger) elements.btnImportTrigger.addEventListener('click', () => elements.importInput.click());
        if (elements.importInput) elements.importInput.addEventListener('change', handleImport);
        if (elements.btnResetData) elements.btnResetData.addEventListener('click', resetData);

        fetchCurrencyRates();

        // Currency Sync & Lock Listeners
        if (elements.btnSyncCurrency) {
            elements.btnSyncCurrency.addEventListener('click', () => {
                showToast("Sincronizando monedas...", "info");
                fetchCurrencyRates();
            });
        }

        if (elements.btnResetLocks) {
            elements.btnResetLocks.addEventListener('click', () => {
                if (confirm("¿Quieres liberar todos los bloqueos manuales y permitir la actualización automática?")) {
                    Object.keys(currencyLock).forEach(k => {
                        currencyLock[k] = false;
                        const el = document.getElementById('rate-' + k.toLowerCase());
                        if (el) el.classList.remove('input-locked');
                    });
                    localStorage.setItem('currencyLock', JSON.stringify(currencyLock));
                    updateLockIndicators();
                    fetchCurrencyRates();
                    showToast("Bloqueos liberados. Sincronizando...", "success");
                }
            });
        }

        // Help UI
        initHelpTrigger();

        // Onboarding Check
        if (!localStorage.getItem('onboardingDone')) {
            setTimeout(() => {
                openModal(document.getElementById('modal-onboarding'));
            }, 1000);
        }

    } catch (err) {
        console.error("Critical Init Error", err);
        // Silently fail if elements are missing, but notify user if it's fatal
    }
});

function createStatusIndicator() {
    const el = document.createElement('div');
    el.id = 'currency-status-indicator';
    document.body.appendChild(el);
    return el;
}

// --- AutoCurrency API ---
async function fetchCurrencyRates() {
    const statusEl = document.getElementById('currency-status-indicator') || createStatusIndicator();
    if (statusEl) {
        statusEl.innerHTML = '🔄 Cotizando...';
        statusEl.style.color = 'var(--text-secondary)';
        statusEl.style.opacity = '1';
    }

    const localCode = (elements.currencyCode?.value || 'ARS').toUpperCase();

    // Timer to avoid "thinking" forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const tryFetch = async (url) => {
        const r = await fetch(url, { signal: controller.signal });
        if (!r.ok) throw new Error("Fetch failed");
        return r.json();
    };

    try {
        let dataFiat;
        try {
            dataFiat = await tryFetch('https://open.er-api.com/v6/latest/USD');
        } catch (e) {
            console.warn("Primary API failed, trying fallback 1...", e);
            try {
                dataFiat = await tryFetch('https://api.exchangerate-api.com/v4/latest/USD');
            } catch (e2) {
                console.warn("Fallback 1 failed, trying fallback 2...", e2);
                // Minimal static fallback data if everything fails to avoid 0 prices
                dataFiat = { rates: { ARS: 1200, EUR: 0.92, BRL: 5.0 } };
            }
        }
        clearTimeout(timeoutId);

        let usdtPrice = 1;
        let usdcPrice = 1;
        try {
            const [resTether, resUsdc] = await Promise.all([
                fetch('https://api.coinpaprika.com/v1/tickers/usdt-tether'),
                fetch('https://api.coinpaprika.com/v1/tickers/usdc-usd-coin')
            ]);
            if (resTether.ok) {
                const data = await resTether.json();
                usdtPrice = data.quotes.USD.price;
            }
            if (resUsdc.ok) {
                const data = await resUsdc.json();
                usdcPrice = data.quotes.USD.price;
            }
        } catch (e) { console.warn('Crypto API fail', e); }

        if (dataFiat && dataFiat.rates) {
            const localRateToUSD = dataFiat.rates[localCode];

            if (localRateToUSD) {
                if (!window.currencyRates) window.currencyRates = {};

                if (!currencyLock.USD) {
                    window.currencyRates['USD'] = localRateToUSD;
                    if (elements.rateUsd) elements.rateUsd.value = localRateToUSD.toFixed(2);
                }
                if (dataFiat.rates.EUR && !currencyLock.EUR) {
                    const eurVal = localRateToUSD / dataFiat.rates.EUR;
                    window.currencyRates['EUR'] = eurVal;
                    if (elements.rateEur) elements.rateEur.value = eurVal.toFixed(2);
                }
                if (!currencyLock.USDT) {
                    const usdtVal = localRateToUSD * usdtPrice;
                    window.currencyRates['USDT'] = usdtVal;
                    if (elements.rateUsdt) elements.rateUsdt.value = usdtVal.toFixed(2);
                }
                if (!currencyLock.USDC) {
                    const usdcVal = localRateToUSD * usdcPrice;
                    window.currencyRates['USDC'] = usdcVal;
                    if (elements.rateUsdc) elements.rateUsdc.value = usdcVal.toFixed(2);
                }

                if (typeof saveCurrency === 'function') saveCurrency();

                if (statusEl) {
                    statusEl.innerHTML = `✅ Actualizado (${localCode}: $${localRateToUSD.toFixed(2)})`;
                    statusEl.style.color = 'var(--success)';
                    setTimeout(() => statusEl.style.opacity = '0.5', 5000);
                }
                updateLockIndicators();
            } else {
                throw new Error("Código no encontrado");
            }
        }
    } catch (err) {
        console.warn('Currency Fetch issues', err);
        if (statusEl) {
            statusEl.innerHTML = err.message === "Código no encontrado" ? '⚠️ Código ISO no válido' : '⚠️ Error de Conexión';
            statusEl.style.color = 'var(--warning)';
        }
    }
}

function updateLockIndicators() {
    let anyLocked = false;
    Object.keys(currencyLock).forEach(curr => {
        const isLocked = currencyLock[curr];
        const lockEl = elements.locks[curr];
        if (lockEl) {
            lockEl.style.display = isLocked ? 'inline' : 'none';
            if (isLocked) anyLocked = true;
        }
        const inputEl = document.getElementById('rate-' + curr.toLowerCase());
        if (inputEl) {
            inputEl.classList.toggle('input-locked', isLocked);
        }
    });

    if (elements.btnResetLocks) {
        elements.btnResetLocks.style.display = anyLocked ? 'flex' : 'none';
    }
}

function createStatusIndicator() {
    const div = document.createElement('div');
    div.id = 'currency-status-indicator';
    div.style.cssText = 'position:fixed; bottom:10px; right:6rem; background:rgba(0,0,0,0.8); color:white; padding:5px 10px; border-radius:10px; font-size:0.7rem; z-index:2000; transition: all 0.5s ease; border:1px solid rgba(255,255,255,0.2);';

    document.body.appendChild(div);
    return div;
}

// --- Theme Logic ---
window.setTheme = (themeName) => {
    document.body.classList.remove('theme-nebula', 'theme-ocean', 'theme-forest', 'theme-midnight', 'theme-light');
    if (themeName !== 'custom') {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        document.body.classList.add(`theme-${themeName}`);
        localStorage.setItem('appTheme', themeName);
        updateThemeButtons(themeName);
    }
    updateDashboard();
};

window.handleCustomBg = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const bgData = e.target.result;
            try {
                localStorage.setItem('customBg', bgData);
                applyCustomTheme(bgData);
            } catch (err) {
                alert('La imagen es demasiado grande para guardarse. Intenta con una más pequeña.');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};

function applyCustomTheme(bgData) {
    document.body.classList.remove('theme-nebula', 'theme-ocean', 'theme-forest', 'theme-midnight', 'theme-light');
    document.body.style.backgroundImage = `url('${bgData}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    localStorage.setItem('appTheme', 'custom');
    updateThemeButtons('custom');
    updateDashboard();
}

function updateThemeButtons(activeName) {
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    if (activeName === 'custom') {
        const customBtn = document.querySelector('.btn-custom');
        if (customBtn) customBtn.classList.add('active');
    } else {
        const btn = document.querySelector(`.btn-${activeName}`);
        if (btn) btn.classList.add('active');
    }
}

// --- Modal Functions ---
function openModal(modal) {
    if (!modal) return;
    console.log("Opening modal:", modal.id);
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    const content = modal.querySelector('.modal-content');
    if (content) content.scrollTop = 0;

    // Safety: If it's mandatory, disable body scroll or close triggers
    if (modal.dataset.mandatory === "true") {
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (!modal) return;
    if (modal.dataset.mandatory === "true") {
        if (!localStorage.getItem('onboardingDone')) {
            showToast("⚠️ Es necesario completar la guía antes de continuar.", "warning");
            return;
        }
        document.body.style.overflow = '';
    }
    modal.classList.add('hidden');
    // Giving time for CSS transitions if any
    setTimeout(() => {
        modal.style.display = 'none';
        if (modal === elements.modal) {
            elements.form.reset();
            editingId = null;
            const dateInput = document.querySelector('input[name="date"]');
            if (dateInput) dateInput.valueAsDate = new Date();
        }
        if (modal === elements.modalGoal) {
            elements.goalForm.reset();
            editingGoalId = null;
        }
    }, 300);
}


// --- Event Listeners ---
window.checkOnboardingAndOpen = (modalId) => {
    if (!localStorage.getItem('onboardingDone')) {
        showToast("💡 Primero conoce la Brújula Financiera para un correcto uso.", "info");
        window.openManual();
        return;
    }
    const modal = document.getElementById(modalId);
    if (modalId === 'modal') {
        editingId = null;
        document.querySelector('#modal h2').textContent = 'Nuevo Movimiento';
    }
    openModal(modal);
};

window.checkOnboardingAndExport = () => {
    if (!localStorage.getItem('onboardingDone')) {
        showToast("💡 Primero conoce la Brújula Financiera.", "info");
        window.openManual();
        return;
    }
    exportData();
};

elements.btnAdd.addEventListener('click', () => {
    window.checkOnboardingAndOpen('modal');
});
elements.btnCancel.addEventListener('click', () => closeModal(elements.modal));
elements.modal.addEventListener('click', (e) => { 
    if (e.target === elements.modal) {
        if (elements.modal.dataset.mandatory === "true" && !localStorage.getItem('onboardingDone')) return;
        closeModal(elements.modal); 
    }
});

const openCats = () => { renderCatManagerList(); openModal(elements.modalCats); };
elements.btnManageCatsForm.addEventListener('click', openCats);
elements.btnManageCatsSidebar.addEventListener('click', openCats);
elements.btnCloseCats.addEventListener('click', () => closeModal(elements.modalCats));
elements.modalCats.addEventListener('click', (e) => { if (e.target === elements.modalCats) closeModal(elements.modalCats); });

elements.btnAddCat.addEventListener('click', addCategory);
elements.form.addEventListener('submit', handleTransactionSubmit);
elements.btnReset.addEventListener('click', resetFilters);

if (elements.filterPeriod) {
    elements.filterPeriod.addEventListener('change', (e) => {
        if (elements.dateGroup) elements.dateGroup.classList.toggle('hidden', e.target.value !== 'custom');
        updateDashboard();
    });
}
if (elements.filterDateStart) elements.filterDateStart.addEventListener('change', updateDashboard);
if (elements.filterDateEnd) elements.filterDateEnd.addEventListener('change', updateDashboard);
elements.filterFlow.addEventListener('change', updateDashboard);

if (elements.currencyCode) elements.currencyCode.addEventListener('change', fetchCurrencyRates);
if (elements.currencyView) elements.currencyView.addEventListener('change', () => {
    saveCurrency();
});

const saveCurrency = () => {
    const settings = {
        code: elements.currencyCode.value.toUpperCase(),
        rates: window.currencyRates,
        view: elements.currencyView.value
    };
    localStorage.setItem('currencySettings', JSON.stringify(settings));
    updateCurrencyLabels();
    updateDashboard();
};

function renderCurrencyManager() {
    elements.currencyManager.innerHTML = '';
    const code = (elements.currencyCode.value || '').toUpperCase();

    Object.keys(window.currencyRates).forEach(curr => {
        const div = document.createElement('div');
        div.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 0.2rem;">
                <label class="form-label" style="font-size: 0.75rem; display: flex; justify-content: space-between;">
                    <span>¿1 ${curr} cuesta cuántos ${code}?</span>
                    ${['USD', 'EUR', 'USDT', 'USDC'].includes(curr) ? '' : `<button onclick="removeCurrency('${curr}')" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:0.7rem;">✖</button>`}
                </label>
                <input type="number" class="form-control" data-curr="${curr}" value="${window.currencyRates[curr] || ''}" placeholder="Ej: 1200" style="padding: 0.4rem;">
            </div>
        `;
        div.querySelector('input').addEventListener('change', (e) => {
            window.currencyRates[curr] = parseFloat(e.target.value) || 0;
            saveCurrency();
        });
        elements.currencyManager.appendChild(div);
    });
}

window.removeCurrency = (curr) => {
    if (confirm(`¿Quitar ${curr}?`)) {
        delete window.currencyRates[curr];
        saveCurrency();
        renderCurrencyManager();
        populateTransactionCurrencies();
    }
};

function populateTransactionCurrencies() {
    const selects = document.querySelectorAll('select[name="currency"], select[id="goal-currency"], select[id="currency-view"]');
    selects.forEach(select => {
        const currentVal = select.value;
        const isView = select.id === 'currency-view';
        select.innerHTML = isView ? '<option value="LOCAL">Moneda Local</option>' : '<option value="LOCAL">Moneda Local</option>';

        Object.keys(window.currencyRates).forEach(curr => {
            const opt = document.createElement('option');
            opt.value = curr;
            opt.textContent = curr;
            select.appendChild(opt);
        });
        if (currentVal) select.value = currentVal;
    });
}

elements.currencyCode.addEventListener('input', () => { saveCurrency(); renderCurrencyManager(); });
elements.currencyView.addEventListener('change', saveCurrency);

function updateCurrencyLabels() {
    const code = (elements.currencyCode.value || '').toUpperCase();
    elements.localSymbols.forEach(el => el.textContent = code || 'ARS');
}

const handleEnter = (e) => { if (e.key === 'Enter') e.target.blur(); };
// Filter Listeners
if (elements.filterType) elements.filterType.addEventListener('change', updateDashboard);
if (elements.filterFlow) elements.filterFlow.addEventListener('change', updateDashboard);
if (elements.filterPeriod) elements.filterPeriod.addEventListener('change', updateDashboard);
if (elements.filterDateStart) elements.filterDateStart.addEventListener('change', updateDashboard);
if (elements.filterDateEnd) elements.filterDateEnd.addEventListener('change', updateDashboard);

// --- UI Helpers ---
window.toggleSelect = (type) => {
    const target = type === 'payment' ? elements.paymentOptions : elements.categoryOptions;
    target.classList.toggle('hidden');
};

window.handleMultiSelect = (type, checkbox) => {
    const wrapper = type === 'payment' ? elements.paymentOptions : elements.categoryOptions;
    const trigger = type === 'payment' ? elements.paymentTriggerText : elements.categoryTriggerText;
    const allCb = wrapper.querySelector('input[value="all"]');
    const allOtherCbs = Array.from(wrapper.querySelectorAll('input:not([value="all"])'));

    if (checkbox.value === 'all') {
        if (checkbox.checked) allOtherCbs.forEach(cb => cb.checked = false);
    } else {
        if (checkbox.checked) allCb.checked = false;
    }

    const checkedOthers = allOtherCbs.filter(cb => cb.checked);
    if (checkedOthers.length === 0 && !allCb.checked) allCb.checked = true;

    if (allCb.checked) {
        trigger.textContent = type === 'payment' ? 'Todos' : 'Todas';
    } else {
        const labels = checkedOthers.map(cb => cb.parentElement.textContent.trim());
        trigger.textContent = labels.length <= 2 ? labels.join(', ') : `${labels[0]}, ${labels[1]} (+${labels.length - 2})`;
    }
    updateDashboard();
};

// --- Functions below were duplicates and moved/consolidated above ---


// --- Transaction Functions ---
function handleTransactionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const data = {
        id: editingId || Date.now().toString(),
        flow: formData.get('flow'),
        amount: parseFloat(formData.get('amount')),
        date: formData.get('date'),
        type: formData.get('type'),
        paymentForm: formData.get('paymentForm'),
        currency: formData.get('currency'),
        platform: formData.get('platform') || '',
        location: formData.get('location') || '',
        category: formData.get('category'),
        description: formData.get('description') || 'Sin descripción'
    };

    if (editingId) {
        const idx = transactions.findIndex(t => t.id === editingId);
        if (idx !== -1) transactions[idx] = data;
    } else { transactions.push(data); }
    saveData();
    updateDashboard();
    closeModal(elements.modal);

    if (!editingId) addXP(10, "Registro de transacción");
}

function migrateLegacyData() {
    let changed = false;
    transactions = transactions.map(t => {
        if (!t.currency) {
            changed = true;
            const oldMethod = (t.paymentMethod || 'cash').toLowerCase();
            if (['usd', 'usdt', 'usdc'].includes(oldMethod)) {
                t.currency = oldMethod.toUpperCase();
                t.paymentForm = 'transfer';
            } else {
                t.currency = 'LOCAL';
                t.paymentForm = oldMethod;
            }
            delete t.paymentMethod;
        }
        if (t.platform === undefined) t.platform = '';
        if (t.location === undefined) t.location = '';
        return t;
    });
    if (changed) saveData();
}

function saveData() { localStorage.setItem('transactions', JSON.stringify(transactions)); }

// -- Category Management --
function saveCategories() { localStorage.setItem('categories', JSON.stringify(categories)); populateCategorySelects(); }
function addCategory() {
    const val = elements.newCatInput.value.trim();
    if (val && !categories.includes(val)) { categories.push(val); categories.sort(); saveCategories(); renderCatManagerList(); elements.newCatInput.value = ''; }
}
function removeCategory(cat) {
    if (confirm(`¿Eliminar "${cat}"?`)) { categories = categories.filter(c => c !== cat); saveCategories(); renderCatManagerList(); }
}

function populateCategorySelects() {
    elements.formCategorySelect.innerHTML = '';
    categories.forEach(cat => { const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat; elements.formCategorySelect.appendChild(opt); });
    elements.categoryOptions.innerHTML = `<label class="option-item"><input type="checkbox" value="all" checked onchange="handleMultiSelect('category', this)"> Todas</label>`;
    categories.forEach(cat => {
        const lbl = document.createElement('label'); lbl.className = 'option-item';
        lbl.innerHTML = `<input type="checkbox" value="${cat}" onchange="handleMultiSelect('category', this)"> ${cat}`;
        elements.categoryOptions.appendChild(lbl);
    });
}

function renderCatManagerList() {
    elements.catManageList.innerHTML = '';
    categories.forEach(cat => {
        const div = document.createElement('div');
        div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:0.5rem; border-radius:var(--radius-sm); border:1px solid var(--glass-border); color:var(--text-primary);';
        div.innerHTML = `<span>${cat}</span> <button style="color:var(--danger); background:none; border:none; cursor:pointer;">✖</button>`;
        div.querySelector('button').onclick = () => removeCategory(cat);
        elements.catManageList.appendChild(div);
    });
}

function resetFilters() {
    if (elements.filterPeriod) elements.filterPeriod.value = 'this-month';
    if (elements.dateGroup) elements.dateGroup.classList.add('hidden');
    elements.filterFlow.value = 'all'; elements.filterType.value = 'all';
    const resetMulti = (wrapper, trigger, type) => {
        const all = wrapper.querySelector('input[value="all"]'); all.checked = true;
        wrapper.querySelectorAll('input:not([value="all"])').forEach(cb => cb.checked = false);
        trigger.textContent = type === 'payment' ? 'Todos' : 'Todas';
    };
    resetMulti(elements.paymentOptions, elements.paymentTriggerText, 'payment');
    resetMulti(elements.categoryOptions, elements.categoryTriggerText, 'category');
    updateDashboard();
}

// -- Currency Engine --
function getOriginCurrency(method) { if (method === 'usd') return 'USD'; if (method === 'usdc') return 'USDC'; if (method === 'usdt') return 'USDT'; return 'LOCAL'; }
function getConvertedAmount(t, targetView) {
    const view = targetView || elements.currencyView?.value || 'LOCAL';
    const rateUsd = getVal('rate-usd') || 1;
    const rateUsdt = getVal('rate-usdt') || 1;
    const rateUsdc = getVal('rate-usdc') || 1;
    const rateEur = getVal('rate-eur') || 1;
    const origin = t.currency || 'LOCAL';

    let valLocal = t.amount;
    if (origin !== 'LOCAL') {
        if (origin === 'USD') valLocal = t.amount * rateUsd;
        else if (origin === 'USDT') valLocal = t.amount * rateUsdt;
        else if (origin === 'USDC') valLocal = t.amount * rateUsdc;
        else if (origin === 'EUR') valLocal = t.amount * rateEur;
    }

    if (view === 'LOCAL') return valLocal;
    if (view === 'USD') return rateUsd ? valLocal / rateUsd : 0;
    if (view === 'USDT') return rateUsdt ? valLocal / rateUsdt : 0;
    if (view === 'USDC') return rateUsdc ? valLocal / rateUsdc : 0;
    if (view === 'EUR') return rateEur ? valLocal / rateEur : 0;
    return valLocal;
}

function formatCurrency(val, override) {
    const view = override || elements.currencyView?.value || 'LOCAL';
    const code = (elements.currencyCode?.value || '').toUpperCase();
    let symb = view === 'LOCAL' ? (code ? `${code} ` : '$ ') : `${view} `;
    return symb + (val || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function convertCurrency(amount, from, to) {
    if (from === to) return amount;
    const rateUsd = getVal('rate-usd') || 1;
    const rateUsdt = getVal('rate-usdt') || 1;
    const rateUsdc = getVal('rate-usdc') || 1;
    const rateEur = getVal('rate-eur') || 1;

    let local = amount;
    if (from === 'USD') local = amount * rateUsd;
    else if (from === 'USDT') local = amount * rateUsdt;
    else if (from === 'USDC') local = amount * rateUsdc;
    else if (from === 'EUR') local = amount * rateEur;

    if (to === 'LOCAL') return local;
    if (to === 'USD') return local / rateUsd;
    if (to === 'USDT') return local / rateUsdt;
    if (to === 'USDC') return local / rateUsdc;
    if (to === 'EUR') return local / rateEur;
    return local;
}

function getDualCurrencyString(amount, from) {
    const localCode = (elements.currencyCode?.value || 'ARS').toUpperCase();
    if (from === 'LOCAL') return formatCurrency(amount, 'LOCAL');
    const localVal = convertCurrency(amount, from, 'LOCAL');
    return `${formatCurrency(amount, from)} <span style="font-size:0.8em; opacity:0.7;">(${formatCurrency(localVal, 'LOCAL')})</span>`;
}

// -- Dashboard Core --
function updateDashboard() {
    try {
        let filtered = (transactions || []).map(t => ({
            ...t,
            amount: parseFloat(t.amount) || 0
        }));

        const period = (elements.filterPeriod ? elements.filterPeriod.value : 'all') || 'all';
        if (elements.filterFlow && elements.filterFlow.value !== 'all') filtered = filtered.filter(t => t.flow === elements.filterFlow.value);
        if (elements.filterType && elements.filterType.value !== 'all') filtered = filtered.filter(t => (t.type || 'variable') === elements.filterType.value);

        const payCbs = elements.paymentOptions ? Array.from(elements.paymentOptions.querySelectorAll('input:checked')).map(cb => cb.value) : ['all'];
        if (!payCbs.includes('all')) filtered = filtered.filter(t => payCbs.includes(t.paymentForm));

        const catCbs = elements.categoryOptions ? Array.from(elements.categoryOptions.querySelectorAll('input:checked')).map(cb => cb.value) : ['all'];
        if (!catCbs.includes('all')) filtered = filtered.filter(t => catCbs.includes(t.category));

        filtered = filtered.filter(t => {
            if (!t.date) return true;
            const [y, m, d] = t.date.split('-').map(Number);
            const tDate = new Date(y, m - 1, d); const now = new Date();
            if (period === 'custom') {
                if (!elements.filterDateStart?.value || !elements.filterDateEnd?.value) return true;
                const [sy, sm, sd] = elements.filterDateStart.value.split('-').map(Number);
                const [ey, em, ed] = elements.filterDateEnd.value.split('-').map(Number);
                return tDate >= new Date(sy, sm - 1, sd) && tDate <= new Date(ey, em - 1, ed);
            }
            if (period === 'this-month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
            return true;
        });

        // -- Period Result by Currency --
        let rawL = 0, rawU = 0, rawT = 0, rawC = 0, rawE = 0;
        filtered.forEach(t => {
            const origin = t.currency === 'LOCAL' ? 'LOCAL' : t.currency;
            const val = t.flow === 'income' ? t.amount : -t.amount;
            if (origin === 'LOCAL') rawL += val;
            else if (origin === 'USD') rawU += val;
            else if (origin === 'USDT') rawT += val;
            else if (origin === 'USDC') rawC += val;
            else if (origin === 'EUR') rawE += val;
        });

        // Update Section Title based on filter
        const headerTitle = document.querySelector('.sidebar + .main-content .stats-container h2') ||
            document.querySelector('.stats-grid-top-wrapper h2') ||
            { textContent: '' };
        if (period === 'all') {
            headerTitle.textContent = 'BALANCE TOTAL (SALDOS REALES)';
        } else {
            headerTitle.textContent = 'RESULTADO DEL PERIODO (POR MONEDA)';
        }

        const code = (elements.currencyCode?.value || '').toUpperCase();
        if (elements.balLocal) elements.balLocal.textContent = (code ? `${code} ` : '$ ') + rawL.toLocaleString('es-AR', { minimumFractionDigits: 2 });
        if (elements.balUsd) elements.balUsd.textContent = 'USD ' + rawU.toLocaleString('es-AR', { minimumFractionDigits: 2 });
        if (elements.balUsdt) elements.balUsdt.textContent = 'USDT ' + rawT.toLocaleString('es-AR', { minimumFractionDigits: 2 });
        if (elements.balUsdc) elements.balUsdc.textContent = 'USDC ' + rawC.toLocaleString('es-AR', { minimumFractionDigits: 2 });
        if (elements.balEur) elements.balEur.textContent = 'EUR ' + rawE.toLocaleString('es-AR', { minimumFractionDigits: 2 });

        let vInc = 0, vExp = 0;
        filtered.forEach(t => { const v = getConvertedAmount(t); if (t.flow === 'income') vInc += v; else vExp += v; });
        if (elements.income) elements.income.textContent = formatCurrency(vInc);
        if (elements.expense) elements.expense.textContent = formatCurrency(vExp);
        if (elements.result) elements.result.textContent = formatCurrency(vInc - vExp);

        renderList(filtered);
        if (typeof updateCharts === 'function') updateCharts(filtered);
        if (typeof renderGoals === 'function') renderGoals();

        renderUserStats();
        updateCoach();
        checkAchievements();

    } catch (e) {
        console.error("Critical Dashboard Error:", e);
        alert("Error crítico mostrando el panel: " + e.message + "\nPor favor revisa que tus datos importados sean correctos.");
    }
}

// --- Period-Aware Surplus Calculation ---
function isInActivePeriod(txDate) {
    const period = elements.filterPeriod ? elements.filterPeriod.value : 'all';
    const now = new Date();

    if (period === 'all') return true;

    if (period === 'this-month') {
        return txDate.getMonth() === now.getMonth() &&
            txDate.getFullYear() === now.getFullYear();
    }

    if (period === 'last-month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return txDate.getMonth() === lastMonth.getMonth() &&
            txDate.getFullYear() === lastMonth.getFullYear();
    }

    if (period === 'this-year') {
        return txDate.getFullYear() === now.getFullYear();
    }

    if (period === 'custom') {
        if (!elements.filterDateStart || !elements.filterDateEnd) return true;
        const start = new Date(elements.filterDateStart.value);
        const end = new Date(elements.filterDateEnd.value);
        return txDate >= start && txDate <= end;
    }

    return true;
}

// --- Gamification & Financial Coach Logic ---
function addXP(amount, reason) {
    userStats.xp += amount;
    const newLevel = Math.floor(userStats.xp / 500) + 1;
    if (newLevel > userStats.level) {
        userStats.level = newLevel;
        showToast(`🎉 ¡Subiste de Nivel! Ahora eres Nivel ${userStats.level}`, "success");
    }
    saveUserStats();
    renderUserStats();
}

function saveUserStats() {
    localStorage.setItem('userStats', JSON.stringify(userStats));
}

function renderUserStats() {
    if (!elements.xpBarFill) return;
    const xpInLevel = userStats.xp % 500;
    const percent = (xpInLevel / 500) * 100;
    elements.xpBarFill.style.width = `${percent}%`;
    elements.xpText.textContent = `${xpInLevel} / 500 XP`;
    elements.userLevelVal.textContent = `LVL ${userStats.level}`;
    const levelNames = ["NOVATO", "AHORRADOR", "INVERSOR", "MAESTRO", "LEYENDA"];
    const nameIdx = Math.min(userStats.level - 1, levelNames.length - 1);
    elements.userLevelName.textContent = levelNames[nameIdx];
}

function showToast(message, type = "info") {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
        color: white; padding: 0.8rem 1.5rem; border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 2000;
        animation: slideUp 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function updateCoach() {
    if (!elements.coachMessage) return;

    const period = (elements.filterPeriod?.value || 'all') || 'all';
    let periodText = "de todo el historial";
    if (period === 'this-month') periodText = "de este mes";
    else if (period === 'last-month') periodText = "del mes pasado";
    else if (period === 'this-year') periodText = "de este año";
    else if (period === 'history') periodText = "del promedio de los últimos 3 meses";

    const incomeStr = elements.income.textContent.replace(/[^-0-9,.]/g, '').replace(',', '.');
    const expenseStr = elements.expense.textContent.replace(/[^-0-9,.]/g, '').replace(',', '.');
    const income = parseFloat(incomeStr) || 0;
    const expense = parseFloat(expenseStr) || 0;
    const surplus = income - expense;
    const savingsRate = income > 0 ? (surplus / income) * 100 : 0;
    const expenseRatio = income > 0 ? (expense / income) * 100 : 0;
    const txCount = transactions.length;
    const goalCount = goals.length;

    // Analyze spending categories for the SAME filtered period as the dashboard
    const now_cat = new Date();
    const period_cat = period;
    const catMap = {};
    const prevCatMap = {}; // For spike detection (previous equivalent period)

    // Logic for trend analysis (Mental shortcut: comparing current month vs average or previous month)
    const isHistory = period === 'all' || period === 'history';

    transactions.forEach(t => {
        if (t.flow !== 'expense') return;

        const td = new Date(t.date);
        const v = getConvertedAmount(t);

        // Current period mapping
        let belongsToCurrent = false;
        if (period_cat === 'all') belongsToCurrent = true;
        else if (period_cat === 'this-month' && td.getMonth() === now_cat.getMonth() && td.getFullYear() === now_cat.getFullYear()) belongsToCurrent = true;
        else if (period_cat === 'last-month') {
            const lm = new Date(now_cat.getFullYear(), now_cat.getMonth() - 1, 1);
            if (td.getMonth() === lm.getMonth() && td.getFullYear() === lm.getFullYear()) belongsToCurrent = true;
        }
        else if (period_cat === 'this-year' && td.getFullYear() === now_cat.getFullYear()) belongsToCurrent = true;
        else if (period_cat === 'history') {
            const h = new Date(); h.setMonth(h.getMonth() - 3);
            if (td >= h) belongsToCurrent = true;
        }

        if (belongsToCurrent) {
            catMap[t.category] = (catMap[t.category] || 0) + v;
        } else {
            // Trend logic: if we are looking at "this month", let's map "last month" for comparison
            if (period === 'this-month') {
                const lm = new Date(now_cat.getFullYear(), now_cat.getMonth() - 1, 1);
                if (td.getMonth() === lm.getMonth() && td.getFullYear() === lm.getFullYear()) {
                    prevCatMap[t.category] = (prevCatMap[t.category] || 0) + v;
                }
            }
        }
    });

    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    // Fix 99999% bug: Only show percentage if income is meaningful
    const topCatShare = (topCat && income > (topCat[1] * 0.05)) ? (topCat[1] / income) * 100 : 0;

    // Spike Detection
    let spikeMsg = "";
    if (topCat && prevCatMap[topCat[0]]) {
        const prevVal = prevCatMap[topCat[0]];
        const diff = ((topCat[1] - prevVal) / prevVal) * 100;
        if (diff > 15) spikeMsg = `<br>🚨 <b>${topCat[0]}</b> subió un <b>${diff.toFixed(0)}%</b> vs mes pasado.`;
    }

    let headline = '', body = '', emoji = '🤖';

    const displayRate = Math.min(100, Math.abs(savingsRate));

    // ---- Situational Analysis (Short & Concise) ----
    if (income === 0 && expense === 0) {
        emoji = '✨'; headline = 'Crea tu futuro hoy.';
        body = `Registra tu primer movimiento para empezar el análisis.`;
    } else if (income === 0 && expense > 0) {
        emoji = '🧭'; headline = 'Faltan ingresos.';
        body = `Sin ingresos registrados, no puedo analizar tu sostenibilidad.`;
    } else if (surplus < 0) {
        emoji = '💡';
        headline = `Bache en el camino (${displayRate.toFixed(0)}% déficit).`;
        body = `Gastaste <b>${formatCurrency(Math.abs(surplus))}</b> más de lo que entró. Analiza: ¿Qué gasto podrías haber evitado?`;
        if (topCat && topCatShare > 0) body += `<br>🔍 <b>${topCat[0]}</b> consume el <b>${Math.min(100, topCatShare).toFixed(0)}%</b> de tu presupuesto.`;
    } else if (savingsRate >= 20) {
        emoji = '💎'; headline = `¡Excelente! Ahorro del ${displayRate.toFixed(1)}%.`;
        body = `Estás en la élite financiera. Estás comprando <b>tiempo y libertad</b>.`;
    } else if (savingsRate > 0 && savingsRate < 10) {
        emoji = '🌱'; headline = `Creciendo (${displayRate.toFixed(1)}%).`;
        body = `Estás en positivo, pero el margen es bajo. Apunta al 20%.`;
    } else if (savingsRate >= 10 && savingsRate < 20) {
        emoji = '💪'; headline = `Ritmo sólido (${displayRate.toFixed(1)}%).`;
        body = `Buen hábito. Evita gastar más a medida que ganes más.`;
    } else {
        emoji = '📊'; headline = `Balance: ${formatCurrency(surplus)}.`;
        body = `La constancia es la clave del éxito financiero.`;
    }
    body += spikeMsg;

    // ---- Rotating Power Tips (Mindset & Psychology) ----
    const allTips = [
        "🧠 <b>Psicología:</b> No ahorres lo que queda después de gastar. Gasta lo que queda después de ahorrar.",
        "🧠 <b>Identidad:</b> No sos lo que compras. Sos la libertad que sos capaz de construir.",
        "🧠 <b>Dopamina:</b> La alegría de una compra dura 48hs. La tranquilidad de una cuenta sólida dura para siempre.",
        "⚡ <b>Regla del 1%:</b> Si aumentas tu ahorro 1% cada mes, el impacto en 2 años será transformador sin que lo sientas hoy.",
        "🎯 <b>Gasto Hormiga:</b> Un gasto pequeño diario parece nada, pero es el ladrillo que le falta a tu casa propia.",
        "❤️ <b>Propósito:</b> No ahorras por el dinero en sí, sino por la <b>paz mental</b> de saber que ante cualquier problema, tenés la solución.",
        "🌊 <b>Fluidez:</b> Si un mes fallas, no abandones. Las finanzas son una maratón, no un sprint de 100 metros.",
        "📚 <b>La mejor inversión:</b> Vos mismo. Un libro o curso de finanzas hoy puede valer millones en decisiones futuras.",
        "🛑 <b>El 'Impuesto' al Impulso:</b> Cuando quieras algo caro, esperá 72 horas. Si todavía lo querés y tenés el dinero, compralo sin culpa.",
        "⚖️ <b>Libertad vs. Estatus:</b> Comprar cosas para impresionar a gente que no te importa es la forma más rápida de ser esclavo de tu trabajo."
    ];

    const tipIdx = (new Date().getDate() + txCount) % allTips.length;
    const tip = allTips[tipIdx];

    // ---- Compose Final Message (More spacious & premium) ----
    const coachSec = document.getElementById('coach-section');
    if (coachSec) {
        coachSec.style.minHeight = "auto"; // Let it grow
        coachSec.style.padding = "1.5rem 2rem";
    }

    if (elements.coachMessage) {
        elements.coachMessage.style.overflowY = "visible";
        elements.coachMessage.style.paddingRight = "0";
    }

    const header = `<span style="font-size:0.6rem; opacity:0.6; display:block; margin-bottom:0.4rem; text-transform:uppercase; letter-spacing:0.1em; font-weight:700; color:var(--secondary);">Financial Coach · ${new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>`;
    const headlineHtml = `<div style="font-weight:700; font-size:1.1rem; margin-bottom:0.6rem; color:var(--text-primary); letter-spacing:-0.01em;">${emoji} ${headline}</div>`;
    const bodyHtml = `<div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1rem;">${body}</div>`;
    const tipHtml = `<div style="font-size:0.7rem; opacity:0.9; padding:0.6rem 1rem; background:rgba(var(--primary-rgb),0.1); border-left:3px solid var(--primary); border-radius:0 6px 6px 0; line-height:1.4; border-top:1px solid rgba(255,255,255,0.05); margin-top:0.8rem; box-shadow: inset 0 0 10px rgba(0,0,0,0.05);">${tip}</div>`;

    elements.coachMessage.innerHTML = header + headlineHtml + bodyHtml + tipHtml;
}




const achievements = [
    { id: 'semilla', name: '🌱 Semilla', desc: 'Registraste tu primer movimiento', condition: () => transactions.length >= 1 },
    { id: 'ahorrador', name: '🎯 Ahorrador', desc: 'Creaste tu primer objetivo', condition: () => goals.length >= 1 },
    { id: 'disciplina', name: '🔥 Disciplina', desc: 'Registraste 10 movimientos', condition: () => transactions.length >= 10 },
    {
        id: 'balance_pos', name: '⚖️ Balance Positivo', desc: 'Tu balance total es positivo', condition: () => {
            const total = transactions.reduce((sum, t) => sum + (t.flow === 'income' ? getConvertedAmount(t) : -getConvertedAmount(t)), 0);
            return total > 0;
        }
    }
];

function checkAchievements() {
    let changed = false;
    achievements.forEach(ach => {
        if (!userStats.unlockedLogros.includes(ach.id) && ach.condition()) {
            userStats.unlockedLogros.push(ach.id);
            addXP(100, `Logro desbloqueado: ${ach.name}`);
            showToast(`🏆 Logro Desbloqueado: ${ach.name}`, "success");
            changed = true;
        }
    });
    if (changed) saveUserStats();
}

window.openLogrosModal = () => {
    renderLogros();
    openModal(document.getElementById('modal-logros'));
};

function renderLogros() {
    const grid = document.getElementById('logros-grid');
    if (!grid) return;
    grid.innerHTML = '';
    achievements.forEach(ach => {
        const isUnlocked = userStats.unlockedLogros.includes(ach.id);
        const card = document.createElement('div');
        card.style.cssText = `
            padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);
            background: ${isUnlocked ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0,0,0,0.2)'};
            opacity: ${isUnlocked ? '1' : '0.5'};
            text-align: center; transition: all 0.3s;
        `;
        card.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem; filter: ${isUnlocked ? 'none' : 'grayscale(100%)'}">${ach.name.split(' ')[0]}</div>
            <div style="font-weight: 700; font-size: 0.8rem; color: ${isUnlocked ? 'var(--secondary)' : 'var(--text-muted)'};">${ach.name.split(' ').slice(1).join(' ')}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.4rem;">${ach.desc}</div>
            ${isUnlocked ? '<div style="font-size: 0.6rem; color: var(--success); margin-top: 0.5rem; font-weight: 700;">✅ COMPLETADO</div>' : ''}
        `;
        grid.appendChild(card);
    });
}

function calculateAvailableSurplus(goalCurrency, goalCreatedAt, ignorePeriod = false) {
    const createdDate = new Date(goalCreatedAt || Date.now());
    createdDate.setHours(0, 0, 0, 0);
    let surplus = 0;
    transactions.forEach(t => {
        const [y, m, d] = t.date.split('-').map(Number);
        const txDate = new Date(y, m - 1, d);
        if (txDate >= createdDate) {
            if (ignorePeriod || isInActivePeriod(txDate)) {
                const val = t.flow === 'income' ? t.amount : -t.amount;
                surplus += convertCurrency(val, t.currency || 'LOCAL', goalCurrency);
            }
        }
    });
    return surplus;
}

// --- CSS Charts (No External Libs) ---
function updateCharts(data) {
    const viewCur = elements.currencyView.value;
    function createHorizontalBarChart(containerId, mapData, title, color, labelFunc) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `<h4 style="font-size:0.85rem; margin-bottom:0.75rem; color:${color}; font-weight:600;">${title}</h4>`;
        const entries = Object.entries(mapData).sort((a, b) => b[1] - a[1]);
        const total = entries.reduce((s, [, v]) => s + v, 0);
        if (total === 0 || entries.length === 0) {
            container.innerHTML += '<div style="opacity:0.5; font-size:0.75rem; text-align:center; padding:1rem;">Sin datos</div>';
            return;
        }
        const maxVal = Math.max(...entries.map(([, v]) => v)) || 1;
        entries.forEach(([key, val]) => {
            const percentOfMax = (val / maxVal) * 100;
            const percentOfTotal = Math.round((val / total) * 100);
            const label = labelFunc ? labelFunc(key) : key;
            const barHtml = `
                <div style="margin-bottom:0.6rem;">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:0.7rem; margin-bottom:3px; gap:0.5rem;">
                        <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;">${label}</span>
                        <div style="display:flex; align-items:baseline; gap:0.3rem;">
                            <span style="font-size:0.65rem; opacity:0.7; font-weight:500;">${percentOfTotal}%</span>
                            <span style="font-weight:600; color:${color};">${formatCurrency(val, viewCur)}</span>
                        </div>
                    </div>
                    <div style="background:rgba(255,255,255,0.08); border-radius:4px; height:18px; position:relative; overflow:hidden;">
                        <div style="background:${color}; height:100%; width:${percentOfMax}%; border-radius:4px; transition:width 0.4s ease; box-shadow: 0 0 8px ${color}40;"></div>
                    </div>
                </div>
            `;
            container.innerHTML += barHtml;
        });
    }

    const catIncMap = {};
    const catExpMap = {};
    data.forEach(t => {
        const v = getConvertedAmount(t);
        if (t.flow === 'income') catIncMap[t.category] = (catIncMap[t.category] || 0) + v;
        else catExpMap[t.category] = (catExpMap[t.category] || 0) + v;
    });
    createHorizontalBarChart('chart-category-income', catIncMap, '💰 Ingresos', 'var(--success)');
    createHorizontalBarChart('chart-category-expense', catExpMap, '💸 Egresos', 'var(--danger)');

    const payIncMap = {};
    const payExpMap = {};
    data.forEach(t => {
        const v = getConvertedAmount(t);
        const k = t.paymentForm || 'cash';
        if (t.flow === 'income') payIncMap[k] = (payIncMap[k] || 0) + v;
        else payExpMap[k] = (payExpMap[k] || 0) + v;
    });
    const payLabels = { cash: 'Efectivo', debit: 'Débito', credit: 'Crédito', transfer: 'Transferencia', crypto: 'Cripto' };
    createHorizontalBarChart('chart-payment-income', payIncMap, '💰 Ingresos', 'var(--success)', (k) => payLabels[k] || k);
    createHorizontalBarChart('chart-payment-expense', payExpMap, '💸 Egresos', 'var(--danger)', (k) => payLabels[k] || k);

    const timeMap = {};
    data.forEach(t => {
        const k = t.date.substring(0, 7);
        const v = getConvertedAmount(t);
        if (!timeMap[k]) timeMap[k] = { inc: 0, exp: 0 };
        if (t.flow === 'income') timeMap[k].inc += v; else timeMap[k].exp += v;
    });
    const timeContainer = document.getElementById('chart-timeline');
    timeContainer.innerHTML = '';
    const sortedMock = Object.keys(timeMap).sort().slice(-6);

    if (sortedMock.length === 0) {
        timeContainer.innerHTML = '<div style="opacity:0.5; font-size:0.8rem; text-align:center; padding:3rem; border:1px dashed var(--glass-border); border-radius:10px; grid-column:1/-1;">Registra ingresos y egresos para ver tu evolución temporal. 📈</div>';
        return;
    }

    const maxVal = Math.max(...sortedMock.map(k => Math.max(timeMap[k].inc, timeMap[k].exp))) || 1;
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    sortedMock.forEach(k => {
        const hInc = (timeMap[k].inc / maxVal * 100) || 0;
        const hExp = (timeMap[k].exp / maxVal * 100) || 0;
        const [y, m] = k.split('-');
        const timeLabel = `${monthNames[parseInt(m) - 1]} ${y}`;
        const incStr = formatCurrency(timeMap[k].inc, viewCur);
        const expStr = formatCurrency(timeMap[k].exp, viewCur);
        const netBalance = timeMap[k].inc - timeMap[k].exp;
        const balanceColor = netBalance >= 0 ? 'var(--success)' : 'var(--danger)';
        const balanceIcon = netBalance >= 0 ? '✅' : '⚠️';
        const balanceStr = formatCurrency(Math.abs(netBalance), viewCur);
        const totalFlow = (timeMap[k].inc + timeMap[k].exp) || 1;
        const pInc = Math.round((timeMap[k].inc / totalFlow) * 100);
        const pExp = Math.round((timeMap[k].exp / totalFlow) * 100);
        timeContainer.innerHTML += `
            <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; height:100%;">
                <div style="display:flex; align-items:flex-end; gap:4px; height:75%; width:100%; justify-content:center;">
                    <div style="display:flex; flex-direction:column; justify-content:flex-end; align-items:center; height:100%; width:12px;">
                        <span style="font-size:0.5rem; opacity:0.8; margin-bottom:2px;">${pInc}%</span>
                        <div style="width:100%; background:var(--success); opacity:0.8; height:${hInc}%; border-radius:2px 2px 0 0;" title="Ing: ${incStr}"></div>
                    </div>
                    <div style="display:flex; flex-direction:column; justify-content:flex-end; align-items:center; height:100%; width:12px;">
                        <span style="font-size:0.5rem; opacity:0.8; margin-bottom:2px;">${pExp}%</span>
                        <div style="width:100%; background:var(--danger); opacity:0.8; height:${hExp}%; border-radius:2px 2px 0 0;" title="Egr: ${expStr}"></div>
                    </div>
                </div>
                <div style="font-size:0.6rem; margin-top:4px; opacity:0.7; text-align:center; white-space:nowrap;">${timeLabel}</div>
                <div style="font-size:0.55rem; margin-top:2px; color:${balanceColor}; font-weight:600; text-align:center;">
                    ${balanceIcon} ${balanceStr}
                </div>
            </div>`;
    });
    if (Object.keys(timeMap).length === 0) {
        timeContainer.innerHTML = '<div style="width:100%; text-align:center; align-self:center; opacity:0.5; font-size:0.8rem;">Sin datos para mostrar</div>';
    }
}

function renderList(data) {
    elements.list.innerHTML = '';
    if (!data.length) { elements.list.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-secondary)">Sin movimientos</div>'; return; }
    data.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
        const isExp = t.flow === 'expense';
        const [y, m, d] = t.date.split('-');
        const item = document.createElement('div');
        item.style.cssText = `display:flex; justify-content:space-between; align-items:center; padding:1rem; background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:var(--radius-md); margin-bottom:0.5rem;`;
        item.innerHTML = `
            <div style="display:flex; gap:1rem; align-items:center;">
                <div style="width:40px; height:40px; border-radius:50%; background:${isExp ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)'}; display:flex; align-items:center; justify-content:center; color:${isExp ? 'var(--danger)' : 'var(--success)'}; font-size:1.2rem;">${isExp ? '↓' : '↑'}</div>
                <div>
                    <div style="font-weight:600;">${t.description} <span style="font-size:0.7rem; background:var(--primary); padding:2px 6px; border-radius:4px;">${t.category}</span></div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${d}/${m}/${y} • ${(t.paymentForm || 'EFECTIVO').toUpperCase()} ${t.platform ? `(${t.platform})` : ''} • ${t.currency || 'LOCAL'} ${t.location ? ` @ ${t.location}` : ''}</div>
                </div>
            </div>
            <div style="text-align:right;">
                <div style="font-weight:700; color:${isExp ? 'var(--danger)' : 'var(--success)'}">${isExp ? '-' : '+'} ${formatCurrency(t.amount, t.currency)}</div>
                <div style="display:flex; gap:0.5rem; justify-content:flex-end; margin-top:0.3rem;">
                    <button onclick="editTransaction('${t.id}')" style="background:none; border:none; cursor:pointer;" title="Editar">📝</button>
                    <button onclick="deleteTransaction('${t.id}')" style="background:none; border:none; cursor:pointer;" title="Eliminar">🗑️</button>
                </div>
            </div>
        `;
        elements.list.appendChild(item);
    });
}

window.editTransaction = (id) => {
    const t = transactions.find(tx => tx.id === id); if (!t) return;
    editingId = id; const f = elements.form;
    f.querySelector(`input[name="flow"][value="${t.flow}"]`).checked = true;
    f.querySelector('input[name="amount"]').value = t.amount;
    f.querySelector('input[name="description"]').value = t.description;
    f.querySelector('input[name="date"]').value = t.date;
    f.querySelector('select[name="type"]').value = t.type;
    f.querySelector('select[name="category"]').value = t.category;
    f.querySelector('select[name="paymentForm"]').value = t.paymentForm || 'cash';
    f.querySelector('select[name="currency"]').value = t.currency || 'LOCAL';
    f.querySelector('input[name="platform"]').value = t.platform || '';
    f.querySelector('input[name="location"]').value = t.location || '';
    document.querySelector('#modal h2').textContent = 'Editar Movimiento'; openModal(elements.modal);
};
window.deleteTransaction = (id) => {
    if (confirm('¿Eliminar esta transacción?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveData();
        updateDashboard();
        showToast("🗑️ Transacción eliminada con éxito", "success");
    }
};

// --- Goal Feasibility Real-time ---

window.togglePolicyInputs = () => { };
window.saveSavingPolicy = () => { };
function loadSavingPolicy() {
    if (elements.policyMode) elements.policyMode.value = savingPolicy.mode || 'percentage';
    if (elements.policyValue) elements.policyValue.value = savingPolicy.value || 0;
    if (elements.policyFreq) elements.policyFreq.value = savingPolicy.frequency || 30;
}
window.toggleCustomFreq = () => {
    if (elements.goalFrequency) {
        elements.goalCustomDays.classList.toggle('hidden', elements.goalFrequency.value !== 'custom');
    }
};
window.toggleGoalModeFields = () => { };

function checkGoalFeasibility() {
    const targetEl = document.getElementById('goal-target-amount');
    const manualEl = document.getElementById('goal-manual-amount');
    const deadlineEl = elements.goalForm.querySelector('[name="deadline"]');

    if (!targetEl || !manualEl || !deadlineEl) return;

    const target = parseFloat(targetEl.value) || 0;
    const currentManual = parseFloat(manualEl.value) || 0;
    const deadlineStr = deadlineEl.value;
    const currency = elements.goalCurrency.value || 'LOCAL';

    // Clamp percentage for display calculation
    const planPctEl = document.getElementById('goal-plan-percentage');
    if (planPctEl && parseFloat(planPctEl.value) > 100) planPctEl.value = 100;
    if (planPctEl && parseFloat(planPctEl.value) < 0) planPctEl.value = 0;

    if (!target || !deadlineStr) {
        elements.goalFeasibilityNotice.classList.add('hidden');
        return;
    }

    const deadline = new Date(deadlineStr);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.ceil((deadline - today) / 86400000);

    if (days <= 0) {
        elements.goalFeasibilityNotice.innerHTML = "⚠️ La fecha límite debe ser futura.";
        elements.goalFeasibilityNotice.classList.remove('hidden');
        return;
    }

    // --- Balance-Aware Liquidity Logic ---
    // 1. Calcular saldo total disponible en la moneda de la meta
    let totalLiquidity = 0;
    transactions.forEach(t => {
        totalLiquidity += convertCurrency(t.flow === 'income' ? t.amount : -t.amount, t.currency || 'LOCAL', currency);
    });

    // 2. Restar lo ya "asignado" (manual contributions) a metas de mayor prioridad
    const currentPriority = parseInt(elements.goalForm.querySelector('[name="priority"]')?.value) || 1;
    const assignedToOthers = goals
        .filter(g => g.id !== editingGoalId && (g.priority || 4) < currentPriority)
        .reduce((sum, g) => sum + convertCurrency(g.manualContributions || 0, g.currency || 'LOCAL', currency), 0);

    const netLiquidity = Math.max(0, totalLiquidity - assignedToOthers);
    const availableTotal = currentManual + netLiquidity;

    // Notice logic
    elements.goalFeasibilityNotice.classList.remove('hidden');

    // Verificación de sobre-compromiso (flujo)
    const currentInputPct = parseFloat(planPctEl?.value) || 0;
    const otherPct = goals.filter(g => g.id !== editingGoalId).reduce((sum, g) => sum + (g.planPercentage || 0), 0);
    const totalProposedPct = currentInputPct + otherPct;

    if (totalProposedPct > 100.1) {
        elements.goalFeasibilityNotice.className = 'goal-message message-reformula';
        elements.goalFeasibilityNotice.innerHTML = `⛔ <b>¡Sobre-Compromiso Detectado!</b><br>
            La suma de tus metas (${totalProposedPct.toFixed(1)}%) supera el 100% de tus ingresos.
            <br><small>El sistema ajustará esta meta al máximo disponible (${Math.max(0, 100 - otherPct).toFixed(1)}%) al guardar.</small>`;
        return;
    }

    if (availableTotal >= target - 0.01) {
        elements.goalFeasibilityNotice.className = 'goal-message message-optimo';
        elements.goalFeasibilityNotice.innerHTML = `✅ <b>¡Meta Cubierta por Saldo!</b><br>Tu saldo disponible actual ya alcanza para este objetivo. 🏆`;
        return;
    }

    // Si no se cubre por saldo, ver el plan de ahorro
    const remainingToSave = target - availableTotal;
    const monthlyNeeded = (remainingToSave / days) * 30;

    const totalPlanAllocation = getSavingAllocationInCurrency(currency);
    const statsResult = calculateMonthlySurplus(currency, 'history');
    const availableReal = Math.max(0, statsResult.monthlyEquivalent);
    const surplusForThis = Math.max(0, totalPlanAllocation);

    let statusClass = 'message-reformula';
    let statusIcon = '⛔';
    let statusTitle = 'Incompatible:';

    if (monthlyNeeded <= surplusForThis + 1) {
        statusClass = 'message-optimo'; statusIcon = '✅'; statusTitle = '¡Meta Viable!';
    } else if (monthlyNeeded <= availableReal + 1) {
        statusClass = 'message-advertencia'; statusIcon = '⚠️'; statusTitle = 'Ahorro en Riesgo:';
    }

    let mainActionText = "";
    if (statusClass === 'message-optimo') {
        const pct = elements.goalForm.querySelector('[name="planPercentage"]')?.value || "0";
        mainActionText = `Con tu plan del ${pct}%, cubrirás los <b>${formatCurrency(remainingToSave, currency)}</b> faltantes.`;
    } else {
        if (days < 30) {
            mainActionText = `Necesitas <b>${formatCurrency(remainingToSave, currency)}</b> extras en los próximos ${days} días.`;
        } else {
            mainActionText = `Necesitas separar <b>${formatCurrency(monthlyNeeded, currency)}/mes</b>.`;
        }

        // Mensaje especial para el caso del 100%
        if (statusClass === 'message-reformula') {
            const planPct = parseFloat(elements.goalForm.querySelector('[name="planPercentage"]')?.value) || 0;
            if (planPct >= 99) {
                mainActionText += `<br><small style="color:var(--danger)">⚠️ Ni ahorrando el 100% alcanzas en este tiempo.</small>`;
            }
        }
    }

    const detailText = (days < 30 && statusClass !== 'message-optimo') ?
        `<br><small>Ritmo mensual equivalente: ${formatCurrency(monthlyNeeded, currency)}/mes.</small>` : "";

    elements.goalFeasibilityNotice.className = `goal-message ${statusClass}`;
    elements.goalFeasibilityNotice.innerHTML = `
            ${statusIcon} <b>${statusTitle}</b><br>
            ${mainActionText}${detailText}
        `;
}


function calculateMonthlySurplus(targetCurrency, periodOverride) {
    const period = periodOverride || (elements.filterPeriod ? elements.filterPeriod.value : 'all') || 'all';
    let filteredTxs = transactions;
    const now = new Date();
    let net = 0;
    let daysDiff = 30;
    if (period === 'this-month') {
        filteredTxs = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
        daysDiff = Math.max(1, now.getDate());
    } else if (period === 'last-month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        filteredTxs = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear(); });
        daysDiff = 30;
    } else if (period === 'custom') {
        if (!elements.filterDateStart || !elements.filterDateEnd) {
            filteredTxs = transactions;
            daysDiff = 30;
        } else {
            const start = new Date(elements.filterDateStart.value);
            const end = new Date(elements.filterDateEnd.value);
            filteredTxs = transactions.filter(t => { const d = new Date(t.date); return d >= start && d <= end; });
            daysDiff = Math.max(1, Math.ceil((end - start) / 86400000));
        }
    } else if (period === 'history') {
        const threeMonthsAgo = new Date(); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filteredTxs = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
        if (filteredTxs.length === 0) {
            daysDiff = 30;
        } else {
            const dates = filteredTxs.map(t => new Date(t.date));
            const firstDate = new Date(Math.min(...dates));
            const range = Math.ceil((now - firstDate) / 86400000);
            daysDiff = Math.max(30, range); // Normalize to at least 30 days
        }
    } else {
        filteredTxs = transactions;
        if (transactions.length > 0) { const dates = transactions.map(t => new Date(t.date)); const minDate = new Date(Math.min(...dates)); daysDiff = Math.max(30, Math.ceil((now - minDate) / 86400000)); }
    }
    filteredTxs.forEach(t => { const val = convertCurrency(t.amount, t.currency || 'LOCAL', targetCurrency); if (t.flow === 'income') net += val; else net -= val; });
    return { totalNet: net, monthlyEquivalent: (net / daysDiff) * 30 };
}

function getSavingAllocationInCurrency(targetCurrency) {
    let monthlyAllocationLocal = 0;
    if (savingPolicy.mode === 'percentage') {
        const totalMonthlyIncomeLocal = calculateTotalIncome('LOCAL');
        monthlyAllocationLocal = totalMonthlyIncomeLocal * (savingPolicy.value / 100);
    } else {
        monthlyAllocationLocal = (savingPolicy.value / (savingPolicy.frequency || 30)) * 30;
    }
    return convertCurrency(monthlyAllocationLocal, 'LOCAL', targetCurrency);
}

function saveGoals() { localStorage.setItem('goals', JSON.stringify(goals)); }

function renderGoals() {
    elements.goalsList.innerHTML = '';
    if (!goals.length) {
        elements.goalsList.innerHTML = '<div style="grid-column:1/-1; text-align:center; opacity:0.6; padding:2rem; border:1px dashed var(--glass-border); border-radius:var(--radius-md);">Sin objetivos aún. ¡Define uno nuevo! 🎯</div>';
        return;
    }

    const stats = calculateMonthlySurplus('LOCAL');
    let availableSurplusLocal = stats.totalNet;
    const totalMonthlyIncomeLocal = calculateTotalIncome('LOCAL');

    // --- Liquidity Pre-calculation ---
    let totalLiquidityLocal = 0;
    transactions.forEach(t => totalLiquidityLocal += convertCurrency(t.flow === 'income' ? t.amount : -t.amount, t.currency || 'LOCAL', 'LOCAL'));

    const sortedGoals = [...goals].sort((a, b) => (a.priority || 4) - (b.priority || 4));
    const goalAllocations = new Map();
    const fundableByBalance = new Set();
    let remainingLiquidity = totalLiquidityLocal;

    sortedGoals.forEach(g => {
        const goalCurrency = g.currency || 'LOCAL';
        // Auto allocation (from income flow)
        const wantedPercent = (g.planPercentage || 0) / 100 * totalMonthlyIncomeLocal;
        const wantedFixed = convertCurrency(g.planFixed || 0, goalCurrency, 'LOCAL');
        const takenLocal = Math.min(availableSurplusLocal, wantedPercent + wantedFixed);
        availableSurplusLocal -= takenLocal;
        const autoVal = convertCurrency(takenLocal, 'LOCAL', goalCurrency);
        goalAllocations.set(g.id, autoVal);

        // Check if fundable by balance (Logic consistent with checkGoalFeasibility)
        const manualVal = parseFloat(g.manualContributions) || 0;
        const remToTarget = g.target - manualVal;
        if (remToTarget <= 0) {
            // Already covered by manual
        } else {
            const remToTargetLocal = convertCurrency(remToTarget, goalCurrency, 'LOCAL');
            if (remainingLiquidity >= remToTargetLocal - 0.01) {
                fundableByBalance.add(g.id);
            }
            remainingLiquidity -= Math.max(0, remToTargetLocal);
        }
    });

    goals.forEach(g => {
        const goalCurrency = g.currency || 'LOCAL';
        const manualVal = parseFloat(g.manualContributions) || 0;
        const autoVal = goalAllocations.get(g.id) || 0;
        const currentVal = manualVal + autoVal;
        // Clamp progress for display: always 0–100% visual, show real value separately
        const rawProg = g.target > 0 ? (currentVal / g.target) * 100 : 0;
        const prog = Math.min(Math.max(rawProg, 0), 100);
        const progDisplay = rawProg < 0
            ? `<span style="color:var(--danger)" title="El valor Auto asignado es negativo porque aún no hay suficiente excedente acumulado en el período seleccionado.">0% <small>(Excedente insuficiente)</small></span>`
            : `${prog.toFixed(1)}%`;
        const rem = Math.max(0, g.target - currentVal);
        const daysLeft = Math.ceil((new Date(g.deadline) - new Date()) / 86400000);
        const ideal = calculateIdealProgress(g);
        const isOptimal = currentVal >= (ideal - (g.target * 0.02));
        const isCoveredByBalance = fundableByBalance.has(g.id);
        const mode = (g.planPercentage > 0 || g.planFixed > 0) ? 'hybrid' : 'manual';

        let saveNeededMsg = '';
        if (rem > 0.99 && daysLeft > 0) {
            const saveNeededToday = rem / daysLeft;
            const freqDays = parseInt(g.frequency) || 30;
            if (daysLeft <= freqDays) saveNeededMsg = `🚩 <b>Recta Final:</b> Necesitás <b>${formatCurrency(rem, goalCurrency)} total</b> en ${daysLeft} días`;
            else saveNeededMsg = `📅 Objetivo: Ahorrar <b>${formatCurrency(saveNeededToday * freqDays, goalCurrency)}</b> cada ${freqDays} días`;
        } else if (rem <= 0.99) {
            saveNeededMsg = `<b style="color:var(--success)">¡¡META CUMPLIDA!! 🏆</b>`;
        }

        const card = document.createElement('div');
        card.className = 'goal-card';
        if (prog >= 100) card.style.borderColor = 'var(--success)';

        const badgeHtml = isCoveredByBalance ?
            `<div style="background:rgba(52,211,153,0.15); color:var(--success); font-size:0.65rem; padding:4px 8px; border-radius:20px; border:1px solid rgba(52,211,153,0.3); font-weight:700; width:fit-content; margin-top:0.4rem;">✅ SALDO SUFICIENTE</div>` : '';

        card.innerHTML = `
            <div class="goal-header">
                <div>
                    <div class="goal-title">🎯 ${g.name} <span style="font-size:0.7rem; color:var(--primary); background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:10px;">${goalCurrency}</span></div>
                    <div style="font-size:0.65rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-top:0.2rem;">Prioridad ${g.priority || 1}</div>
                    ${badgeHtml}
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <button onclick="editGoal('${g.id}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem;" title="Editar">📝</button>
                    <button onclick="deleteGoal('${g.id}')" style="background:none; border:none; cursor:pointer; font-size:1.1rem;" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="goal-stats"><span>Progreso: <b>${progDisplay}</b></span><span>Faltan: <b>${formatCurrency(rem, goalCurrency)}</b></span></div>
            <div class="goal-progress-container"><div class="goal-progress-bar" style="width:${prog}%"></div></div>
            <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">
                ${mode === 'hybrid' ? '<i style="color:var(--success); font-size:0.75rem;">🔄 Modo Híbrido Activo</i><br>' : ''}
                <div style="font-size:0.75rem; margin-top:0.3rem; padding:0.4rem; background:rgba(255,255,255,0.05); border-radius:4px; margin-bottom:0.5rem;">
                    📍 Manual: <b>${formatCurrency(manualVal, goalCurrency)}</b><br>
                    🤖 Auto (Asignado): <b>${formatCurrency(autoVal, goalCurrency)}</b><br>
                    💰 Total: <b>${formatCurrency(currentVal, goalCurrency)}</b>
                </div>
                ${saveNeededMsg}<br>⌛ Tiempo: <b>${daysLeft > 0 ? (daysLeft + ' días restantes') : (rem <= 0.99 ? '¡Completado!' : '¡Fecha cumplida!')}</b>
            </div>
            <div class="goal-message ${(rem <= 0.99 || isOptimal) ? 'message-optimo' : 'message-reformula'}">
                ${(rem <= 0.99 || isOptimal) ? `<b>¡¡Excelente!</b><br>Vas por delante de tu meta! 🌟` : `<b>¡Ánimo!</b><br>Faltan <b>${formatCurrency(Math.max(0, ideal - currentVal), goalCurrency)}</b> para estar al día. 💪`}
            </div>`;
        elements.goalsList.appendChild(card);
    });
}

function calculateIdealProgress(g) {
    const start = new Date(parseInt(g.createdAt || g.id));
    const end = new Date(g.deadline);
    const now = new Date();
    if (now >= end) return g.target;
    if (now <= start) return 0;
    return ((now - start) / (end - start)) * g.target;
}

window.editGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    editingGoalId = id;
    const form = elements.goalForm;
    form.querySelector('input[name="goalName"]').value = goal.name;
    form.querySelector('input[name="targetAmount"]').value = goal.target;
    form.querySelector('select[name="goalCurrency"]').value = goal.currency || 'LOCAL';
    document.getElementById('goal-plan-percentage').value = goal.planPercentage || 0;
    document.getElementById('goal-plan-fixed').value = goal.planFixed || 0;
    document.getElementById('goal-priority').value = goal.priority || 1;
    document.getElementById('goal-manual-amount').value = goal.manualContributions || 0;
    form.querySelector('input[name="deadline"]').value = goal.deadline;
    const freq = goal.frequency || 30;
    if ([7, 15, 30].includes(freq)) {
        form.querySelector('select[name="frequency"]').value = freq.toString();
        if (elements.goalCustomDays) elements.goalCustomDays.classList.add('hidden');
    }
    else {
        form.querySelector('select[name="frequency"]').value = 'custom';
        if (form.querySelector('input[name="customDays"]')) form.querySelector('input[name="customDays"]').value = freq;
        if (elements.goalCustomDays) elements.goalCustomDays.classList.remove('hidden');
    }
    const header = document.querySelector('#modal-goal h2');
    if (header) header.textContent = 'Editar Objetivo';
    openModal(elements.modalGoal);
    // Explicitly check feasibility after population
    checkGoalFeasibility();
}

window.deleteGoal = (id) => { if (confirm('¿Eliminar este objetivo?')) { goals = goals.filter(g => g.id !== id); saveGoals(); renderGoals(); updateGlobalMonitor(); } };

function handleGoalSubmit(e) {
    e.preventDefault();
    const formData = new FormData(elements.goalForm);
    const id = editingGoalId || Date.now().toString();
    const newPriority = parseInt(formData.get('priority')) || 1;

    let planPercentage = parseFloat(formData.get('planPercentage')) || 0;
    if (planPercentage > 100) planPercentage = 100;
    if (planPercentage < 0) planPercentage = 0;

    // --- Commitment Cap Enforcement ---
    const otherIncomesPct = goals.filter(g => g.id !== id).reduce((sum, g) => sum + (g.planPercentage || 0), 0);
    if (planPercentage + otherIncomesPct > 100) {
        planPercentage = Math.max(0, 100 - otherIncomesPct);
        showToast(`Meta ajustada al ${planPercentage.toFixed(1)}% para no exceder el 100% total.`, "warning");
    }

    // --- Priority Conflict Resolution ---
    // If a goal already has this priority, shift all equal or higher priorities up
    let updatedGoals = [...goals];
    const exists = updatedGoals.some(g => g.id !== id && g.priority === newPriority);

    if (exists) {
        updatedGoals = updatedGoals.map(g => {
            if (g.id !== id && g.priority >= newPriority) {
                return { ...g, priority: g.priority + 1 };
            }
            return g;
        });
        goals = updatedGoals;
    }

    const data = {
        id,
        name: formData.get('goalName'),
        target: parseFloat(formData.get('targetAmount')),
        currency: formData.get('goalCurrency') || 'LOCAL',
        priority: newPriority,
        planPercentage: planPercentage,
        planFixed: parseFloat(formData.get('planFixed')) || 0,
        manualContributions: parseFloat(formData.get('manualAmount')) || 0,
        deadline: formData.get('deadline'),
        frequency: formData.get('frequency') === 'custom' ? (parseInt(formData.get('customDays')) || 30) : parseInt(formData.get('frequency')),
        createdAt: editingGoalId ? goals.find(g => g.id === id).createdAt : Date.now()
    };

    if (editingGoalId) {
        const idx = goals.findIndex(g => g.id === editingGoalId);
        if (idx !== -1) goals[idx] = data;
    } else {
        goals.push(data);
    }

    saveGoals();
    closeModal(elements.modalGoal);
    renderGoals();
    updateGlobalMonitor();
    addXP(20, "Nueva meta financiera definida");
}

function updateGlobalMonitor() {
    if (!elements.libertyCommitment || !elements.libertyMargin) return;

    // Calcular compromisos totales
    let totalPercent = 0;
    let totalFixedLocal = 0;

    goals.forEach(g => {
        totalPercent += (parseFloat(g.planPercentage) || 0);
        totalFixedLocal += convertCurrency(parseFloat(g.planFixed) || 0, g.currency || 'LOCAL', 'LOCAL');
    });

    const totalMonthlyIncomeLocal = calculateTotalIncome('LOCAL');
    const committedAmount = (totalMonthlyIncomeLocal * (Math.min(100, totalPercent) / 100)) + totalFixedLocal;

    if (elements.libertyCommitment) {
        elements.libertyCommitment.innerHTML = `
            <div style="font-size:0.9rem; font-weight:700;">${Math.min(100, totalPercent).toFixed(1)}% + ${formatCurrency(totalFixedLocal, 'LOCAL')}</div>
            <div style="font-size:0.7rem; opacity:0.8; margin-top:2px;">Compromiso Total: ${formatCurrency(committedAmount, 'LOCAL')}</div>
        `;
    }

    // Obtener excedente promedio (3 meses)
    const stats = calculateMonthlySurplus('LOCAL', 'history');
    const monthlyEquivalent = stats.monthlyEquivalent || 0;
    const freeMargin = monthlyEquivalent - committedAmount;

    // --- Sustainability Aware Logic ---
    // Calculamos el saldo total para saber si el flujo negativo es tolerable
    let totalLiquidityLocal = 0;
    transactions.forEach(t => totalLiquidityLocal += convertCurrency(t.flow === 'income' ? t.amount : -t.amount, t.currency || 'LOCAL', 'LOCAL'));

    const isOverCommitted = totalPercent > 100.1;
    let marginStatus = 'optimo'; // normal
    let marginColor = 'var(--success)';
    let sustainabilityText = '* Ingresos promedio menos gastos y compromisos.';

    if (isOverCommitted) {
        marginStatus = 'danger';
        marginColor = 'var(--danger)';
        sustainabilityText = '⚠️ Superas el 100% de compromiso de tus ingresos.';
    } else if (freeMargin < 0) {
        // ¿Tenemos saldo para cubrir este déficit de flujo?
        const monthsOfSustain = Math.abs(totalLiquidityLocal / freeMargin);
        if (monthsOfSustain > 6) {
            marginStatus = 'warning';
            marginColor = '#ff9800'; // Naranja (Sostenible por saldo)
            sustainabilityText = `⚠️ Flujo negativo, pero sostenible por ~${Math.floor(monthsOfSustain)} meses con tu saldo actual.`;
        } else {
            marginStatus = 'danger';
            marginColor = 'var(--danger)';
            sustainabilityText = `⛔ Déficit de flujo crítico. Tu ahorro supera tu capacidad mensual real.`;
        }
    }

    if (elements.libertyMargin) {
        const warningIcon = marginStatus !== 'optimo' ? '⚠️ ' : '';
        elements.libertyMargin.innerHTML = `
            <div style="color:${marginColor}; font-weight:700; font-size:1.1rem;">${warningIcon}${formatCurrency(freeMargin, 'LOCAL')}</div>
            <div style="font-size:0.65rem; opacity:0.7; line-height:1.2;">Margen Libre (Flujo Mensual)</div>
            <div style="font-size:0.6rem; opacity:0.5; margin-top:4px; font-style:italic;">${sustainabilityText}</div>
        `;
    }
}
// --- Manual (Help) ---
window.openManual = () => {
    console.log("Opening manual...");
    if (typeof nextManualStep === 'function') nextManualStep(1);
    openModal(elements.modalOnboarding);
};

// Help binding (Consolidated)
function initHelpTrigger() {
    console.log("Initializing help trigger listener...");
    const trigger = document.getElementById('help-trigger');
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            console.log("Help trigger clicked!");
            e.preventDefault();
            window.openManual();
        });
    } else {
        console.warn("Help trigger element not found in DOM!");
    }
}

window.nextManualStep = (step) => {
    document.querySelectorAll('.manual-card').forEach(card => card.classList.add('hidden'));
    const nextCard = document.getElementById(`manual-step-${step}`);
    if (nextCard) {
        nextCard.classList.remove('hidden');
        // Update dots for all cards
        const dots = nextCard.querySelectorAll('.manual-dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === step - 1);
        });
    }
};

function initHelpChat() {
    console.log("Initializing help chat listener...");
    if (elements.helpChatForm) {
        elements.helpChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = elements.helpChatInput;
            const text = input.value.trim().toLowerCase();
            if (!text) return;

            appendChatMessage(input.value, 'user');
            input.value = '';

            setTimeout(() => {
                let response = window.CHATBOT_KNOWLEDGE?.["fallback"] || "Lo siento, no entiendo esa duda específica.";
                const knowledge = window.CHATBOT_KNOWLEDGE || {};

                // 🌟 DYNAMIC ANALYSIS INTERCEPTION 🌟
                if (text.includes("analiza") || text.includes("como voy") || text.includes("resultados") || text.includes("resumen")) {
                    // Extract live data from the DOM
                    const localBalance = elements.balLocal ? elements.balLocal.innerText : "$ 0";
                    const marginLibre = elements.libertyMargin ? elements.libertyMargin.innerText : "$ 0";
                    const isPositive = !marginLibre.includes('-');

                    response = `¡Claro! Analizando tus números actuales en tiempo real: tienes un saldo local de <b>${localBalance}</b>.<br><br>`;

                    if (isPositive && marginLibre !== "$ 0,00" && marginLibre !== "$ 0.00" && marginLibre !== "$ 0") {
                        response += `Tu Margen Libre reportado es de <b style="color: var(--success-color);">${marginLibre}</b>. Como es positivo, vas por muy buen camino. Te aconsejo destinar ese superávit mensual a tus metas de prioridad alta o inversiones.<br><br>`;
                    } else if (!isPositive) {
                        response += `Tu Margen Libre reportado es de <b style="color: var(--danger-color);">${marginLibre}</b>. Al ser negativo, estás sobre-comprometido. Te recomiendo frenar los gastos variables agresivamente este mes para no atrasar tus metas futuras. ¡El futuro se construye hoy!`;
                    } else {
                        response += `Tu Margen Libre es de <b>${marginLibre}</b>. Estás justo al límite (quedaste en cero). Es un buen inicio, pero intenta reducir gastos hormiga para empezar a generar superávit el próximo mes.`;
                    }
                } else {
                    // Standard Dictionary Lookup (Partial match on sentence allowed)
                    for (const [key, val] of Object.entries(knowledge)) {
                        if (text.includes(key.toLowerCase()) && key !== "fallback") {
                            response = val;
                            break;
                        }
                    }
                }
                appendChatMessage(response, 'assistant');
            }, 600);
        });
    }
}

window.showSectionInfo = (section) => {
    const infos = {
        filtros: {
            title: "Filtros de Datos",
            text: "Usa este panel para segmentar tu información. <br><br><b>Fechas:</b> Define el periodo de análisis. <br><b>Flujo:</b> Filtra solo ingresos o egresos. <br><b>Categorías:</b> Enfócate en un grupo específico de gastos. <br><br><b>Consejo:</b> Usa el filtro 'Este Mes' para ver tu rendimiento actual vs tus metas."
        },
        logros: {
            title: "Nivel y Logros",
            text: "Este sistema premia tu disciplina financiera. <br><br><b>XP:</b> Ganas experiencia por registrar movimientos, crear metas y ahorrar. <br><b>Niveles:</b> Reflejan tu maestría. <br><b>Logros:</b> Hitos específicos que desbloquean bonificaciones de XP. <br><br>¡Conviértete en una 'Leyenda' financiera!"
        },
        coach: {
            title: "Coach Financiero 🤖",
            text: "Es tu asesor basado en IA. <br><br><b>Objetivo:</b> Analiza tendencias, detecta gastos impulsivos y te da tips psicológicos para mejorar tus hábitos. <br><br><b>Qué significa:</b> Si el Coach te advierte sobre una categoría, es porque detectó un aumento inusual respecto a tus periodos anteriores."
        },
        monitor: {
            title: "Monitor de Compromisos",
            text: "Analiza la sostenibilidad de tu vida financiera. <br><br><b>Compromiso:</b> Cuánto de tus ingresos ya está prometido a metas de ahorro. <br><b>Margen Libre:</b> Lo que te queda REALMENTE para vivir. <br><br><b>Peligro:</b> Si el margen es negativo, estás 'sobre-comprometido' y podrías tener problemas de liquidez pronto."
        },
        balance_resumen: {
            title: "Resumen de Saldos",
            text: "Tu patrimonio total dividido por moneda. <br><br><b>Saldos Reales:</b> No es lo que ganaste hoy, sino lo que tienes acumulado físicamente o en bancos. <br><br><b>Uso:</b> Te ayuda a saber exactamente cuánta liquidez tienes en cada moneda para tomar decisiones de inversión o gasto."
        },
        ingresos: {
            title: "Tus Ingresos",
            text: "Suma de todo el dinero que entró en el periodo seleccionado. <br><br><b>Objetivo:</b> Mantener esta cifra siempre por encima de tus egresos. <br><br><b>Significado:</b> Un flujo constante de ingresos es la base para alimentar tus metas automáticas."
        },
        egresos: {
            title: "Tus Egresos",
            text: "Todo el dinero que gastaste o salió de tu sistema. <br><br><b>Objetivo:</b> Detectar y reducir gastos 'hormiga' o innecesarios. <br><br><b>Tip:</b> Si los egresos superan tus ingresos, el Coach te avisará para que revises tu presupuesto."
        },
        resultado: {
            title: "Resultado Neto (Superávit)",
            text: "Es la 'Ganancia' de tu vida personal (Ingresos - Egresos). <br><br><b>Clave:</b> Este valor es el que alimenta tus **Metas por Prioridad**. Si es positivo, ¡estás creando riqueza! Si es negativo, estás consumiendo tus ahorros."
        },
        objetivos: {
            title: "Objetivos Financieros",
            text: "Define tus metas y deja que el Dashboard las gestione. <br><br><b>Prioridad (P1, P2...):</b> El orden en que se llenarán tus metas. El superávit de fin de mes irá primero a P1, luego a P2, etc. <br><br><b>Modo Híbrido:</b> Puedes aportar manualmente o dejar que el sistema asigne un % fijo de tus ingresos."
        },
        analisis: {
            title: "Análisis de Gastos",
            text: "Visualiza dónde se va el dinero. El gráfico temporal te avisa con ⚠️ si ese día gastaste más de lo que ganaste en promedio. <br><br><b>Filosofía:</b> No busques el 0, busca el superávit (✅) constante."
        },
        evolucion: {
            title: "Análisis de Evolución",
            text: "Este gráfico muestra tus 'batallas' diarias. Cada barra es un día o mes según el filtro. <br><br><b>Verde:</b> Superávit. <br><b>Rojo/Naranja:</b> Déficit que afecta tu capital acumulado."
        },
        categorias: {
            title: "Distribución por Categoría",
            text: "Analiza tus hábitos de consumo. <br><br><b>Uso:</b> Detecta qué áreas (ej: Comida, Ocio, Servicios) consumen más porcentaje de tu ingreso para optimizarlas."
        },
        metodos: {
            title: "Métodos de Pago",
            text: "Controla cómo usas el dinero. <br><br><b>Efectivo/Débito:</b> Consumo sobre capital propio. <br><b>Crédito:</b> Consumo sobre capital futuro (deuda). Monitorea que tu crédito no supere tu capacidad de pago mensual."
        },
        transacciones: {
            title: "Detalle de Movimientos",
            text: "El registro histórico de cada paso que das. <br><br><b>Uso:</b> Puedes editar o borrar movimientos. Sirve para auditar gastos que no recordabas y entender el flujo diario."
        },
        cur_config: {
            title: "Configuración de Moneda",
            text: "Ajusta cómo el sistema calcula tus conversiones. <br><br><b>Sincronización (🔄):</b> Actualiza las tasas automáticamente usando APIs externas. <br><b>Bloqueo Manual (🔒):</b> Si editas un valor a mano, el sistema dejará de actualizarlo automáticamente para respetar tu ingreso manual. <br><b>Liberar (🔓):</b> Si quieres volver al modo automático, usa esta opción."
        }
    };

    const info = infos[section];
    if (info) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.zIndex = '3000';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 450px; border: 1px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: var(--primary);">${info.title}</h3>
                    <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                </div>
                <p style="line-height: 1.6; color: var(--text-secondary); font-size: 0.95rem;">${info.text}</p>
                <button onclick="this.closest('.modal-overlay').remove()" class="btn-primary" style="width: 100%; margin-top: 1.5rem;">Entendido</button>
            </div>
        `;
        document.body.appendChild(modal);
        // Force display:flex since .modal-overlay defaults to display:none in CSS
        modal.style.display = 'flex';
    }
};

window.validateQuiz = (questionId, option) => {
    const feedback = document.getElementById(`quiz-feedback-${questionId}`);
    
    if (questionId === 1) {
        if (option === 2) {
            feedback.innerHTML = '<span style="color:var(--success)">✨ ¡Correcto! El Margen Libre es tu verdadera brújula.</span>';
            setTimeout(() => {
                window.nextManualStep(10);
            }, 1000);
        } else {
            feedback.innerHTML = '<span style="color:var(--warning)">❌ No exactamente. Revisa el Paso 2 sobre el Margen Libre.</span>';
        }
    } else if (questionId === 2) {
        if (option === 2) {
            feedback.innerHTML = '<span style="color:var(--success)">✨ ¡Exacto! Eres responsable de tu propia copia.</span>';
            setTimeout(() => {
                window.finishManual();
            }, 1000);
        } else {
            feedback.innerHTML = '<span style="color:var(--warning)">❌ Error. Esta App es privada, no hay nube. Debes guardar tu copia.</span>';
        }
    }
};

window.finishManual = () => { 
    if (confirm("He comprendido la importancia del Margen Libre y la seguridad de mis datos.")) {
        localStorage.setItem('onboardingDone', 'true'); 
        const modal = elements.modalOnboarding;
        if (modal) {
            modal.dataset.mandatory = "false";
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
        document.body.style.overflow = '';
        showToast("¡Excelente! Ahora tienes el control total.", "success");
    }
};

// --- Help Assistant Chat Logic ---
window.askChat = (questionText) => {
    const input = document.getElementById('help-chat-input');
    if (input) {
        input.value = questionText;
        elements.helpChatForm.dispatchEvent(new Event('submit'));
    }
};
window.openHelpChat = () => {
    const modal = elements.helpChatModal;
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        // Auto-focus input for better ergonomics
        setTimeout(() => elements.helpChatInput?.focus(), 100);
    }
};

window.closeHelpChat = () => {
    const modal = elements.helpChatModal;
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

// Help knowledge is now loaded from window.CHATBOT_KNOWLEDGE in chatbot_knowledge.js

function appendChatMessage(msg, sender) {
    const container = elements.helpChatMessages;
    if (!container) return;
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = msg;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}



function calculateTotalIncome(targetCurrency) {
    const now = new Date();
    const threeMonthsAgo = new Date(); threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Filter incomes in the last 3 months
    const incomes = transactions.filter(t => t.flow === 'income' && new Date(t.date) >= threeMonthsAgo);
    if (incomes.length === 0) return 0;

    let totalIncomeLocal = 0;
    incomes.forEach(t => totalIncomeLocal += convertCurrency(t.amount, t.currency || 'LOCAL', 'LOCAL'));

    // Fix for new accounts or irregular data:
    // 1. Find the earliest transaction in the window
    const dates = incomes.map(t => new Date(t.date));
    const firstDate = new Date(Math.min(...dates));

    // 2. Calculate actual days covered by transactions in this window
    const daysSinceStart = Math.max(1, Math.ceil((now - firstDate) / 86400000));

    // 3. Logic: If we have less than 30 days of data, 
    // we assume the recorded income IS the monthly base (don't divide/average yet).
    // If we have more than 30 days, we normalize to a 30-day "monthly equivalent".
    let monthlyEquivalentLocal = 0;
    if (daysSinceStart <= 30) {
        monthlyEquivalentLocal = totalIncomeLocal; // Take it as is
    } else {
        monthlyEquivalentLocal = (totalIncomeLocal / daysSinceStart) * 30; // Average out
    }

    return convertCurrency(monthlyEquivalentLocal, 'LOCAL', targetCurrency);
}




// --- Data Management Logic ---

const BACKUP_KEYS = ['transactions', 'categories', 'goals', 'userStats', 'currencyLock', 'currencySettings', 'nomadMode', 'savingPolicy', 'onboardingDone', 'appTheme', 'customBg'];

function exportData() {
    const backup = {};
    BACKUP_KEYS.forEach(key => {
        backup[key] = localStorage.getItem(key);
    });

    try {
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", `finanzas_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        setTimeout(() => URL.revokeObjectURL(url), 100);
        showToast("✅ ¡Copia guardada con éxito! Guárdala bien para usarla en otros dispositivos.", "success");
    } catch (e) {
        console.error("Export error:", e);
        showToast("Error al generar el respaldo.", "danger");
    }
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const backup = JSON.parse(event.target.result);

            // Basic validation
            if (!backup || typeof backup !== 'object') throw new Error("Formato de archivo inválido.");

            if (confirm("⚠️ ¿Quieres recuperar esta copia? Esto reemplazará todo lo que tienes cargado en este momento.")) {
                localStorage.clear();

                let count = 0;
                Object.keys(backup).forEach(key => {
                    let val = backup[key];
                    if (val === null || val === undefined) return;

                    // Resilience: if the value is an object (old format), stringify it
                    if (typeof val !== 'string') {
                        val = JSON.stringify(val);
                    }

                    localStorage.setItem(key, val);
                    count++;
                });

                showToast(`✅ ¡Datos recuperados con éxito! El sistema se reiniciará para aplicar los cambios.`, "success");

                // Final safety: Force immediate update of common global arrays if possible
                // though reload is the main way to sync.
                setTimeout(() => window.location.reload(), 1200);
            }
        } catch (err) {
            console.error("Import error:", err);
            showToast("Error al importar: " + err.message, "danger");
        }
    };
    reader.readAsText(file);
}

function resetData() {
    if (confirm("🚨 ATENCIÓN: Esta acción borrará TODO de forma permanente (Transacciones, Metas, Categorías y Progreso). ¿Deseas continuar?")) {
        const password = prompt("Escribe exactamente 'BORRAR' (en mayúsculas) para confirmar:");
        if (password === 'BORRAR') {
            localStorage.clear();
            showToast("Todo ha sido borrado. Reiniciando...", "warning");
            setTimeout(() => window.location.reload(), 1500);
        } else {
            showToast("Confirmación incorrecta. Acción cancelada.", "info");
        }
    }
}
