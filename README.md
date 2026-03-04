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
| **Friskanmälan / Avsluta semester** | När status är Sjuk visas "✅ Friskanmäl dig" och när status är Semester visas "✅ Avsluta semester" — ett klick återställer till Utloggad |
| **Semesteransökan** | Anställda skickar en ansökan (datum + anledning) och ser statusen (Väntar/Godkänd/Nekad) direkt i vyn |
| **Inloggningsmeddelande** | Admin-meddelande visas som en lila banner när anställda loggar in — stängs per session, dyker upp igen om meddelandet ändras |
| **Lönedag-nedräkning** | "Dagar till lön"-ruta i stats-grid räknar ned till konfigurerat lönedatum. Visar 🎉 Idag! på lönedagen |
| **Anställningsinformation** | Visar anställningsdatum och beräknad tjänstetid (X år Y mån) i ett eget kort |
| **Mina certifikat** | Anställda ser sina certifikat och kompetenser (registrerade av admin) med utgångsdatum och färgkodad status |
| **Tillgänglighetsmarkering** | Markera dagar du kan jobba men inte är schemalagd — visas för admin i planeringskalendern som ✋-markeringar |
| **Skiftbyte** | Välj ett kommande pass och en kollega och skicka en bytesförfrågan — admin godkänner och passet flyttas automatiskt |
| **Interaktiv guide** | ❓ Guide-knapp i navigeringen startar en steg-för-steg genomgång av alla funktioner — startar automatiskt vid första inloggning |

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
| **Semesterplanering** | Delad månadskalender som visar alla anställdas schemalagda pass (blå), semesterdagar (grön 🏖️), sjukdagar (röd 🤒) och tillgänglighetsmarkeringar (gul ✋) — navigera med ◀ ▶ |
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
| **Semesteransökningar** | Admin ser alla väntande ansökningar (med antal i rubriken), kan skriva en kommentar och godkänna eller neka — godkännande drar dagarna automatiskt och fyller i semesterhistoriken |
| **Certifikat & kompetenser** | Admin lägger till certifikat med utgångsdatum per anställd — färgkodat grön/orange/röd. Varningskort visar alla certifikat som löper ut inom 60 dagar |
| **Anställningsdatum** | Admin registrerar startdatum per anställd — ingår i personalregister-CSV |
| **Inloggningsmeddelande** | Admin skriver ett meddelande i ⚙️ Inställningar som visas som banner för alla anställda vid nästa inloggning |
| **Lönedatum** | Admin konfigurerar lönedagen (1–31) under ⚙️ Inställningar — styr anställdas nedräkning |
| **Konfigurerbar övertidsgräns** | Admin ställer in efter hur många timmar/dag övertid räknas under ⚙️ Inställningar (standard: 8h) |
| **Anpassningsbara OB-tider** | Admin ställer in kväll- och morgongränser för OB under ⚙️ Inställningar (standard: 18:00 / 07:00) |
| **Företagsnamn** | Ange företagsnamn under ⚙️ Inställningar — visas i navigeringen och på lönespecen |
| **Lönespecifikationshistorik** | Varje gång en lönespec öppnas sparas en snapshot automatiskt — admin ser alla under ⚙️ Inställningar |
| **Säkerhetskopiering** | Ladda ner hela databasen (anställda, historik, loggar, lönespecar) som JSON, eller återställ från backup |
| **Frånvarostatistik** | Donut-diagram som visar totalt antal jobbade pass, sjukdagar och semesterdagar för alla anställda |
| **Skiftbyten** | Admin ser alla väntande skiftbytesförfrågningar, godkänner (passet flyttas automatiskt i schemat) eller nekar |

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
| **Interaktiv guide** | 4-panelsspotlight med steg-för-steg tooltip — 6 steg för anställda, 8 för admin. Auto-start vid första inloggning, manuell start via ❓ Guide i navigeringen |

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
12. **Lönedag** — Visa nedräkningen "Dagar till lön" i stats-griden.
13. **Friskanmäl** — Klicka *Sjuk*, visa bekräftelse-prompten, sedan visa att "✅ Friskanmäl dig"-knappen visas och återställer statusen.
14. **Semesteransökan** — Scrolla till ansökningskortet, fyll i datum och anledning och skicka in.
15. **Certifikat** — Visa det egna certifikat-kortet med färgkodad statusindikator.
16. **Tillgänglighet** — Scrolla till "Min Tillgänglighet", lägg till ett datum och visa att det sparas.
17. **Skiftbyte** — Gå till "Byt Skift", välj ett pass och en kollega och skicka förfrågan.
18. **Byt PIN** — Scrolla till profilkortet och visa PIN-bytesformuläret.
19. **Admin-vy** — Logga ut och logga in som Admin (`9999`).
20. **Inloggningsmeddelande** — Öppna ⚙️ Inställningar, skriv ett meddelande, spara. Logga in som worker och visa bannern.
21. **Dashboard-statistik** — Visa de fyra statistikrutorna längst upp.
22. **Semesteransökningar** — Visa kortet med väntande ansökningar, godkänn en med kommentar.
23. **Skiftbyten** — Visa kortet med väntande skiftbytesförfrågningar och godkänn ett.
24. **Frånvarostatistik** — Visa donut-diagrammet med jobbade pass, sjukdagar och semesterdagar.
25. **Certifikat-varningar** — Visa varningskortet för certifikat som snart löper ut.
26. **Löneperiod** — Byt filter till *Denna månad* och visa hur totalsiffrorna ändras.
27. **Övertidsrapport** — Visa stapeldiagrammet med övertid per anställd.
28. **Semesterplanering** — Scrolla till kalenderkortet, navigera månader och visa ✋-markeringar för tillgänglighet.
29. **Historikvy** — Klicka *Historik* bredvid en anställd. Visa månadsgruppering, frånvarohistorik med kommentarer och månadsdiagrammet.
30. **Exportera** — Visa de tre CSV-exportknapparna: löneöversikt, all historik, personalregister (inkl. anst.datum).
31. **Inställningar** — Visa lönedatum, OB-tider, övertidsgräns och företagsnamn.
32. **Backup** — Klicka *Ladda ner backup* och visa den nedladdade JSON-filen.
33. **Offline** — Stäng av WiFi och visa att indikatorn byter till 🔴 Offline utan att appen slutar fungera.

