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
    renderModalSchedule(id);
    document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() { document.getElementById('edit-modal').classList.remove('active'); }

function saveEmployeeEdit() {
    const id         = document.getElementById('edit-emp-id').value;
    const emp        = employees.find(e => e.id === id);
    const newName    = document.getElementById('edit-name').value;
    const newPin     = document.getElementById('edit-pin').value;
    const newWage    = parseInt(document.getElementById('edit-wage').value);
    const newVacation = parseInt(document.getElementById('edit-vacation-days').value);

    if (!newName || !newPin || isNaN(newWage)) return showToast("Fyll i alla fält.", "warning");
    if (employees.find(e => e.pin === newPin && e.id !== id)) return showToast("PIN-koden används redan!", "error");

    emp.name  = newName;
    emp.pin   = newPin;
    emp.wage  = newWage;
    if (!isNaN(newVacation)) emp.vacationDaysLeft = newVacation;

    saveData(); loadAdminData(); showToast("Uppgifter sparade!", "success"); closeEditModal();
}

async function clearEmployeeHistory() {
    const id  = document.getElementById('edit-emp-id').value;
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    try {
        await confirmAction(`Rensa all historik för ${emp.name}? Sjukdagar nollställs men semesterdagar påverkas inte.`, "Rensa historik");
        emp.workedHistory = [];
        emp.sickDaysUsed  = 0;
        addLog(`Historik rensad för ${emp.name}`);
        saveData(); loadAdminData();
        showToast("Historik rensad!", "success");
    } catch (_) {}
}

// Schema vs faktisk tid
function renderModalSchedule(id) {
    const emp  = employees.find(e => e.id === id);
    const list = document.getElementById('modal-schedule-list');
    list.innerHTML = '';

    if (!emp.schedule.length) {
        list.innerHTML = '<li><em style="color:var(--text-muted)">Inget schema inlagt.</em></li>';
        return;
    }

    emp.schedule.forEach((shift, index) => {
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
            <button class="btn-sm btn-delete" onclick="deleteShiftFromModal('${id}', ${index})">✖</button>
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
// HISTORIKVY PER ANSTÄLLD
// ================================================================
function openHistoryModal(id) {
    const emp = employees.find(e => e.id === id);
    document.getElementById('history-modal-title').innerText = `📋 Historik: ${emp.name}`;

    const empty = document.getElementById('history-modal-empty');
    const body  = document.getElementById('history-modal-body');

    if (!emp.workedHistory.length) {
        body.innerHTML = '';
        empty.style.display = 'block';
        document.getElementById('history-modal-summary').innerText = '';
    } else {
        empty.style.display = 'none';
        const sorted = [...emp.workedHistory].sort((a, b) => b.date.localeCompare(a.date));

        body.innerHTML = sorted.map(s => {
            const ot    = s.otHours || 0;
            const pay   = (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + (ot * emp.wage * 0.5);
            return `<tr>
                <td>${s.date}</td>
                <td>${s.hours.toFixed(2)}h</td>
                <td style="color:#8b5cf6;">${s.obHours.toFixed(2)}h</td>
                <td style="color:#f97316;">${ot.toFixed(2)}h</td>
                <td style="color:var(--text-muted);">${s.breakMinutes || 0} min</td>
                <td>${Math.round(pay).toLocaleString('sv-SE')} kr</td>
            </tr>`;
        }).join('');

        const tot = emp.workedHistory.reduce(
            (a, s) => ({ h: a.h + s.hours, ob: a.ob + s.obHours, ot: a.ot + (s.otHours || 0) }),
            { h: 0, ob: 0, ot: 0 }
        );
        document.getElementById('history-modal-summary').innerText =
            `Totalt: ${tot.h.toFixed(1)}h vanlig + ${tot.ob.toFixed(1)}h OB + ${tot.ot.toFixed(1)}h övertid`;
    }

    document.getElementById('history-modal').classList.add('active');
}

function closeHistoryModal() { document.getElementById('history-modal').classList.remove('active'); }

// ================================================================
// INSTÄLLNINGAR & FÖRETAGSNAMN
// ================================================================
function updateCompanyName() {
    const name = localStorage.getItem('tt_company') || 'TimeTrack';
    document.getElementById('nav-company-name').innerText = `⏱️ ${name}`;
}

function openSettingsModal() {
    document.getElementById('company-name-input').value = localStorage.getItem('tt_company') || '';
    renderSavedPayslips();
    document.getElementById('settings-modal').classList.add('active');
}

function closeSettingsModal() { document.getElementById('settings-modal').classList.remove('active'); }

function saveSettings() {
    const name = document.getElementById('company-name-input').value.trim();
    if (name) localStorage.setItem('tt_company', name);
    else      localStorage.removeItem('tt_company');
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
