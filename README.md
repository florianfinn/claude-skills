# flofi-skills

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
```

Danach ist der Skill in jedem Projekt verfügbar. Zum Aktualisieren genügt
`/plugin marketplace update flofi-skills`.

Alternativ ohne Plugin-Mechanik: den Ordner
`plugins/subagent-orchestration/skills/subagent-orchestration/` nach
`~/.claude/skills/` kopieren.

## Inhalt

| Plugin | Was es tut |
| --- | --- |
| [`subagent-orchestration`](plugins/subagent-orchestration) | Arbeit auf mehrere zugeschnittene Subagenten aufteilen und wieder zusammenführen. |

### subagent-orchestration

Der Skill greift, sobald Arbeit auf mehrere Agenten verteilt werden soll, und
führt durch acht Schritte: schneiden, Modell wählen, Auftrag schreiben, führen,
prüfen, zusammenführen, abnehmen, berichten.

Drei Beilagen:

- **`references/agent-brief.md`** — die Auftragsvorlage zum Ausfüllen. Ein
  Auftrag ist selbsttragend; der Agent hat weder deinen Verlauf noch den
  Vorgang gelesen.
- **`references/project-profile.md`** — ein Blatt, das einmal je Repo
  ausgefüllt wird (Standardbranch, Prüfbefehle, Konventionen, Wächtertests,
  stille Fallen). Jeder Auftrag zieht daraus.
- **`references/field-notes.md`** — woher jede Regel stammt. Acht Vorfälle aus
  einer Nacht mit neun Agentenläufen, je mit der Regel, die daraus wurde.

Der Kern in drei Sätzen:

1. **Eine Datei gehört genau einem Agenten.** Zwei Agenten in derselben Datei
   erzeugen Konflikte, die du hinterher von Hand auflöst.
2. **Das Modell folgt der Fehlerklasse, nicht der Textmenge.** Stark dort, wo
   ein Fehler grün durchkommt; mittel dort, wo ein Test ihn fängt.
3. **Was du selbst baust, prüft niemand.** Behalte nur, was kein Agent
   übernehmen kann: Konfliktauflösung, Schnitt, Abnahme, und die Fragen an den
   Auftraggeber.

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
geladen.

## Lizenz

MIT, siehe [LICENSE](LICENSE).
