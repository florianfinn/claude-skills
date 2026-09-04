# Fahrplan

*(Nur anlegen, wenn das Projekt einen Vorgangs-Tracker führt —
`vorgaenge` in `alpha-code.json`, Regel 16. `werkzeuge/vorgaenge.mjs`
liest genau dieses Format, `werkzeuge/pruefe-vorgaenge.mjs` prüft es.)*

Dieses Dokument trägt die **Begründung**: was gebaut werden soll, warum
in dieser Reihenfolge, und woran man erkennt, dass ein Schritt fertig
ist. **Den Stand trägt es nicht** — der lebt im Vorgang (Regel 13/14).
Ein „erledigt" hier veraltet lautlos; ein geschlossener Vorgang nicht.

## Das Format, das die Werkzeuge lesen

| Zeile | Bedeutung |
| --- | --- |
| `## Titel` | eine **Phase** — wird ein Sammelvorgang mit Label `track` |
| `### Titel` | ein **Schritt** darunter — wird ein Kind-Vorgang |
| `Vorgang: #12` | die Nummer, sobald der Vorgang angelegt ist |
| `Vorgang: keiner` | **dieser Abschnitt ist Prosa** und wird nie ein Vorgang |

**`Vorgang: keiner` ist der wichtigste Eintrag beim Nachrüsten.** Eine
gewachsene Roadmap besteht nicht nur aus Phasen: Sie hat Vorworte,
Begriffsklärungen, „die kurze Antwort". Ohne diese Zeile würde für jeden
davon ein Issue entstehen. Geraten wird nichts — wer ausnimmt, schreibt
es hin, einmal, und danach ist es für immer eindeutig.

Die Nummer schreibt niemand von Hand: `node werkzeuge/vorgaenge.mjs
roadmap` zeigt erst, was fehlt; mit `--wirklich` legt es die Vorgänge an
und nennt die Nummern, die dann hier eingetragen werden.

**Warum die Nummer trotzdem im Dokument steht,** obwohl der Stand es
nicht darf: Sie ist ein **Verweis**, keine Behauptung. `Vorgang: #12`
ist morgen noch richtig, `erledigt` vielleicht nicht.

---

## {{PHASE}}

*(Ein Absatz: was diese Phase erreichen soll und warum sie hier steht
und nicht früher. Wenn sie auf eine andere wartet, gehört das hierhin.)*

**Fertig, wenn:** {{ABNAHMEKRITERIUM}}

Vorgang: #{{N}}

### {{SCHRITT}}

*(Ein Schritt hat **ein** Fertig-Kriterium. Lassen sich zwei nennen,
sind es zwei Schritte — sonst gibt es keinen Zeitpunkt, an dem man den
Vorgang guten Gewissens schließen kann.)*

**Fertig, wenn:** {{MESSBARES_KRITERIUM}}

Vorgang: #{{N}}

### {{SCHRITT}}

**Fertig, wenn:** {{MESSBARES_KRITERIUM}}

Vorgang: #{{N}}

---

## Was **nicht** hierher gehört

| | wohin stattdessen |
| --- | --- |
| „läuft", „erledigt", „als Nächstes" | in den Vorgang |
| ein Häkchen an einem Schritt | in die Aufgabenliste des Sammelvorgangs |
| ein gefundener Fehler | eigener Vorgang mit Label `fehler`, nach der Behebung ein Fall im Fehlerbuch |
| eine offene Frage | eigener Vorgang mit Label `entscheidung` — **an keiner Phase**, sie überlebt die Arbeit, die auf sie wartet |
| eine gepflegte Übersichtstabelle | `node werkzeuge/vorgaenge.mjs stand` — eine Abfrage veraltet nicht |

## Was ein datierter Vermerk darf

„Gemessen am 12.03.2026: 4,3 ms je Bild" bleibt richtig, auch wenn es
morgen 3,1 sind — das Datum legt die Aussage trocken. Solche Belege sind
in einem Fahrplan willkommen: Sie begründen die Reihenfolge.
