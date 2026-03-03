// ================================================================
// BEKRÄFTELSEDIALOG
// ================================================================
let _confirmResolve = null;
let _confirmReject  = null;

function confirmAction(message, title = 'Bekräfta') {
    document.getElementById('confirm-title').innerText   = title;
    document.getElementById('confirm-message').innerText = message;
    document.getElementById('confirm-modal').classList.add('active');
    return new Promise((resolve, reject) => {
        _confirmResolve = resolve;
        _confirmReject  = reject;
    });
}

function confirmResolve() {
    document.getElementById('confirm-modal').classList.remove('active');
    if (_confirmResolve) { _confirmResolve(); _confirmResolve = _confirmReject = null; }
}

function confirmReject() {
    document.getElementById('confirm-modal').classList.remove('active');
    if (_confirmReject) { _confirmReject(new Error('cancelled')); _confirmResolve = _confirmReject = null; }
}

// ================================================================
// LÖNESPECIFIKATION
// ================================================================
function openPayslipModal() {
    let totHrs = 0, obHrs = 0, otHrs = 0;
    currentUser.workedHistory.forEach(s => { totHrs += s.hours; obHrs += s.obHours; otHrs += (s.otHours || 0); });

    const regPay = totHrs * currentUser.wage;
    const obPay  = obHrs  * (currentUser.wage * 1.5);
    const otPay  = otHrs  * (currentUser.wage * 0.5);
    const gross  = regPay + obPay + otPay;
    const tax    = getTaxBreakdown(gross);
    const net    = gross - tax.total;

    document.getElementById('payslip-company').innerText    = localStorage.getItem('tt_company') || '';
    document.getElementById('payslip-name').innerText       = currentUser.name;
    document.getElementById('payslip-date').innerText       = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' });
    document.getElementById('payslip-reg-hours').innerText  = totHrs.toFixed(2);
    document.getElementById('payslip-reg-wage').innerText   = currentUser.wage;
    document.getElementById('payslip-reg-total').innerText  = Math.round(regPay).toLocaleString('sv-SE') + " kr";
    document.getElementById('payslip-ob-hours').innerText   = obHrs.toFixed(2);
    document.getElementById('payslip-ob-wage').innerText    = currentUser.wage * 1.5;
    document.getElementById('payslip-ob-total').innerText   = Math.round(obPay).toLocaleString('sv-SE') + " kr";
    document.getElementById('payslip-ot-hours').innerText   = otHrs.toFixed(2);
    document.getElementById('payslip-ot-wage').innerText    = (currentUser.wage * 0.5).toFixed(0);
    document.getElementById('payslip-ot-total').innerText   = Math.round(otPay).toLocaleString('sv-SE') + " kr";
    document.getElementById('payslip-grand-total').innerText = Math.round(gross).toLocaleString('sv-SE') + " kr";
    document.getElementById('payslip-kommunal').innerText   = "-" + Math.round(tax.kommunal).toLocaleString('sv-SE') + " kr";
    document.getElementById('payslip-statlig').innerText    = "-" + Math.round(tax.statlig).toLocaleString('sv-SE')  + " kr";
    document.getElementById('payslip-net-total').innerText  = Math.round(net).toLocaleString('sv-SE') + " kr";

    savePayslipSnapshot({
        empId: currentUser.id, empName: currentUser.name,
        gross, net, regPay, obPay, otPay,
        date: new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' })
    });

    document.getElementById('payslip-modal').classList.add('active');
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'] });
}

function closePayslipModal() { document.getElementById('payslip-modal').classList.remove('active'); }

function savePayslipSnapshot(data) {
    const month = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: '2-digit' });
    savedPayslips = savedPayslips.filter(p => !(p.empId === data.empId && p.month === month));
    savedPayslips.unshift({ ...data, month, savedAt: Date.now() });
    if (savedPayslips.length > 100) savedPayslips.pop();
    localStorage.setItem(PAYSLIPS_KEY, JSON.stringify(savedPayslips));
}

