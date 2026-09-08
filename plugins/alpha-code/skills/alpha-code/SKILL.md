---
name: alpha-code
description: Ein Projekt nach der Alpha-Code-Methode einrichten oder ein bestehendes nachrüsten — Wegweiser, Funktions-Tags an jeder Datei, Prüfkette mit Wächtern, vorbefülltes Fehlerbuch, Workclaim gegen parallele Sitzungen, Changelog-Pflicht, Altlasten-Ratchet für Großdateien, Geheimnisprüfung samt Git-Historie vor jeder Veröffentlichung. Benutzen, sobald jemand ein neues Projekt anlegt, ein bestehendes „aufräumen", „strukturieren", „sortieren", „klar Schiff machen" oder „nachrüsten" will, ein Repository veröffentlichen oder öffentlich schalten möchte, nach Wegweiser, Wächtern, Prüfkette, Fehlerbuch, Workclaim, Roadmap, Vorgängen oder Issues fragt — oder „Alpha-Code" sagt, auch ohne das Wort Skill.
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
5. **Kein Dokument behauptet einen Zustand.** „Ist live", „noch
   offen", „erledigt" veralten lautlos: Nichts wird rot, niemand
   merkt es, und das Dokument wird trotzdem geglaubt. Doku trägt die
   **Begründung**; der Stand lebt dort, wo er beim Ändern der
   Wirklichkeit mitgeändert wird.

Wer nur die Dateien anlegt, ohne diese fünf Sätze zu leben, hat
Alpha-Code nicht angewendet.

## Was das Gerüst enthält

Die Beilagen liegen **nicht** unter `references/`, weil sie nicht zum
Nachlesen da sind, sondern zum Kopieren: `vorlagen/` wird ins Projekt
geschrieben, `werkzeuge/` läuft dort.

| Teil | Datei im Projekt | Vorlage | Zweck |
| --- | --- | --- | --- |
| Einstieg | `CLAUDE.md` | [`vorlagen/CLAUDE.md`](vorlagen/CLAUDE.md) | kurz; Regeln, Prüfbefehl, Wegweiser in Fragen — samt „In dreißig Sekunden" und **„Ausdrücklich nicht gefordert"** (verhindert erfundene Anforderungen) |
| Karte | `docs/WEGWEISER.md` | [`vorlagen/WEGWEISER.md`](vorlagen/WEGWEISER.md) | Systeme, wer redet mit wem und warum, „wo fasse ich an" |
| Regeln | `docs/REGELN.md` | [`vorlagen/REGELN.md`](vorlagen/REGELN.md) | die sechzehn Regeln + Systemtabelle (Tags, Zweignamen) |
| Fehlerbuch | `docs/FEHLERBUCH.md` | [`vorlagen/FEHLERBUCH.md`](vorlagen/FEHLERBUCH.md) | **vorbefüllt** mit 18 übertragbaren Fällen |
| Workclaim | `WORKCLAIM.md` | [`vorlagen/WORKCLAIM.md`](vorlagen/WORKCLAIM.md) | wer arbeitet woran; fremde Bereiche sind gesperrt |
| Changelog | `CHANGELOG.md` | [`vorlagen/CHANGELOG.md`](vorlagen/CHANGELOG.md) | jede Änderung, oben, mit Warum und Messung |
| Agentenprofil | `.claude/PROJEKTPROFIL.md` | [`vorlagen/PROJEKTPROFIL.md`](vorlagen/PROJEKTPROFIL.md) | was in jeden Subagenten-Auftrag gehört |
| Prüfkette | `werkzeuge/pruefe-alles.mjs` + sieben Wächter (plus zwei mit Konfiguration) | [`werkzeuge/`](werkzeuge/) | siehe unten |
| Einstellung | `alpha-code.json` | erzeugt | Quellordner, Endungen, Hauptzweig, Zeilengrenze, Altlasten-Datei — und, wenn gewollt, Sprachtrennung und Vorgangs-Tracker |
| Vorgänge | GitHub Issues | [`werkzeuge/vorgaenge.mjs`](werkzeuge/vorgaenge.mjs) | legt Phasen, Schritte, Fehler und Entscheidungen an und verkettet sie |

