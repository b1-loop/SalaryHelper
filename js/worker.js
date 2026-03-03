// ================================================================
// SKIFTPÅMINNELSER
// ================================================================
function checkShiftReminders() {
    if (!currentUser?.schedule) return;
    const now = new Date();

    currentUser.schedule.forEach(shift => {
        const startStr = shift.time.split(' - ')[0]?.trim();
        if (!startStr) return;

        const shiftStart = new Date(`${shift.day}T${startStr}:00`);
        const diffMin    = (shiftStart - now) / 60000;
        const key        = `${shift.day}_${startStr}`;

        if (diffMin > 0 && diffMin <= 30 && !shownReminders.has(key)) {
            shownReminders.add(key);
            if (Notification.permission === 'granted') {
                new Notification('⏰ Skiftpåminnelse', {
                    body: `Ditt skift ${shift.day} ${shift.time} börjar om ${Math.round(diffMin)} minuter!`
                });
            }
            showToast(`Skiftet börjar om ${Math.round(diffMin)} min!`, 'warning');
        }
    });
}

// ================================================================
// ARBETAR-VY
// ================================================================
let scheduleViewMode = 'list'; // 'list' | 'calendar'
let longShiftWarned  = false;

function loadWorkerView() {
    updateWorkerControls();

    let totHrs = 0, obHrs = 0, otHrs = 0;
    currentUser.workedHistory.forEach(s => { totHrs += s.hours; obHrs += s.obHours; otHrs += (s.otHours || 0); });

    const gross = (totHrs * currentUser.wage) + (obHrs * currentUser.wage * 1.5) + (otHrs * currentUser.wage * 0.5);
    document.getElementById('worker-hours').innerText         = totHrs.toFixed(2) + "h";
    document.getElementById('worker-ob-hours').innerText      = obHrs.toFixed(2)  + "h";
    document.getElementById('worker-ot-hours').innerText      = otHrs.toFixed(2)  + "h";
    document.getElementById('worker-earned').innerText        = Math.round(gross).toLocaleString('sv-SE') + " kr";
    document.getElementById('worker-vacation-days').innerText = currentUser.vacationDaysLeft ?? 25;
    document.getElementById('worker-sick-days').innerText     = currentUser.sickDaysUsed ?? 0;
    const reqDaysLeft = document.getElementById('req-days-left');
    if (reqDaysLeft) reqDaysLeft.innerText = (currentUser.vacationDaysLeft ?? 25) + ' st';

    // Autofill today's date
    const dayInput = document.getElementById('new-shift-day');
    if (dayInput && !dayInput.value) dayInput.value = new Date().toISOString().slice(0, 10);

    // Fill profile form
    const _pn = document.getElementById('profile-personnummer');
    const _pp = document.getElementById('profile-phone');
    const _pe = document.getElementById('profile-email');
    const _pa = document.getElementById('profile-address');
    const _po = document.getElementById('profile-postal');
    const _pc = document.getElementById('profile-city');
    if (_pn) _pn.value = currentUser.personnummer || '';
    if (_pp) _pp.value = currentUser.phone        || '';
    if (_pe) _pe.value = currentUser.email        || '';
    if (_pa) _pa.value = currentUser.address      || '';
    if (_po) _po.value = currentUser.postalCode   || '';
    if (_pc) _pc.value = currentUser.city         || '';

    // Admin message banner
    const adminMsg   = localStorage.getItem('tt_admin_message');
    const banner     = document.getElementById('admin-message-banner');
    const dismissed  = sessionStorage.getItem('tt_msg_dismissed');
    if (banner) {
        if (adminMsg && adminMsg !== dismissed) {
            document.getElementById('admin-message-text').innerText = adminMsg;
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
    }

    // Feature 1 & 7: render schedule (list or calendar)
    renderScheduleSection();
    renderWorkerChart();
    renderMyVacationRequests();
}

function renderWorkerChart() {
    const monthly = {};
    currentUser.workedHistory.forEach(s => {
        const m = s.date.slice(0, 7);
        if (!monthly[m]) monthly[m] = 0;
        monthly[m] += (s.hours * currentUser.wage) + (s.obHours * currentUser.wage * 1.5) + ((s.otHours || 0) * currentUser.wage * 0.5);
    });
    const months = Object.keys(monthly).sort();
    const chartSection = document.getElementById('worker-chart-section');
    if (!months.length) { chartSection.classList.add('hidden'); return; }
    chartSection.classList.remove('hidden');
    const labels = months.map(m => new Date(m + '-01').toLocaleDateString('sv-SE', { month: 'short', year: '2-digit' }));
    const data   = months.map(m => Math.round(monthly[m]));
    if (window.workerIncomeChart) window.workerIncomeChart.destroy();
    const ctx  = document.getElementById('worker-income-chart').getContext('2d');
    const dark = document.body.classList.contains('dark-mode');
    window.workerIncomeChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Bruttolön (kr)', data, backgroundColor: '#10b981', borderRadius: 4 }] },
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

// ================================================================
// SCHEMA — LISTA / KALENDER TOGGLE (feature 7)
// ================================================================
function toggleScheduleView() {
    scheduleViewMode = scheduleViewMode === 'list' ? 'calendar' : 'list';
    const btn = document.getElementById('schedule-view-btn');
    if (btn) btn.innerText = scheduleViewMode === 'list' ? '📅 Kalender' : '📋 Lista';
    renderScheduleSection();
}

function renderScheduleSection() {
    if (scheduleViewMode === 'calendar') {
        renderScheduleCalendar();
    } else {
        renderScheduleList();
    }
}

function renderScheduleList() {
    const ul       = document.getElementById('schedule-list');
    ul.innerHTML   = '';
    const todayStr = new Date().toISOString().slice(0, 10);

    // Feature 1: sort by date
    const sorted = [...currentUser.schedule].sort((a, b) => a.day.localeCompare(b.day));

    sorted.forEach(shift => {
        const origIdx       = currentUser.schedule.indexOf(shift);
        const isPastOrToday = shift.day <= todayStr;
        const completeBtn   = isPastOrToday
            ? `<button class="btn-sm" style="background:#10b981; margin-right:0.4rem;" onclick="completeScheduledShift(${origIdx})">✅ Färdig</button>`
            : '';
        ul.innerHTML += `<li>
            <div><strong>${shift.day}</strong> <span style="margin-left:10px; color:var(--text-muted);">${shift.time}</span></div>
            <div style="display:flex;gap:0.25rem;align-items:center;">
                ${completeBtn}
                <button class="btn-sm btn-edit" style="padding:0.4rem 0.6rem;" onclick="duplicateShiftWorker(${origIdx})" title="Duplicera pass">📋</button>
                <button class="btn-sm btn-delete" onclick="deleteShiftWorker(${origIdx})">✖ Ta bort</button>
            </div>
        </li>`;
    });

    if (!sorted.length) ul.innerHTML = '<li><em style="color:var(--text-muted)">Inga planerade pass.</em></li>';
}

function renderScheduleCalendar() {
    const container = document.getElementById('schedule-list');
    const now       = new Date();
    const year      = now.getFullYear();
    const month     = now.getMonth();
    const firstDay  = new Date(year, month, 1);
    const lastDay   = new Date(year, month + 1, 0);
    const monthStr  = `${year}-${String(month + 1).padStart(2, '0')}`;
    const todayStr  = now.toISOString().slice(0, 10);

    const monthShifts = {};
    currentUser.schedule.forEach(shift => {
        if (shift.day.startsWith(monthStr)) monthShifts[shift.day] = shift.time;
    });

    const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    let html = '<div class="cal-grid">';
    dayNames.forEach(d => { html += `<div class="cal-header">${d}</div>`; });

    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;
    for (let i = 0; i < startDow; i++) html += '<div class="cal-day empty"></div>';

    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${monthStr}-${String(d).padStart(2, '0')}`;
        const shift   = monthShifts[dateStr];
        const isToday = dateStr === todayStr;
        html += `<div class="cal-day ${shift ? 'has-shift' : ''} ${isToday ? 'is-today' : ''}">
            <span class="cal-date">${d}</span>
            ${shift ? `<span class="cal-shift">${shift}</span>` : ''}
        </div>`;
    }
    html += '</div>';

    const monthLabel = firstDay.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' });
    container.innerHTML = `<div style="font-weight:700; color:var(--text-muted); margin-bottom:0.5rem; text-transform:capitalize;">${monthLabel}</div>` + html;
}

function updateWorkerControls() {
    const badge   = document.getElementById('worker-status-badge');
    badge.innerText = currentUser.status;
    badge.className = `badge ${currentUser.status.toLowerCase()}`;

    const btnContainer = document.getElementById('worker-action-buttons');
    const timerEl      = document.getElementById('active-session-timer');
    clearInterval(liveTimerInterval);

    if (currentUser.status === 'Utloggad') {
        timerEl.style.display = 'none';
        btnContainer.innerHTML = `
            <button class="btn btn-in"    onclick="clockIn()">▶ Klocka In (GPS)</button>
            <button class="btn btn-sick"  onclick="promptAbsence('Sjuk')">🤒 Sjuk</button>
            <button class="btn btn-leave" onclick="promptAbsence('Semester')">🏖️ Ledighet</button>
        `;
    } else if (currentUser.status === 'Sjuk') {
        timerEl.style.display = 'none';
        btnContainer.innerHTML = `
            <button class="btn btn-in" onclick="clockIn()">▶ Klocka In (GPS)</button>
            <button class="btn" style="background:#10b981;" onclick="returnToWork()">✅ Friskanmäl dig</button>
        `;
    } else if (currentUser.status === 'Semester') {
        timerEl.style.display = 'none';
        btnContainer.innerHTML = `
            <button class="btn btn-in" onclick="clockIn()">▶ Klocka In (GPS)</button>
            <button class="btn" style="background:#10b981;" onclick="returnToWork()">✅ Avsluta semester</button>
        `;
    } else if (currentUser.status === 'Inloggad') {
        timerEl.style.display = 'block'; startLiveTimer();
        btnContainer.innerHTML = `
            <button class="btn btn-break" onclick="toggleBreak(true)">☕ Börja Rast</button>
            <button class="btn btn-out"   onclick="clockOut()">⏹ Stämpla Ut</button>
        `;
    } else if (currentUser.status === 'Rast') {
        timerEl.style.display = 'block'; timerEl.innerText = "PAUSAD ☕";
        btnContainer.innerHTML = `<button class="btn btn-in" onclick="toggleBreak(false)">▶ Avsluta Rast</button>`;
    }
}

// Feature 3: warn if clocked in > 10h
function startLiveTimer() {
    longShiftWarned = false;
    liveTimerInterval = setInterval(() => {
        const ms    = getElapsedMs(currentUser.activeSession);
        const hours = Math.floor(ms / 3600000);
        const mins  = Math.floor((ms % 3600000) / 60000);
        const secs  = Math.floor((ms % 60000) / 1000);
        document.getElementById('active-session-timer').innerText =
            `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

        if (!longShiftWarned && ms > 10 * 3600000) {
            longShiftWarned = true;
            showToast('⚠️ Du har varit instämplad i över 10 timmar! Glömde du stämpla ut?', 'warning');
        }
    }, 1000);
}

