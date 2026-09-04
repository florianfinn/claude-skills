---
name: alpha-code
description: Ein Projekt nach der Alpha-Code-Methode einrichten oder ein bestehendes nachrüsten — Wegweiser, Funktions-Tags an jeder Datei, Prüfkette mit Wächtern, vorbefülltes Fehlerbuch, Workclaim gegen parallele Sitzungen, Changelog-Pflicht, Altlasten-Ratchet für Großdateien, Geheimnisprüfung samt Git-Historie vor jeder Veröffentlichung. Benutzen, sobald jemand ein neues Projekt anlegt, ein bestehendes „aufräumen", „strukturieren", „sortieren", „klar Schiff machen" oder „nachrüsten" will, ein Repository veröffentlichen oder öffentlich schalten möchte, nach Wegweiser, Wächtern, Prüfkette, Fehlerbuch oder Workclaim fragt — oder „Alpha-Code" sagt, auch ohne das Wort Skill.
---

# Alpha-Code — die Projektmethode

Destilliert aus einem Spielprojekt mit eigenem Echtzeit-Renderer
(09/2026), wo die Prüfkette **jeden** dokumentierten Fehler gefangen hat,
bevor er auf `main` kam. Später erweitert um die Muster, die beim
Nachrüsten gewachsener Webapps im Wirkbetrieb dazukamen:
Altlasten-Ratchet, Projektgrenzen, Geheimnisprüfung, Freigabeliste.

Dieser Skill überträgt nicht die Dokumente, sondern die Methode — die
Dokumente sind der billige Teil.

## Die Haltung — sie ist der eigentliche Inhalt

1. **Jede Zahl ist gemessen.** Nicht geschätzt, nicht aus einem
   Kommentar übernommen, nicht aus dem Gedächtnis. Steht irgendwo eine
   Zahl, gibt es den Befehl, der sie nachrechnet.
2. **Jede neue Prüfung wird zuerst rot gemacht.** Fehler absichtlich
   einbauen, anschlagen sehen, zurücknehmen. Eine Prüfung, die nie rot
   war, prüft womöglich nichts.
3. **Umbau und Inhalt werden getrennt.** Ein Umbau ohne sichtbare
   Änderung lässt sich beweisen (gleiche Eingaben → byteweise gleiches
   Ergebnis); ein Umbau mit Änderung nicht. Erst das eine, dann das
   andere.
4. **Geprüft wird der Fall, der ohne die Arbeit falsch wäre** — nicht
   der, der ohnehin gewinnt.

Wer nur die Dateien anlegt, ohne diese vier Sätze zu leben, hat
Alpha-Code nicht angewendet.

## Was das Gerüst enthält

Die Beilagen liegen **nicht** unter `references/`, weil sie nicht zum
Nachlesen da sind, sondern zum Kopieren: `vorlagen/` wird ins Projekt
geschrieben, `werkzeuge/` läuft dort.

| Teil | Datei im Projekt | Vorlage | Zweck |
| --- | --- | --- | --- |
| Einstieg | `CLAUDE.md` | [`vorlagen/CLAUDE.md`](vorlagen/CLAUDE.md) | kurz; Regeln, Prüfbefehl, Wegweiser in Fragen — samt „In dreißig Sekunden" und **„Ausdrücklich nicht gefordert"** (verhindert erfundene Anforderungen) |
| Karte | `docs/WEGWEISER.md` | [`vorlagen/WEGWEISER.md`](vorlagen/WEGWEISER.md) | Systeme, wer redet mit wem und warum, „wo fasse ich an" |
| Regeln | `docs/REGELN.md` | [`vorlagen/REGELN.md`](vorlagen/REGELN.md) | die zwölf Regeln + Systemtabelle (Tags, Zweignamen) |
| Fehlerbuch | `docs/FEHLERBUCH.md` | [`vorlagen/FEHLERBUCH.md`](vorlagen/FEHLERBUCH.md) | **vorbefüllt** mit 17 übertragbaren Fällen |
| Workclaim | `WORKCLAIM.md` | [`vorlagen/WORKCLAIM.md`](vorlagen/WORKCLAIM.md) | wer arbeitet woran; fremde Bereiche sind gesperrt |
| Changelog | `CHANGELOG.md` | [`vorlagen/CHANGELOG.md`](vorlagen/CHANGELOG.md) | jede Änderung, oben, mit Warum und Messung |
| Agentenprofil | `.claude/PROJEKTPROFIL.md` | [`vorlagen/PROJEKTPROFIL.md`](vorlagen/PROJEKTPROFIL.md) | was in jeden Subagenten-Auftrag gehört |
| Prüfkette | `werkzeuge/pruefe-alles.mjs` + sechs Wächter | [`werkzeuge/`](werkzeuge/) | siehe unten |
| Einstellung | `alpha-code.json` | erzeugt | Quellordner, Endungen, Hauptzweig, Altlasten-Datei für die Wächter |

