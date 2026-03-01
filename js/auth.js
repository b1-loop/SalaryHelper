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
    const pin = document.getElementById('login-pin').value;
    currentUser = employees.find(emp => emp.pin === pin);

    if (!currentUser) {
        const inp = document.getElementById('login-pin');
        inp.value = '';
        inp.classList.remove('shake');
        void inp.offsetWidth; // reflow to restart animation
        inp.classList.add('shake');
        document.getElementById('pin-error').innerText = 'Fel PIN-kod';
        showToast("Fel PIN-kod", "error");
        return;
    }

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
    document.getElementById('logged-in-user').innerText = `👤 ${currentUser.name}`;
    updateCompanyName();

    if (currentUser.role === 'admin') {
        document.getElementById('admin-view').classList.remove('hidden');
        document.getElementById('worker-view').classList.add('hidden');
        document.getElementById('settings-btn').classList.remove('hidden');
        loadAdminData();
        showToast("Inloggad som Admin", "success");
    } else {
        document.getElementById('worker-view').classList.remove('hidden');
        document.getElementById('admin-view').classList.add('hidden');
        document.getElementById('settings-btn').classList.add('hidden');
        loadWorkerView();
        showToast("Välkommen!", "success");
        resetInactivityTimer();

        if ('Notification' in window) Notification.requestPermission();
        checkShiftReminders();
        setInterval(checkShiftReminders, 60000);
    }
}

function logout() {
    clearInterval(liveTimerInterval);
    clearTimeout(inactivityTimer);
    currentUser = null;
    document.getElementById('app-content').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-pin').value = '';
    document.getElementById('pin-error').innerText = '';
    showToast("Utloggad.");
}

// Enter key on PIN field triggers login
document.getElementById('login-pin').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
});

// Init company name on page load
updateCompanyName();