function clockIn() {
    currentUser.status        = 'Inloggad';
    currentUser.activeSession = { startTime: Date.now(), breaks: [] };

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            pos => { addLog(`Stämplade in 📍 (Lat: ${pos.coords.latitude.toFixed(2)})`); saveData(); },
            ()  => { addLog("Stämplade in"); saveData(); },
            { timeout: 3000 }
        );
    } else { addLog("Stämplade in"); }

    saveData(); loadWorkerView(); showToast("Inloggad och tiden går!", "success");
}

function toggleBreak(isStarting) {
    if (isStarting) {
        currentUser.status = 'Rast';
        currentUser.activeSession.breaks.push({ start: Date.now(), end: null });
        addLog("Började rast ☕"); showToast("Rast startad. Tiden är pausad.", "warning");
    } else {
        currentUser.status = 'Inloggad';
        const b = currentUser.activeSession.breaks.find(b => b.end === null);
        if (b) b.end = Date.now();
        addLog("Avslutade rast ▶"); showToast("Åter i arbete.", "success");
    }
    saveData(); loadWorkerView();
}

// Feature 9: note shown after clockout
function clockOut() {
    const split    = calculateOBSplit(currentUser.activeSession);
    const totalHrs = split.regularHours + split.obHours;

    const totalBreakMs = currentUser.activeSession.breaks
        .reduce((sum, b) => sum + ((b.end || Date.now()) - b.start), 0);
    const breakMinutes = Math.round(totalBreakMs / 60000);

    const today        = new Date().toLocaleDateString('sv-SE');
    const alreadyToday = currentUser.workedHistory
        .filter(s => s.date === today)
        .reduce((sum, s) => sum + s.hours + s.obHours, 0);
    const otThreshold = parseFloat(localStorage.getItem('tt_ot_threshold') || '8');
    const otHours = Math.max(0, alreadyToday + totalHrs - otThreshold);

    currentUser.workedHistory.push({
        date: today, hours: split.regularHours, obHours: split.obHours,
        otHours, breakMinutes, note: ''
    });

    currentUser.status        = 'Utloggad';
    currentUser.activeSession = null;
    addLog(`Stämplade ut. Vanlig: ${split.regularHours.toFixed(2)}h, OB: ${split.obHours.toFixed(2)}h, OT: ${otHours.toFixed(2)}h`);
    saveData(); loadWorkerView();
    showToast(`Utstämplad! ${totalHrs.toFixed(2)}h totalt (OB: ${split.obHours.toFixed(2)}h, OT: ${otHours.toFixed(2)}h)`, "success");

    const noteDiv = document.getElementById('post-clockout-note');
    if (noteDiv) {
        noteDiv.classList.remove('hidden');
        document.getElementById('session-note-input').value = '';
    }
}

