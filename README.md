# flofi-skills

Eigene Skills für [Claude Code](https://docs.claude.com/en/docs/claude-code),
als installierbare Plugins. Ein Repo, das gleichzeitig der Marktplatz ist.

Jeder Skill hier beschreibt eine Arbeitsweise, die sich in echten Projekten
bewährt hat — mit den Fehlern, die zu ihr geführt haben. Keine Sammlung von
Vorsätzen: was drinsteht, ist entweder einmal schiefgegangen oder folgt aus der
dokumentierten Mechanik, und beides steht mit Quelle dabei.

## Installieren

```bash
/plugin marketplace add florianfinn/claude-skills
```

```bash
/plugin install subagent-orchestration@flofi-skills
```

Danach ist der Skill in jedem Projekt verfügbar. Zum Aktualisieren genügt
`/plugin marketplace update flofi-skills`.

## Inhalt

| Plugin | Was es tut |
| --- | --- |
| [`subagent-orchestration`](plugins/subagent-orchestration) | Einen Auftrag als Ganzes auf zugeschnittene Subagenten verteilen und geprüft wieder zusammenführen. |

---

## subagent-orchestration

Du gibst ein Zielbild, ein Issue oder eine Etappe. Der Skill macht daraus einen
geführten Vorgang: Kontext aufnehmen, offene Fragen klären, in Arbeitspakete
schneiden, an zugeschnittene Subagenten vergeben, die Wellen überwachen,
Fehlschläge nach Klasse neu ansetzen, mit **frischen** Agenten gegen
Abnahmekriterien prüfen, zusammenführen — und am Ende ein fertiges Ergebnis für
die Eingangsanfrage.

Der Zweck ist doppelt: **weniger Kontext** im Hauptfenster und **bessere
Ergebnisse**, weil jedes Paket den Zuschnitt bekommt, den es braucht.

### Die Schleife

```
0 Aufnahme → 1 Schnitt → 2 Besetzung → 3 Auftrag → 4 Lauf
                                                     ↓
8 Bericht ← 7 Abnahme ← 6 Zusammenführung ← 5 Prüfung (frische Agenten)
```

Verfehlt das Ergebnis das Ziel, geht es **nach Fehlerklasse** zurück:
Baufehler → 4, Schnittfehler → 1, Zielbildfehler → 0 (zum Auftraggeber).
Höchstens zwei Schleifen je Paket.

### Befehle

Plugin-Skills sind namensraumgebunden — tipp `/orch`, die Vervollständigung
findet sie:

| Befehl | Wofür |
| --- | --- |
| `/subagent-orchestration:orchestrate <Zielbild\|Issue\|Etappe>` | Einen Vorgang starten. |
| `/subagent-orchestration:orchestrate-resume [Vorgang]` | Einen unterbrochenen Vorgang aus seinem Vorgangsbuch wieder aufnehmen — auch in einer neuen Sitzung. |
| `/subagent-orchestration:orchestrate-profile [stille Falle]` | Das Profil dieses Repos anlegen oder fortschreiben. |

Alle drei sind auf `disable-model-invocation: true` gesetzt: sie belasten den
Kontext nicht und werden nur getippt. Der eigentliche Skill greift daneben von
selbst, sobald Arbeit auf mehrere Agenten verteilt werden soll.

### Mitgelieferte Agenten

Als Plugin heißen sie `subagent-orchestration:orchestration-scout` und
`subagent-orchestration:orchestration-verifier`.

| Agent | Wofür | Modell |
| --- | --- | --- |
| `orchestration-scout` | Karte der Codebasis aufnehmen: Flächen, gemessene Importbeziehungen, echte Prüfbefehle, Wächtertests mit Schwellen. Nur Befunde, keine Empfehlung. | haiku, geringer Aufwand |
| `orchestration-verifier` | Frisch gegen Abnahmekriterien prüfen, **ohne Schreibrechte**. Antwortet mit erfüllt / nicht erfüllt / nicht prüfbar, je mit Beleg. | opus, hoher Aufwand |

### Zusammenspiel mit `awesome-claude-code-subagents`

Der Skill nutzt den
[VoltAgent-Bestand](https://github.com/VoltAgent/awesome-claude-code-subagents)
als **Rollenkatalog** für die Bauarbeit — mit einer Zuordnung nach Arbeitsklasse
in [`references/casting.md`](plugins/subagent-orchestration/skills/subagent-orchestration/references/casting.md).

Drei Dinge, die dabei zählen und am Bestand nachgezählt sind:

- **Keine** der 158 Rollen führt das `Agent`-Werkzeug — keine von ihnen kann
  Subagenten starten. Die Orchestrierung bleibt beim Leitstand, auch die Rollen
  aus `09-meta-orchestration`: die schreiben Markdown-Pläne.
- `code-reviewer` und `architect-reviewer` haben `Write` und `Edit` und sind
  deshalb als Prüfer ungeeignet — ein Prüfer, der repariert, beurteilt danach
  seine eigene Reparatur. Dafür gibt es `orchestration-verifier`.
- Die Modellstufe der Rolle ist eine Voreinstellung, keine Entscheidung: 106 der
  Rollen stehen auf `sonnet`. Bei stiller Fehlerklasse wird sie beim Aufruf
  überschrieben.

### Der Kern in fünf Sätzen

1. **Eine Datei gehört genau einem Paket.** Zwei Agenten in derselben Datei
   erzeugen Konflikte, die du hinterher von Hand auflöst.
2. **Das Modell folgt der Fehlerklasse, nicht der Textmenge.** Stark, wo ein
   Fehler grün durchkommt; mittel, wo ein Test ihn fängt; schwach, wo am Ende
   eine Zahl steht.
3. **Wer gebaut hat, prüft nicht** — und ein Prüfer bekommt keine
   Schreibrechte.
4. **Der Rückmeldevertrag ist die Kontextbremse.** Ein Deckel in Zeilen, Zahlen
   statt Prosa, Langes in eine Datei. Ohne ihn kostet Verteilen mehr, als es
   spart.
5. **Was du selbst baust, prüft niemand.** Behalte nur, was kein Agent
   übernehmen kann: Schnitt, Konfliktauflösung, Abnahme, und die Fragen an den
   Auftraggeber.

### Aufbau

```
skills/subagent-orchestration/
  SKILL.md                    Die Dienstanweisung: Schleife, Regeln, Token-Haushalt
  references/
    mechanics.md              Wie Subagenten wirklich laufen — mit Quelle und Datum
    intake.md                 Phase 0: Kontext, Zielbild in Kriterien, Fragenkatalog
    cut.md                    Phase 1: Flächen, gemessene Abhängigkeiten, Wellen
    casting.md                Phase 2: Rolle, Modell, Aufwand — mit VoltAgent-Zuordnung
    agent-brief.md            Phase 3: die Auftragsvorlage
    execution.md              Phase 4: führen, überwachen, Fehler-Playbook
    verification.md           Phase 5–7: frisch prüfen, zusammenführen, abnehmen
    ledger.md                 Das Vorgangsbuch: Zustand, der die Verdichtung überlebt
    project-profile.md        Das Profil je Repo
    field-notes.md            Herkunft jeder Regel — Vorfall oder Mechanik
skills/orchestrate/           Einstieg   (getippt: /subagent-orchestration:orchestrate)
skills/orchestrate-resume/    Wiederaufnahme aus dem Vorgangsbuch
skills/orchestrate-profile/   Projektprofil anlegen/fortschreiben
agents/                       orchestration-scout, orchestration-verifier
```

---

## Einen weiteren Skill aufnehmen

1. `plugins/<name>/.claude-plugin/plugin.json` anlegen (Name, Beschreibung,
   Version).
2. `plugins/<name>/skills/<name>/SKILL.md` schreiben — YAML-Kopf mit `name` und
   `description`, darunter Markdown. Die `description` ist der
   Auslösemechanismus: sie nennt, **was** der Skill tut **und wann** er greifen
   soll.
3. Einen Eintrag in `.claude-plugin/marketplace.json` ergänzen, mit
   `"source": "./plugins/<name>"`.

Umfangreiches gehört nach `references/` und wird aus der `SKILL.md` verlinkt —
sie selbst bleibt unter 500 Zeilen und wird bei jedem Auslösen vollständig
geladen. Referenzdateien kosten nichts, bis sie gelesen werden.

Benutzerbefehle sind ebenfalls Skills: ein eigener Ordner unter `skills/` mit
`disable-model-invocation: true` erzeugt ein `/kommando`, dessen Beschreibung
den Kontext **nicht** belastet.

## Lizenz

MIT, siehe [LICENSE](LICENSE).
