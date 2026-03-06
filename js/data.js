// ================================================================
// 1. DATABAS & GLOBAL STATE
// ================================================================
const DB_KEY         = 'timetrack_pro_v3';
const LOGS_KEY       = 'timetrack_logs_v3';
const PAYSLIPS_KEY   = 'tt_payslips';
const MESSAGES_KEY   = 'tt_messages';
const TEMPLATES_KEY  = 'tt_schedule_templates';
const CLOCKIN_KEY    = 'tt_clockin_queue';
const CAL_NOTES_KEY  = 'tt_cal_notes';
const SHIFT_POOL_KEY = 'tt_shift_pool';

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
let savedPayslips       = JSON.parse(localStorage.getItem(PAYSLIPS_KEY))   || [];
let adminMessages       = JSON.parse(localStorage.getItem(MESSAGES_KEY))   || [];
let scheduleTemplates   = JSON.parse(localStorage.getItem(TEMPLATES_KEY))  || [];

// Migrate existing employees — add new fields if missing
employees.forEach(emp => {
    if (emp.vacationDaysLeft  === undefined) emp.vacationDaysLeft  = 25;
    if (emp.sickDaysUsed     === undefined) emp.sickDaysUsed     = 0;
    if (emp.vacationHistory  === undefined) emp.vacationHistory  = [];
    if (emp.sickHistory      === undefined) emp.sickHistory      = [];
    // Migrate absence arrays from strings to {date, comment} objects
    emp.vacationHistory = emp.vacationHistory.map(e => typeof e === 'string' ? { date: e, comment: '' } : e);
    emp.sickHistory     = emp.sickHistory.map(e => typeof e === 'string'     ? { date: e, comment: '' } : e);
    if (emp.phone            === undefined) emp.phone            = '';
    if (emp.email            === undefined) emp.email            = '';
    if (emp.address          === undefined) emp.address          = '';
    if (emp.postalCode       === undefined) emp.postalCode       = '';
    if (emp.city             === undefined) emp.city             = '';
    if (emp.personnummer     === undefined) emp.personnummer     = '';
    if (emp.vacationRequests  === undefined) emp.vacationRequests  = [];
    if (emp.certifications    === undefined) emp.certifications    = [];
    if (emp.startDate         === undefined) emp.startDate         = '';
    if (emp.availability      === undefined) emp.availability      = [];
    if (emp.swapRequests      === undefined) emp.swapRequests      = [];
    if (emp.notifications     === undefined) emp.notifications     = [];
    if (emp.lastLogin         === undefined) emp.lastLogin         = null;
    if (emp.vabDaysUsed       === undefined) emp.vabDaysUsed       = 0;
    if (emp.vabHistory        === undefined) emp.vabHistory        = [];
    emp.vabHistory = emp.vabHistory.map(e => typeof e === 'string' ? { date: e, comment: '' } : e);
    if (emp.department        === undefined) emp.department        = '';
    if (emp.position          === undefined) emp.position          = '';
    if (emp.defaultWeek       === undefined) emp.defaultWeek       = {};
    if (emp.loginHistory      === undefined) emp.loginHistory      = [];
    if (emp.emergencyName     === undefined) emp.emergencyName     = '';
    if (emp.emergencyPhone    === undefined) emp.emergencyPhone    = '';
    if (emp.employmentType    === undefined) emp.employmentType    = '';
    if (emp.documents         === undefined) emp.documents         = [];
    if (emp.profilePhoto      === undefined) emp.profilePhoto      = '';
    if (emp.salaryPayments    === undefined) emp.salaryPayments    = [];
    emp.workedHistory.forEach(s => {
        if (s.otHours      === undefined) s.otHours      = 0;
        if (s.breakMinutes === undefined) s.breakMinutes = 0;
        if (s.note         === undefined) s.note         = '';
    });
});

function saveData() {
    try {
        localStorage.setItem(DB_KEY,         JSON.stringify(employees));
        localStorage.setItem(LOGS_KEY,       JSON.stringify(logs));
        localStorage.setItem(MESSAGES_KEY,   JSON.stringify(adminMessages));
        localStorage.setItem(TEMPLATES_KEY,  JSON.stringify(scheduleTemplates));
    } catch (e) {
        console.error('Kunde inte spara data (localStorage fullt?):', e);
        showToast('⚠️ Kunde inte spara — lagringen kan vara full.', 'error');
    }
}