function saveSessionNote() {
    const note = document.getElementById('session-note-input').value.trim();
    if (note && currentUser.workedHistory.length > 0) {
        currentUser.workedHistory[currentUser.workedHistory.length - 1].note = note;
        saveData();
        showToast('Kommentar sparad!', 'success');
    }
    document.getElementById('post-clockout-note').classList.add('hidden');
}

// Feature 10: track absence dates
let _absenceType = null;

function promptAbsence(type) {
    _absenceType = type;
    const label = type === 'Sjuk' ? '🤒 Sjukanmälan' : '🏖️ Ledighetsmarkering';
    document.getElementById('absence-type-label').innerText = label;
    document.getElementById('absence-comment-input').value = '';
    document.getElementById('absence-prompt').classList.remove('hidden');
}

function confirmAbsence() {
    if (!_absenceType) return;
    const comment = document.getElementById('absence-comment-input').value.trim();
    const type = _absenceType;
    cancelAbsence();
    setStatus(type, comment);
}

function cancelAbsence() {
    _absenceType = null;
    document.getElementById('absence-prompt').classList.add('hidden');
}

function setStatus(status, comment = '') {
    if (status === 'Semester') {
        const left = currentUser.vacationDaysLeft ?? 25;
        if (left <= 0) return showToast("Inga semesterdagar kvar!", "error");
        currentUser.vacationDaysLeft = left - 1;
        if (!currentUser.vacationHistory) currentUser.vacationHistory = [];
        currentUser.vacationHistory.push({ date: new Date().toISOString().slice(0, 10), comment });
    }
    if (status === 'Sjuk') {
        currentUser.sickDaysUsed = (currentUser.sickDaysUsed ?? 0) + 1;
        if (!currentUser.sickHistory) currentUser.sickHistory = [];
        currentUser.sickHistory.push({ date: new Date().toISOString().slice(0, 10), comment });
    }
    currentUser.status = status;
    addLog(`Satte status: ${status}`);
    saveData(); loadWorkerView(); showToast(`Status satt till ${status}`);
}

