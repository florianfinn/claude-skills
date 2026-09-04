# Wegweiser — die Karte über allem

*(Beim Einrichten füllen — und danach bei jedem neuen System nachziehen.
Jede Aussage hier muss aus dem Code belegt sein: Wer „A liest B"
schreibt, hat den Import gesehen. Ein Wegweiser, der auf etwas zeigt,
das es nicht gibt, ist schlimmer als keiner — er wird geglaubt. Zahlen,
die sich ändern (Zeilen, Prüfungszahlen), gehören nicht hierher,
sondern in die Dokumente, die sie führen.)*

Zwei Leser sind gemeint. **Der Auftraggeber** liest Teil 1 und Teil 3.
**Wer hier zu bauen anfängt**, liest alles, bevor er eine Datei öffnet.

---

## Teil 1 · Die Karte in Worten

*(Für den Auftraggeber, in seiner Sprache: Was gibt es, und wie hängt es
zusammen? Der Grundriss in drei bis fünf Sätzen, dann die Systemtabelle.)*

### Die Systeme

| | System | was es tut | Dateien/Bereiche |
| --- | --- | --- | --- |
| 1 | *(Name)* | *(ein Satz)* | *(Dateien)* |

*(Jede Quelldatei gehört zu genau einem System. Die Tags und Zweignamen
dazu stehen in [REGELN.md](REGELN.md), Regel 2 — dort ist die eine
Quelle, hier steht das Warum.)*

*(Beim **Nachrüsten** eines gewachsenen Projekts bekommt die Tabelle
eine vierte Spalte „Zielordner": wo der Bereich **heute** liegt und wo
er beim Herauslösen **hin soll** — Muster aus einer gewachsenen Modulkarte. So
wird die Wanderung dokumentierte Absicht statt Zufall, und jeder
Eingriff weiß, wohin er den berührten Teil verschiebt.)*

---

## Teil 2 · Wer redet mit wem, und warum

*(Je Verbindung: welche Richtung, worüber — welche Funktion, welche
Datei —, und **warum genau so**. Das Warum ist der Teil, den man nicht
aus dem Code ablesen kann, und deshalb der wertvollste.)*

| Verbindung | Art | worüber | warum so |
| --- | --- | --- | --- |
| *(A → B)* | *(Import / Übergabe / Vertrag / Ereignis)* | *(…)* | *(…)* |

---

## Teil 3 · „Ich will X ändern — wo fasse ich an?"

*(Der Teil, der im Alltag am meisten spart. Aus echten Wünschen
ableiten, nicht aus erdachten. Je Fall: Dateien in Arbeitsreihenfolge,
die Prüfung, die zuerst rot würde, und der Zweigname.)*

| Ich will … | Dateien, in dieser Reihenfolge | Prüfung danach | Zweig |
| --- | --- | --- | --- |
| *(…)* | *(…)* | *(…)* | *(…)* |

Für jede Änderung gilt zusätzlich, immer: `WORKCLAIM.md` lesen und
eintragen · `CHANGELOG.md` oben ergänzen · `node
werkzeuge/pruefe-alles.mjs` am Ende.
