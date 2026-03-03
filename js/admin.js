// ================================================================
// ADMIN-VY & LÖNEPERIODER
// ================================================================
let _sortCol = null;
let _sortDir = 1; // 1 = asc, -1 = desc

function sortTable(col) {
    if (_sortCol === col) _sortDir *= -1;
    else { _sortCol = col; _sortDir = 1; }
    loadAdminData();
}

function loadAdminData() {
    const tbody = document.getElementById('payroll-body'); tbody.innerHTML = '';
    const chartLabels = [], chartRegularPay = [], chartOBPay = [];

    renderLogs();
    renderOvertimeReport();
    renderSharedCalendar();
    renderPendingRequests();

    // Update sort indicators
    ['name', 'hours', 'ob', 'gross'].forEach(col => {
        const el = document.getElementById(`sort-${col}`);
        if (el) el.innerText = _sortCol === col ? (_sortDir === 1 ? '▲' : '▼') : '';
    });

    let emps = employees.filter(e => e.role !== 'admin');

    if (_sortCol) {
        emps = [...emps].sort((a, b) => {
            if (_sortCol === 'name') return _sortDir * a.name.localeCompare(b.name, 'sv');
            const hA = getFilteredHistory(a), hB = getFilteredHistory(b);
            const sum = (hist, field) => hist.reduce((s, h) => s + (h[field] || 0), 0);
            const gross = (emp, hist) => {
                const t = sum(hist, 'hours'), o = sum(hist, 'obHours'), ot = sum(hist, 'otHours');
                return (t * emp.wage) + (o * emp.wage * 1.5) + (ot * emp.wage * 0.5);
            };
            const valA = _sortCol === 'hours' ? sum(hA, 'hours') : _sortCol === 'ob' ? sum(hA, 'obHours') : gross(a, hA);
            const valB = _sortCol === 'hours' ? sum(hB, 'hours') : _sortCol === 'ob' ? sum(hB, 'obHours') : gross(b, hB);
            return _sortDir * (valA - valB);
        });
    }

    emps.forEach(emp => {
        const hist = getFilteredHistory(emp);
        let totHrs = 0, obHrs = 0, otHrs = 0;
        hist.forEach(s => { totHrs += s.hours; obHrs += s.obHours; otHrs += (s.otHours || 0); });

        const regPay = totHrs * emp.wage;
        const obPay  = obHrs  * (emp.wage * 1.5);
        const otPay  = otHrs  * (emp.wage * 0.5);
        const gross  = regPay + obPay + otPay;

        chartLabels.push(emp.name.split(' ')[0]);
        chartRegularPay.push(regPay);
        chartOBPay.push(obPay);

        tbody.innerHTML += `<tr class="employee-row">
            <td class="emp-name"><strong class="clickable-name" onclick="openEditModal('${emp.id}')">${emp.name}</strong><br><small style="color:var(--text-muted)">${emp.wage} kr/h</small></td>
            <td><span class="badge ${emp.status.toLowerCase()}">${emp.status}</span></td>
            <td>${totHrs.toFixed(2)}h</td>
            <td style="color: #8b5cf6; font-weight:bold;">${obHrs.toFixed(2)}h</td>
            <td><strong>${Math.round(gross).toLocaleString('sv-SE')} kr</strong></td>
            <td>
                <button class="btn-sm btn-edit"   onclick="openEditModal('${emp.id}')">Redigera</button>
                <button class="btn-sm" style="background:#10b981;" onclick="openHistoryModal('${emp.id}')">Historik</button>
                <button class="btn-sm btn-delete" onclick="deleteEmployee('${emp.id}')">✖</button>
            </td>
        </tr>`;
    });

    // Feature 8: dashboard stats
    let totalCost = 0, totalHrs = 0;
    emps.forEach(emp => {
        const hist = getFilteredHistory(emp);
        hist.forEach(s => {
            totalHrs  += s.hours + s.obHours + (s.otHours || 0);
            totalCost += (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + ((s.otHours || 0) * emp.wage * 0.5);
        });
    });
    const activeNow = employees.filter(e => e.role !== 'admin' && e.status === 'Inloggad').length;
    const wages     = emps.map(e => e.wage);
    const avgWage   = wages.length ? Math.round(wages.reduce((a, b) => a + b, 0) / wages.length) : 0;
    const el = id => document.getElementById(id);
    if (el('admin-total-cost'))    el('admin-total-cost').innerText    = Math.round(totalCost).toLocaleString('sv-SE') + ' kr';
    if (el('admin-active-now'))    el('admin-active-now').innerText    = activeNow;
    if (el('admin-avg-wage'))      el('admin-avg-wage').innerText      = avgWage + ' kr/h';
    if (el('admin-total-hours'))   el('admin-total-hours').innerText   = totalHrs.toFixed(1) + 'h';

    updateChart(chartLabels, chartRegularPay, chartOBPay);
}

function filterTable() {
    const filter = document.getElementById('search-employee').value.toLowerCase();
    [...document.getElementsByClassName('employee-row')].forEach(row => {
        const name = row.querySelector('.emp-name');
        row.style.display = (name?.textContent || '').toLowerCase().includes(filter) ? '' : 'none';
    });
}

function addEmployee() {
    const name = document.getElementById('new-name').value;
    const pin  = document.getElementById('new-pin').value;
    const wage = parseInt(document.getElementById('new-wage').value);

    if (!name || !pin || isNaN(wage)) return showToast("Fyll i namn, PIN och lön.", "warning");
    if (employees.find(e => e.pin === pin)) return showToast("PIN-koden används redan!", "error");

    employees.push({ id: Date.now().toString(), name, pin, role: "worker", wage, status: "Utloggad", activeSession: null, workedHistory: [], schedule: [], vacationDaysLeft: 25, sickDaysUsed: 0, vacationHistory: [], sickHistory: [], personnummer: '', phone: '', email: '', address: '', postalCode: '', city: '' });
    document.getElementById('new-name').value = '';
    document.getElementById('new-pin').value  = '';
    document.getElementById('new-wage').value = '';
    saveData(); loadAdminData(); showToast("Anställd tillagd!", "success");
}

async function deleteEmployee(id) {
    try {
        await confirmAction("Är du säker på att du vill radera denna anställd och dess historik?", "Radera anställd");
        employees = employees.filter(e => e.id !== id);
        saveData(); loadAdminData(); showToast("Anställd raderad");
    } catch (_) {}
}

// ================================================================
// SEMESTERANSÖKNINGAR
// ================================================================
function renderPendingRequests() {
    const list = document.getElementById('pending-requests-list');
    if (!list) return;
    const pending = [];
    employees.filter(e => e.role !== 'admin').forEach(emp => {
        (emp.vacationRequests || []).filter(r => r.status === 'pending').forEach(r => {
            pending.push({ ...r, empId: emp.id, empName: emp.name, daysLeft: emp.vacationDaysLeft ?? 25 });
        });
    });
    const heading = document.getElementById('pending-requests-heading');
    if (heading) heading.innerText = `📋 Semesteransökningar${pending.length ? ` (${pending.length})` : ''}`;
    if (!pending.length) {
        list.innerHTML = '<p style="color:var(--text-muted); padding:0.5rem 0; margin:0;">Inga väntande ansökningar.</p>';
        return;
    }
    pending.sort((a, b) => a.createdAt - b.createdAt);
    list.innerHTML = pending.map(r => `
        <div style="padding:0.75rem 0; border-bottom:1px solid var(--card-border);">
            <div style="margin-bottom:0.4rem;">
                <strong>${r.empName}</strong>
                <span style="color:var(--text-muted); font-size:0.85rem; margin-left:0.4rem;">${r.startDate} – ${r.endDate} (${r.days} dag${r.days !== 1 ? 'ar' : ''})</span>
                <span style="color:var(--text-muted); font-size:0.8rem; margin-left:0.4rem;">| Saldo: ${r.daysLeft} dagar</span>
                ${r.reason ? `<div style="color:var(--text-muted); font-size:0.8rem; font-style:italic; margin-top:0.2rem;">"${r.reason}"</div>` : ''}
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
                <input type="text" id="review-note-${r.id}" placeholder="Valfri kommentar till anställd..."
                    style="flex:1; min-width:150px; padding:0.4rem 0.6rem; border-radius:6px; border:1px solid var(--input-border); background:var(--input-bg); color:var(--text-color); font-size:0.85rem;">
                <button class="btn-sm" style="background:#10b981;" onclick="approveVacationRequest('${r.empId}','${r.id}')">✅ Godkänn</button>
                <button class="btn-sm btn-delete" onclick="rejectVacationRequest('${r.empId}','${r.id}')">❌ Neka</button>
            </div>
        </div>`).join('');
}

function approveVacationRequest(empId, reqId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const req = (emp.vacationRequests || []).find(r => r.id === reqId);
    if (!req) return;
    const note = document.getElementById(`review-note-${reqId}`)?.value.trim() || '';
    emp.vacationDaysLeft = Math.max(0, (emp.vacationDaysLeft ?? 25) - req.days);
    if (!emp.vacationHistory) emp.vacationHistory = [];
    const start = new Date(req.startDate), end = new Date(req.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const ds = d.toISOString().slice(0, 10);
        if (!emp.vacationHistory.some(e => (typeof e === 'string' ? e : e.date) === ds))
            emp.vacationHistory.push({ date: ds, comment: req.reason || 'Godkänd ansökan' });
    }
    req.status = 'approved'; req.reviewNote = note; req.reviewedAt = Date.now();
    addLog(`Godkände semesteransökan för ${emp.name}: ${req.startDate} – ${req.endDate}`);
    saveData(); loadAdminData();
    showToast(`Ansökan godkänd! ${req.days} semesterdagar dragna från ${emp.name}s saldo.`, 'success');
}

function rejectVacationRequest(empId, reqId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const req = (emp.vacationRequests || []).find(r => r.id === reqId);
    if (!req) return;
    const note = document.getElementById(`review-note-${reqId}`)?.value.trim() || '';
    req.status = 'rejected'; req.reviewNote = note; req.reviewedAt = Date.now();
    addLog(`Nekade semesteransökan för ${emp.name}: ${req.startDate} – ${req.endDate}`);
    saveData(); loadAdminData();
    showToast(`Ansökan nekad.`, 'warning');
}

// ================================================================
// ÖVERTIDSRAPPORT (Feature 2)
// ================================================================
function renderOvertimeReport() {
    const list = document.getElementById('overtime-report-list');
    if (!list) return;
    const data = employees
        .filter(e => e.role !== 'admin')
        .map(emp => ({ name: emp.name, otHrs: getFilteredHistory(emp).reduce((s, h) => s + (h.otHours || 0), 0) }))
        .filter(d => d.otHrs > 0)
        .sort((a, b) => b.otHrs - a.otHrs);

    if (!data.length) {
        list.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:1rem 0;">Ingen övertid registrerad för vald period.</p>';
        return;
    }
    const maxOt = data[0].otHrs;
    list.innerHTML = data.map(d => {
        const pct   = Math.round(d.otHrs / maxOt * 100);
        const color = d.otHrs > 20 ? '#ef4444' : d.otHrs > 10 ? '#f97316' : '#f59e0b';
        return `<div style="margin-bottom:0.75rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
                <span>${d.name}</span>
                <span style="color:${color}; font-weight:700;">${d.otHrs.toFixed(1)}h övertid</span>
            </div>
            <div style="height:8px; background:var(--stat-bg); border-radius:4px;">
                <div style="height:8px; width:${pct}%; background:${color}; border-radius:4px;"></div>
            </div>
        </div>`;
    }).join('');
}

// ================================================================
// SEMESTERPLANERING / DELAD KALENDER (Feature 4)
// ================================================================
let _planMonth = new Date().getMonth();
let _planYear  = new Date().getFullYear();

function renderSharedCalendar() {
    const container = document.getElementById('shared-calendar-container');
    if (!container) return;

    const monthStr   = `${_planYear}-${String(_planMonth + 1).padStart(2, '0')}`;
    const firstDay   = new Date(_planYear, _planMonth, 1);
    const lastDay    = new Date(_planYear, _planMonth + 1, 0);
    const todayStr   = new Date().toISOString().slice(0, 10);
    const monthLabel = firstDay.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' });

    const dayMap = {};
    employees.filter(e => e.role !== 'admin').forEach(emp => {
        const first = emp.name.split(' ')[0];
        emp.schedule.forEach(s => {
            if (!s.day.startsWith(monthStr)) return;
            if (!dayMap[s.day]) dayMap[s.day] = { shifts: [], absences: [] };
            dayMap[s.day].shifts.push(first);
        });
        (emp.vacationHistory || []).forEach(entry => {
            const d = typeof entry === 'string' ? entry : entry.date;
            if (!d.startsWith(monthStr)) return;
            if (!dayMap[d]) dayMap[d] = { shifts: [], absences: [] };
            dayMap[d].absences.push({ name: first, type: 'vacation' });
        });
        (emp.sickHistory || []).forEach(entry => {
            const d = typeof entry === 'string' ? entry : entry.date;
            if (!d.startsWith(monthStr)) return;
            if (!dayMap[d]) dayMap[d] = { shifts: [], absences: [] };
            dayMap[d].absences.push({ name: first, type: 'sick' });
        });
    });

    const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    let html = '<div class="cal-grid">';
    dayNames.forEach(d => { html += `<div class="cal-header">${d}</div>`; });

    let startDow = firstDay.getDay() - 1; if (startDow < 0) startDow = 6;
    for (let i = 0; i < startDow; i++) html += '<div class="cal-day empty"></div>';

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${monthStr}-${String(d).padStart(2, '0')}`;
        const data    = dayMap[dateStr];
        const isToday = dateStr === todayStr;
        let content   = '';
        if (data?.shifts?.length) {
            content += data.shifts.map(n =>
                `<span style="display:block; font-size:0.6rem; color:#3b82f6; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${n}</span>`
            ).join('');
        }
        if (data?.absences?.length) {
            content += data.absences.map(a =>
                `<span style="display:block; font-size:0.6rem; color:${a.type === 'vacation' ? '#10b981' : '#ef4444'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${a.name} ${a.type === 'vacation' ? '🏖️' : '🤒'}</span>`
            ).join('');
        }
        html += `<div class="cal-day ${isToday ? 'is-today' : ''}" style="min-height:60px; align-items:flex-start; padding:0.3rem;">
            <span class="cal-date">${d}</span>${content}
        </div>`;
    }
    html += '</div>';

    container.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem; flex-wrap:wrap;">
            <button class="btn-sm" onclick="changePlanMonth(-1)">◀</button>
            <strong style="text-transform:capitalize;">${monthLabel}</strong>
            <button class="btn-sm" onclick="changePlanMonth(1)">▶</button>
            <span style="font-size:0.8rem; color:var(--text-muted); margin-left:0.5rem;">
                <span style="color:#3b82f6;">●</span> Schemalagd
                <span style="color:#10b981; margin-left:0.5rem;">●</span> Semester
                <span style="color:#ef4444; margin-left:0.5rem;">●</span> Sjuk
            </span>
        </div>
        ${html}`;
}

function changePlanMonth(dir) {
    _planMonth += dir;
    if (_planMonth < 0)  { _planMonth = 11; _planYear--; }
    if (_planMonth > 11) { _planMonth = 0;  _planYear++; }
    renderSharedCalendar();
}

// ================================================================
// EXPORT CSV
// ================================================================
function exportCSV() {
    let csv = "data:text/csv;charset=utf-8,Namn;Status;Vanlig Tid(h);OB-Tid(h);Timlon;Bruttolon(kr)\n";
    employees.filter(e => e.role !== 'admin').forEach(emp => {
        let t = 0, o = 0;
        emp.workedHistory.forEach(s => { t += s.hours; o += s.obHours; });
        csv += `${emp.name};${emp.status};${t.toFixed(2)};${o.toFixed(2)};${emp.wage};${Math.round((t * emp.wage) + (o * emp.wage * 1.5))}\n`;
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "Lonelista_Pro.csv");
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast("CSV nedladdad!", "success");
}

// ================================================================
// BULK-EXPORT ALLA ANSTÄLLDA (Feature 3)
// ================================================================
function exportAllCSV() {
    let csv = "data:text/csv;charset=utf-8,Namn;Datum;Vanlig Tid(h);OB(h);Övertid(h);Rast(min);Bruttolön(kr);Kommentar\n";
    employees.filter(e => e.role !== 'admin').forEach(emp => {
        [...emp.workedHistory].sort((a, b) => b.date.localeCompare(a.date)).forEach(s => {
            const pay = (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + ((s.otHours || 0) * emp.wage * 0.5);
            csv += `${emp.name};${s.date};${s.hours.toFixed(2)};${s.obHours.toFixed(2)};${(s.otHours || 0).toFixed(2)};${s.breakMinutes || 0};${Math.round(pay)};"${(s.note || '').replace(/"/g, '""')}"\n`;
        });
    });
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `historik_alla_${new Date().toLocaleDateString('sv-SE')}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('Alla historiker exporterade!', 'success');
}

// ================================================================
// PERSONALREGISTER EXPORT
// ================================================================
function exportPersonnelCSV() {
    let csv = "data:text/csv;charset=utf-8,Namn;Personnummer;Telefon;E-post;Gatuadress;Postnummer;Stad;Timlön(kr);Status\n";
    employees.filter(e => e.role !== 'admin').forEach(emp => {
        csv += `"${emp.name}";"${emp.personnummer || ''}";"${emp.phone || ''}";"${emp.email || ''}";"${emp.address || ''}";"${emp.postalCode || ''}";"${emp.city || ''}";${emp.wage};"${emp.status}"\n`;
    });
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `personalregister_${new Date().toLocaleDateString('sv-SE')}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('Personalregister exporterat!', 'success');
}

// ================================================================
// DIAGRAM
// ================================================================
function updateChart(labels, regularData, obData) {
    const ctx  = document.getElementById('salaryChart').getContext('2d');
    const dark = document.body.classList.contains('dark-mode');
    Chart.defaults.color       = dark ? '#94a3b8' : '#64748b';
    Chart.defaults.font.family = 'Inter';
    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Vanlig Lön (kr)', data: regularData, backgroundColor: '#3b82f6', borderRadius: 4 },
                { label: 'OB-tillägg (kr)',  data: obData,      backgroundColor: '#8b5cf6', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, border: { display: false } }
            },
            plugins: { legend: { position: 'top' } }
        }
    });
}