function renderSavedPayslips() {
    const list = document.getElementById('saved-payslips-list');
    if (!list) return;
    if (!savedPayslips.length) {
        list.innerHTML = '<li><em style="color:var(--text-muted)">Inga sparade lönespecar ännu.</em></li>';
        return;
    }
    list.innerHTML = savedPayslips.slice(0, 24).map(p =>
        `<li>
            <span><strong>${p.empName}</strong> — ${p.month}</span>
            <span style="color:var(--text-muted);">${Math.round(p.net || 0).toLocaleString('sv-SE')} kr netto</span>
        </li>`
    ).join('');
}

// ================================================================
// ADMIN EDIT MODAL & RENSA HISTORIK
// ================================================================
function openEditModal(id) {
    const emp = employees.find(e => e.id === id);
    document.getElementById('edit-emp-id').value           = id;
    document.getElementById('edit-modal-title').innerText  = "Profil: " + emp.name;
    document.getElementById('edit-name').value             = emp.name;
    document.getElementById('edit-pin').value              = emp.pin;
    document.getElementById('edit-wage').value             = emp.wage;
    document.getElementById('edit-vacation-days').value    = emp.vacationDaysLeft ?? 25;
    document.getElementById('edit-personnummer').value     = emp.personnummer || '';
    document.getElementById('edit-phone').value            = emp.phone        || '';
    document.getElementById('edit-email').value            = emp.email        || '';
    document.getElementById('edit-address').value          = emp.address      || '';
    document.getElementById('edit-postal').value           = emp.postalCode   || '';
    document.getElementById('edit-city').value             = emp.city         || '';
    renderModalSchedule(id);
    document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() { document.getElementById('edit-modal').classList.remove('active'); }

function saveEmployeeEdit() {
    const id          = document.getElementById('edit-emp-id').value;
    const emp         = employees.find(e => e.id === id);
    const newName     = document.getElementById('edit-name').value;
    const newPin      = document.getElementById('edit-pin').value;
    const newWage     = parseInt(document.getElementById('edit-wage').value);
    const newVacation = parseInt(document.getElementById('edit-vacation-days').value);

    if (!emp) return showToast("Anställd ej hittad.", "error");
    if (!newName || !newPin || isNaN(newWage)) return showToast("Fyll i alla fält.", "warning");
    if (employees.find(e => e.pin === newPin && e.id !== id)) return showToast("PIN-koden används redan!", "error");

    emp.name         = newName;
    emp.pin          = newPin;
    emp.wage         = newWage;
    if (!isNaN(newVacation)) emp.vacationDaysLeft = newVacation;
    emp.personnummer = (document.getElementById('edit-personnummer')?.value || '').trim();
    emp.phone        = (document.getElementById('edit-phone')?.value        || '').trim();
    emp.email        = (document.getElementById('edit-email')?.value        || '').trim();
    emp.address      = (document.getElementById('edit-address')?.value      || '').trim();
    emp.postalCode   = (document.getElementById('edit-postal')?.value       || '').trim();
    emp.city         = (document.getElementById('edit-city')?.value         || '').trim();

    saveData(); loadAdminData(); showToast("Uppgifter sparade!", "success"); closeEditModal();
}

async function clearEmployeeHistory() {
    const id  = document.getElementById('edit-emp-id').value;
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    try {
        await confirmAction(`Rensa all historik för ${emp.name}? Sjukdagar nollställs men semesterdagar påverkas inte.`, "Rensa historik");
        emp.workedHistory   = [];
        emp.sickDaysUsed    = 0;
        emp.sickHistory     = [];
        emp.vacationHistory = [];
        addLog(`Historik rensad för ${emp.name}`);
        saveData(); loadAdminData();
        showToast("Historik rensad!", "success");
    } catch (_) {}
}

// Feature 1: sort schedule by date in modal
function renderModalSchedule(id) {
    const emp  = employees.find(e => e.id === id);
    const list = document.getElementById('modal-schedule-list');
    list.innerHTML = '';

    if (!emp.schedule.length) {
        list.innerHTML = '<li><em style="color:var(--text-muted)">Inget schema inlagt.</em></li>';
        return;
    }

    const sorted = [...emp.schedule].sort((a, b) => a.day.localeCompare(b.day));

    sorted.forEach(shift => {
        const index = emp.schedule.indexOf(shift);
        let workedInfo = '';
        const parts = shift.time.split(' - ');
        if (parts.length === 2) {
            const [sh, sm] = parts[0].trim().split(':').map(Number);
            const [eh, em] = parts[1].trim().split(':').map(Number);
            const scheduled = ((eh * 60 + em) - (sh * 60 + sm)) / 60;

            const sessions = emp.workedHistory.filter(s => s.date === shift.day);
            if (sessions.length) {
                const worked = sessions.reduce((sum, s) => sum + s.hours + s.obHours, 0);
                const diff   = worked - scheduled;
                const color  = diff >= 0 ? '#10b981' : '#ef4444';
                const sign   = diff >= 0 ? '+' : '';
                workedInfo = `<span style="color:${color}; font-size:0.8rem; margin-left:0.5rem;">| Jobbade: ${worked.toFixed(1)}h (${sign}${diff.toFixed(1)}h)</span>`;
            }
        }

        list.innerHTML += `<li>
            <div>
                <strong>${shift.day}</strong>
                <span style="margin-left:10px; color:var(--text-muted);">${shift.time}</span>
                ${workedInfo}
            </div>
            <div style="display:flex; gap:0.25rem;">
                <button class="btn-sm btn-edit" style="padding:0.4rem 0.6rem;" onclick="duplicateShiftModal('${id}', ${index})" title="Duplicera pass">📋</button>
                <button class="btn-sm btn-delete" onclick="deleteShiftFromModal('${id}', ${index})">✖</button>
            </div>
        </li>`;
    });
}

function deleteShiftFromModal(id, index) {
    employees.find(e => e.id === id).schedule.splice(index, 1);
    saveData(); renderModalSchedule(id);
}

function addShiftFromModal() {
    const id = document.getElementById('edit-emp-id').value;
    const d  = document.getElementById('modal-shift-day').value;
    const s  = document.getElementById('modal-shift-start').value;
    const e  = document.getElementById('modal-shift-end').value;
    if (!d || !s || !e) return showToast("Fyll i datum och tider.", "warning");
    if (s >= e)         return showToast("Sluttiden måste vara efter start.", "error");
    employees.find(emp => emp.id === id).schedule.push({ day: d, time: `${s} - ${e}` });
    document.getElementById('modal-shift-day').value   = '';
    document.getElementById('modal-shift-start').value = '';
    document.getElementById('modal-shift-end').value   = '';
    saveData(); renderModalSchedule(id); showToast("Pass tillagt!", "success");
}

// ================================================================
// ÅTERKOMMANDE SCHEMA
// ================================================================
function addRecurringShift() {
    const id        = document.getElementById('edit-emp-id').value;
    const targetDay = parseInt(document.getElementById('modal-recur-day').value);
    const startTime = document.getElementById('modal-recur-start').value;
    const endTime   = document.getElementById('modal-recur-end').value;
    const weeks     = parseInt(document.getElementById('modal-recur-weeks').value);

    if (!startTime || !endTime) return showToast("Fyll i starttid och sluttid.", "warning");
    if (startTime >= endTime)   return showToast("Sluttiden måste vara efter start.", "error");

    const emp = employees.find(e => e.id === id);

    const base = new Date(); base.setHours(0, 0, 0, 0);
    let daysAhead = (targetDay - base.getDay() + 7) % 7;
    if (daysAhead === 0) daysAhead = 7;
    base.setDate(base.getDate() + daysAhead);

    let added = 0;
    for (let w = 0; w < weeks; w++) {
        const dayStr = base.toISOString().slice(0, 10);
        if (!emp.schedule.some(s => s.day === dayStr && s.time === `${startTime} - ${endTime}`)) {
            emp.schedule.push({ day: dayStr, time: `${startTime} - ${endTime}` });
            added++;
        }
        base.setDate(base.getDate() + 7);
    }

    saveData(); renderModalSchedule(id);
    showToast(`${added} återkommande pass tillagda!`, 'success');
}

// ================================================================
// HISTORIKVY — månadsöversikt, admin edit, export (features 4, 5, 6, 10)
// ================================================================
let _historyEmpId    = null;
let _editSessionIdx  = null;

function clearHistoryFilter() {
    const f = document.getElementById('hist-from');
    const t = document.getElementById('hist-to');
    if (f) f.value = '';
    if (t) t.value = '';
    if (_historyEmpId) openHistoryModal(_historyEmpId);
}

function openHistoryModal(id) {
    if (id !== _historyEmpId) cancelEditSession();
    _historyEmpId = id;
    const emp        = employees.find(e => e.id === id);
    const isAdmin    = currentUser.role === 'admin';
    const fromVal    = document.getElementById('hist-from')?.value || '';
    const toVal      = document.getElementById('hist-to')?.value   || '';

    document.getElementById('history-modal-title').innerText = `📋 Historik: ${emp.name}`;

    const empty = document.getElementById('history-modal-empty');
    const body  = document.getElementById('history-modal-body');

    if (!emp.workedHistory.length) {
        body.innerHTML = '';
        empty.style.display = 'block';
        document.getElementById('history-modal-summary').innerText = '';
    } else {
        empty.style.display = 'none';
        let sorted = [...emp.workedHistory].sort((a, b) => b.date.localeCompare(a.date));
        if (fromVal) sorted = sorted.filter(s => s.date >= fromVal);
        if (toVal)   sorted = sorted.filter(s => s.date <= toVal);

        // Feature 6: group by month
        const byMonth = {};
        sorted.forEach(s => {
            const month = s.date.slice(0, 7);
            if (!byMonth[month]) byMonth[month] = [];
            byMonth[month].push(s);
        });

        // Update thead dynamically
        document.getElementById('history-modal-thead').innerHTML = `<tr>
            <th>Datum</th>
            <th>Vanlig tid</th>
            <th style="color:#8b5cf6;">OB</th>
            <th style="color:#f97316;">Övertid</th>
            <th>Rast</th>
            <th>Kommentar</th>
            <th>Bruttolön</th>
            ${isAdmin ? '<th></th>' : ''}
        </tr>`;

        const colSpan = isAdmin ? 8 : 7;
        let html = '';

        for (const [month, sessions] of Object.entries(byMonth)) {
            const monthLabel = new Date(month + '-01').toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' });
            let mH = 0, mOB = 0, mOT = 0, mPay = 0;
            sessions.forEach(s => {
                mH   += s.hours; mOB += s.obHours; mOT += (s.otHours || 0);
                mPay += (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + ((s.otHours || 0) * emp.wage * 0.5);
            });

            html += `<tr style="background:var(--stat-bg);">
                <td colspan="${colSpan}" style="font-weight:700; padding:0.6rem 1rem; font-size:0.85rem; text-transform:capitalize;">
                    📅 ${monthLabel} — ${mH.toFixed(1)}h vanlig + ${mOB.toFixed(1)}h OB | ${Math.round(mPay).toLocaleString('sv-SE')} kr
                </td>
            </tr>`;

            sessions.forEach(s => {
                const ot      = s.otHours || 0;
                const pay     = (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + (ot * emp.wage * 0.5);
                const origIdx = emp.workedHistory.indexOf(s);
                const delBtn  = isAdmin
                    ? `<td style="white-space:nowrap;">
                        <button class="btn-sm btn-edit" style="margin-right:0.25rem;" onclick="editWorkSession('${id}', ${origIdx})">✏️</button>
                        <button class="btn-sm btn-delete" onclick="deleteWorkSession('${id}', ${origIdx})">✖</button>
                       </td>`
                    : '';
                html += `<tr>
                    <td>${s.date}</td>
                    <td>${s.hours.toFixed(2)}h</td>
                    <td style="color:#8b5cf6;">${s.obHours.toFixed(2)}h</td>
                    <td style="color:#f97316;">${ot.toFixed(2)}h</td>
                    <td style="color:var(--text-muted);">${s.breakMinutes || 0} min</td>
                    <td style="color:var(--text-muted); font-size:0.8rem; max-width:120px; word-break:break-word;">${s.note || ''}</td>
                    <td>${Math.round(pay).toLocaleString('sv-SE')} kr</td>
                    ${delBtn}
                </tr>`;
            });
        }

        if (sorted.length) {
            body.innerHTML = html;
        } else {
            body.innerHTML = '';
            empty.style.display = 'block';
        }

        const tot = sorted.reduce(
            (a, s) => ({ h: a.h + s.hours, ob: a.ob + s.obHours, ot: a.ot + (s.otHours || 0) }),
            { h: 0, ob: 0, ot: 0 }
        );
        const filterNote = (fromVal || toVal) ? ' (filtrerat)' : '';
        document.getElementById('history-modal-summary').innerText =
            `Totalt: ${tot.h.toFixed(1)}h vanlig + ${tot.ob.toFixed(1)}h OB + ${tot.ot.toFixed(1)}h övertid${filterNote}`;
    }

    // Chart: monthly earnings per employee (Feature 4)
    const chartSection = document.getElementById('history-chart-section');
    if (emp.workedHistory.length >= 2) {
        chartSection.classList.remove('hidden');
        renderHistoryChart(emp);
    } else {
        chartSection.classList.add('hidden');
    }

    // Feature 10: absence history
    const absSection = document.getElementById('history-absence-section');
    const vacHist    = emp.vacationHistory || [];
    const sickHist   = emp.sickHistory     || [];
    if (vacHist.length || sickHist.length) {
        absSection.classList.remove('hidden');
        let absHtml = '';
        const fmtEntry = (entry, type) => {
            const d = typeof entry === 'string' ? entry : entry.date;
            const c = typeof entry === 'string' ? '' : entry.comment;
            const commentPart = c ? ` <span style="color:var(--text-muted); font-size:0.8rem;">(${c})</span>` : '';
            const delBtn = isAdmin
                ? ` <button class="btn-sm btn-delete" style="padding:0.15rem 0.4rem; font-size:0.7rem;" onclick="removeAbsenceDate('${id}','${type}','${d}')">✖</button>`
                : '';
            return `<span style="display:inline-block; margin-bottom:0.2rem;">${d}${commentPart}${delBtn}</span>`;
        };
        if (vacHist.length) {
            const vacDates = [...vacHist].sort((a, b) => {
                const da = typeof a === 'string' ? a : a.date;
                const db = typeof b === 'string' ? b : b.date;
                return db.localeCompare(da);
            }).map(e => fmtEntry(e, 'vacation')).join('&ensp;');
            absHtml += `<p style="margin:0 0 0.4rem;"><strong>🏖️ Semester (${vacHist.length} dag${vacHist.length !== 1 ? 'ar' : ''}):</strong><br>${vacDates}</p>`;
        }
        if (sickHist.length) {
            const sickDates = [...sickHist].sort((a, b) => {
                const da = typeof a === 'string' ? a : a.date;
                const db = typeof b === 'string' ? b : b.date;
                return db.localeCompare(da);
            }).map(e => fmtEntry(e, 'sick')).join('&ensp;');
            absHtml += `<p style="margin:0;"><strong>🤒 Sjukdagar (${sickHist.length}):</strong><br>${sickDates}</p>`;
        }
        document.getElementById('history-absence-content').innerHTML = absHtml;
    } else {
        absSection.classList.add('hidden');
    }

    // Feature 4: admin edit section
    const adminSection = document.getElementById('history-admin-section');
    if (isAdmin) {
        adminSection.classList.remove('hidden');
        document.getElementById('history-add-emp-id').value = id;
        document.getElementById('manual-date').value = new Date().toISOString().slice(0, 10);
    } else {
        adminSection.classList.add('hidden');
    }

    document.getElementById('history-modal').classList.add('active');
}

function closeHistoryModal() {
    cancelEditSession();
    document.getElementById('history-modal').classList.remove('active');
}

// Feature 4 (monthly chart for employee)
function renderHistoryChart(emp) {
    const monthly = {};
    emp.workedHistory.forEach(s => {
        const m = s.date.slice(0, 7);
        if (!monthly[m]) monthly[m] = 0;
        monthly[m] += (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + ((s.otHours || 0) * emp.wage * 0.5);
    });
    const months = Object.keys(monthly).sort();
    const labels = months.map(m => new Date(m + '-01').toLocaleDateString('sv-SE', { month: 'short', year: '2-digit' }));
    const data   = months.map(m => Math.round(monthly[m]));
    if (window.historyEmpChart) window.historyEmpChart.destroy();
    const ctx  = document.getElementById('history-emp-chart').getContext('2d');
    const dark = document.body.classList.contains('dark-mode');
    window.historyEmpChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Bruttolön (kr)', data, backgroundColor: '#3b82f6', borderRadius: 4 }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: dark ? '#94a3b8' : '#64748b' } },
                y: { border: { display: false }, ticks: { color: dark ? '#94a3b8' : '#64748b' } }
            }
        }
    });
}