Vier weitere Vorlagen werden **nur bei Bedarf** kopiert
([`einrichten.mjs`](einrichten.mjs) legt sie nicht automatisch an):

| Vorlage | wann |
| --- | --- |
| [`vorlagen/ALTLASTEN.md`](vorlagen/ALTLASTEN.md) → `docs/ALTLASTEN.md` | beim Nachrüsten, wenn Dateien über der Zeilengrenze bestehen — mit **gemessenen** Zeilenzahlen als Baseline |
| [`vorlagen/PROJEKTGRENZE.md`](vorlagen/PROJEKTGRENZE.md) → `docs/PROJEKTGRENZE.md` | sobald das Projekt einen Nachbarn hat: zweites Repository, gemeinsame Datenbank, gemeinsamer Rechner. Geteilte Ressourcen bekommen einen eigenen Wächter — die Warnung dahinter ist echt: Eine gemeinsame Firestore-Regeldatei hätte am 02.09.2026 fast ein zweites Projekt abgeschaltet |
| [`vorlagen/WORTLISTE.md`](vorlagen/WORTLISTE.md) → `docs/WORTLISTE.md` | sobald das Projekt seine Sprachtrennung erzwingen soll (Regel 15) — dann zusätzlich einen `sprache`-Block in `alpha-code.json` |
| [`vorlagen/ROADMAP.md`](vorlagen/ROADMAP.md) → `docs/ROADMAP.md` | sobald das Projekt einen Vorgangs-Tracker führt (Regel 16) — dann zusätzlich einen `vorgaenge`-Block in `alpha-code.json` |

Die sieben mitgelieferten Wächter laufen in **jedem** Projekt, egal
welcher Technik (sie sind Node, brauchen aber nur Dateien und Git):
`pruefe-arbeitsweise` (nie auf `main`, Changelog-Pflicht) ·
`pruefe-tags` (jede Quelldatei trägt `[Aufgabe: <Tag>]` aus der
Systemtabelle) · `pruefe-verweise` (kein Doku-Verweis ins Leere) ·
`pruefe-workclaim` (die Anspruchstabelle ist da und vollständig) ·
`pruefe-geheimnisse` (keine verbotenen Formate, keine Geheimnismuster) ·
`pruefe-altlasten` (neue Dateien unter der Zeilengrenze, geführte
Altlasten wachsen nie) · `pruefe-doku-status` (kein Dokument behauptet
einen Zustand).

**Zwei weitere laufen nur mit Konfiguration** und sagen ohne sie, dass
sie übersprungen wurden, statt still grün zu melden:
`pruefe-sprache` (Sprachtrennung, Regel 15) und `pruefe-vorgaenge`
(Fahrplan, Vorgänge und ihre Verweise, Regel 16). Und **außerhalb**
der Kette: `pruefe-freigabe`, die Freigabeliste vor einer
Veröffentlichung, siehe unten.

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
7. **Vorgänge einrichten** — **kein Zusatzpunkt, sondern Regel 16.**
   Hat das Projekt ein GitHub-Repository, hat `einrichten.mjs`
   `docs/ROADMAP.md` und den `vorgaenge`-Block schon angelegt. Dann:
   - **Fahrplan füllen** (`##` Phase, `###` Schritt, je ein
     Fertig-Kriterium) — aus dem, was der Auftraggeber vorhat, in
     seinen Worten. Solange Platzhalter drinstehen, meldet der Wächter
     „angelegt, noch nicht gefüllt" und ist grün.
   - **Trockenlauf zeigen:** `node werkzeuge/vorgaenge.mjs roadmap`
     druckt, was angelegt würde — diese Liste bekommt der Auftraggeber
     zu sehen, **bevor** irgendetwas entsteht.
   - **Erst auf sein Ja:** `… roadmap --wirklich`. Vorgänge anzulegen
     wirkt nach außen, erzeugt Benachrichtigungen und lässt sich nicht
     spurlos zurücknehmen (Regel 3).
   - **Die Nummern zurück ins Dokument:** je Phase und Schritt eine
     Zeile `Vorgang: #N`. Danach ist die Prüfung scharf.

   Ohne GitHub-Repository gilt Regel 13 mit **einer** benannten
   Standdatei — nie verstreut.
