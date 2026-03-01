# ⏱️ TimeTrack Pro — Diamond Edition 💎

**Live demo:** https://b1-loop.github.io/SalaryHelper/

Ett komplett, webbaserat löne- och stämplingsverktyg byggt som en Single Page Application (SPA) i **en enda HTML-fil**. Projektet är designat som en avancerad, klickbar prototyp (MVP) för kundpresentationer.

Kräver ingen backend eller databas — allt sparas i webbläsarens `localStorage` och fungerar helt offline. Förberedd som en PWA (Progressive Web App) och kan sparas på mobilens hemskärm.

---

## 🔑 Demo-inloggning

| Roll | PIN |
|------|-----|
| Admin | `9999` |
| Alex (Du) | `1234` |
| Sara Andersson | `5678` |

---

## ✨ Funktioner

### 👨‍🔧 Arbetarvyn

| Funktion | Beskrivning |
|----------|-------------|
| **Stämpelklocka** | Klocka in med GPS-tagg, starta/avsluta rast, stämpla ut |
| **Automatisk OB-beräkning** | Systemet delar automatiskt upp sessionen i vanlig tid och OB-tid (vardagar före 07:00 / efter 18:00, samt helger) med 5-minutsupplösning — ingen manuell OB-knapp behövs |
| **Övertidsberäkning** | Timmar utöver 8h per dag flaggas automatiskt som övertid och ger 1,5× lön |
| **Rastlängd** | Rasttid (minuter) sparas per session och visas i historiken |
| **Frånvarohantering** | Knappar för Sjukdom (räknar sjukdagar) och Semester (drar av semesterdagar) |
| **Frånvarosaldo** | Semesterdagar kvar och sjukdagar visas direkt i stats-grid |
| **Schemahantering** | Visa, lägg till och ta bort egna pass |
| **Skiftpåminnelse** | Browser-notis + toast om ett pass börjar inom 30 min (uppdateras var 60:e sekund) |
| **Lönespecifikation** | Bruttolön uppdelad på vanlig tid, OB och övertid. Progressiv skatteberäkning (kommunalskatt 31,49 % + statlig skatt 20 % på belopp över 46 000 kr/mån). Konfetti-animation vid öppning |
| **Skriv ut / Spara PDF** | Knapp i lönespecifikationen som öppnar utskriftsdialogen — allt utom specen döljs |

---

### 👔 Admin Dashboard

| Funktion | Beskrivning |
|----------|-------------|
| **Kostnadsdiagram** | Interaktivt stapeldiagram (Chart.js) — vanlig lön vs OB-tillägg per anställd |
| **Löneöversikt med perioder** | Filtrera lönetabellen på *Allt*, *Denna vecka* eller *Denna månad* |
| **Sök anställda** | Fritextsök i lönetabellen |
| **Personalhantering** | Lägg till, redigera (namn, PIN, timlön, semesterdagar) och radera anställda |
| **Bekräftelsedialog** | Alla destruktiva åtgärder kräver bekräftelse via en anpassad modal — ingen `window.confirm()` |
| **Schema vs. faktisk tid** | I redigeringsmodalen visas jobbad tid bredvid schemalagd tid: `08:00–16:00 \| Jobbade: 7,5h (−0,5h)` |
| **Återkommande schema** | Lägg till ett pass för varje valbar veckodag under 4/8/12 veckor framåt med ett klick |
| **Historikvy per anställd** | Knapp i lönetabellen öppnar en modal med dag-för-dag-historik: vanlig tid, OB, övertid, rast och bruttolön |
| **Rensa historik** | Knapp i redigeringsmodalen rensar all arbetstidshistorik och nollställer sjukdagar (semesterdagar rörs ej) — kräver bekräftelse |
| **Aktivitetslogg** | 100 senaste händelser, fritextsök i loggen, "Visa fler"-knapp (50 åt gången) |
| **CSV-export** | Exportera hela löneöversikten till en Excel-kompatibel CSV |
| **Företagsnamn** | Ange företagsnamn under ⚙️ Inställningar — visas i navigeringen och på lönespecen |
| **Lönespecifikationshistorik** | Varje gång en lönespec öppnas sparas en snapshot automatiskt. Admin kan se alla sparade specifikationer under ⚙️ Inställningar |
| **Säkerhetskopiering** | Ladda ner hela databasen (anställda, historik, loggar, lönespecar) som en JSON-fil, eller återställ från en tidigare backup |

---

### 🌐 System & UX

