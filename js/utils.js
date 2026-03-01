// ================================================================
// 2. TOASTS & KLOCKA
// ================================================================
function showToast(msg, type = '') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateClock() {
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById('live-clock').innerText = "Systemtid: " + new Date().toLocaleDateString('sv-SE', opts);
}
setInterval(updateClock, 1000);
updateClock();

// ================================================================
// 3. AKTIVITETSLOGG (cap 100, search, visa fler)
// ================================================================
function addLog(action, userName = null) {
    const name = userName || (currentUser ? currentUser.name : "System");
    logs.unshift({ name, action, time: new Date().toLocaleTimeString('sv-SE') });
    if (logs.length > 100) logs.pop();
    saveData();
    if (currentUser && currentUser.role === 'admin') renderLogs();
}

function renderLogs() {
    const list = document.getElementById('activity-log-list');
    if (!list) return;

    const filter = (document.getElementById('log-search')?.value || '').toLowerCase();
    const filtered = filter
        ? logs.filter(l => l.name.toLowerCase().includes(filter) || l.action.toLowerCase().includes(filter))
        : logs;

    list.innerHTML = filtered.slice(0, logDisplayCount)
        .map(l => `<li><span><strong>${l.name}</strong>: ${l.action}</span><span class="log-time">${l.time}</span></li>`)
        .join('');

    const btn = document.getElementById('log-show-more');
    if (btn) btn.style.display = filtered.length > logDisplayCount ? 'block' : 'none';
}

function showMoreLogs() {
    logDisplayCount += 50;
    renderLogs();
}

// ================================================================
// 4. TEMA & NÄTVERK
// ================================================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('tt_theme', isDark ? 'dark' : 'light');
    if (window.myChart) { Chart.defaults.color = isDark ? '#94a3b8' : '#64748b'; window.myChart.update(); }
}
if (localStorage.getItem('tt_theme') === 'dark') document.body.classList.add('dark-mode');

function updateNetworkStatus(isOnline) {
    const el = document.getElementById('network-status');
    if (isOnline) { el.className = 'network-badge online'; el.innerText = '🟢 Online'; }
    else          { el.className = 'network-badge offline'; el.innerText = '🔴 Offline'; showToast('Du är offline. Allt sparas lokalt.', 'warning'); }
}
window.addEventListener('online',  () => updateNetworkStatus(true));
window.addEventListener('offline', () => updateNetworkStatus(false));
if (!navigator.onLine) updateNetworkStatus(false);