8. **Die Kette zuerst rot, dann grün.** Einmal absichtlich brechen
   (einer Datei den Tag nehmen → `pruefe-tags` muss anschlagen; ihn
   zurückgeben), dann:
   ```bash
   node werkzeuge/pruefe-alles.mjs
   ```
   Erst wenn alles grün ist und der Rot-Beweis erbracht war, gilt die
   Einrichtung als fertig. Committen (`einrichtung: Alpha-Code-Gerüst` — Conventional
   Commits, deutscher Betreff **mit** richtigen Umlauten, Regel 15) und
   den Auftraggeber fragen, ob es nach `main` soll (Regel 3).

## Modus B · Bestehendes Projekt nachrüsten

Der Unterschied zu Modus A: **Erst messen, dann anfassen — und nichts
Bestehendes überschreiben.**

1. **Bestandsaufnahme, rein lesend.** Was gibt es schon — README,
   Changelog, Doku, Prüfungen, Kopfkommentare? Mit Befehlen zählen,
   nicht schätzen. Was davon widerspricht dem Code? Jeden Fund notieren.
   **Dateien über der Zeilengrenze messen** und mit ihren Zeilenzahlen in
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
7. **Vorgänge nachrüsten — und zuerst nachsehen, was es schon gibt.**
   Hier ist der Unterschied zu Modus A am größten: Ein gewachsenes
   Projekt hat oft schon Issues, und wer blind anlegt, erzeugt zu jedem
   ein zweites.
   - `node werkzeuge/vorgaenge.mjs stand` **zuerst** — er zeigt auch
     die Vorgänge ohne Form-Label, also genau die, die es vor
     Alpha-Code schon gab.
   - Bestehende Vorgänge bekommen ihr Label, statt ersetzt zu werden.
     Ein Issue, an dem eine Unterhaltung hängt, ist mehr wert als ein
     sauber formatiertes neues.
   - Was in der Roadmap steht und schon einen Vorgang hat, bekommt
     seine `Vorgang: #N`-Zeile — **von Hand, aus dem Bestand.** Erst
     was danach ohne Nummer bleibt, wird angelegt.
   - Dann wie Modus A, Schritt 7: Trockenlauf zeigen, Ja abwarten,
     `--wirklich`.
8. Rot-Beweis, Kette, Changelog-Eintrag, Commit, Auftraggeber fragen —
   wie Modus A, Schritt 8.

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

## Wo der Stand lebt — und wo nicht

Die häufigste Art, wie ein Repository unehrlich wird, ist kein Fehler
im Code: Es ist ein Dokument, das seit vier Monaten „noch offen" sagt.
Deshalb sind **Begründung und Stand zwei Dinge** (Regel 13/14):

| | gehört hin | Beispiel |
| --- | --- | --- |
| **Begründung** | Doku (`docs/`) | Zielbild, Messungen, verworfene Alternativen, das Abnahmekriterium |
| **Stand** | Vorgangs-Tracker | „Phase 2 läuft", „blockiert durch #14" |
| **Verlauf** | `CHANGELOG.md` | was wann geändert wurde, mit Messung |
| **Abgeschlossenes** | `docs/history/` | dort **darf** Status stehen — es behauptet nicht mehr, die Gegenwart zu sein |

Drei Punkte, die man leicht übersieht:

1. **Der Vorgang einer Phase existiert, bevor die Phase beginnt.**
   Sonst wandert der Stand in der Zwischenzeit doch wieder in
   Commit-Texte und Dokumente — und von dort holt ihn niemand zurück.
2. **Eine offene Entscheidung ist ein eigener Vorgang**, kein Absatz
   in einem Phasen-Vorgang: Sie hat eine **andere Lebensdauer** als
   die Arbeit, die auf sie wartet, und überlebt sie oft.
3. **Eine gepflegte Übersichtsdatei ist selbst wieder Doku**, die
   veraltet. Wo es einen Tracker gibt, ist die Übersicht eine
   **Abfrage** (`gh issue list --label track --state open`).

