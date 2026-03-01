// ================================================================
// 1. DATABAS & GLOBAL STATE
// ================================================================
const DB_KEY       = 'timetrack_pro_v3';
const LOGS_KEY     = 'timetrack_logs_v3';
const PAYSLIPS_KEY = 'tt_payslips';

const defaultEmployees = [
    { id: "1", name: "Admin",          pin: "9999", role: "admin",   wage: 0,   status: "Utloggad", activeSession: null, workedHistory: [], schedule: [],                                                    vacationDaysLeft: 25, sickDaysUsed: 0 },
    { id: "2", name: "Alex (Du)",       pin: "1234", role: "worker",  wage: 150, status: "Utloggad", activeSession: null, workedHistory: [], schedule: [{ day: "2026-02-27", time: "08:00 - 16:00" }], vacationDaysLeft: 25, sickDaysUsed: 0 },
    { id: "3", name: "Sara Andersson",  pin: "5678", role: "worker",  wage: 160, status: "Utloggad", activeSession: null, workedHistory: [], schedule: [],                                                    vacationDaysLeft: 25, sickDaysUsed: 0 }
];

let employees         = JSON.parse(localStorage.getItem(DB_KEY))       || defaultEmployees;
let logs              = JSON.parse(localStorage.getItem(LOGS_KEY))      || [];
let currentUser       = null;
let liveTimerInterval = null;
let logDisplayCount   = 50;
const shownReminders  = new Set();
let inactivityTimer   = null;
const INACTIVITY_MS   = 15 * 60 * 1000; // 15 minutes
let savedPayslips     = JSON.parse(localStorage.getItem(PAYSLIPS_KEY)) || [];

// Migrate existing employees — add new fields if missing
employees.forEach(emp => {
    if (emp.vacationDaysLeft === undefined) emp.vacationDaysLeft = 25;
    if (emp.sickDaysUsed    === undefined) emp.sickDaysUsed    = 0;
    emp.workedHistory.forEach(s => {
        if (s.otHours      === undefined) s.otHours      = 0;
        if (s.breakMinutes === undefined) s.breakMinutes = 0;
    });
});

function saveData() {
    localStorage.setItem(DB_KEY,   JSON.stringify(employees));
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}