function returnToWork() {
    const prev = currentUser.status;
    currentUser.status = 'Utloggad';
    addLog(`Återgick till arbete (från: ${prev})`);
    saveData(); loadWorkerView();
    showToast(prev === 'Sjuk' ? '✅ Friskanmäld! Välkommen tillbaka.' : '✅ Semester avslutad. Välkommen tillbaka!', 'success');
}

function dismissAdminMessage() {
    const msg = localStorage.getItem('tt_admin_message') || '';
    sessionStorage.setItem('tt_msg_dismissed', msg);
    document.getElementById('admin-message-banner').classList.add('hidden');
}

function submitVacationRequest() {
    const start  = document.getElementById('req-start-date').value;
    const end    = document.getElementById('req-end-date').value;
    const reason = document.getElementById('req-reason').value.trim();
    if (!start || !end) return showToast('Välj start- och slutdatum.', 'warning');
    if (end < start)    return showToast('Slutdatum måste vara efter startdatum.', 'error');
    const days = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
    if (days > (currentUser.vacationDaysLeft ?? 25))
        return showToast(`Du har bara ${currentUser.vacationDaysLeft ?? 25} semesterdagar kvar!`, 'error');
    if (!currentUser.vacationRequests) currentUser.vacationRequests = [];
    currentUser.vacationRequests.unshift({ id: Date.now().toString(), startDate: start, endDate: end, days, reason, status: 'pending', createdAt: Date.now(), reviewNote: '' });
    document.getElementById('req-start-date').value = '';
    document.getElementById('req-end-date').value   = '';
    document.getElementById('req-reason').value     = '';
    saveData();
    addLog(`Skickade semesteransökan: ${start} – ${end} (${days} dag${days !== 1 ? 'ar' : ''})`);
    renderMyVacationRequests();
    showToast('Ansökan skickad! Väntar på godkännande.', 'success');
}

