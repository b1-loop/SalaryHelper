// ================================================================
// INTERNATIONALISERING (i18n) — Svenska / English
// ================================================================
let currentLang = localStorage.getItem('tt_lang') || 'sv';

const TRANSLATIONS = {
    sv: {
        // NAV
        nav_guide: '❓ Guide', nav_settings: '⚙️ Inställningar', nav_theme: '🌙 Tema',
        nav_logout: 'Logga ut', lang_toggle: '🇬🇧 EN',

        // LOGIN
        login_subtitle: 'Säker inloggning med personlig PIN.',
        login_btn: 'Logga in',

        // WORKER
        worker_title: 'Din stämpelklocka',
        worker_my_payslips: '📋 Mina lönespecar',
        worker_view_payslip: '🧾 Visa Lönespecifikation',

        // STATS
        stat_regular: 'Vanlig Tid', stat_ob: 'OB-Timmar', stat_ot: 'Övertid',
        stat_gross: 'Bruttolön', stat_vacation: 'Semesterdagar kvar',
        stat_sick: 'Sjukdagar', stat_payday: 'Dagar till lön',

        // STATUS CARD
        status_current: '⏰ Aktuell Status', status_label: 'Status:',

        // ACTION BUTTONS (used in JS)
        btn_clockin: '▶ Klocka In (GPS)', btn_clockout: '⏹ Stämpla Ut',
        btn_sick: '🤒 Sjuk', btn_leave: '🏖️ Ledighet',
        btn_return: '✅ Friskanmäl dig', btn_return_vac: '↩️ Avsluta semester',
        btn_break_start: '☕ Börja Rast', btn_break_end: '▶ Fortsätt Arbeta',

        // SESSION NOTE
        note_label: '💬 Kommentar till passet (valfritt)',
        btn_save_note: '💾 Spara', btn_skip: 'Hoppa över',

        // ABSENCE PROMPT
        btn_confirm: 'Bekräfta', btn_cancel_abs: 'Avbryt',

        // INCOME CHART
        chart_income: '📈 Inkomst per månad',

        // SCHEDULE CARD
        card_schedule: '📅 Mitt Schema', card_schedule_add: 'Lägg till nytt pass',
        btn_copy_schedule: '📋 Kopiera förra veckan',
        btn_add: 'Lägg till', btn_calendar: '📅 Kalender', btn_list: '📋 Lista',

        // PROFILE CARD
        card_profile: '👤 Min Profil',
        profile_desc: 'Din personliga information — visas för admin.',
        label_personnummer: 'Personnummer', label_phone: 'Telefon', label_email: 'E-post',
        label_address: 'Gatuadress', label_postal: 'Postnummer', label_city: 'Stad',
        label_emergency_name: 'Nödkontakt (namn)', label_emergency_phone: 'Nödkontakt (telefon)',
        btn_save_profile: '💾 Spara profil',
        pin_change_title: '🔑 Byt PIN-kod',
        label_current_pin: 'Nuvarande PIN', label_new_pin: 'Ny PIN', label_confirm_pin: 'Bekräfta ny PIN',
        btn_change_pin: '🔑 Byt PIN',

        // EMPLOYMENT CARD
        card_employment: '📋 Anställningsinformation', card_certs: '🎓 Mina Certifikat',

        // VACATION REQUEST
        card_vacation_req: '📝 Semesteransökan',
        label_from_date: 'Från datum', label_to_date: 'Till datum',
        label_reason: 'Anledning (valfritt)', btn_send_vacation: '📤 Skicka ansökan',

        // AVAILABILITY
        card_availability: '✋ Min Tillgänglighet',
        availability_desc: 'Markera dagar du kan jobba men inte är schemalagd — visas för admin i planeringskalendern.',
        btn_add_avail: '+ Lägg till',

        // SHIFT SWAP
        card_swap: '🔄 Byt Skift',
        swap_desc: 'Begär att ett av dina schemalagda pass ska överföras till en kollega. Admin godkänner bytet.',
        label_my_shift: 'Mitt pass (välj)', label_give_to: 'Ge passet till',
        label_swap_note: 'Notering (valfritt)', btn_send_swap: '📤 Skicka förfrågan',

        // MESSAGE
        card_message: '💬 Meddelande till Admin',
        message_desc: 'Skicka ett meddelande direkt till admin — t.ex. om du har frågor om lön, schema eller annat.',
        btn_send_msg: '📤 Skicka',

        // WEEKLY REPORT
        weekly_title: '📆 Veckorapport', weekly_day: 'Dag', weekly_hours: 'Timmar',
        weekly_ob: 'OB', weekly_pay: 'Lön', weekly_total: 'Totalt',
        weekly_no_work: '—',

        // ADMIN
        admin_title: 'Admin Dashboard',
        admin_stat_cost: 'Lönekostnad (period)', admin_stat_active: 'Inloggade just nu',
        admin_stat_avg: 'Snittlön', admin_stat_hours: 'Totala timmar (period)',
        admin_chart: '📊 Kostnadsfördelning',
        card_new_emp: '➕ Ny Anställd', label_name: 'Namn',
        label_pin_field: 'Personlig PIN (4 siffror)', label_wage: 'Timlön (kr)',
        btn_add_emp: 'Lägg till person',
        card_vacation_reqs: '📋 Semesteransökningar',
        card_swap_reqs: '🔄 Skiftbyten',
        card_messages: '💬 Meddelanden', btn_mark_read: 'Markera alla lästa',
        card_log: '⏱️ Aktivitetslogg',
        log_search_ph: 'Sök i logg...',
        btn_show_more: 'Visa fler',
        card_payroll: '💰 Löneöversikt',
        payroll_period: 'Löneperiod:',
        period_all: 'Allt', period_week: 'Denna vecka', period_month: 'Denna månad',
        emp_search_ph: 'Sök efter anställd...',
        col_employee: 'Anställd', col_status: 'Status', col_hours: 'Vanlig Tid',
        col_ob: 'OB', col_gross: 'Bruttolön', col_action: 'Åtgärd',
        card_overtime: '⚠️ Övertidsrapport',
        card_calendar: '📅 Semesterplanering & Schema',
        card_absence_stats: '📊 Frånvarostatistik',

        // PAYSLIP MODAL
        payslip_title: 'Lönespecifikation',
        payslip_period_label: 'Period:', payslip_name_label: 'Namn:',
        payslip_regular: 'Vanlig Arbetstid', payslip_ob: 'OB-Tillägg / Helg',
        payslip_ot: 'Övertid >8h/dag (× 50% tillägg á',
        payslip_gross: 'Bruttolön (Innan skatt)', payslip_kommunal: 'Kommunalskatt (31.49%)',
        payslip_statlig: 'Statlig skatt (20% på belopp över 46 000 kr/mån)',
        payslip_net: 'Nettolön (Att få ut)',
        btn_print: '🖨️ Skriv ut / Spara PDF', btn_close_payslip: 'Stäng Kvitto',

        // EDIT MODAL
        edit_title: 'Profil & Pass',
        label_vacation_days: 'Semesterdagar kvar', label_startdate: 'Anst. datum',
        btn_save_emp: 'Spara Grunduppgifter', btn_reset_vacation: '🔄 Återställ semester',
        btn_clear_history: '🗑️ Rensa historik',
        modal_schedule_title: '📅 Planerade Pass', label_add_manual: 'Lägg till pass manuellt',
        modal_cert_title: '🎓 Certifikat & Kompetenser',
        label_cert_name: 'Namn', label_cert_expiry: 'Utgångsdatum',
        label_recur: '🔄 Återkommande pass',

        // CONFIRM MODAL
        confirm_default_title: 'Bekräfta', confirm_cancel: 'Avbryt', confirm_ok: 'Bekräfta',

        // SETTINGS MODAL
        settings_title: '⚙️ Inställningar', label_company: 'Företagsnamn',
        settings_msg_heading: '📢 Meddelande till anställda',
        btn_save_settings: '💾 Spara inställningar',
        settings_ot: '⏱️ Övertidsgräns (h/dag)', settings_payday: '💰 Lönedatum (dag i månaden)',
        settings_ob: '⏰ OB-tider (vardagar)',
        label_ob_evening: 'OB börjar (kväll)', label_ob_morning: 'OB slutar (morgon)',
        settings_payslips: '📋 Sparade Lönespecar',
        settings_backup: '💾 Säkerhetskopiering',
        btn_download_backup: '📥 Ladda ner backup', btn_restore_backup: '📤 Återställ backup',

        // HISTORY MODAL
        history_filter: 'Filtrera:', btn_clear_filter: '✖ Rensa',
        col_date: 'Datum', col_clockin: 'In', col_clockout: 'Ut', col_break: 'Rast',
        col_regular: 'Vanlig', col_ob_h: 'OB', col_ot_h: 'ÖT', col_note: 'Kommentar', col_del: 'Radera',
        history_absence: '📋 Frånvarohistorik', add_session_title: '➕ Lägg till arbetspass manuellt',
        label_date: 'Datum', label_regular_h: 'Vanlig (h)', label_ob_h: 'OB (h)',
        label_ot_h: 'Övertid (h)', label_break_min: 'Rast (min)', label_comment: 'Kommentar',
        btn_add_session: 'Lägg till', btn_cancel: 'Avbryt',

        // MY PAYSLIPS MODAL
        my_payslips_title: '📋 Mina Lönespecar',
        my_payslips_desc: 'Öppna Lönespecifikation för att spara aktuell period.',

        // TOUR
        tour_prev: '← Bakåt', tour_skip: 'Hoppa över', tour_next: 'Nästa →',
        tour_emp_1_title: '▶ Stämpla in och ut',
        tour_emp_1_text: 'Klocka in när du börjar jobba och klocka ut när du slutar. Härifrån markerar du dig också som sjuk eller tar ut semester.',
        tour_emp_2_title: '📊 Din statistik',
        tour_emp_2_text: 'Se dina jobbade timmar, OB-tid, övertid, bruttolön, kvarvarande semesterdagar och nedräkning till nästa lönedag.',
        tour_emp_3_title: '📅 Ditt schema',
        tour_emp_3_text: 'Dina inlagda arbetspass visas här. Klicka "Kalender" för månadsöversikt eller lägg till nya pass med formuläret nedan.',
        tour_emp_4_title: '🎓 Anställningsinformation',
        tour_emp_4_text: 'Dina certifikat, kompetenser och anställningsdatum visas här. Admin registrerar och uppdaterar dessa.',
        tour_emp_5_title: '📝 Semesteransökan',
        tour_emp_5_text: 'Fyll i datum och skicka en ansökan till admin. Statusen (Väntar / Godkänd / Nekad) visas direkt i listan nedan formuläret.',
        tour_emp_6_title: '👤 Din profil',
        tour_emp_6_text: 'Håll din kontaktinformation uppdaterad — den är synlig för admin. Längre ned i kortet kan du byta PIN-kod.',
        tour_adm_1_title: '📊 Dashboard',
        tour_adm_1_text: 'Snabb översikt: total lönekostnad, antal inloggade just nu, snittlön per timme och totala timmar — allt för vald period.',
        tour_adm_2_title: '📅 Löneperiod',
        tour_adm_2_text: 'Filtrera all data på Allt, Denna vecka eller Denna månad. Lönetabell, diagram och rapport uppdateras direkt.',
        tour_adm_3_title: '💰 Lönetabell',
        tour_adm_3_text: 'Komplett löneöversikt för alla anställda. Sök, sortera på valfri kolumn, klicka "Historik" för att se och redigera enskilda arbetspass.',
        tour_adm_4_title: '⏰ Övertidsrapport',
        tour_adm_4_text: 'Stapeldiagram som visar vem som jobbat mest övertid. Grön = lite, orange = måttlig, röd = hög övertid.',
        tour_adm_5_title: '🗓️ Semesterplanering',
        tour_adm_5_text: 'Månadskalender med alla anställdas scheman och beviljade semestrar. Navigera månader för att planera beläggning.',
        tour_adm_6_title: '📋 Semesteransökningar',
        tour_adm_6_text: 'Ansökningar från anställda samlas här. Skriv en valfri kommentar och godkänn eller neka — dagarna dras automatiskt.',
        tour_adm_7_title: '🎓 Certifikat-varningar',
        tour_adm_7_text: 'Certifikat som löper ut inom 60 dagar visas som påminnelser. Grön = ok, orange = snart, röd = utgånget.',
        tour_adm_8_title: '⚙️ Inställningar',
        tour_adm_8_text: 'Konfigurera företagsnamn, lönedatum, OB-tider, övertidsgräns och ett meddelande som visas för alla anställda vid inloggning.',

        // RECURRING DAY NAMES
        day_mon: 'Måndag', day_tue: 'Tisdag', day_wed: 'Onsdag', day_thu: 'Torsdag',
        day_fri: 'Fredag', day_sat: 'Lördag', day_sun: 'Söndag',
    },
    en: {
        // NAV
        nav_guide: '❓ Guide', nav_settings: '⚙️ Settings', nav_theme: '🌙 Theme',
        nav_logout: 'Log out', lang_toggle: '🇸🇪 SV',

        // LOGIN
        login_subtitle: 'Secure login with personal PIN.',
        login_btn: 'Log in',

        // WORKER
        worker_title: 'Your time clock',
        worker_my_payslips: '📋 My payslips',
        worker_view_payslip: '🧾 View Payslip',

        // STATS
        stat_regular: 'Regular Hours', stat_ob: 'OB Hours', stat_ot: 'Overtime',
        stat_gross: 'Gross Pay', stat_vacation: 'Vacation days left',
        stat_sick: 'Sick days', stat_payday: 'Days to payday',

        // STATUS CARD
        status_current: '⏰ Current Status', status_label: 'Status:',

        // ACTION BUTTONS
        btn_clockin: '▶ Clock In (GPS)', btn_clockout: '⏹ Clock Out',
        btn_sick: '🤒 Sick', btn_leave: '🏖️ Vacation',
        btn_return: '✅ Return to work', btn_return_vac: '↩️ End vacation',
        btn_break_start: '☕ Start Break', btn_break_end: '▶ Continue Working',

        // SESSION NOTE
        note_label: '💬 Note for this shift (optional)',
        btn_save_note: '💾 Save', btn_skip: 'Skip',

        // ABSENCE PROMPT
        btn_confirm: 'Confirm', btn_cancel_abs: 'Cancel',

        // INCOME CHART
        chart_income: '📈 Income per month',

        // SCHEDULE CARD
        card_schedule: '📅 My Schedule', card_schedule_add: 'Add new shift',
        btn_copy_schedule: '📋 Copy last week',
        btn_add: 'Add', btn_calendar: '📅 Calendar', btn_list: '📋 List',

        // PROFILE CARD
        card_profile: '👤 My Profile',
        profile_desc: 'Your personal information — visible to admin.',
        label_personnummer: 'Personal ID number', label_phone: 'Phone', label_email: 'Email',
        label_address: 'Street address', label_postal: 'Postal code', label_city: 'City',
        label_emergency_name: 'Emergency contact (name)', label_emergency_phone: 'Emergency contact (phone)',
        btn_save_profile: '💾 Save profile',
        pin_change_title: '🔑 Change PIN',
        label_current_pin: 'Current PIN', label_new_pin: 'New PIN', label_confirm_pin: 'Confirm new PIN',
        btn_change_pin: '🔑 Change PIN',

        // EMPLOYMENT CARD
        card_employment: '📋 Employment info', card_certs: '🎓 My Certificates',

        // VACATION REQUEST
        card_vacation_req: '📝 Vacation Request',
        label_from_date: 'From date', label_to_date: 'To date',
        label_reason: 'Reason (optional)', btn_send_vacation: '📤 Send request',

        // AVAILABILITY
        card_availability: '✋ My Availability',
        availability_desc: 'Mark days you can work but are not scheduled — shown to admin in the planning calendar.',
        btn_add_avail: '+ Add',

        // SHIFT SWAP
        card_swap: '🔄 Swap Shift',
        swap_desc: 'Request to transfer one of your scheduled shifts to a colleague. Admin approves the swap.',
        label_my_shift: 'My shift (select)', label_give_to: 'Give shift to',
        label_swap_note: 'Note (optional)', btn_send_swap: '📤 Send request',

        // MESSAGE
        card_message: '💬 Message to Admin',
        message_desc: 'Send a message directly to admin — e.g. questions about pay, schedule or other matters.',
        btn_send_msg: '📤 Send',

        // WEEKLY REPORT
        weekly_title: '📆 Weekly Report', weekly_day: 'Day', weekly_hours: 'Hours',
        weekly_ob: 'OB', weekly_pay: 'Pay', weekly_total: 'Total',
        weekly_no_work: '—',

        // ADMIN
        admin_title: 'Admin Dashboard',
        admin_stat_cost: 'Payroll cost (period)', admin_stat_active: 'Currently logged in',
        admin_stat_avg: 'Average wage', admin_stat_hours: 'Total hours (period)',
        admin_chart: '📊 Cost breakdown',
        card_new_emp: '➕ New Employee', label_name: 'Name',
        label_pin_field: 'Personal PIN (4 digits)', label_wage: 'Hourly wage (kr)',
        btn_add_emp: 'Add person',
        card_vacation_reqs: '📋 Vacation Requests',
        card_swap_reqs: '🔄 Shift swaps',
        card_messages: '💬 Messages', btn_mark_read: 'Mark all read',
        card_log: '⏱️ Activity log',
        log_search_ph: 'Search log...',
        btn_show_more: 'Show more',
        card_payroll: '💰 Payroll overview',
        payroll_period: 'Pay period:',
        period_all: 'All', period_week: 'This week', period_month: 'This month',
        emp_search_ph: 'Search employee...',
        col_employee: 'Employee', col_status: 'Status', col_hours: 'Regular',
        col_ob: 'OB', col_gross: 'Gross pay', col_action: 'Action',
        card_overtime: '⚠️ Overtime report',
        card_calendar: '📅 Vacation planning & Schedule',
        card_absence_stats: '📊 Absence statistics',

        // PAYSLIP MODAL
        payslip_title: 'Payslip',
        payslip_period_label: 'Period:', payslip_name_label: 'Name:',
        payslip_regular: 'Regular working hours', payslip_ob: 'OB supplement / Weekend',
        payslip_ot: 'Overtime >8h/day (× 50% supplement á',
        payslip_gross: 'Gross pay (before tax)', payslip_kommunal: 'Municipal tax (31.49%)',
        payslip_statlig: 'State tax (20% on amount over 46 000 kr/month)',
        payslip_net: 'Net pay (to receive)',
        btn_print: '🖨️ Print / Save PDF', btn_close_payslip: 'Close',

        // EDIT MODAL
        edit_title: 'Profile & Shifts',
        label_vacation_days: 'Vacation days left', label_startdate: 'Hire date',
        btn_save_emp: 'Save basic info', btn_reset_vacation: '🔄 Reset vacation',
        btn_clear_history: '🗑️ Clear history',
        modal_schedule_title: '📅 Planned Shifts', label_add_manual: 'Add shift manually',
        modal_cert_title: '🎓 Certificates & Skills',
        label_cert_name: 'Name', label_cert_expiry: 'Expiry date',
        label_recur: '🔄 Recurring shifts',

        // CONFIRM MODAL
        confirm_default_title: 'Confirm', confirm_cancel: 'Cancel', confirm_ok: 'Confirm',

        // SETTINGS MODAL
        settings_title: '⚙️ Settings', label_company: 'Company name',
        settings_msg_heading: '📢 Message to employees',
        btn_save_settings: '💾 Save settings',
        settings_ot: '⏱️ Overtime threshold (h/day)', settings_payday: '💰 Payday (day of month)',
        settings_ob: '⏰ OB hours (weekdays)',
        label_ob_evening: 'OB starts (evening)', label_ob_morning: 'OB ends (morning)',
        settings_payslips: '📋 Saved payslips',
        settings_backup: '💾 Backup',
        btn_download_backup: '📥 Download backup', btn_restore_backup: '📤 Restore backup',

        // HISTORY MODAL
        history_filter: 'Filter:', btn_clear_filter: '✖ Clear',
        col_date: 'Date', col_clockin: 'In', col_clockout: 'Out', col_break: 'Break',
        col_regular: 'Regular', col_ob_h: 'OB', col_ot_h: 'OT', col_note: 'Note', col_del: 'Delete',
        history_absence: '📋 Absence history', add_session_title: '➕ Add work session manually',
        label_date: 'Date', label_regular_h: 'Regular (h)', label_ob_h: 'OB (h)',
        label_ot_h: 'Overtime (h)', label_break_min: 'Break (min)', label_comment: 'Comment',
        btn_add_session: 'Add', btn_cancel: 'Cancel',

        // MY PAYSLIPS MODAL
        my_payslips_title: '📋 My Payslips',
        my_payslips_desc: 'Open Payslip to save the current period.',

        // TOUR
        tour_prev: '← Back', tour_skip: 'Skip', tour_next: 'Next →',
        tour_emp_1_title: '▶ Clock in and out',
        tour_emp_1_text: 'Clock in when you start work and clock out when you finish. You can also mark yourself as sick or take vacation from here.',
        tour_emp_2_title: '📊 Your statistics',
        tour_emp_2_text: 'See your worked hours, OB time, overtime, gross pay, remaining vacation days, and countdown to your next payday.',
        tour_emp_3_title: '📅 Your schedule',
        tour_emp_3_text: 'Your scheduled shifts are shown here. Click "Calendar" for a monthly overview or add new shifts using the form below.',
        tour_emp_4_title: '🎓 Employment info',
        tour_emp_4_text: 'Your certificates, skills, and employment date are shown here. Admin registers and updates these.',
        tour_emp_5_title: '📝 Vacation request',
        tour_emp_5_text: 'Enter dates and send a request to admin. The status (Pending / Approved / Rejected) is shown in the list below the form.',
        tour_emp_6_title: '👤 Your profile',
        tour_emp_6_text: 'Keep your contact information up to date — it is visible to admin. Further down in the card you can change your PIN.',
        tour_adm_1_title: '📊 Dashboard',
        tour_adm_1_text: 'Quick overview: total payroll cost, how many are currently logged in, average hourly wage and total hours — all for the selected period.',
        tour_adm_2_title: '📅 Pay period',
        tour_adm_2_text: 'Filter all data by All, This week, or This month. The payroll table, chart and report update immediately.',
        tour_adm_3_title: '💰 Payroll table',
        tour_adm_3_text: 'Complete payroll overview for all employees. Search, sort by any column, click "History" to view and edit individual work sessions.',
        tour_adm_4_title: '⏰ Overtime report',
        tour_adm_4_text: 'Bar chart showing who has worked the most overtime. Green = low, orange = moderate, red = high overtime.',
        tour_adm_5_title: '🗓️ Vacation planning',
        tour_adm_5_text: 'Monthly calendar with all employees\' schedules and approved vacations. Navigate months to plan staffing.',
        tour_adm_6_title: '📋 Vacation requests',
        tour_adm_6_text: 'Requests from employees are collected here. Write an optional comment and approve or reject — days are deducted automatically.',
        tour_adm_7_title: '🎓 Certificate warnings',
        tour_adm_7_text: 'Certificates expiring within 60 days are shown as reminders. Green = ok, orange = soon, red = expired.',
        tour_adm_8_title: '⚙️ Settings',
        tour_adm_8_text: 'Configure company name, payday, OB hours, overtime threshold and a message shown to all employees on login.',

        // RECURRING DAY NAMES
        day_mon: 'Monday', day_tue: 'Tuesday', day_wed: 'Wednesday', day_thu: 'Thursday',
        day_fri: 'Friday', day_sat: 'Saturday', day_sun: 'Sunday',
    }
};

