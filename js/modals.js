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
    document.getElementById('edit-startdate').value        = emp.startDate      || '';
    document.getElementById('edit-department').value       = emp.department     || '';
    document.getElementById('edit-position').value         = emp.position       || '';
    document.getElementById('edit-employment-type').value  = emp.employmentType || '';
    document.getElementById('edit-personnummer').value      = emp.personnummer    || '';
    document.getElementById('edit-phone').value             = emp.phone           || '';
    document.getElementById('edit-email').value             = emp.email           || '';
    document.getElementById('edit-address').value           = emp.address         || '';
    document.getElementById('edit-postal').value            = emp.postalCode      || '';
    document.getElementById('edit-city').value              = emp.city            || '';
    document.getElementById('edit-emergency-name').value    = emp.emergencyName   || '';
    document.getElementById('edit-emergency-phone').value   = emp.emergencyPhone  || '';
    const editAvatar = document.getElementById('edit-avatar');
    if (editAvatar) editAvatar.src = emp.profilePhoto || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%234b5563'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%239ca3af'/%3E%3Cellipse cx='50' cy='80' rx='28' ry='20' fill='%239ca3af'/%3E%3C/svg%3E";
    renderModalSchedule(id);
    renderModalCertifications(id);
    renderModalDocuments(id);
    renderModalTemplates(id);
    document.getElementById('edit-modal').classList.add('active');
}

function closeEditModal() { document.getElementById('edit-modal').classList.remove('active'); }

function randomizePIN() {
    const currentId = document.getElementById('edit-emp-id').value;
    const usedPins  = employees.filter(e => e.id !== currentId).map(e => e.pin);
    let pin;
    do { pin = String(Math.floor(1000 + Math.random() * 9000)); } while (usedPins.includes(pin));
    document.getElementById('edit-pin').value = pin;
    showToast(`Ny PIN: ${pin} — kom ihåg att spara och meddela den anställde.`, 'success');
}

