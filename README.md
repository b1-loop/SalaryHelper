# ⏱️ TimeTrack Pro — Diamond Edition 💎

**Live demo:** https://b1-loop.github.io/SalaryHelper/

Ett komplett, webbaserat löne- och stämplingsverktyg byggt som en Single Page Application (SPA) med **multi-fil projektstruktur** (HTML + CSS + JS). Projektet är designat som en avancerad, klickbar prototyp (MVP) för kundpresentationer.

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
| **Färdig pass** | Klicka ✅ Färdig på ett planerat pass — OB, övertid och lön räknas ut automatiskt från schemalagda tider |
| **Automatisk OB-beräkning** | Sessionen delas upp i vanlig tid och OB-tid med 5-minutsupplösning — gränserna är konfigurerbara av admin |
| **Övertidsberäkning** | Timmar utöver den konfigurerbara gränsen (standard 8h/dag) flaggas som övertid och ger 1,5× lön |
| **Varning vid lång inloggningstid** | Toast-notis om man varit instämplad i över 10 timmar utan att stämpla ut |
| **Kommentar på arbetspass** | Valfri kommentarsruta dyker upp efter utstämpling (t.ex. "vikariat", "extra kvällsarbete") |
| **Rastlängd** | Rasttid (minuter) sparas per session och visas i historiken |
| **Frånvarohantering med kommentar** | Knappar för Sjukdom och Semester öppnar ett inline-formulär där man kan skriva en valfri orsak/kommentar innan man bekräftar |
| **Frånvarosaldo** | Semesterdagar kvar och sjukdagar visas direkt i stats-grid |
| **Inkomstgraf** | Grönt månadsdiagram (Chart.js) i arbetar-vyn som visar bruttolön per månad — döljs automatiskt om historik saknas |
| **Mina lönespecar** | Knapp som öppnar en modal med alla egna sparade lönespecifikationer (period, brutto och netto) |
| **Schemahantering** | Visa, lägg till och ta bort egna pass — listan sorteras alltid kronologiskt |
| **Kalendervy för schema** | Toggle-knapp för att växla mellan listvy och månadskalender |
| **Kopiera förra veckan** | Ett klick kopierar alla pass från förra veckan till motsvarande dagar denna vecka (hoppar över dubbletter) |
| **Duplicera pass** | 📋-knapp på varje pass fyller i formuläret med samma tider — byt bara datum och tryck Lägg till |
| **Återkommande pass** | Lägg till ett pass för en valbar veckodag under 4/8/12 veckor framåt med ett klick |
| **Autofyll datum** | Datumfältet vid nytt pass fylls automatiskt med dagens datum |
| **Skiftpåminnelse** | Browser-notis + toast om ett pass börjar inom 30 min (uppdateras var 60:e sekund) |
| **Lönespecifikation** | Bruttolön uppdelad på vanlig tid, OB och övertid. Progressiv skatteberäkning (kommunalskatt 31,49 % + statlig skatt 20 % på belopp över 46 000 kr/mån). Konfetti-animation vid öppning |
| **Skriv ut / Spara PDF** | Knapp i lönespecifikationen som öppnar utskriftsdialogen — allt utom specen döljs |
| **Min profil** | Anställda uppdaterar sin kontaktinformation (personnummer, telefon, e-post, gatuadress, postnummer, stad) — synlig för admin |
| **Byt PIN-kod** | Anställda kan byta sin egen PIN direkt från profilkortet (validerar gamla PIN, 4-siffror, unikhet) |

---

### 👔 Admin Dashboard