function t(key) {
    return (TRANSLATIONS[currentLang] || TRANSLATIONS.sv)[key] || key;
}

function getLangLocale() {
    return currentLang === 'en' ? 'en-GB' : 'sv-SE';
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = t(el.dataset.i18n);
        if (val) el.innerText = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const val = t(el.dataset.i18nPh);
        if (val) el.placeholder = val;
    });
    // Recurring day names
    const dayMap = { 1: 'day_mon', 2: 'day_tue', 3: 'day_wed', 4: 'day_thu', 5: 'day_fri', 6: 'day_sat', 0: 'day_sun' };
    const recurSel = document.getElementById('modal-recur-day');
    if (recurSel) {
        Array.from(recurSel.options).forEach(opt => {
            const key = dayMap[opt.value];
            if (key) opt.text = t(key);
        });
    }
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'sv';
    // Update lang button
    const btn = document.getElementById('lang-btn');
    if (btn) btn.innerText = t('lang_toggle');
}

function toggleLanguage() {
    currentLang = currentLang === 'sv' ? 'en' : 'sv';
    localStorage.setItem('tt_lang', currentLang);
    applyTranslations();
    // Re-render dynamic views
    if (currentUser?.role === 'admin') loadAdminData();
    else if (currentUser) loadWorkerView();
}
