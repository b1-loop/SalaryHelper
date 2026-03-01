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

    const ul = document.getElementById('schedule-list'); ul.innerHTML = '';
    currentUser.schedule.forEach((shift, i) => {
        ul.innerHTML += `<li><div><strong>${shift.day}</strong> <span style="margin-left:10px; color:var(--text-muted);">${shift.time}</span></div><button class="btn-sm btn-delete" onclick="deleteShiftWorker(${i})">✖ Ta bort</button></li>`;
    });
}

function updateWorkerControls() {
    const badge    = document.getElementById('worker-status-badge');
    badge.innerText  = currentUser.status;
    badge.className  = `badge ${currentUser.status.toLowerCase()}`;

    const btnContainer = document.getElementById('worker-action-buttons');
    const timerEl      = document.getElementById('active-session-timer');
    clearInterval(liveTimerInterval);

    if (['Utloggad', 'Sjuk', 'Semester'].includes(currentUser.status)) {
        timerEl.style.display = 'none';
        btnContainer.innerHTML = `
            <button class="btn btn-in"    onclick="clockIn()">▶ Klocka In (GPS)</button>
            <button class="btn btn-sick"  onclick="setStatus('Sjuk')">🤒 Sjuk</button>
            <button class="btn btn-leave" onclick="setStatus('Semester')">🏖️ Ledighet</button>
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

function startLiveTimer() {
    liveTimerInterval = setInterval(() => {
        const ms    = getElapsedMs(currentUser.activeSession);
        const hours = Math.floor(ms / 3600000);
        const mins  = Math.floor((ms % 3600000) / 60000);
        const secs  = Math.floor((ms % 60000) / 1000);
        document.getElementById('active-session-timer').innerText =
            `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
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

function clockOut() {
    const split    = calculateOBSplit(currentUser.activeSession);
    const totalHrs = split.regularHours + split.obHours;

    // Break duration
    const totalBreakMs  = currentUser.activeSession.breaks
        .reduce((sum, b) => sum + ((b.end || Date.now()) - b.start), 0);
    const breakMinutes  = Math.round(totalBreakMs / 60000);

    // Overtime: hours beyond 8h in the same calendar day
    const today         = new Date().toLocaleDateString('sv-SE');
    const alreadyToday  = currentUser.workedHistory
        .filter(s => s.date === today)
        .reduce((sum, s) => sum + s.hours + s.obHours, 0);
    const otHours = Math.max(0, alreadyToday + totalHrs - 8);

    currentUser.workedHistory.push({
        date:         today,
        hours:        split.regularHours,
        obHours:      split.obHours,
        otHours:      otHours,
        breakMinutes: breakMinutes
    });

    currentUser.status        = 'Utloggad';
    currentUser.activeSession = null;
    addLog(`Stämplade ut. Vanlig: ${split.regularHours.toFixed(2)}h, OB: ${split.obHours.toFixed(2)}h, OT: ${otHours.toFixed(2)}h`);
    saveData(); loadWorkerView();
    showToast(`Utstämplad! ${totalHrs.toFixed(2)}h totalt (OB: ${split.obHours.toFixed(2)}h, OT: ${otHours.toFixed(2)}h)`, "success");
}

function setStatus(status) {
    if (status === 'Semester') {
        const left = currentUser.vacationDaysLeft ?? 25;
        if (left <= 0) return showToast("Inga semesterdagar kvar!", "error");
        currentUser.vacationDaysLeft = left - 1;
    }
    if (status === 'Sjuk') {
        currentUser.sickDaysUsed = (currentUser.sickDaysUsed ?? 0) + 1;
    }
    currentUser.status = status;
    addLog(`Satte status: ${status}`);
    saveData(); loadWorkerView(); showToast(`Status satt till ${status}`);
}

function addShift() {
    const d = document.getElementById('new-shift-day').value;
    const s = document.getElementById('new-shift-start').value;
    const e = document.getElementById('new-shift-end').value;
    if (!d || !s || !e) return showToast("Fyll i datum och tider.", "warning");
    if (s >= e)         return showToast("Sluttiden måste vara efter start.", "error");
    currentUser.schedule.push({ day: d, time: `${s} - ${e}` });
    document.getElementById('new-shift-day').value   = '';
    document.getElementById('new-shift-start').value = '';
    document.getElementById('new-shift-end').value   = '';
    saveData(); loadWorkerView(); showToast("Pass tillagt!", "success");
}

function deleteShiftWorker(i) {
    currentUser.schedule.splice(i, 1);
    saveData(); loadWorkerView(); showToast("Pass borttaget", "warning");
}