Zwei weitere Vorlagen werden **nur bei Bedarf** kopiert
([`einrichten.mjs`](einrichten.mjs) legt sie nicht automatisch an):

| Vorlage | wann |
| --- | --- |
| [`vorlagen/ALTLASTEN.md`](vorlagen/ALTLASTEN.md) → `docs/ALTLASTEN.md` | beim Nachrüsten, wenn Dateien über 500 Zeilen bestehen — mit **gemessenen** Zeilenzahlen als Baseline |
| [`vorlagen/PROJEKTGRENZE.md`](vorlagen/PROJEKTGRENZE.md) → `docs/PROJEKTGRENZE.md` | sobald das Projekt einen Nachbarn hat: zweites Repository, gemeinsame Datenbank, gemeinsamer Rechner. Geteilte Ressourcen bekommen einen eigenen Wächter — die Warnung dahinter ist echt: Eine gemeinsame Firestore-Regeldatei hätte am 02.09.2026 fast ein zweites Projekt abgeschaltet |

Die sechs mitgelieferten Wächter laufen in **jedem** Projekt, egal
welcher Technik (sie sind Node, brauchen aber nur Dateien und Git):
`pruefe-arbeitsweise` (nie auf `main`, Changelog-Pflicht) ·
`pruefe-tags` (jede Quelldatei trägt `[Aufgabe: <Tag>]` aus der
Systemtabelle) · `pruefe-verweise` (kein Doku-Verweis ins Leere) ·
`pruefe-workclaim` (die Anspruchstabelle ist da und vollständig) ·
`pruefe-geheimnisse` (keine verbotenen Formate, keine Geheimnismuster) ·
`pruefe-altlasten` (neue Dateien < 500 Zeilen, geführte Altlasten
wachsen nie). Dazu **außerhalb** der Kette: `pruefe-freigabe` — die
Freigabeliste vor einer Veröffentlichung, siehe unten.

## Modus A · Neues Projekt

1. **Zielordner klären** (bei Unklarheit fragen, nie raten) und dort
   `git init` ausführen, falls noch kein Repository besteht. Ersten
   Zweig anlegen: `git switch -c einrichtung/alpha-code` — Regel 1 gilt
   ab der ersten Minute.
2. **Gerüst aufstellen:**
   ```bash
   node <dieser-skill-ordner>/einrichten.mjs <zielordner>
   ```
   Das Skript kopiert Vorlagen und Wächter, erkennt Zeilenenden am
   Bestand (leerer Ordner: CRLF; mit `--lf` erzwingbar) und
   überschreibt **nie** etwas.
3. **Platzhalter füllen** — `{{PROJEKTNAME}}`, `{{AUFTRAGGEBER}}` und
   der Ein-Absatz in `CLAUDE.md`, aus der eigenen Beschreibung des
   Auftraggebers, zitiert.
4. **Systeme benennen.** Mit dem Auftraggeber (oder aus seiner
   Beschreibung) die Systemtabelle in `docs/REGELN.md` füllen: System ·
   Tag · Zweigname · Bereiche. Lieber vier grobe Systeme, die stimmen,
   als zwölf geratene. `alpha-code.json` auf die echten Quellordner und
   Endungen stellen (bei Godot etwa `.gd`; die Wächter bleiben trotzdem
   Node).
5. **Jede schon vorhandene Quelldatei** bekommt ihre Kopfnotiz: Was ·
   Warum · „Arbeitet zusammen mit" · `[Aufgabe: <Tag>]` in den ersten
   12 Zeilen.
6. **`docs/WEGWEISER.md` füllen**, soweit es schon etwas zu kartieren
   gibt — jede Aussage aus dem Code belegt, keine veraltenden Zahlen
   hinein (die führen andere Dateien).
