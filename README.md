# Lönekontor
1. Arbetar-vyn (Worker Dashboard)
Detta är det första arbetaren ser i sin telefon eller på datorn.

Stämpelklocka: Två stora, tydliga knappar för "Klocka In" och "Klocka Ut". Kanske en statusindikator som visar "Du är just nu: Inloggad".

Tidrapport: En enkel lista eller tabell som visar dagens och veckans arbetade timmar.

Mitt Schema: En liten sektion som visar kommande arbetspass (t.ex. "Måndag: 08:00 - 17:00").

2. Admin-vyn (Admin Dashboard)
Här loggar chefen in för att få överblick inför löning.

Översiktsvy: En lista/tabell över alla anställda.

Löneberäkning: Kolumner som visar: Namn, Arbetade timmar (denna månad), Timlön, och Total lön att utbetala.

Aktivitetslogg: Vem som är inloggad just nu och exakta tider de stämplat in och ut.

Vår tekniska plan (Steg-för-steg)
Eftersom vi vill ha ut detta snabbt idag, föreslår jag att vi bygger allt i en och samma HTML-fil (Single Page-känsla), men vi använder JavaScript och CSS för att "dölja" och "visa" antingen Arbetar-vyn eller Admin-vyn beroende på vad man klickar på i menyn. Det gör det superenkelt att visa för kunden utan att ladda om sidan.

Steg 1: Sätta upp HTML-skelettet och en enkel navigeringsmeny (Byt mellan "Arbetare" och "Admin").

Steg 2: Bygga UI:t för Arbetar-vyn med stämpelklockan och schemat.

Steg 3: Bygga UI:t för Admin-vyn med lönetabellen.

Steg 4: Lägga till lite CSS för att göra det snyggt, modernt och mobilanpassat (så det ser professionellt ut för kunden).

Steg 5: Koppla på JavaScript så att knapparna "fungerar" visuellt med vår låtsasdata.