---

## 🧹 Återställa testdata

Klistra in detta i webbläsarens konsol (F12 → Console) för att nollställa all data:

```js
['timetrack_pro_v3', 'timetrack_logs_v3', 'tt_payslips', 'tt_company', 'tt_ob_evening', 'tt_ob_morning', 'tt_ot_threshold', 'tt_payday', 'tt_admin_message'].forEach(k => localStorage.removeItem(k));
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
  worker.js         ← Arbetar-vy, clockIn/Out, schema, kalender, profil, PIN-byte, semesteransökan, tillgänglighet, skiftbyte, certifikat, frånvaro, lönedag
  admin.js          ← Admin-dashboard, lönetabell, sortering, övertidsrapport, semesterplanering, frånvarostatistik, skiftbyten, certifikat-varningar, semesteransökningar, exportCSV, diagram
  modals.js         ← Alla modaler: lönespec, redigera, bekräfta, inställningar, historik, backup, certifikat, mina lönespecar
  auth.js           ← PIN-login, inaktivitetstimeout (15 min), logout
  tour.js           ← Interaktiv guide med 4-panelsspotlight, separata steg för anställda och admin
```

Skripten laddas i rätt ordning i `index.html` (data → utils → calculations → worker → admin → modals → auth) så att alla globala variabler och funktioner finns tillgängliga vid behov. Ingen byggprocess eller bundler krävs — öppna `index.html` direkt i webbläsaren.