| Funktion | Beskrivning |
|----------|-------------|
| **Dashboard-statistik** | Fyra statistikrutor längst upp: lönekostnad för vald period, antal inloggade just nu, snittlön (kr/h) och totala timmar |
| **Kostnadsdiagram** | Interaktivt stapeldiagram (Chart.js) — vanlig lön vs OB-tillägg per anställd |
| **Löneöversikt med perioder** | Filtrera lönetabellen på *Allt*, *Denna vecka* eller *Denna månad* |
| **Sorterbar lönetabell** | Klicka på kolumnrubriker (Anställd, Vanlig tid, OB, Bruttolön) för att sortera stigande/fallande |
| **Sök anställda** | Fritextsök i lönetabellen |
| **Övertidsrapport** | Horisontellt stapeldiagram per anställd sorterat efter övertidstimmar — färgkodat (gul/orange/röd) efter allvarlighetsgrad, respekterar periofiltret |
| **Semesterplanering** | Delad månadskalender som visar alla anställdas schemalagda pass (blå), semesterdagar (grön 🏖️) och sjukdagar (röd 🤒) — navigera med ◀ ▶ |
| **Personalhantering** | Lägg till, redigera (namn, PIN, timlön, semesterdagar) och radera anställda |
| **Bekräftelsedialog** | Alla destruktiva åtgärder kräver bekräftelse via en anpassad modal — ingen `window.confirm()` |
| **Schema vs. faktisk tid** | I redigeringsmodalen visas jobbad tid bredvid schemalagd tid: `08:00–16:00 \| Jobbade: 7,5h (−0,5h)` |
| **Historikvy per anställd** | Månadsgrupperad historik med deltotaler — vanlig tid, OB, övertid, rast, kommentar och bruttolön |
| **Månadsdiagram i historik** | Blått stapeldiagram per anställd i historikmodalen visar lön per månad |
| **Datumfilter i historik** | Filtrera historikmodalen på valfritt datumintervall |
| **Korrigera arbetstid** | Admin kan lägga till, redigera eller ta bort enskilda arbetspass direkt i historikmodalen |
| **Frånvarohistorik** | Visar exakta datum + kommentarer för sjukdagar och semester i historikmodalen, med möjlighet att ta bort enskilda dagar |
| **Nollställ semesterdagar** | Återställ en anställds semesterdagar till 25 med ett klick (kräver bekräftelse) |
| **Rensa historik** | Knapp i redigeringsmodalen rensar all arbetstidshistorik och nollställer sjukdagar (semesterdagar rörs ej) |
| **Aktivitetslogg** | 100 senaste händelser, fritextsök i loggen, "Visa fler"-knapp (50 åt gången) |
| **CSV-export (löneöversikt)** | Exportera hela löneöversikten till en Excel-kompatibel CSV |
| **CSV-export (all historik)** | Exportera alla anställdas kompletta arbetshistorik som en samlad CSV-fil |
| **CSV-export (personalregister)** | Exportera alla anställdas kontaktuppgifter (personnummer, telefon, e-post, adress m.m.) som CSV |
| **CSV-export (per anställd)** | Ladda ner en enskild anställds historik som CSV direkt från historikmodalen |
| **Konfigurerbar övertidsgräns** | Admin ställer in efter hur många timmar/dag övertid räknas under ⚙️ Inställningar (standard: 8h) |
| **Anpassningsbara OB-tider** | Admin ställer in kväll- och morgongränser för OB under ⚙️ Inställningar (standard: 18:00 / 07:00) |
| **Företagsnamn** | Ange företagsnamn under ⚙️ Inställningar — visas i navigeringen och på lönespecen |
| **Lönespecifikationshistorik** | Varje gång en lönespec öppnas sparas en snapshot automatiskt — admin ser alla under ⚙️ Inställningar |
| **Säkerhetskopiering** | Ladda ner hela databasen (anställda, historik, loggar, lönespecar) som JSON, eller återställ från backup |

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
| **Arkitektur** | Multi-fil SPA — HTML, CSS och JS i separata filer |

---

## 🚀 Kom igång

Ingen byggprocess eller Node.js behövs.

1. Öppna `index.html` direkt i en modern webbläsare (Chrome, Edge, Firefox, Safari).
2. Logga in med en av PIN-koderna ovan.

**Mobil-demo:** Ladda upp projektet till GitHub Pages eller Vercel och öppna länken på telefonen. Välj *Dela → Lägg till på hemskärmen* för att installera som PWA.

---

## 🎭 Guide för demopresentation