function saveEmployeeEdit() {
    const id          = document.getElementById('edit-emp-id').value;
    const emp         = employees.find(e => e.id === id);
    const newName     = document.getElementById('edit-name').value;
    const newPin      = document.getElementById('edit-pin').value;
    const newWage     = parseInt(document.getElementById('edit-wage').value, 10);
    const newVacation = parseInt(document.getElementById('edit-vacation-days').value, 10);

    if (!emp) return showToast("Anställd ej hittad.", "error");
    if (!newName || !newPin || isNaN(newWage)) return showToast("Fyll i alla fält.", "warning");
    if (employees.find(e => e.pin === newPin && e.id !== id)) return showToast("PIN-koden används redan!", "error");

    emp.name         = newName;
    emp.pin          = newPin;
    emp.wage         = newWage;
    if (!isNaN(newVacation)) emp.vacationDaysLeft = newVacation;
    emp.startDate      = (document.getElementById('edit-startdate')?.value      || '');
    emp.department     = (document.getElementById('edit-department')?.value    || '').trim();
    emp.position       = (document.getElementById('edit-position')?.value      || '').trim();
    emp.employmentType = (document.getElementById('edit-employment-type')?.value || '');
    emp.personnummer   = (document.getElementById('edit-personnummer')?.value    || '').trim();
    emp.phone          = (document.getElementById('edit-phone')?.value          || '').trim();
    emp.email          = (document.getElementById('edit-email')?.value          || '').trim();
    emp.address        = (document.getElementById('edit-address')?.value        || '').trim();
    emp.postalCode     = (document.getElementById('edit-postal')?.value         || '').trim();
    emp.city           = (document.getElementById('edit-city')?.value           || '').trim();
    emp.emergencyName  = (document.getElementById('edit-emergency-name')?.value  || '').trim();
    emp.emergencyPhone = (document.getElementById('edit-emergency-phone')?.value || '').trim();

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

// Feature 2: copy last week's shifts +7 days for a specific employee (admin edit modal)
function copyLastWeekScheduleAdmin() {
    const id  = document.getElementById('edit-emp-id').value;
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    const now = new Date(); now.setHours(0, 0, 0, 0);
    let dow = now.getDay(); if (dow === 0) dow = 7;
    const thisMonday = new Date(now); thisMonday.setDate(now.getDate() - dow + 1);
    const lastMonday = new Date(thisMonday); lastMonday.setDate(thisMonday.getDate() - 7);
    const lastSunday = new Date(lastMonday); lastSunday.setDate(lastMonday.getDate() + 6);
    const fromStr = lastMonday.toISOString().slice(0, 10);
    const toStr   = lastSunday.toISOString().slice(0, 10);

    const lastWeekShifts = emp.schedule.filter(s => s.day >= fromStr && s.day <= toStr);
    if (!lastWeekShifts.length) return showToast('Inga pass förra veckan att kopiera.', 'warning');

    let added = 0;
    lastWeekShifts.forEach(shift => {
        const newDate    = new Date(shift.day); newDate.setDate(newDate.getDate() + 7);
        const newDateStr = newDate.toISOString().slice(0, 10);
        if (!emp.schedule.some(s => s.day === newDateStr && s.time === shift.time)) {
            emp.schedule.push({ day: newDateStr, time: shift.time });
            added++;
        }
    });

    if (added > 0) { saveData(); renderModalSchedule(id); showToast(`${added} pass kopierade till denna vecka!`, 'success'); }
    else showToast('Dessa pass finns redan denna vecka.', 'warning');
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
    const targetDay = parseInt(document.getElementById('modal-recur-day').value, 10);
    const startTime = document.getElementById('modal-recur-start').value;
    const endTime   = document.getElementById('modal-recur-end').value;
    const weeks     = parseInt(document.getElementById('modal-recur-weeks').value, 10);

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
// SCHEMAMALLAR
// ================================================================
function renderModalTemplates(empId) {
    const list = document.getElementById('modal-template-list');
    if (!list) return;
    const dayNames = ['', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    if (!scheduleTemplates.length) {
        list.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; margin:0;">Inga mallar sparade ännu.</p>';
        return;
    }
    list.innerHTML = scheduleTemplates.map(t => {
        const desc = t.shifts.map(s => `${dayNames[s.dow]} ${s.start}`).join(', ');
        return `<div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; padding:0.5rem 0; border-bottom:1px solid var(--card-border); flex-wrap:wrap;">
            <div style="flex:1; min-width:120px;">
                <strong style="font-size:0.9rem;">${escapeHtml(t.name)}</strong>
                <span style="color:var(--text-muted); font-size:0.75rem; display:block;">${desc}</span>
            </div>
            <div style="display:flex; gap:0.4rem; align-items:center; flex-shrink:0;">
                <select id="tpl-weeks-${t.id}" style="padding:0.35rem; border-radius:6px; border:1px solid var(--input-border); background:var(--input-bg); color:var(--text-color); font-size:0.8rem;">
                    <option value="2">2 v</option><option value="4" selected>4 v</option>
                    <option value="8">8 v</option><option value="12">12 v</option>
                </select>
                <button class="btn-sm btn-edit" onclick="applyTemplate('${t.id}', '${empId}')">Applicera</button>
                <button class="btn-sm btn-delete" onclick="deleteTemplate('${t.id}', '${empId}')">✖</button>
            </div>
        </div>`;
    }).join('');
}

function saveCurrentWeekAsTemplate() {
    const name = document.getElementById('modal-template-name').value.trim();
    if (!name) return showToast('Ange ett mallnamn.', 'warning');
    const id  = document.getElementById('edit-emp-id').value;
    const emp = employees.find(e => e.id === id);

    const now = new Date(); now.setHours(0, 0, 0, 0);
    let dow = now.getDay(); if (dow === 0) dow = 7;
    const monday = new Date(now); monday.setDate(now.getDate() - dow + 1);
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    const fromStr = monday.toISOString().slice(0, 10);
    const toStr   = sunday.toISOString().slice(0, 10);

    const weekShifts = emp.schedule.filter(s => s.day >= fromStr && s.day <= toStr);
    if (!weekShifts.length) return showToast('Inga pass denna vecka att spara som mall.', 'warning');

    const shifts = weekShifts.map(s => {
        let d = new Date(s.day).getDay(); if (d === 0) d = 7;
        const [start, end] = s.time.split(' - ').map(t => t.trim());
        return { dow: d, start, end };
    });

    scheduleTemplates.push({ id: Date.now().toString(), name, shifts });
    saveData();
    document.getElementById('modal-template-name').value = '';
    renderModalTemplates(id);
    showToast(`Mall "${name}" sparad!`, 'success');
}

function applyTemplate(templateId, empId) {
    const template = scheduleTemplates.find(t => t.id === templateId);
    const emp      = employees.find(e => e.id === empId);
    if (!template || !emp) return;

    const weeks = parseInt(document.getElementById(`tpl-weeks-${templateId}`)?.value || '4', 10);

    const now = new Date(); now.setHours(0, 0, 0, 0);
    let dow = now.getDay(); if (dow === 0) dow = 7;
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() - dow + 1 + 7);

    let added = 0;
    for (let w = 0; w < weeks; w++) {
        template.shifts.forEach(shift => {
            const d = new Date(nextMonday);
            d.setDate(nextMonday.getDate() + w * 7 + (shift.dow - 1));
            const dayStr  = d.toISOString().slice(0, 10);
            const timeStr = `${shift.start} - ${shift.end}`;
            if (!emp.schedule.some(s => s.day === dayStr && s.time === timeStr)) {
                emp.schedule.push({ day: dayStr, time: timeStr });
                added++;
            }
        });
    }
    saveData(); renderModalSchedule(empId);
    showToast(`${added} pass tillagda från "${template.name}"!`, 'success');
}

function deleteTemplate(templateId, empId) {
    scheduleTemplates = scheduleTemplates.filter(t => t.id !== templateId);
    saveData();
    renderModalTemplates(empId);
    showToast('Mall raderad.', 'success');
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
                    <td id="note-cell-${origIdx}" style="font-size:0.8rem; max-width:130px; word-break:break-word; cursor:${isAdmin ? 'pointer' : 'default'};" ${isAdmin ? `onclick="inlineEditNote('${id}',${origIdx})"` : ''} title="${isAdmin ? 'Klicka för att redigera kommentar' : ''}"><span style="color:${s.note ? 'var(--text-color)' : 'var(--text-muted)'};">${s.note || (isAdmin ? '+ kommentar' : '')}</span></td>
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
    const vabHist    = emp.vabHistory      || [];
    if (vacHist.length || sickHist.length || vabHist.length) {
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
            absHtml += `<p style="margin:0 0 0.4rem;"><strong>🤒 Sjukdagar (${sickHist.length}):</strong><br>${sickDates}</p>`;
        }
        if (vabHist.length) {
            const vabDates = [...vabHist].sort((a, b) => {
                const da = typeof a === 'string' ? a : a.date;
                const db = typeof b === 'string' ? b : b.date;
                return db.localeCompare(da);
            }).map(e => fmtEntry(e, 'vab')).join('&ensp;');
            absHtml += `<p style="margin:0;"><strong>👶 VAB-dagar (${vabHist.length}):</strong><br>${vabDates}</p>`;
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

// Feature 4 (monthly earnings line chart — last 6 months + average)
function renderHistoryChart(emp) {
    const monthly = {};
    emp.workedHistory.forEach(s => {
        const m = s.date.slice(0, 7);
        if (!monthly[m]) monthly[m] = 0;
        monthly[m] += (s.hours * emp.wage) + (s.obHours * emp.wage * 1.5) + ((s.otHours || 0) * emp.wage * 0.5);
    });

    // Show last 6 months (or fewer if not enough data)
    const allMonths = Object.keys(monthly).sort();
    const months    = allMonths.slice(-6);
    const data      = months.map(m => Math.round(monthly[m]));
    const avg       = data.length ? Math.round(data.reduce((a, b) => a + b, 0) / data.length) : 0;
    const locale    = getLangLocale();
    const labels    = months.map(m => new Date(m + '-01').toLocaleDateString(locale, { month: 'short', year: '2-digit' }));

    if (window.historyEmpChart) window.historyEmpChart.destroy();
    const ctx  = document.getElementById('history-emp-chart').getContext('2d');
    const dark = document.body.classList.contains('dark-mode');
    const tickColor = dark ? '#94a3b8' : '#64748b';
    window.historyEmpChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Bruttolön (kr)',
                    data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.12)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'Snitt',
                    data: months.map(() => avg),
                    borderColor: '#f59e0b',
                    borderDash: [6, 4],
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: tickColor, boxWidth: 12, font: { size: 11 } } } },
            scales: {
                x: { grid: { display: false }, ticks: { color: tickColor } },
                y: { border: { display: false }, ticks: { color: tickColor } }
            }
        }
    });
}