function renderMyVacationRequests() {
    const list = document.getElementById('my-vacation-requests');
    if (!list) return;
    const reqs = currentUser.vacationRequests || [];
    if (!reqs.length) { list.innerHTML = ''; return; }
    const badge = s => s === 'approved'
        ? '<span style="background:#10b981; color:#fff; border-radius:6px; padding:0.2rem 0.5rem; font-size:0.75rem; font-weight:700;">✅ Godkänd</span>'
        : s === 'rejected'
        ? '<span style="background:#ef4444; color:#fff; border-radius:6px; padding:0.2rem 0.5rem; font-size:0.75rem; font-weight:700;">❌ Nekad</span>'
        : '<span style="background:#f59e0b; color:#fff; border-radius:6px; padding:0.2rem 0.5rem; font-size:0.75rem; font-weight:700;">⏳ Väntar</span>';
    list.innerHTML = '<h4 style="margin:0 0 0.6rem;">Mina ansökningar</h4>' +
        reqs.slice(0, 6).map(r => `<div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--card-border); gap:0.5rem; flex-wrap:wrap;">
            <div>
                <strong>${r.startDate} – ${r.endDate}</strong>
                <span style="color:var(--text-muted); font-size:0.85rem; margin-left:0.4rem;">(${r.days} dag${r.days !== 1 ? 'ar' : ''})</span>
                ${r.reason ? `<div style="color:var(--text-muted); font-size:0.8rem;">${r.reason}</div>` : ''}
                ${r.reviewNote ? `<div style="color:#ef4444; font-size:0.8rem; font-style:italic;">Admin: ${r.reviewNote}</div>` : ''}
            </div>
            ${badge(r.status)}
        </div>`).join('');
}

function changePIN() {
    const oldPin     = document.getElementById('old-pin-input').value;
    const newPin     = document.getElementById('new-pin-input').value;
    const confirmPin = document.getElementById('confirm-pin-input').value;
    if (!oldPin || !newPin || !confirmPin) return showToast('Fyll i alla PIN-fält.', 'warning');
    if (oldPin !== currentUser.pin) return showToast('Fel nuvarande PIN.', 'error');
    if (!/^\d{4}$/.test(newPin)) return showToast('Ny PIN måste vara exakt 4 siffror.', 'error');
    if (newPin !== confirmPin) return showToast('De nya PIN-koderna matchar inte.', 'error');
    if (employees.find(e => e.pin === newPin && e.id !== currentUser.id)) return showToast('PIN-koden används redan av någon annan.', 'error');
    currentUser.pin = newPin;
    document.getElementById('old-pin-input').value   = '';
    document.getElementById('new-pin-input').value   = '';
    document.getElementById('confirm-pin-input').value = '';
    saveData();
    addLog('Bytte PIN-kod');
    showToast('PIN-kod uppdaterad!', 'success');
}

function copyLastWeekSchedule() {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    let dow = now.getDay(); if (dow === 0) dow = 7;
    const thisMonday = new Date(now); thisMonday.setDate(now.getDate() - dow + 1);
    const lastMonday = new Date(thisMonday); lastMonday.setDate(thisMonday.getDate() - 7);
    const lastSunday = new Date(lastMonday); lastSunday.setDate(lastMonday.getDate() + 6);
    const fromStr = lastMonday.toISOString().slice(0, 10);
    const toStr   = lastSunday.toISOString().slice(0, 10);
    const lastWeekShifts = currentUser.schedule.filter(s => s.day >= fromStr && s.day <= toStr);
    if (!lastWeekShifts.length) return showToast('Inga pass förra veckan att kopiera.', 'warning');
    let added = 0;
    lastWeekShifts.forEach(shift => {
        const newDate = new Date(shift.day); newDate.setDate(newDate.getDate() + 7);
        const newDateStr = newDate.toISOString().slice(0, 10);
        if (!currentUser.schedule.some(s => s.day === newDateStr && s.time === shift.time)) {
            currentUser.schedule.push({ day: newDateStr, time: shift.time });
            added++;
        }
    });
    if (added > 0) { saveData(); loadWorkerView(); showToast(`${added} pass kopierade till denna vecka!`, 'success'); }
    else showToast('Dessa pass finns redan denna vecka.', 'warning');
}

