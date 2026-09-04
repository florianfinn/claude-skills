# {{PROJEKTNAME}} — zuerst lesen

{{EIN_ABSATZ_WAS_DAS_PROJEKT_IST}}

Auftraggeber ist **{{AUFTRAGGEBER}}**. {{WIE_ER_ARBEITET}}
*(Ein bis zwei Sätze beim Einrichten — etwa: entscheidet fachlich,
programmiert selbst nicht, alles Technische wird gebaut und in seiner
Sprache erklärt.)* Sein Wortlaut ist die Quelle: Wünsche werden
**zitiert**, nicht umformuliert.

## In dreißig Sekunden

- Zweig anlegen, `WORKCLAIM.md` lesen und eintragen — **dann** erst bauen.
- Jede Änderung: Changelog-Eintrag oben, dann `node werkzeuge/pruefe-alles.mjs`.
- Ein roter Ausgangsstand wird zuerst **gemeldet**, nicht überbaut.
- Merge, Push, Deploy, Veröffentlichung: nur auf das ausdrückliche Ja des Auftraggebers.
- Was unter „Ausdrücklich nicht gefordert" steht, wird nicht gebaut und
  nicht als Lücke gemeldet.

## Ausdrücklich nicht gefordert

*(Beim Einrichten mit dem Auftraggeber füllen — die Liste verhindert, dass Agenten
Anforderungen einpreisen, die niemand gestellt hat. Beispiele je nach
Projekt: Konten und Anmeldung, Mehrspieler, Bezahlung, Impressum/AGB,
Barrierefreiheits-Nachweise, Übersetzungen, App-Stores.)*

- {{NICHT_GEFORDERT}}

---

## Die Regeln

Ausführlich in [docs/REGELN.md](docs/REGELN.md); die prüfbaren laufen in
der Kette mit.

1. **Nie direkt auf `main`.** Jede Änderung entsteht auf einem Zweig.
2. **Ein Zweig je System.** Die Tabelle steht in `docs/REGELN.md`.
3. **Nach jeder Änderung wird gefragt**, ob sie nach `main` soll —
   Merge, Push und Deploy nur auf das ausdrückliche Ja des Auftraggebers.
4. **Alles steht im Changelog.** Jede einzelne Änderung, genau, oben.
5. **Workclaim:** [WORKCLAIM.md](WORKCLAIM.md) erst lesen, dann
   eintragen, dann schreiben. Fremde Bereiche sind gesperrt.

```bash
node werkzeuge/pruefe-alles.mjs      # die ganze Prüfkette
```

---

## Wegweiser — welche Datei beantwortet welche Frage

**Vor dem Bauen immer zuerst:** dieses Dokument, dann
[docs/FEHLERBUCH.md](docs/FEHLERBUCH.md) — dort stehen die Fehler, die
sich wiederholen, und woran man sie erkennt, **bevor** man hineinläuft.

| Frage | Datei |
| --- | --- |
| Welches System redet mit welchem, und warum? Wo fasse ich für Wunsch X an? | [docs/WEGWEISER.md](docs/WEGWEISER.md) |
| Wer arbeitet gerade woran? | [WORKCLAIM.md](WORKCLAIM.md) |
| Was wurde zuletzt gebaut, und warum — mit den Messungen | `CHANGELOG.md`, oberster Eintrag |
| Welche Regeln gelten, welche Tags und Zweignamen gibt es? | [docs/REGELN.md](docs/REGELN.md) |
| Welche Fehler wiederholen sich? | [docs/FEHLERBUCH.md](docs/FEHLERBUCH.md) |
| Wie verteile ich Arbeit auf Agenten? | `.claude/PROJEKTPROFIL.md` |

---

## Die Haltung dieses Projekts

**Jede Zahl ist gemessen.** Nicht geschätzt, nicht aus einem Kommentar
übernommen. Wenn irgendwo eine Zahl steht, gibt es den Befehl, der sie
nachrechnet.

**Umbau und Inhalt werden getrennt.** Ein Umbau ohne sichtbare Änderung
lässt sich beweisen (gleiche Eingaben → gleiches Ergebnis, byteweise);
ein Umbau mit Änderung nicht. Deshalb erst das eine, dann das andere.

**Jede neue Prüfung wird zuerst rot gemacht.** Den Fehler absichtlich
einbauen, anschlagen sehen, zurücknehmen. Eine Prüfung, die nie rot
war, prüft womöglich nichts.

**Geprüft wird der Fall, der ohne die Arbeit falsch wäre.** Nicht der,
der ohnehin gewinnt.