// Feature 3: inline note editing in history table
function inlineEditNote(empId, idx) {
    const cell = document.getElementById(`note-cell-${idx}`);
    if (!cell || cell.querySelector('input')) return; // already editing
    const emp     = employees.find(e => e.id === empId);
    const current = emp?.workedHistory[idx]?.note || '';
    const inputId = `note-input-${idx}`;
    cell.innerHTML = `
        <div style="display:flex; gap:0.3rem; align-items:center;" onclick="event.stopPropagation()">
            <input id="${inputId}" type="text" value="${current.replace(/"/g, '&quot;')}"
                style="flex:1; min-width:80px; padding:0.2rem 0.4rem; border-radius:5px; border:1px solid var(--input-border); background:var(--input-bg); color:var(--text-color); font-size:0.78rem;"
                onkeydown="if(event.key==='Enter')saveInlineNote('${empId}',${idx},'${inputId}'); if(event.key==='Escape')openHistoryModal(_historyEmpId);">
            <button class="btn-sm" style="padding:0.2rem 0.5rem; font-size:0.72rem; background:#10b981;" onclick="saveInlineNote('${empId}',${idx},'${inputId}')">💾</button>
            <button class="btn-sm" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="openHistoryModal(_historyEmpId)">✖</button>
        </div>`;
    document.getElementById(inputId)?.focus();
}