| Funktion | Beskrivning |
|----------|-------------|
| **Dark Mode / Light Mode** | Fullt stöd för mörkt tema, sparas i `localStorage` |
| **Korrekt utskrift i dark mode** | Lönespecen skrivs alltid ut med ljus bakgrund oavsett valt tema |
| **PIN-knappsats** | Visuellt numeriskt tangentbord på inloggningsskärmen — auto-skickar vid 4 siffror |
| **Enter-tangent** | Tryck Enter i PIN-fältet för att logga in |
| **Fel PIN-animation** | Inputfältet skakar och visar "Fel PIN-kod" i rött vid felaktig inloggning |
| **Inaktivitets-timeout** | Automatisk utloggning efter 15 minuters inaktivitet |
| **Offline-indikator** | Visar 🟢 Online / 🔴 Offline i navigeringen i realtid |
| **Toast-notiser** | Animerade notiser för all feedback — inga webbläsar-popups |
| **Levande klocka** | Systemtid uppdateras varje sekund |

---

## 🛠️ Teknisk stack

| Del | Teknik |
|-----|--------|
| **Frontend** | HTML5, CSS3 (CSS-variabler, `@keyframes`, `@media print`), Vanilla JS (ES6+) |
| **Databas** | `localStorage` — ingen server krävs |
| **Diagram** | [Chart.js](https://www.chartjs.org/) via CDN |
| **Konfetti** | [canvas-confetti](https://github.com/catdad/canvas-confetti) via CDN |
| **Arkitektur** | Single-file SPA — hela appen i `index.html` |

---

## 🚀 Kom igång

Ingen byggprocess eller Node.js behövs.

1. Öppna `index.html` direkt i en modern webbläsare (Chrome, Edge, Firefox, Safari).
2. Logga in med en av PIN-koderna ovan.

**Mobil-demo:** Ladda upp filen till GitHub Pages eller Vercel och öppna länken på telefonen. Välj *Dela → Lägg till på hemskärmen* för att installera som PWA.

---

## 🎭 Guide för demopresentation

1. **Inloggning** — Visa PIN-skärmen och knappsatsen. Ange `1234` för Alex.
2. **Klocka in** — Klicka *Klocka In (GPS)*. Notera plats-taggen i aktivitetsloggen.
3. **Rast** — Starta och avsluta en rast. Visa att rasttiden dras av från arbetstiden.
4. **Klocka ut** — Klicka *Stämpla Ut*. Visa att OB och övertid beräknas automatiskt i toasten.
5. **Lönespecifikation** — Klicka *Visa Lönespecifikation*. Visa konfettin, skatteuppdelningen och utskriftsknappen.
6. **Frånvaro** — Klicka *Semester* och visa att semesterdagssaldot minskar direkt.
7. **Admin-vy** — Logga ut och logga in som Admin (`9999`).
8. **Löneperiod** — Byt filter till *Denna månad* och visa hur totalsiffrorna ändras.
9. **Historikvy** — Klicka på *Historik*-knappen bredvid en anställd.
10. **Schema** — Öppna *Redigera* för en anställd, lägg till ett återkommande pass (t.ex. varje måndag i 4 veckor).
11. **Inställningar** — Klicka på ⚙️ Inställningar, sätt ett företagsnamn och visa att det dyker upp i navbaren och på lönespecen.
12. **Backup** — Klicka *Ladda ner backup* och visa den nedladdade JSON-filen.
13. **Offline** — Stäng av WiFi och visa att indikatorn byter till 🔴 Offline utan att appen slutar fungera.

---

## 🧹 Återställa testdata

Klistra in detta i webbläsarens konsol (F12 → Console) för att nollställa all data:

```js
['timetrack_pro_v3', 'timetrack_logs_v3', 'tt_payslips', 'tt_company'].forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## 📁 Projektstruktur

```
index.html          ← HTML-markup + referenser till CSS och JS
README.md           ← Denna fil
css/
  style.css         ← All CSS (variabler, animationer, dark mode, @media print)
js/
  data.js           ← Global state, konstanter, localStorage-nycklar, datamigration
  utils.js          ← showToast, updateClock, aktivitetslogg, toggleDarkMode, nätverksstatus
  calculations.js   ← isOBTime, calculateOBSplit, getTaxBreakdown, getElapsedMs, getFilteredHistory
  worker.js         ← Arbetar-vy, clockIn/Out, toggleBreak, setStatus, schema, skiftpåminnelser
  admin.js          ← Admin-dashboard, lönetabell, addEmployee, deleteEmployee, exportCSV, diagram
  modals.js         ← Alla modaler: lönespec, redigera, bekräfta, inställningar, historik, backup
  auth.js           ← PIN-login, inaktivitetstimeout (15 min), logout
```

Skripten laddas i rätt ordning i `index.html` (data → utils → calculations → worker → admin → modals → auth) så att alla globala variabler och funktioner finns tillgängliga vid behov. Ingen byggprocess eller bundler krävs — öppna `index.html` direkt i webbläsaren.
