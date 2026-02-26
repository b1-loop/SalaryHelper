live-demo: https://b1-loop.github.io/SalaryHelper/

⏱️ TimeTrack Pro - MVP (Diamond Edition) 💎
Ett komplett, webbaserat löne- och stämplingsverktyg byggt som en Single Page Application (SPA) i en enda HTML-fil. Projektet är designat för att fungera som en avancerad, klickbar prototyp (MVP) för kundpresentationer.

Applikationen kräver ingen backend eller databas för att demonstreras, utan använder webbläsarens localStorage för att spara data (timmar, scheman och personal) mellan sessioner. Den är dessutom förberedd som en PWA (Progressive Web App), vilket innebär att den kan sparas på mobilens hemskärm och fungera som en riktig app.

✨ Huvudfunktioner
Applikationen är uppdelad i två huvudvyer med rollbaserad åtkomst (PIN-skyddad demoinloggning):

👨‍🔧 För Arbetaren (Min Vy)
Avancerad Stämpelklocka: Klocka in (med GPS-spårning/simulering), ta rast, och klocka ut (både vanlig tid och OB-tid).

Frånvarohantering: Knappar för att snabbt anmäla Sjukdom eller Semester.

Schemahantering: Arbetaren kan se sina inlagda pass och själv lägga till nya pass.

Lönespecifikation (Kvitto): Ett digitalt kvitto som visar uträknad bruttolön baserat på vanliga timmar och OB-timmar. Inkluderar en konfetti-effekt (Gamification) vid öppning!

Realtidsstatistik: Visar direkt hur många timmar som jobbats och vad timlönen ligger på.

👔 För Administratören (Admin Dashboard)
Grafisk Översikt: Ett interaktivt stapeldiagram (Chart.js) som visualiserar lönekostnader fördelat på vanliga timmar och OB-tillägg.

Personalhantering: Lägg till ny personal, redigera befintlig (namn, lön) och radera.

Schemaläggning (Modal): Klicka på en anställd för att se och redigera just den personens schema och pass.

Aktivitetslogg: Realtidslogg som visar exakt när personal stämplar in/ut, tar rast eller blir sjuka (inkluderar platstaggar).

Sök & Filtrera: Snabbt sökfält för att filtrera lönetabellen.

CSV Export: Möjlighet att exportera hela löneöversikten till en CSV-fil som kan öppnas i Excel för vidare bokföring.

🌐 System & UX (Gemensamt)
Dark Mode / Light Mode: Fullt stöd för mörkt tema som sparas i användarens inställningar.

Offline-stöd (Indikator): Systemet känner av om användaren förlorar internetuppkopplingen och informerar om att systemet nu sparar datan lokalt tills nätverket är tillbaka.

Toast-notiser: Snygga animerade notiser istället för tråkiga webbläsar-popups.

Levande klocka: En realtidsklocka som följer systemets tid.

🛠️ Teknisk Stack
Frontend: Ren HTML5, CSS3 (med CSS-variabler för theming) och Vanilla JavaScript (ES6+).

Databas: Inbyggd localStorage i webbläsaren.

Externa Bibliotek (laddas via CDN):

Chart.js - För kostnadsdiagrammet i Admin-vyn.

Canvas Confetti - För gamification-effekten på lönekvittot.

🚀 Hur man kör projektet (Kom igång)
Eftersom hela projektet ligger i en enda fil behövs ingen byggprocess, Node.js eller webbserver.

Ladda ner eller skapa filen index.html.

Dubbelklicka på filen för att öppna den i valfri modern webbläsare (Chrome, Safari, Edge, Firefox).

För mobil-demo: Skicka HTML-filen (eller en länk om du lägger upp den på t.ex. GitHub Pages/Vercel) till din telefon, öppna i webbläsaren och välj "Dela -> Lägg till på hemskärmen".

🎭 Guide för Demopresentation
När du demonstrerar systemet för kund, följ detta flöde för bäst effekt:

Inloggning: Möt kunden med startskärmen. Berätta att systemet har säker inloggning. PIN-koden för demon är: 1234. Skriv in detta och välj roll.

Arbetarvyn (Klocka in): Visa den responsiva designen. Klicka på "Klocka In (GPS)". Notera webbläsarens platsförfrågan och den gröna Toast-notisen.

Konfetti: Klicka på "Visa Lönespecifikation" och låt kunden överraskas av konfettiregnet och det tydliga kvittot.

Offline-läge: Stäng av din dators WiFi/Nätverk manuellt. Peka på statusindikatorn högst upp som byter från 🟢 Online till 🔴 Offline (Lokalt). Förklara att arbetare i miljöer utan täckning fortfarande kan använda systemet. Sätt på WiFi igen och visa hur den slår tillbaka.

Adminvyn: Logga ut och logga in som Admin (1234).

Hantera personal: Klicka på namnet på en av de anställda (t.ex. "Sara Andersson") i listan för att öppna redigeringsläget och ändra hennes pass.

Exportera Data: Avsluta med att klicka på "Ladda ner CSV" för att visa att datan är redo för ekonomiavdelningen.

🧹 Återställa Data
Om du har lagt in massa test-data inför en presentation och vill "städa" systemet:

Logga in.

Skriv in följande i webbläsarens utvecklarkonsol (F12 -> Console) och tryck Enter:
localStorage.removeItem('mvp_pro_employees'); localStorage.removeItem('mvp_pro_logs'); location.reload();

(Alternativt kan du bygga in en dold "Rensa"-knapp i koden, men konsolen är säkrast för att undvika att klicka fel under en live-demo).