function saveInlineNote(empId, idx, inputId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.workedHistory[idx]) return;
    const val = document.getElementById(inputId)?.value.trim() || '';
    emp.workedHistory[idx].note = val;
    saveData();
    openHistoryModal(empId);
    showToast('Kommentar sparad.', 'success');
}

// Feature 2: remove a single absence date
function removeAbsenceDate(empId, type, date) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    if (type === 'vacation') {
        const idx = emp.vacationHistory.findIndex(e => (typeof e === 'string' ? e : e.date) === date);
        if (idx > -1) { emp.vacationHistory.splice(idx, 1); emp.vacationDaysLeft = (emp.vacationDaysLeft || 0) + 1; }
    } else if (type === 'sick') {
        const idx = emp.sickHistory.findIndex(e => (typeof e === 'string' ? e : e.date) === date);
        if (idx > -1) { emp.sickHistory.splice(idx, 1); emp.sickDaysUsed = Math.max(0, (emp.sickDaysUsed || 0) - 1); }
    } else if (type === 'vab') {
        const idx = (emp.vabHistory || []).findIndex(e => (typeof e === 'string' ? e : e.date) === date);
        if (idx > -1) { emp.vabHistory.splice(idx, 1); emp.vabDaysUsed = Math.max(0, (emp.vabDaysUsed || 0) - 1); }
    }
    saveData();
    if (currentUser.role === 'admin') loadAdminData();
    openHistoryModal(empId);
    showToast('Frånvarodag borttagen.', 'success');
}