// Feature 2: remove a single absence date
function removeAbsenceDate(empId, type, date) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    if (type === 'vacation') {
        const idx = emp.vacationHistory.findIndex(e => (typeof e === 'string' ? e : e.date) === date);
        if (idx > -1) { emp.vacationHistory.splice(idx, 1); emp.vacationDaysLeft = (emp.vacationDaysLeft || 0) + 1; }
    } else {
        const idx = emp.sickHistory.findIndex(e => (typeof e === 'string' ? e : e.date) === date);
        if (idx > -1) { emp.sickHistory.splice(idx, 1); emp.sickDaysUsed = Math.max(0, (emp.sickDaysUsed || 0) - 1); }
    }
    saveData();
    if (currentUser.role === 'admin') loadAdminData();
    openHistoryModal(empId);
    showToast('Frånvarodag borttagen.', 'success');
}

// Feature: view own saved payslips (worker)
function openMyPayslipsModal() {
    const myPayslips = savedPayslips.filter(p => p.empId === currentUser.id);
    const list = document.getElementById('my-payslips-list');
    if (!myPayslips.length) {
        list.innerHTML = '<li><em style="color:var(--text-muted)">Inga sparade lönespecar ännu. Öppna lönespecifikationen för att spara en.</em></li>';
    } else {
        list.innerHTML = myPayslips.map(p => `<li>
            <div>
                <strong>${p.month}</strong>
                <span style="color:var(--text-muted); font-size:0.85rem; margin-left:0.5rem;">${new Date(p.savedAt).toLocaleDateString('sv-SE')}</span>
            </div>
            <div style="text-align:right; font-size:0.9rem;">
                <div style="color:var(--text-muted);">${Math.round(p.gross || 0).toLocaleString('sv-SE')} kr brutto</div>
                <div style="color:#10b981; font-weight:700;">${Math.round(p.net || 0).toLocaleString('sv-SE')} kr netto</div>
            </div>
        </li>`).join('');
    }
    document.getElementById('my-payslips-modal').classList.add('active');
}