function saveProfile() {
    if (!currentUser) return;
    currentUser.personnummer = (document.getElementById('profile-personnummer')?.value || '').trim();
    currentUser.phone        = (document.getElementById('profile-phone')?.value        || '').trim();
    currentUser.email        = (document.getElementById('profile-email')?.value        || '').trim();
    currentUser.address      = (document.getElementById('profile-address')?.value      || '').trim();
    currentUser.postalCode   = (document.getElementById('profile-postal')?.value       || '').trim();
    currentUser.city         = (document.getElementById('profile-city')?.value         || '').trim();
    saveData();
    showToast('Profil sparad!', 'success');
}

function addShift() {
    const d = document.getElementById('new-shift-day').value;
    const s = document.getElementById('new-shift-start').value;
    const e = document.getElementById('new-shift-end').value;
    if (!d || !s || !e) return showToast("Fyll i datum och tider.", "warning");
    if (s >= e)         return showToast("Sluttiden måste vara efter start.", "error");
    currentUser.schedule.push({ day: d, time: `${s} - ${e}` });
    document.getElementById('new-shift-day').value   = new Date().toISOString().slice(0, 10);
    document.getElementById('new-shift-start').value = '';
    document.getElementById('new-shift-end').value   = '';
    saveData(); loadWorkerView(); showToast("Pass tillagt!", "success");
}

function duplicateShiftWorker(idx) {
    const shift = currentUser.schedule[idx];
    if (!shift) return;
    const parts = shift.time.split(' - ');
    document.getElementById('new-shift-day').value   = new Date().toISOString().slice(0, 10);
    document.getElementById('new-shift-start').value = parts[0]?.trim() || '';
    document.getElementById('new-shift-end').value   = parts[1]?.trim() || '';
    document.getElementById('new-shift-day').focus();
    showToast('Tider ifyllda — välj datum och klicka Lägg till.', 'info');
}

function deleteShiftWorker(i) {
    currentUser.schedule.splice(i, 1);
    saveData(); loadWorkerView(); showToast("Pass borttaget", "warning");
}

function completeScheduledShift(index) {
    const shift = currentUser.schedule[index];
    if (!shift) return;

    const parts = shift.time.split(' - ');
    if (parts.length !== 2) return showToast("Ogiltigt schemaformat.", "error");

    const [startStr, endStr] = parts.map(p => p.trim());
    const startTs = new Date(`${shift.day}T${startStr}:00`).getTime();
    const endTs   = new Date(`${shift.day}T${endStr}:00`).getTime();

    if (isNaN(startTs) || isNaN(endTs)) return showToast("Kunde inte tolka passets tider.", "error");
    if (endTs <= startTs) return showToast("Sluttiden är inte efter starttiden.", "error");

    const mockSession = { startTime: startTs, breaks: [] };
    const split       = calculateOBSplit(mockSession, endTs);
    const totalHrs    = split.regularHours + split.obHours;

    const alreadyThatDay = currentUser.workedHistory
        .filter(s => s.date === shift.day)
        .reduce((sum, s) => sum + s.hours + s.obHours, 0);
    const otThreshold = parseFloat(localStorage.getItem('tt_ot_threshold') || '8');
    const otHours = Math.max(0, alreadyThatDay + totalHrs - otThreshold);

    currentUser.workedHistory.push({
        date: shift.day, hours: split.regularHours, obHours: split.obHours,
        otHours, breakMinutes: 0, note: ''
    });

    currentUser.schedule.splice(index, 1);

    addLog(`Slutförde schemalagt pass ${shift.day} ${shift.time} — ${totalHrs.toFixed(2)}h (OB: ${split.obHours.toFixed(2)}h, OT: ${otHours.toFixed(2)}h)`);
    saveData(); loadWorkerView();
    showToast(`Pass klart! ${totalHrs.toFixed(2)}h (OB: ${split.obHours.toFixed(2)}h, OT: ${otHours.toFixed(2)}h)`, "success");
}