7. **Die Kette zuerst rot, dann grün.** Einmal absichtlich brechen
   (einer Datei den Tag nehmen → `pruefe-tags` muss anschlagen; ihn
   zurückgeben), dann:
   ```bash
   node werkzeuge/pruefe-alles.mjs
   ```
   Erst wenn alles grün ist und der Rot-Beweis erbracht war, gilt die
   Einrichtung als fertig. Committen (`einrichtung: Alpha-Code-Geruest`,
   Betreff ohne Umlaute) — und den Auftraggeber fragen, ob es nach
   `main` soll (Regel 3).

## Modus B · Bestehendes Projekt nachrüsten

Der Unterschied zu Modus A: **Erst messen, dann anfassen — und nichts
Bestehendes überschreiben.**

1. **Bestandsaufnahme, rein lesend.** Was gibt es schon — README,
   Changelog, Doku, Prüfungen, Kopfkommentare? Mit Befehlen zählen,
   nicht schätzen. Was davon widerspricht dem Code? Jeden Fund notieren.
   **Dateien über 500 Zeilen messen** und mit ihren Zeilenzahlen in
   `docs/ALTLASTEN.md` aufnehmen (Vorlage liegt bei) — sie werden
   **nicht** sofort geteilt; die Grenze ist ein Ratchet, kein Vorwand
   für einen riskanten Komplettumbau. Alte Übergabe- und Kontextdateien
   wandern nach `docs/geschichte/` mit dem Vermerk: **Belege, nicht
   automatisch der aktuelle Sollstand.**
2. **Workclaim zuerst.** Gibt es Hinweise auf parallele Arbeit (fremde
   offene Änderungen, laufende Merges, `CURRENT_TASK`-artige Dateien)?
   Dann anhalten und den Auftraggeber fragen, bevor irgendetwas
   geschrieben wird.
3. `einrichten.mjs` legt nur die **fehlenden** Teile an und meldet die
   übersprungenen. Bestehende Dokumente werden **eingearbeitet**, nicht
   ersetzt: Ein vorhandenes README bleibt die Quelle und wird verlinkt;
   ein vorhandener Changelog bekommt die Regel-4-Pflicht ab jetzt, ohne
   dass alte Einträge umgeschrieben werden.
4. **Fehlbeschriftungen sind der wertvollste Fund** — Kommentare und
   Doku, die etwas anderes behaupten als der Code tut. Jede prüfen,
   beheben oder melden. Zahlen in Prosa, die eine Konstante
   wiederholen, durch einen Verweis auf die eine führende Stelle
   ersetzen.
5. Kopfnotizen und Tags wie in Modus A, Schritt 5 — bei vielen Dateien
   die Fläche schneiden und auf Subagenten verteilen (je Fläche ein
   Worktree, Besitz in `WORKCLAIM.md`; das Muster steht in
   `.claude/PROJEKTPROFIL.md`, ausführlich im Skill
   `subagent-orchestration`).
6. **Kein Verhalten ändern.** Nachrüsten ist ein Umbau ohne sichtbare
   Änderung — wo es einen berechenbaren Kern gibt, das mit gleichen
   Eingaben → gleichem Ergebnis belegen; wo es eine Oberfläche gibt,
   im Browser durchklicken. Was dabei an echten Fehlern auffällt, wird
   **gemeldet, nicht nebenbei gefixt**.
7. Rot-Beweis, Kette, Changelog-Eintrag, Commit, Auftraggeber fragen —
   wie Modus A, Schritt 7.

## Fachprüfungen — der Teil, der je Projekt entsteht

Die mitgelieferten Wächter sichern die Arbeitsweise. Was sie nicht
können: das **Verhalten** des Projekts prüfen. Dafür entstehen nach und
nach `werkzeuge/pruefe-<thema>.mjs` — `pruefe-alles.mjs` nimmt sie
automatisch auf. Regeln dabei:

- Wo möglich, den Kern **ohne Oberfläche prüfbar** bauen (kein DOM,
  keine Wanduhr, kein `Math.random` im Kern) — das ist die eine
  Entscheidung, aus der im Ursprungsprojekt fast alles Angenehme folgte.
- Ist die Projektsprache nicht JavaScript (Godot, Python …), prüft der
  Node-Wächter das, was er erreichen kann (Dateien, Ausgaben,
  Exporte), und ruft für Verhalten die Projektsprache auf (etwa
  `godot --headless --script`). Die Kette bleibt der eine Einstieg.