function closeMyPayslipsModal() { document.getElementById('my-payslips-modal').classList.remove('active'); }

// Feature 5: reset vacation days to 25
async function resetVacationDays() {
    const id  = document.getElementById('edit-emp-id').value;
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    try {
        await confirmAction(`Återställ semesterdagar till 25 för ${emp.name}?`, 'Återställ semester');
        emp.vacationDaysLeft = 25;
        emp.vacationHistory  = [];
        addLog(`Semesterdagar återställda för ${emp.name}`);
        saveData(); loadAdminData();
        document.getElementById('edit-vacation-days').value = 25;
        showToast('Semesterdagar återställda till 25!', 'success');
    } catch (_) {}
}

// Feature 8: duplicate a shift in admin edit modal
function duplicateShiftModal(id, idx) {
    const emp   = employees.find(e => e.id === id);
    const shift = emp?.schedule[idx];
    if (!shift) return;
    const parts = shift.time.split(' - ');
    document.getElementById('modal-shift-day').value   = '';
    document.getElementById('modal-shift-start').value = parts[0]?.trim() || '';
    document.getElementById('modal-shift-end').value   = parts[1]?.trim() || '';
    document.getElementById('modal-shift-day').focus();
    showToast('Tider ifyllda — välj datum och klicka Lägg till.', 'info');
}

