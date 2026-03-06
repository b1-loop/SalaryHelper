// ================================================================
// 1b. XSS-SKYDD
// ================================================================
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ================================================================
// 2. RÖDA DAGAR (svenska helgdagar)
// ================================================================
function getEasterDate(year) {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day   = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function getSwedishHolidays(year) {
    const pad  = n => String(n).padStart(2, '0');
    const fmt  = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const add  = (base, days) => { const d = new Date(base); d.setDate(d.getDate() + days); return d; };
    const easter = getEasterDate(year);

    // Midsommarafton = fredag 19–25 juni
    let mid = new Date(year, 5, 19);
    while (mid.getDay() !== 5) mid.setDate(mid.getDate() + 1);

    // Alla helgons dag = lördag 31 okt – 6 nov
    let allh = new Date(year, 9, 31);
    while (allh.getDay() !== 6) allh.setDate(allh.getDate() + 1);

    return {
        [`${year}-01-01`]: 'Nyårsdagen',
        [`${year}-01-06`]: 'Trettondedag jul',
        [fmt(add(easter, -2))]: 'Långfredagen',
        [fmt(easter)]:           'Påskdagen',
        [fmt(add(easter, 1))]:   'Annandag påsk',
        [`${year}-05-01`]:       'Första maj',
        [fmt(add(easter, 39))]:  'Kristi himmelsfärd',
        [`${year}-06-06`]:       'Nationaldagen',
        [fmt(mid)]:              'Midsommarafton',
        [fmt(add(mid, 1))]:      'Midsommardagen',
        [fmt(allh)]:             'Alla helgons dag',
        [`${year}-12-24`]:       'Julafton',
        [`${year}-12-25`]:       'Juldagen',
        [`${year}-12-26`]:       'Annandag jul',
        [`${year}-12-31`]:       'Nyårsafton',
    };
}

// ================================================================
// 3. TOASTS & KLOCKA
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
// 4. AKTIVITETSLOGG (cap 100, search, visa fler)
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
        .map(l => `<li><span><strong>${escapeHtml(l.name)}</strong>: ${escapeHtml(l.action)}</span><span class="log-time">${escapeHtml(l.time)}</span></li>`)
        .join('');

    const btn = document.getElementById('log-show-more');
    if (btn) btn.style.display = filtered.length > logDisplayCount ? 'block' : 'none';
}

function showMoreLogs() {
    logDisplayCount += 50;
    renderLogs();
}

// ================================================================
// 5. TEMA & NÄTVERK
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