- Jede neue Prüfung: zuerst rot machen, dann in die Wegweiser-Tabelle
  im Kopf von `pruefe-alles.mjs` eintragen — mit der dritten Spalte:
  *welcher Fehler käme ohne sie still durch?* Eine Prüfung ohne
  Antwort darauf ist Zierde.
- Jede Prüfung meldet über `macheMelder` aus `helfer.mjs` und endet
  mit „N Prüfungen, M Fehler" — die Summe über alle Läufe darf bei
  keinem Umbau sinken.
- **Trägt das Projekt eine Version an zwei Stellen** (etwa
  `package.json` und ein Manifest), prüft ein Wächter die Gleichheit —
  zwei Zahlen für dieselbe Sache gehen gut, bis jemand eine ändert
  (Fehlerbuch-Klasse E2).
- **Hat das Projekt echte Nutzer** (Spieler, Betreiber, Mitarbeiter),
  lohnt ein Doppel: `CHANGELOG.md` beschreibt Änderungen, *wie Nutzer
  sie im Alltag erleben*, und ein zweites `CHANGELOG-TECHNIK.md` trägt
  die Messungen. Ohne echte Nutzer bleibt es bei einem Changelog —
  zwei Protokolle ohne Leser sind Pflege ohne Ertrag.

## Vor einer Veröffentlichung

Bevor ein Repository öffentlich wird, eine Seite live geht oder ein
Etikett gesetzt wird — **zusätzlich zur grünen Kette**:

```bash
node werkzeuge/pruefe-freigabe.mjs
```

Sie ist bewusst kein Teil der Kette (während der Entwicklung ist ein
Vorlagenzustand normal) und prüft: nichts Verbotenes im Arbeitsstand,
keine `{{Platzhalter}}` mehr in der Doku, ein README, das dieses
Projekt beschreibt — und **die gesamte Git-Historie** auf
Geheimnismuster, denn die wird beim Veröffentlichen für immer sichtbar.
Am Ende druckt sie die Liste dessen, was nur ein Mensch prüfen kann
(Lizenzen, echte Daten, Commit-Absender, ein Durchklick am Gerät).
Danach gilt Regel 3: Veröffentlicht wird nur auf ein ausdrückliches Ja.

## Der Arbeitsalltag danach (gilt für jede Änderung)

1. `WORKCLAIM.md` lesen; fremde Bereiche sind gesperrt. Eigenen
   Anspruch eintragen.
2. Zweig gemäß Systemtabelle (`<zweigname>/<kurz>`).
3. Bauen — jede Behauptung gemessen, jeder Fehler sofort ins
   Fehlerbuch (Vier-Felder-Muster).
4. `CHANGELOG.md` oben: was, warum, Messungen.
5. `node werkzeuge/pruefe-alles.mjs` — Ausgabe **außerhalb** des
   Projekts ablegen (`> lauf.txt` im Scratchpad), sonst sieht die
   Arbeitsweise-Prüfung sie als offene Änderung.
6. Committen, Workclaim auf `frei`, **Auftraggeber fragen** ob nach
   `main`.

## Stille Fallen (Kurzfassung — ausführlich im Fehlerbuch, Klasse C)

- Backslashes, Backticks, Regexe: nie durch `node -e` oder Heredocs —
  als Datei ins Scratchpad. Windows-Node braucht `C:/…`, nicht `/c/…`.
- CRLF: Zeilenenden der Zieldatei übernehmen; nie mit `grep`/`cat -A`
  beurteilen, nur `file` oder Bytes zählen.
- `String.replace` mit `$` im Ersatztext: Funktion oder `slice`.
- `<befehl> | tail; echo $?` meldet den Code von `tail`.
- Nach jeder Kopfnotiz-Änderung `node --check` (bei JavaScript).

## Abschluss-Checkliste

- [ ] Kette grün, und **jeder neue Wächter war einmal rot**
- [ ] Jede Quelldatei: Kopfnotiz mit Was/Warum/Zusammenarbeit + Tag
- [ ] `WEGWEISER.md` belegt, ohne veraltende Zahlen
- [ ] `WORKCLAIM.md` auf `frei`
- [ ] Changelog-Eintrag oben, mit Messungen
- [ ] Auftraggeber gefragt, nichts eigenmächtig auf `main`
