# Phase 2: Besetzung

Je Paket entscheidest du Rolle, Modell, Aufwand und Kontext. Wo diese vier
Stellschrauben technisch sitzen und was pro Aufruf überhaupt steuerbar ist,
steht in [`mechanics.md`](mechanics.md), Abschnitt 3 — lies das einmal, bevor du
dich auf eine Einstellung verlässt.

---

## Rolle: wann ein Spezialist etwas bringt

Eine Spezialistenrolle ist ein **fachlicher Systemprompt**: Vokabular, eine
Prüfliste, Gewohnheiten der Fachdomäne. Sie ist **kein** Projektwissen. Ein
`react-specialist` kennt React — deine Konventionen, deine stillen Fallen und
deinen Basis-SHA kennt er nicht. Die trägt weiterhin dein Auftrag.

**Nimm einen Spezialisten, wenn die Fläche eine fachtypische stille Fehlerklasse
hat, die die Rolle wirklich abdeckt.** Beispiele: Hooks und Renderzyklen in
React, Lebenszeiten in Rust, Sperren und Indizes in SQL, Idempotenz in
Zahlungsstrecken, Ressourcengrenzen in Kubernetes. Das sind Fehler, die grün
durchkommen — und genau dort liegt der Ertrag der Rolle.

**Nimm `general-purpose`, wenn:**

- Die Arbeit mechanisch ist (umbenennen, umstellen, löschen mit Nachweis).
- Keine passende Rolle existiert und du eine „ungefähr passende" nehmen würdest.
  Eine unpassende Rolle ist schlechter als keine: sie bringt Gewohnheiten mit,
  die nicht zur Fläche gehören.
- Das Paket über mehrere Fachdomänen geht. Dann ist es meistens zwei Pakete.

⚠️ **Die Rolle ersetzt den Auftrag nicht und ist kein Grund, ihn zu kürzen.**
Der häufigste Fehlgriff bei der Besetzung: einen Spezialisten wählen und dann
Konventionen, stille Fallen und Rand weglassen, weil „der weiß das schon". Weiß
er nicht.

---

## Der VoltAgent-Bestand