// Feature 4: populate form for editing an existing work session
function editWorkSession(empId, idx) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    const s = emp.workedHistory[idx];
    if (!s) return;

    _editSessionIdx = idx;
    document.getElementById('history-add-emp-id').value = empId;
    document.getElementById('manual-date').value         = s.date;
    document.getElementById('manual-hours').value        = s.hours;
    document.getElementById('manual-ob').value           = s.obHours;
    document.getElementById('manual-ot').value           = s.otHours || 0;
    document.getElementById('manual-break').value        = s.breakMinutes || 0;
    document.getElementById('manual-note').value         = s.note || '';

    document.getElementById('manual-session-heading').innerText      = '✏️ Redigera arbetspass';
    document.getElementById('manual-session-btn').innerText          = 'Spara ändringar';
    document.getElementById('manual-session-cancel').style.display   = '';

    document.getElementById('manual-session-heading').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cancelEditSession() {
    _editSessionIdx = null;
    document.getElementById('manual-date').value         = new Date().toISOString().slice(0, 10);
    document.getElementById('manual-hours').value        = '';
    document.getElementById('manual-ob').value           = '';
    document.getElementById('manual-ot').value           = '';
    document.getElementById('manual-break').value        = '';
    document.getElementById('manual-note').value         = '';

    const heading = document.getElementById('manual-session-heading');
    const btn     = document.getElementById('manual-session-btn');
    const cancel  = document.getElementById('manual-session-cancel');
    if (heading) heading.innerText       = '➕ Lägg till arbetspass manuellt';
    if (btn)     btn.innerText           = 'Lägg till';
    if (cancel)  cancel.style.display   = 'none';
}

