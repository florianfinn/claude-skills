# florianfinn-skills

Eigene Skills für [Claude Code](https://docs.claude.com/en/docs/claude-code),
als installierbare Plugins. Ein Repo, das gleichzeitig der Marktplatz ist.

Jeder Skill hier beschreibt eine Arbeitsweise, die sich in echten Projekten
bewährt hat — mit den Fehlern, die zu ihr geführt haben. Keine Sammlung von
Vorsätzen: was drinsteht, ist einmal schiefgegangen.

## Installieren

```bash
/plugin marketplace add florianfinn/claude-skills
```

```bash
/plugin install subagent-orchestration@flofi-skills
/plugin install grill-me@flofi-skills
/plugin install alpha-code@flofi-skills
```

Danach ist der Skill in jedem Projekt verfügbar.

## Aktualisieren

Zwei Schritte, und der erste allein genügt nicht:

```bash
/plugin marketplace update flofi-skills
/plugin update subagent-orchestration@flofi-skills
```

Der erste Befehl holt den Marktplatz neu vom Repo — erst danach kennt Claude
Code die neue Versionsnummer. Der zweite vergleicht sie mit der installierten
und tauscht das Plugin. Wer nur den ersten fährt, bekommt „kein Update
verfügbar" zu sehen, obwohl eines da ist.

Der Vergleich läuft über das Feld `version` in
`plugins/<name>/.claude-plugin/plugin.json`. Solange diese Zahl gleich bleibt,
gilt das Plugin als unverändert — auch wenn sich der Inhalt geändert hat. Läuft
noch eine Sitzung, greift die neue Fassung erst nach `/reload-plugins` oder
einem Neustart.

Alternativ ohne Plugin-Mechanik: den Ordner
`plugins/subagent-orchestration/skills/subagent-orchestration/` nach
`~/.claude/skills/` kopieren.

## Inhalt

| Plugin | Was es tut |
| --- | --- |
| [`subagent-orchestration`](plugins/subagent-orchestration) | Arbeit auf mehrere zugeschnittene Subagenten aufteilen und wieder zusammenführen. |
| [`grill-me`](plugins/grill-me) | Ein Vorhaben stresstesten, bevor es gebaut wird — Weiche für Weiche, mit Empfehlung. |
| [`alpha-code`](plugins/alpha-code) | Ein Projekt so einrichten oder nachrüsten, dass Fehler auffallen, bevor sie auf `main` landen. (von [Kimpaliz](https://github.com/Kimpaliz)) |

### subagent-orchestration

Der Skill greift, sobald Arbeit auf mehrere Agenten verteilt werden soll, und
führt durch acht Schritte: schneiden, Modell wählen, Auftrag schreiben, führen,
prüfen, zusammenführen, abnehmen, berichten.

Drei Beilagen:

- **`references/agent-brief.md`** — die Auftragsvorlage zum Ausfüllen, in
  drei Fassungen: voll für Bauagenten, kurz für nur lesende Scouts, kurz für
  Prüfaufträge. Ein Auftrag ist selbsttragend; der Agent hat weder deinen
  Verlauf noch den Vorgang gelesen.
- **`references/project-profile.md`** — ein Blatt, das einmal je Repo
  ausgefüllt wird (Standardbranch, Prüfbefehle, Worktree-Einrichtung,
  Konventionen, Wächtertests, stille Fallen). Jeder Auftrag zieht daraus.
- **`references/field-notes.md`** — woher jede Regel stammt. Zwanzig Vorfälle
  aus echten Vorgängen — einer Nacht mit neun Agentenläufen, einem Vorgang über
  12 Pakete in zwei Repos und Nachträgen aus früheren Läufen —, je mit der
  Regel, die daraus wurde.

Der Kern in drei Sätzen:

1. **Eine Datei gehört genau einem Agenten.** Zwei Agenten in derselben Datei
   erzeugen Konflikte, die du hinterher von Hand auflöst.
2. **Das Modell folgt der Fehlerklasse, nicht der Textmenge.** Stark dort, wo
   ein Fehler grün durchkommt; mittel dort, wo ein Test ihn fängt, aber
   Verständnis vor der Ausführung braucht; leicht dort, wo nur eine feste
   Regel angewendet wird.
3. **Was du selbst baust, prüft niemand.** Behalte nur, was kein Agent
   übernehmen kann: Konfliktauflösung, Schnitt, Abnahme, und die Fragen an den
   Auftraggeber.
4. **Der Abriss am Zuglimit ist der Regelfall.** Rund jeder zweite Lauf endet
   daran, ohne Rückmeldung. Deshalb wird gegen ihn geschnitten (Deckel je
   Auftragsart) und gegen ihn gebaut (fortlaufende Rückmeldedatei,
   Zwischencommit je Baustein).

### grill-me

Greift, sobald jemand „grill mich", „stresstest meinen Plan" oder „hinterfrag
das" sagt — oder einen Plan schildert und erkennbar Widerstand statt Zustimmung
sucht. Der Skill geht den Entscheidungsbaum des Vorhabens durch und legt jede
Weiche einzeln zur Wahl vor, jeweils mit begründeter Empfehlung. Am Ende steht
ein Protokoll, das ausdrücklich bestätigt wird; vorher wird nicht gebaut.

Der Kern in drei Sätzen:

1. **Ändert die Antwort das Vorgehen?** Wenn nicht, wird die Frage gestrichen.
   Das ist das Abbruchkriterium statt einer festen Fragenzahl — und der Filter,
   der Verständigung von Verhör trennt.
2. **Fakten werden nachgeschlagen, Entscheidungen vorgelegt.** Was in Dateien,
   Konfiguration oder Git-Verlauf steht, ist Recherche und keine Frage. Was du
   fragst, kostet den Auftraggeber Zeit; was du nachschlägst, kostet nur dich.
3. **Eine Frage, ein Aufruf, warten.** Das Fragewerkzeug erlaubt vier Fragen auf
   einmal — genau das ist die Falle: dann sieht niemand mehr, wie Frage 3 von
   Antwort 1 abhängt.

### alpha-code (von [Kimpaliz](https://github.com/Kimpaliz))

Greift, sobald ein Projekt neu angelegt oder ein bestehendes aufgeräumt,
strukturiert oder veröffentlicht werden soll. Der Skill stellt ein Gerüst auf —
Wegweiser, Regeln, Fehlerbuch, Workclaim, Changelog — und legt eine Prüfkette
dazu, die nicht den Code prüft, sondern die **Arbeitsweise**: nie auf `main`,
nichts ohne Changelog-Eintrag, jede Quelldatei mit Funktions-Tag, kein
Doku-Verweis ins Leere, keine Datei über 1.000 Zeilen, kein Geheimnis im
Arbeitsstand — und **kein Dokument, das einen Zustand behauptet**; der lebt
als Vorgang im Tracker. Vor einer
Veröffentlichung läuft zusätzlich eine Freigabeliste, die auch die gesamte
Git-Historie durchsucht.

Anders als die beiden anderen Skills bringt dieser **ausführbare Beilagen** mit:

- **`einrichten.mjs`** — kopiert Vorlagen und Wächter ins Projekt, erkennt die
  Zeilenenden am Bestand und überschreibt **nie** etwas. Nachrüsten heißt
  einarbeiten, nicht ersetzen.
- **`werkzeuge/`** — sieben Wächter plus die Kette darüber, dazu zwei, die
  nur mit Konfiguration laufen (Sprachtrennung, Vorgänge). Sie sind Node,
  brauchen aber nur Dateien und Git und laufen deshalb auch über einem
  Godot-, Python- oder Nur-Doku-Projekt.
- **`vorgaenge.mjs`** — macht aus dem Fahrplan verkettete GitHub-Issues:
  Phasen als Sammelvorgänge, Schritte als Kinder, dazu Fehlerberichte und
  offene Entscheidungen. Jede Verbindung wird in beide Richtungen
  geschrieben; ohne `--wirklich` läuft alles trocken.
- **`vorlagen/`** — die Dokumente, darunter ein **vorbefülltes Fehlerbuch** mit
  18 übertragbaren Fällen. Sie haben anderswo schon einmal Zeit gekostet; das
  neue Projekt muss sie nicht ein zweites Mal bezahlen.

Der Kern in drei Sätzen:

1. **Jede Zahl ist gemessen.** Steht irgendwo eine Zahl, gibt es den Befehl, der
   sie nachrechnet — nicht geschätzt, nicht aus einem Kommentar übernommen.
2. **Jede neue Prüfung wird zuerst rot gemacht.** Fehler einbauen, anschlagen
   sehen, zurücknehmen. Eine Prüfung, die nie rot war, prüft womöglich nichts.
3. **Kein Dokument behauptet einen Zustand.** „Ist live", „noch offen",
   „erledigt" veralten lautlos — nichts wird rot, und geglaubt wird es
   trotzdem. Doku trägt die Begründung; der Stand lebt dort, wo er beim
   Ändern der Wirklichkeit mitgeändert wird. Ein **datierter** Vermerk ist die
   Ausnahme: Das Datum legt ihn trocken.

Dazu zwei Sätze, die den Rest tragen: Umbau und Inhalt werden getrennt (nur
ein Umbau ohne sichtbare Änderung lässt sich beweisen), und geprüft wird der
Fall, der ohne die Arbeit falsch wäre — nicht der, der ohnehin gewinnt.

## Einen weiteren Skill aufnehmen

1. `plugins/<name>/.claude-plugin/plugin.json` anlegen (Name, Beschreibung,
   Version). Die `version` ist der Anker für Updates: **jede inhaltliche
   Änderung hebt sie an**, sonst sieht ein installiertes Plugin sie nie. Kein
   `version`-Feld in `marketplace.json` — steht es an beiden Stellen, gewinnt
   `plugin.json` kommentarlos.
2. `plugins/<name>/skills/<name>/SKILL.md` schreiben — YAML-Kopf mit `name` und
   `description`, darunter Markdown. Die `description` ist der
   Auslösemechanismus: sie nennt, **was** der Skill tut **und wann** er greifen
   soll.
3. Einen Eintrag in `.claude-plugin/marketplace.json` ergänzen, mit
   `"source": "./plugins/<name>"`.

Umfangreiches gehört nach `references/` und wird aus der `SKILL.md` verlinkt —
sie selbst bleibt unter 500 Zeilen und wird bei jedem Auslösen vollständig
geladen.

## Lizenz

MIT, siehe [LICENSE](LICENSE).