**Ein datierter Vermerk ist die Ausnahme und bleibt** — „gemessen am
12.03.2026" behauptet nichts über jetzt; das Datum legt ihn trocken.
Wer eine Zustandsaussage in einem Dokument braucht, schreibt sie
datiert: dann ist sie in einem Jahr nicht falsch, sondern alt.

Hat das Projekt keinen Tracker (rein lokal, kein Hosting), gehört der
Stand in **eine** benannte Datei — nie verstreut. Der Wächter prüft
`docs/`, nicht diese eine Datei.

## Vorgänge — der Fahrplan wird zu Issues (Regel 16)

Sobald ein `vorgaenge`-Block in `alpha-code.json` steht, werden **drei
Dinge** zu Vorgängen: der Fahrplan, jeder Fehlerbericht, jede offene
Problematik. Nichts davon bleibt ein Absatz in einem Dokument.

| Form | Label | Eltern | trägt |
| --- | --- | --- | --- |
| **Phase** | `track` | keins | das Abnahmekriterium aus `docs/ROADMAP.md` |
| **Schritt** | `schritt` | Phase | **ein** Fertig-Kriterium |
| **Fehler** | `fehler` | frei | das Vier-Felder-Muster des Fehlerbuchs |
| **Entscheidung** | `entscheidung` | **keins** | Frage, Optionen, Empfehlung |

**Große Vorgänge werden geteilt.** Eine Phase ist ein Sammelvorgang und
enthält selbst keine Arbeit — die Arbeit sind ihre Schritte. Lassen sich
für einen Schritt zwei Fertig-Kriterien nennen, sind es zwei Schritte:
sonst gibt es keinen Zeitpunkt, an dem man ihn guten Gewissens schließt.

```bash
node werkzeuge/vorgaenge.mjs roadmap              # zeigt, was fehlt
node werkzeuge/vorgaenge.mjs roadmap --wirklich   # legt an und verkettet
node werkzeuge/vorgaenge.mjs fehler "Titel" --datei bericht.md
node werkzeuge/vorgaenge.mjs entscheidung "Titel" --datei frage.md
node werkzeuge/vorgaenge.mjs bericht 42 --datei abschluss.md
node werkzeuge/vorgaenge.mjs stand                # die Übersicht als Abfrage
```

Ohne `--wirklich` läuft alles trocken — Vorgänge anzulegen erzeugt
Benachrichtigungen und lässt sich nicht spurlos zurücknehmen. Der
Zugang kommt aus `GITHUB_TOKEN`, `gh auth token` oder dem
Anmeldespeicher von Git selbst (`git credential`); ein `gh` muss also
nicht installiert sein.

**Jede Verbindung wird zweimal geschrieben**, sonst ist sie von einer
Seite unsichtbar: `Teil von #12` im Kind, `- [ ] #13` in der
Aufgabenliste des Elternteils (daraus rechnet GitHub den Fortschritt),
`Begründung: docs/ROADMAP.md` im Vorgang, `Vorgang: #12` im Dokument,
`(#13)` am Ende des Commit-Betreffs.

**Zwei Grenzen, die man leicht übersieht:**

- **Eine Entscheidung hängt an keiner Phase.** Sie hat eine andere
  Lebensdauer als die Arbeit, die auf sie wartet — als Absatz in einem
  Phasen-Vorgang verschwände sie mit dessen Abschluss, ohne beantwortet
  zu sein.
- **Der Fehler geht durch beide Bücher, nacheinander:** erst der Vorgang
  (was ist kaputt, seit wann, woran erkannt), nach der Behebung der Fall
  im Fehlerbuch (woran ich es früher merke). Wer nur eines führt,
  verliert entweder den Stand oder die Lehre.

**Die Kette prüft ohne Netz.** `pruefe-vorgaenge` sieht in der Kette
nur nach, was in den Dateien steht — jede Phase und jeder Schritt mit
Nummer, keine Nummer zweimal, kein Stand in der Roadmap. Erst
`--online` fragt GitHub, ob es die Vorgänge gibt und die Verweise
stimmen; das läuft von Hand, vor einem Merge. Eine Prüfkette, die ein
fremdes Haus braucht, wird rot, wenn dieses Haus langsam ist — und
gewöhnt einem so das Übergehen an.

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