// Feature 4: delete a single work session
async function deleteWorkSession(empId, idx) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    try {
        await confirmAction(`Ta bort arbetspasset ${emp.workedHistory[idx]?.date}?`, 'Ta bort pass');
        emp.workedHistory.splice(idx, 1);
        saveData(); loadAdminData();
        openHistoryModal(empId);
        showToast('Arbetspass borttaget.', 'warning');
    } catch (_) {}
}

// Feature 4: manually add or edit a work session
function addManualSession() {
    const id    = document.getElementById('history-add-emp-id').value;
    const emp   = employees.find(e => e.id === id);
    const date  = document.getElementById('manual-date').value;
    const hours = parseFloat(document.getElementById('manual-hours').value) || 0;
    const ob    = parseFloat(document.getElementById('manual-ob').value)    || 0;
    const ot    = parseFloat(document.getElementById('manual-ot').value)    || 0;
    const brk   = parseInt(document.getElementById('manual-break').value)   || 0;
    const note  = document.getElementById('manual-note').value.trim();

    if (!date)                   return showToast('Välj ett datum.', 'warning');
    if (hours === 0 && ob === 0) return showToast('Ange minst vanlig tid eller OB-tid.', 'warning');

    if (_editSessionIdx !== null) {
        emp.workedHistory[_editSessionIdx] = { date, hours, obHours: ob, otHours: ot, breakMinutes: brk, note };
        saveData(); loadAdminData();
        cancelEditSession();
        openHistoryModal(id);
        showToast('Arbetspass uppdaterat!', 'success');
    } else {
        emp.workedHistory.push({ date, hours, obHours: ob, otHours: ot, breakMinutes: brk, note });
        document.getElementById('manual-hours').value = '';
        document.getElementById('manual-ob').value    = '';
        document.getElementById('manual-ot').value    = '';
        document.getElementById('manual-break').value = '';
        document.getElementById('manual-note').value  = '';
        saveData(); loadAdminData();
        openHistoryModal(id);
        showToast('Arbetspass tillagt!', 'success');
    }
}