// ================================================================
// CERTIFIKAT & KOMPETENSER
// ================================================================
function certDaysLeft(dateStr) {
    return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function renderModalCertifications(id) {
    const emp  = employees.find(e => e.id === id);
    const list = document.getElementById('modal-cert-list');
    if (!list) return;
    const certs = emp.certifications || [];
    if (!certs.length) {
        list.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; margin:0 0 0.5rem;">Inga certifikat registrerade.</p>';
        return;
    }
    const today = new Date().toISOString().slice(0, 10);
    list.innerHTML = certs.map((c, i) => {
        const expired = c.expiryDate && c.expiryDate < today;
        const soon    = c.expiryDate && !expired && certDaysLeft(c.expiryDate) <= 30;
        const color   = expired ? '#ef4444' : soon ? '#f97316' : '#10b981';
        const label   = expired ? `⚠️ Utgången (${c.expiryDate})` : c.expiryDate ? (soon ? `⏰ ${certDaysLeft(c.expiryDate)} dagar kvar` : `✅ t.o.m. ${c.expiryDate}`) : '✅ Inget datum';
        return `<div style="display:flex; justify-content:space-between; align-items:center; padding:0.4rem 0; border-bottom:1px solid var(--card-border); gap:0.5rem; flex-wrap:wrap;">
            <div><strong style="font-size:0.9rem;">${escapeHtml(c.name)}</strong> <span style="color:${color}; font-size:0.8rem;">${label}</span></div>
            <button class="btn-sm btn-delete" onclick="removeCertification('${id}', ${i})">✖</button>
        </div>`;
    }).join('');
}

function addCertification() {
    const id   = document.getElementById('edit-emp-id').value;
    const emp  = employees.find(e => e.id === id);
    const name = document.getElementById('modal-cert-name').value.trim();
    const exp  = document.getElementById('modal-cert-expiry').value;
    if (!name) return showToast('Ange namn på certifikatet.', 'warning');
    if (!emp.certifications) emp.certifications = [];
    emp.certifications.push({ id: Date.now().toString(), name, expiryDate: exp });
    document.getElementById('modal-cert-name').value   = '';
    document.getElementById('modal-cert-expiry').value = '';
    saveData(); renderModalCertifications(id);
    showToast('Certifikat tillagt!', 'success');
}

function removeCertification(empId, idx) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    emp.certifications.splice(idx, 1);
    saveData(); renderModalCertifications(empId);
    showToast('Certifikat borttaget.', 'warning');
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
    const brk   = parseInt(document.getElementById('manual-break').value, 10)   || 0;
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
    document.getElementById('payday-input').value        = localStorage.getItem('tt_payday')        || '25';

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

    const payday = parseInt(document.getElementById('payday-input').value, 10);
    if (!isNaN(payday) && payday >= 1 && payday <= 31) localStorage.setItem('tt_payday', payday.toString());

    // OT threshold
    const otThr = parseFloat(document.getElementById('ot-threshold-input').value);
    if (!isNaN(otThr) && otThr > 0) localStorage.setItem('tt_ot_threshold', otThr.toString());

    // Feature 8: save OB times
    const obEvening = document.getElementById('ob-evening-input').value;
    const obMorning = document.getElementById('ob-morning-input').value;
    if (obEvening) localStorage.setItem('tt_ob_evening', parseInt(obEvening.split(':')[0], 10).toString());
    if (obMorning) localStorage.setItem('tt_ob_morning', parseInt(obMorning.split(':')[0], 10).toString());

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

// ================================================================
// PROFILBILD (admin edit modal)
// ================================================================
function uploadEditPhoto(input) {
    const id   = document.getElementById('edit-emp-id').value;
    const file = input.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) return showToast('Bilden är för stor (max 500 KB).', 'error');
    const emp    = employees.find(e => e.id === id);
    const reader = new FileReader();
    reader.onload = ev => {
        emp.profilePhoto = ev.target.result;
        const avatarEl   = document.getElementById('edit-avatar');
        if (avatarEl) avatarEl.src = emp.profilePhoto;
        saveData();
        loadAdminData();
        showToast('Profilbild sparad!', 'success');
    };
    reader.readAsDataURL(file);
}

// ================================================================
// DOKUMENT
// ================================================================
function renderModalDocuments(id) {
    const emp  = employees.find(e => e.id === id);
    const list = document.getElementById('modal-doc-list');
    if (!list) return;
    const docs = emp.documents || [];
    if (!docs.length) {
        list.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem; margin:0;">Inga dokument uppladdade.</p>';
        return;
    }
    list.innerHTML = docs.map(doc => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.4rem 0; border-bottom:1px solid var(--card-border);">
            <div>
                <a href="${doc.data}" download="${escapeHtml(doc.name)}" style="color:#3b82f6; font-size:0.9rem; text-decoration:none;">📄 ${escapeHtml(doc.name)}</a>
                <span style="color:var(--text-muted); font-size:0.75rem; margin-left:0.5rem;">${escapeHtml(doc.uploadedAt)}</span>
            </div>
            <button class="btn-sm btn-delete" onclick="deleteDocument('${id}', '${doc.id}')">✖</button>
        </div>`).join('');
}

function uploadDocument() {
    const id        = document.getElementById('edit-emp-id').value;
    const fileInput = document.getElementById('modal-doc-file');
    const file      = fileInput.files[0];
    if (!file) return showToast('Välj en fil först.', 'warning');
    if (file.size > 2 * 1024 * 1024) return showToast('Filen är för stor (max 2 MB).', 'error');
    const emp    = employees.find(e => e.id === id);
    const reader = new FileReader();
    reader.onload = ev => {
        if (!emp.documents) emp.documents = [];
        emp.documents.push({
            id: Date.now().toString(),
            name: file.name,
            type: file.type,
            data: ev.target.result,
            uploadedAt: new Date().toISOString().slice(0, 10)
        });
        saveData();
        renderModalDocuments(id);
        fileInput.value = '';
        showToast('Dokument uppladdat!', 'success');
    };
    reader.readAsDataURL(file);
}

function deleteDocument(empId, docId) {
    const emp = employees.find(e => e.id === empId);
    emp.documents = (emp.documents || []).filter(d => d.id !== docId);
    saveData();
    renderModalDocuments(empId);
    showToast('Dokument raderat.', 'success');
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
