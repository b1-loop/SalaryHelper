// ================================================================
// OB-BERÄKNING (automatisk, 5-min slices)
// ================================================================
function isOBTime(date) {
    const day = date.getDay(); // 0=sön, 6=lör
    if (day === 0 || day === 6) return true;
    const minutes = date.getHours() * 60 + date.getMinutes();
    return minutes < 7 * 60 || minutes >= 18 * 60;
}

function calculateOBSplit(session) {
    const endTime   = Date.now();
    const SLICE_MS  = 5 * 60 * 1000;

    // Build worked intervals by excluding breaks
    const sortedBreaks = [...session.breaks].sort((a, b) => a.start - b.start);
    const intervals = [];
    let cur = session.startTime;

    for (const brk of sortedBreaks) {
        if (brk.start > cur) intervals.push({ start: cur, end: brk.start });
        cur = brk.end || endTime;
    }
    if (cur < endTime) intervals.push({ start: cur, end: endTime });

    let regularMs = 0, obMs = 0;

    for (const iv of intervals) {
        let t = iv.start;
        while (t < iv.end) {
            const sliceEnd = Math.min(t + SLICE_MS, iv.end);
            const midpoint = new Date((t + sliceEnd) / 2);
            if (isOBTime(midpoint)) obMs += sliceEnd - t;
            else regularMs += sliceEnd - t;
            t = sliceEnd;
        }
    }

    return { regularHours: regularMs / 3600000, obHours: obMs / 3600000 };
}

// ================================================================
// TIDTAGNING
// ================================================================
function getElapsedMs(session) {
    if (!session) return 0;
    let total = Date.now() - session.startTime;
    session.breaks.forEach(b => { total -= (b.end ? b.end - b.start : Date.now() - b.start); });
    return total;
}

// ================================================================
// PROGRESSIV SKATTEBERÄKNING
// ================================================================
function getTaxBreakdown(grossMonthly) {
    const kommunal    = grossMonthly * 0.3149;
    const statligBase = Math.max(0, grossMonthly - 46000);
    const statlig     = statligBase * 0.20;
    return { kommunal, statlig, total: kommunal + statlig };
}

// ================================================================
// FILTRERA HISTORIK PER PERIOD
// ================================================================
function getFilteredHistory(emp) {
    const filter = document.getElementById('period-filter')?.value || 'all';
    if (filter === 'all') return emp.workedHistory;

    const now = new Date();
    return emp.workedHistory.filter(s => {
        const d = new Date(s.date);
        if (isNaN(d)) return true;
        if (filter === 'week') {
            const weekStart = new Date(now);
            const dow = now.getDay() || 7; // Monday=1
            weekStart.setDate(now.getDate() - dow + 1);
            weekStart.setHours(0, 0, 0, 0);
            return d >= weekStart;
        }
        if (filter === 'month') {
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }
        return true;
    });
}