// Feature 5: export individual employee history as CSV
function exportEmployeeCSV() {
    if (!_historyEmpId) return;
    const emp = employees.find(e => e.id === _historyEmpId);
    if (!emp) return;

    let csv = "data:text/csv;charset=utf-8,Datum;Vanlig Tid(h);OB(h);Övertid(h);Rast(min);Bruttolön(kr);Kommentar\n";
    [...emp.workedHistory].sort((a, b) => b.date.localeCompare(a.date)).forEach(s => {
        const pay = (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + ((s.otHours || 0) * emp.wage * 0.5);
        csv += `${s.date};${s.hours.toFixed(2)};${s.obHours.toFixed(2)};${(s.otHours || 0).toFixed(2)};${s.breakMinutes || 0};${Math.round(pay)};"${(s.note || '').replace(/"/g, '""')}"\n`;
    });

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `historik_${emp.name.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('CSV nedladdad!', 'success');
}

// ================================================================
// INSTÄLLNINGAR & FÖRETAGSNAMN (feature 8: anpassningsbara OB-tider)
// ================================================================
function updateCompanyName() {
    const name = localStorage.getItem('tt_company') || 'TimeTrack';
    document.getElementById('nav-company-name').innerText = `⏱️ ${name}`;
}

function openSettingsModal() {
    document.getElementById('company-name-input').value  = localStorage.getItem('tt_company')       || '';
    document.getElementById('admin-message-input').value = localStorage.getItem('tt_admin_message') || '';

    // OT threshold
    document.getElementById('ot-threshold-input').value = localStorage.getItem('tt_ot_threshold') || '8';

    // Feature 8: load OB times
    const obEvening = localStorage.getItem('tt_ob_evening') || '18';
    const obMorning = localStorage.getItem('tt_ob_morning') || '7';
    document.getElementById('ob-evening-input').value = `${String(obEvening).padStart(2,'0')}:00`;
    document.getElementById('ob-morning-input').value = `${String(obMorning).padStart(2,'0')}:00`;

    renderSavedPayslips();
    document.getElementById('settings-modal').classList.add('active');
}

function closeSettingsModal() { document.getElementById('settings-modal').classList.remove('active'); }

function saveSettings() {
    const name = document.getElementById('company-name-input').value.trim();
    if (name) localStorage.setItem('tt_company', name);
    else      localStorage.removeItem('tt_company');

    const msg = document.getElementById('admin-message-input').value.trim();
    if (msg) localStorage.setItem('tt_admin_message', msg);
    else     localStorage.removeItem('tt_admin_message');

    // OT threshold
    const otThr = parseFloat(document.getElementById('ot-threshold-input').value);
    if (!isNaN(otThr) && otThr > 0) localStorage.setItem('tt_ot_threshold', otThr.toString());

    // Feature 8: save OB times
    const obEvening = document.getElementById('ob-evening-input').value;
    const obMorning = document.getElementById('ob-morning-input').value;
    if (obEvening) localStorage.setItem('tt_ob_evening', parseInt(obEvening.split(':')[0]).toString());
    if (obMorning) localStorage.setItem('tt_ob_morning', parseInt(obMorning.split(':')[0]).toString());

    updateCompanyName();
    closeSettingsModal();
    showToast("Inställningar sparade!", "success");
}

// ================================================================
// BACKUP & ÅTERSTÄLLNING
// ================================================================
function downloadBackup() {
    const data = {
        version:       1,
        exportedAt:    new Date().toISOString(),
        employees,
        logs,
        savedPayslips
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `timetrack_backup_${new Date().toLocaleDateString('sv-SE')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup nedladdad!', 'success');
}

async function restoreBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data.employees)) return showToast('Ogiltig backupfil.', 'error');
            const date = data.exportedAt
                ? new Date(data.exportedAt).toLocaleDateString('sv-SE')
                : 'okänt datum';
            try {
                await confirmAction(
                    `Återställa backup från ${date}? All nuvarande data ersätts.`,
                    'Återställ backup'
                );
                employees     = data.employees;
                logs          = data.logs || [];
                savedPayslips = data.savedPayslips || [];
                localStorage.setItem(PAYSLIPS_KEY, JSON.stringify(savedPayslips));
                employees.forEach(emp => {
                    if (emp.vacationDaysLeft === undefined) emp.vacationDaysLeft = 25;
                    if (emp.sickDaysUsed    === undefined) emp.sickDaysUsed    = 0;
                    if (emp.vacationHistory  === undefined) emp.vacationHistory = [];
                    if (emp.sickHistory      === undefined) emp.sickHistory     = [];
                });
                saveData();
                showToast('Backup återställd! Laddar om...', 'success');
                setTimeout(() => location.reload(), 1500);
            } catch (_) {}
        } catch (_) {
            showToast('Kunde inte läsa backupfilen.', 'error');
        }
    };
    reader.readAsText(file);
}