1. **Inloggning** — Visa PIN-skärmen och knappsatsen. Ange `1234` för Alex.
2. **Klocka in** — Klicka *Klocka In (GPS)*. Notera plats-taggen i aktivitetsloggen.
3. **Rast** — Starta och avsluta en rast. Visa att rasttiden dras av från arbetstiden.
4. **Klocka ut** — Klicka *Stämpla Ut*. Visa OB/övertid i toasten, sedan kommentarsrutan.
5. **Färdig pass** — Visa ✅ Färdig-knappen på ett planerat pass och hur lönen räknas ut direkt.
6. **Frånvaro med kommentar** — Klicka *Sjuk* eller *Semester* och visa kommentarsrutan som dyker upp innan bekräftelse.
7. **Inkomstgraf** — Visa det gröna månadsdiagrammet i arbetar-vyn.
8. **Kopiera vecka** — Klicka *Kopiera förra veckan* och visa att passen dupliceras till denna vecka.
9. **Kalendervy** — Växla till kalendervy för schemat och tillbaka till lista.
10. **Lönespecifikation** — Klicka *Visa Lönespecifikation*. Visa konfettin, skatteuppdelningen och utskriftsknappen.
11. **Mina lönespecar** — Klicka *Mina lönespecar* och visa historiken.
12. **Byt PIN** — Scrolla till profilkortet och visa PIN-bytesformuläret.
13. **Admin-vy** — Logga ut och logga in som Admin (`9999`).
14. **Dashboard-statistik** — Visa de fyra statistikrutorna längst upp.
15. **Löneperiod** — Byt filter till *Denna månad* och visa hur totalsiffrorna ändras.
16. **Övertidsrapport** — Visa stapeldiagrammet med övertid per anställd.
17. **Semesterplanering** — Scrolla till kalenderkortet och navigera mellan månader.
18. **Historikvy** — Klicka *Historik* bredvid en anställd. Visa månadsgruppering, frånvarohistorik med kommentarer och månadsdiagrammet.
19. **Exportera** — Visa de tre CSV-exportknapparna: löneöversikt, all historik, personalregister.
20. **Inställningar** — Klicka ⚙️ Inställningar, sätt företagsnamn, justera OB-tider och övertidsgräns.
21. **Backup** — Klicka *Ladda ner backup* och visa den nedladdade JSON-filen.
22. **Offline** — Stäng av WiFi och visa att indikatorn byter till 🔴 Offline utan att appen slutar fungera.

---

## 🧹 Återställa testdata

Klistra in detta i webbläsarens konsol (F12 → Console) för att nollställa all data:

```js
['timetrack_pro_v3', 'timetrack_logs_v3', 'tt_payslips', 'tt_company', 'tt_ob_evening', 'tt_ob_morning', 'tt_ot_threshold'].forEach(k => localStorage.removeItem(k));
location.reload();
```

---

## 📁 Projektstruktur

```
index.html          ← HTML-markup + referenser till CSS och JS
README.md           ← Denna fil
css/
  style.css         ← All CSS (variabler, animationer, dark mode, kalender, @media print)
js/
  data.js           ← Global state, konstanter, localStorage-nycklar, datamigration
  utils.js          ← showToast, updateClock, aktivitetslogg, toggleDarkMode, nätverksstatus
  calculations.js   ← isOBTime, calculateOBSplit, getTaxBreakdown, getElapsedMs, getFilteredHistory
  worker.js         ← Arbetar-vy, clockIn/Out, toggleBreak, setStatus, schema, kalender, skiftpåminnelser, profil, PIN-byte
  admin.js          ← Admin-dashboard, lönetabell, sortering, övertidsrapport, semesterplanering, exportCSV, diagram
  modals.js         ← Alla modaler: lönespec, redigera, bekräfta, inställningar, historik, backup, mina lönespecar
  auth.js           ← PIN-login, inaktivitetstimeout (15 min), logout
```

Skripten laddas i rätt ordning i `index.html` (data → utils → calculations → worker → admin → modals → auth) så att alla globala variabler och funktioner finns tillgängliga vid behov. Ingen byggprocess eller bundler krävs — öppna `index.html` direkt i webbläsaren.