[`VoltAgent/awesome-claude-code-subagents`](https://github.com/VoltAgent/awesome-claude-code-subagents)
liefert rund 158 Rollen in zehn Kategorien, je als eigenes Plugin.

### Was er dir gibt

- Eine fachliche Prüfliste je Domäne — brauchbar als Rollenprompt.
- Eine gesetzte Modellstufe je Rolle (`sonnet`, `haiku`, `inherit`).
- Eine eingeschränkte Werkzeugliste je Rolle.

### Was er dir nicht gibt — und was du deshalb selbst tust

| Beobachtung am Bestand | Folge für dich |
| --- | --- |
| Kein Projektwissen, keine Konventionen | Auftrag trägt alles. Unverändert Pflicht. |
| **Keine Definition hat das `Agent`-Werkzeug** | Kein Agent von dort kann Subagenten starten. Die Orchestrierung bleibt beim Leitstand. |
| Die „Orchestrierer" in `09-meta-orchestration` schreiben **Markdown-Pläne**, sie führen nichts aus | `agent-organizer`, `task-distributor`, `workflow-orchestrator`, `multi-agent-coordinator` sind Planschreiber. Nutze sie nicht als Leitstand. |
| Prüfrollen wie `code-reviewer` und `architect-reviewer` haben **`Write` und `Edit`** | Als Prüfer ungeeignet: sie reparieren, was sie finden, und beurteilen danach ihre eigene Reparatur. Für Prüfläufe `orchestration-verifier` nehmen. |
| Kein `effort:`, kein `maxTurns:` in den Definitionen | Aufwand steuerst du über Modell und Zuschnitt, nicht über die Rolle. |
| Einige Rollen verlangen MCP-Server, die du vielleicht nicht hast (`ui-ux-tester`, `visual-asset-generator`, `codebase-orchestrator`) | Vor dem Einsatz prüfen, sonst startet der Agent mit weniger, als sein Prompt annimmt. |

### Was installiert ist, feststellen

Die Kategorien sind einzelne Plugins — installiert ist nicht automatisch alles:

```bash
ls ~/.claude/plugins/*/*/agents/*.md 2>/dev/null | xargs -n1 basename | sed 's/\.md$//' | sort
```

Oder direkt im Bestand, falls du ihn als Repo geklont hast:

```bash
grep -h '^name:\|^model:' <pfad>/categories/*/*.md | paste - - | sed 's/name: //;s/model: //'
```

⚠️ **Rate keinen Rollennamen.** Ein `subagent_type`, den es nicht gibt, kostet
dich einen Fehlversuch je Paket. Stell einmal fest, was da ist, und trag die
Namen ins Vorgangsbuch.

### Zuordnung nach Arbeitsklasse

Kandidaten, nicht Vorschriften. Prüfe die Rolle am Auftrag, nicht am Namen.

| Arbeitsklasse | Kandidaten aus dem Bestand | Kategorie-Plugin |
| --- | --- | --- |
| Server, API, Dienste | `backend-developer`, `api-designer`, `graphql-architect`, `microservices-architect` | `voltagent-core-dev` |
| Oberfläche | `frontend-developer`, `react-specialist`, `vue-expert`, `angular-architect`, `nextjs-developer` | `voltagent-core-dev`, `voltagent-lang` |
| Sprache mit eigenen Fehlerklassen | `typescript-pro`, `python-pro`, `rust-engineer`, `golang-pro`, `java-architect`, `sql-pro` | `voltagent-lang` |
| Betrieb, Ausrollen | `devops-engineer`, `kubernetes-specialist`, `terraform-engineer`, `deployment-engineer`, `sre-engineer` | `voltagent-infra` |
| Daten, Datenbank | `data-engineer`, `database-optimizer`, `postgres-pro` | `voltagent-data-ai` |
| Tests schreiben | `test-automator`, `qa-expert` | `voltagent-qa-sec` |
| Fehler suchen | `debugger`, `error-detective` | `voltagent-qa-sec` |
| Sicherheit lesen | `security-auditor`, `penetration-tester` (beide **ohne** Schreibrechte — als Prüfer brauchbar) | `voltagent-qa-sec` |
| Umbau im Bestand | `refactoring-specialist`, `legacy-modernizer` | `voltagent-dev-exp` |
| Doku nachziehen | `documentation-engineer`, `docs-drift-editor`, `api-documenter` | `voltagent-dev-exp` |
| Abhängigkeiten, Bau | `dependency-manager`, `build-engineer` | `voltagent-dev-exp` |
| Fachdomäne | `payment-integration`, `fintech-engineer`, `blockchain-developer`, `iot-engineer` | `voltagent-domains` |
| Recherche | `research-analyst`, `search-specialist`, `competitive-analyst` | `voltagent-research` |

**Nicht besetzen mit:** `agent-organizer`, `task-distributor`,
`workflow-orchestrator`, `multi-agent-coordinator`, `context-manager`,
`error-coordinator`, `codebase-orchestrator`. Das ist die Arbeit, die dieser
Skill beschreibt. Ein zweiter Leitstand ohne Vorgangsbuch, ohne Zugang zum
Auftraggeber und ohne Zusammenführung ist kein Gewinn.

---

## Die mitgelieferten Agenten

⚠️ **Plugin-Bestandteile sind namensraumgebunden.** Kommen die beiden Agenten
aus dem installierten Plugin, heißen sie beim Aufruf
`subagent-orchestration:orchestration-scout` und
`subagent-orchestration:orchestration-verifier`. Liegen sie als Projekt- oder
Benutzeragenten unter `.claude/agents/`, gilt der kurze Name. Dasselbe gilt für
den VoltAgent-Bestand: dort setzt der Name des jeweiligen Kategorie-Plugins den
Namensraum. Stell einmal fest, wie sie in deiner Installation heißen, und trag
die Namen ins Vorgangsbuch — ein `subagent_type`, den es nicht gibt, kostet
einen Fehlversuch je Paket.

Zwei Rollen, für die der Bestand keine passende Entsprechung hat, weil beide
über ihre **Werkzeugliste und ihren Rückmeldevertrag** definiert sind und nicht
über eine Fachdomäne.

### `orchestration-scout`

Nimmt die Karte auf: Flächen, Größen, Importbeziehungen, Prüfbefehle, Wächter
mit Schwellen. Lesend, `haiku`, niedriger Aufwand, gedeckelte Rückmeldung.

Nimm ihn in Phase 0 und vor jedem Neuschnitt. Er liefert **Befunde mit dem
Befehl, der sie erzeugt hat**, und ausdrücklich keine Empfehlung — das Urteil
bleibt beim Leitstand.

*Unterschied zum eingebauten `Explore`:* `Explore` sucht gut, antwortet aber in
Prosa und überspringt CLAUDE.md. Der Scout liefert die Tabelle, die der Schnitt
braucht. Für „wo ist X?" ist `Explore` das bessere Werkzeug.

### `orchestration-verifier`

Prüft frisch gegen ein Abnahmekriterium. **Ohne `Write`, ohne `Edit`** —
technisch über `tools:` und zusätzlich im Prompt, weil Plugin-Agenten
`permissionMode` ignorieren (siehe [`mechanics.md`](mechanics.md), Abschnitt 9).

Bekommt Kriterium und Diff, **nicht** den Bauauftrag. Antwortet je Kriterium mit
erfüllt / nicht erfüllt / nicht prüfbar, plus Befehl und Ausgabe. Läuft auf
`opus` mit hohem Aufwand: ein Prüfer, der einen Fehler übersieht, ist teurer als
der Fehler.

---

## Modell

Pro Aufruf überschreibbar — die wirksamste Stellschraube, die du zur Laufzeit
hast.

| Arbeit | Modell | Warum |
| --- | --- | --- |
| Neue Bauart, Nebenläufigkeit, Zustand, Sicherheit, Datenmigration | **stark** (Opus) | Fehler bleiben hier **still**: Tests grün, Verhalten falsch. |
| Prüfen gegen ein Kriterium | **stark** (Opus) | Ein übersehener Fehler kostet mehr als der Fehler selbst. |
| Schnitt einer Fläche, Umstellen, Löschen mit Nachweis | **mittel** (Sonnet) | Mechanisch, aber mit Beleg. Ein Test fängt den Fehler. |
| Tests schreiben, Doku nachziehen | **mittel** (Sonnet) | Der Bestand gibt den Ton vor. |
| Messen, zählen, Karte aufnehmen, Marken nachziehen | **schwach** (Haiku) | Am Ende steht eine Zahl — und die zählst du ohnehin nach. |

⚠️ **Die Textmenge ist das falsche Maß.** Zwei Zeilen in einer Nebenläufigkeit
sind Opus-Arbeit; achthundert Zeilen Doku-Nachzug sind es nicht.

⚠️ **Das Modell der Rolle ist nur die Voreinstellung.** Der Bestand steht
überwiegend auf `sonnet`. Ist die Fehlerklasse still, überschreib das beim
Aufruf — verlass dich nicht auf die Frontmatter.

Die Modellwahl spart **Geld**, nicht Kontext. Ein Haiku-Agent, der zwölf Absätze
zurückschreibt, kostet dich dasselbe Fenster wie ein Opus-Agent. Gegen den
Kontext wirkt nur der Rückmeldevertrag.

---

## Aufwand

`effort` ist **nicht pro Aufruf** setzbar, nur in der Agentendefinition. Drei
Wege, in dieser Reihenfolge:

1. **Zuschnitt des Auftrags.** Eine Etappe, genannte Dateiliste, genanntes
   Kriterium. Begrenzt den Aufwand zuverlässiger als jede Einstellung — und
   kostet nichts.
2. **Modellwahl.** Kein Ersatz, aber der Hebel, den du zur Laufzeit hast.
3. **Eigene Agentendatei** unter `.claude/agents/` im Projekt. Der Weg für
   Arbeitsklassen, die im Projekt wiederkehren:

```yaml
---
name: repo-migrator
description: Führt Flächenmigrationen in diesem Repo aus.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
effort: high
maxTurns: 40
skills:
  - projekt-konventionen     # lädt den Skill VOLLSTÄNDIG in den Agenten
---
```

Das `skills:`-Feld ist der sauberste Weg für wiederkehrende Konventionen: einmal
als Projektskill schreiben, hier nennen, statt sie in jeden Auftrag zu kopieren.
⚠️ Ein Skill mit `disable-model-invocation: true` lässt sich so nicht vorladen.
⚠️ Prüfe, ob eine neu angelegte Agentendatei in der **laufenden** Sitzung schon
greift, bevor du dich auf sie verlässt.

---

## Was ins Vorgangsbuch kommt

Je Paket eine Zeile:

```
| P-3 | src/dialogs/** | AK-2 | react-specialist | opus | Welle 2 | offen |
```

Ohne diese Tabelle weißt du nach der zweiten Welle nicht mehr, welches Paket auf
welchem Modell lief — und kannst weder aus Fehlgriffen lernen noch einen
Rücklauf richtig einordnen.
