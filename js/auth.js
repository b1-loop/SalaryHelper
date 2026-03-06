// ================================================================
// INAKTIVITETS-TIMEOUT (15 min)
// ================================================================
function resetInactivityTimer() {
    if (!currentUser) return;
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (currentUser) {
            showToast('Automatisk utloggning efter 15 min inaktivitet.', 'warning');
            logout();
        }
    }, INACTIVITY_MS);
}

['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
});

// ================================================================
// INLOGGNING
// ================================================================
let _loginAttempts  = 0;
let _loginLockedUntil = 0;
const MAX_LOGIN_ATTEMPTS = 3;
const LOGIN_LOCKOUT_MS   = 30_000; // 30 sekunder

function clearPinError() {
    document.getElementById('pin-error').innerText = '';
    document.getElementById('login-pin').classList.remove('shake');
}

function pinInput(digit) {
    const inp = document.getElementById('login-pin');
    if (inp.value.length < 4) { inp.value += digit; clearPinError(); }
    if (inp.value.length === 4) doLogin();
}

function pinClear() {
    const inp = document.getElementById('login-pin');
    inp.value = inp.value.slice(0, -1);
    clearPinError();
}

function doLogin() {
    const now = Date.now();
    const errEl = document.getElementById('pin-error');

    if (now < _loginLockedUntil) {
        const secsLeft = Math.ceil((_loginLockedUntil - now) / 1000);
        errEl.innerText = `Kontot låst — försök igen om ${secsLeft}s`;
        document.getElementById('login-pin').value = '';
        return;
    }

    const pin = document.getElementById('login-pin').value;
    currentUser = employees.find(emp => emp.pin === pin);

    if (!currentUser) {
        _loginAttempts++;
        const inp = document.getElementById('login-pin');
        inp.value = '';
        inp.classList.remove('shake');
        void inp.offsetWidth; // reflow to restart animation
        inp.classList.add('shake');

        if (_loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            _loginLockedUntil = now + LOGIN_LOCKOUT_MS;
            _loginAttempts    = 0;
            errEl.innerText   = 'För många försök — låst i 30 sekunder';
            showToast("För många felaktiga PIN-försök. Låst i 30s.", "error");
        } else {
            const left = MAX_LOGIN_ATTEMPTS - _loginAttempts;
            errEl.innerText = `Fel PIN-kod (${left} försök kvar)`;
            showToast("Fel PIN-kod", "error");
        }
        return;
    }

    _loginAttempts  = 0;
    _loginLockedUntil = 0;

    currentUser.lastLogin = Date.now();
    saveData();

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
    document.getElementById('logged-in-user').innerText = `👤 ${currentUser.name}`;
    updateCompanyName();
    applyTranslations();

    document.getElementById('tour-help-btn').classList.remove('hidden');

    if (currentUser.role === 'admin') {
        document.getElementById('admin-view').classList.remove('hidden');
        document.getElementById('worker-view').classList.add('hidden');
        document.getElementById('settings-btn').classList.remove('hidden');
        document.getElementById('msg-nav-btn').classList.remove('hidden');
        loadAdminData();
        initAdminPolling();
        showToast("Inloggad som Admin", "success");
        autoStartTour();
    } else {
        document.getElementById('worker-view').classList.remove('hidden');
        document.getElementById('admin-view').classList.add('hidden');
        document.getElementById('settings-btn').classList.add('hidden');
        loadWorkerView();
        showToast("Välkommen!", "success");
        autoStartTour();
        resetInactivityTimer();

        if ('Notification' in window) Notification.requestPermission();
        checkShiftReminders();
        setInterval(checkShiftReminders, 60000);
    }
}

function logout() {
    clearInterval(liveTimerInterval);
    clearTimeout(inactivityTimer);
    endTour();
    currentUser = null;
    document.getElementById('app-content').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-pin').value = '';
    document.getElementById('pin-error').innerText = '';
    document.getElementById('tour-help-btn').classList.add('hidden');
    showToast("Utloggad.");
}

// Enter key on PIN field triggers login
document.getElementById('login-pin').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
});

// Init company name and language on page load
updateCompanyName();
applyTranslations();
