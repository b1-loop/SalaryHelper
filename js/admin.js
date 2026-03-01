// ================================================================
// ADMIN-VY & LÖNEPERIODER
// ================================================================
function loadAdminData() {
    const tbody = document.getElementById('payroll-body'); tbody.innerHTML = '';
    const chartLabels = [], chartRegularPay = [], chartOBPay = [];

    renderLogs();

    employees.filter(e => e.role !== 'admin').forEach(emp => {
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

    employees.push({ id: Date.now().toString(), name, pin, role: "worker", wage, status: "Utloggad", activeSession: null, workedHistory: [], schedule: [], vacationDaysLeft: 25, sickDaysUsed: 0 });
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
