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

Vier Rollen, für die der VoltAgent-Bestand keine Entsprechung hat, weil sie
nicht über eine **Fachdomäne** definiert sind, sondern über **Aufwand,
Werkzeugliste und Rückmeldevertrag** — genau die Felder, die der Bestand nicht
setzt.

| Rolle | Arbeitsart | Modell | Aufwand | Werkzeuge |
| --- | --- | --- | --- | --- |
| `orchestration-scout` | Karte aufnehmen, messen, zählen | haiku | low | lesend |
| `orchestration-mechanic` | Fläche umstellen, löschen mit Nachweis, Tests und Doku nachziehen | sonnet | medium | bauend |
| `orchestration-builder` | Stille Fehlerklassen: Nebenläufigkeit, Zustand, Sicherheit, Migration, neue Bauart | opus | high | bauend |
| `orchestration-verifier` | Gegen ein Kriterium prüfen | opus | high | lesend |

Alle vier tragen die Disziplin im **Systemprompt** statt im Auftrag: Basis-SHA
herstellen, im Rand bleiben, nicht mergen oder pushen, keine Wächtermarke
senken, echten Exit-Code fangen, gedeckelt in Zahlen melden. Das macht jeden
Auftrag an sie deutlich kürzer — du schreibst nur noch Etappe, Dateiliste,
Kriterium, Konventionen und stille Fallen.

### `orchestration-scout`

Nimmt die Karte auf: Flächen, Größen, Importbeziehungen, Prüfbefehle, Wächter
mit Schwellen. Lesend, `haiku`, niedriger Aufwand, gedeckelte Rückmeldung.

Nimm ihn in Phase 0 und vor jedem Neuschnitt. Er liefert **Befunde mit dem
Befehl, der sie erzeugt hat**, und ausdrücklich keine Empfehlung — das Urteil
bleibt beim Leitstand.

*Unterschied zum eingebauten `Explore`:* `Explore` sucht gut, antwortet aber in
Prosa und überspringt CLAUDE.md. Der Scout liefert die Tabelle, die der Schnitt
braucht. Für „wo ist X?" ist `Explore` das bessere Werkzeug.

### `orchestration-mechanic` und `orchestration-builder`

Dieselbe Disziplin, zwei Stufen. Der Unterschied ist die **Fehlerklasse**, nicht
die Textmenge:

- **`orchestration-mechanic`** (sonnet, medium): Der Fehler wird von einem Test
  gefangen. Sein Prompt betont Messen vorher/nachher, Nachweis beim Löschen und
  die lautlos verfallende `>=`-Marke. Meldet er, dass ein Paket Urteil statt
  Ausführung verlangt, liegt es auf der falschen Stufe — dann umbesetzen, nicht
  nachfassen.
- **`orchestration-builder`** (opus, high): Der Fehler kommt grün durch. Sein
  Prompt richtet die Sorgfalt auf Nebenläufigkeit, Abbruch mitten im Schritt,
  Idempotenz, Altwerte ohne Regel und die genannten stillen Fallen — und verlangt
  eine ausdrückliche Angabe, was er **nicht** abschließend beurteilen konnte.

⚠️ **Ein Fachspezialist schlägt beide, wenn die Fläche eine fachtypische stille
Fehlerklasse hat.** `react-specialist` weiß mehr über Renderzyklen als
`orchestration-builder`. Umgekehrt trägt der Spezialist die Disziplin nicht —
dann gehört sie vollständig in den Auftrag. Willst du beides, ist das der Fall
für eine eigene Rolle: Prompt des Spezialisten übernehmen, Kopf mit `effort`,
`tools` und `maxTurns` ersetzen.

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

## Aufwand und Werkzeuge

`effort`, `tools`, `disallowedTools`, `maxTurns` und `skills` sind **nicht pro
Aufruf** setzbar — sie stehen in der Agentendefinition. Das ist kein Hindernis:
**Definitionen kannst du schreiben, und sie greifen sofort.**

Drei Wege, in dieser Reihenfolge der Kosten:

### 1. Eine mitgelieferte Stufe nehmen

Die vier Agenten dieses Plugins tragen Aufwand und Werkzeuge fest — für die vier
Arbeitsarten, die der Schnitt ohnehin unterscheidet. Kostet nichts und ist der
Normalfall.

### 2. Den Auftrag enger schneiden

Eine Etappe, genannte Dateiliste, genanntes Kriterium. Begrenzt den tatsächlichen
Aufwand zuverlässiger als jede Einstellung — und kostet ebenfalls nichts.
Zusammen mit der Modellwahl (pro Aufruf überschreibbar) deckt das die meisten
Pakete ab.

### 3. Eine eigene Rolle schreiben

Wenn die Arbeitsklasse im Projekt **wiederkehrt** oder eine mitgelieferte Stufe
fachlich nicht passt. Datei nach `.claude/agents/<name>.md`:

```yaml
---
name: repo-migrator
description: Führt Flächenmigrationen in diesem Repo aus.
tools: Read, Write, Edit, Bash, Glob, Grep   # Agent fehlt: darf nichts starten
model: opus
effort: high                                  # low | medium | high | xhigh | max
maxTurns: 50
skills:
  - projekt-konventionen                      # lädt den Skill VOLLSTÄNDIG vor
---

<Systemprompt: Rolle, Disziplin aus der Auftragsvorlage, Rückmeldevertrag.>
```

**Neue Agentendateien greifen ohne Neustart** — Claude Code beobachtet
`.claude/agents/` und `~/.claude/agents/` und erkennt Änderungen in Sekunden. Du
kannst also mitten im Vorgang eine Rolle für ein Paket bauen und sie in derselben
Welle einsetzen.

⚠️ **Mit einer Ausnahme, die dich genau einmal trifft:** Der Beobachter deckt nur
Verzeichnisse ab, die beim Sitzungsstart schon existierten. Existiert
`.claude/agents/` noch nicht, greift die erste Datei darin erst nach einem
Neustart. **Leg das Verzeichnis deshalb in Phase 0 an**, zusammen mit dem
Projektprofil — auch leer.

Zwei weitere Fälle brauchen ebenfalls einen Neustart: `.claude/agents/` in
Verzeichnissen aus `--add-dir`, und Sitzungen mit `--disable-slash-commands`.

### Drei Muster, die sich lohnen

| Muster | Wofür |
| --- | --- |
| **Fremde Rolle anpassen** | Gleicher Name unter `.claude/agents/` überschreibt die Plugin-Rolle. So gibst du einer VoltAgent-Rolle `effort`, `maxTurns` und einen engeren Werkzeugsatz, ohne ihren Prompt zu verlieren — Text übernehmen, Kopf ersetzen. |
| **Konventionen über `skills:` vorladen** | Konventionen einmal als Projektskill schreiben, in der Definition nennen — statt sie in jeden Auftrag zu kopieren. Der größte Einzelgewinn für den Token-Haushalt. ⚠️ Ein Skill mit `disable-model-invocation: true` lässt sich so nicht vorladen. |
| **Disziplin in den Systemprompt** | Basis-SHA, Rand, kein Merge, keine Marke senken, Rückmeldevertrag — im Systemprompt sind sie auffälliger als in der Auftragsnachricht und machen jeden Auftrag kürzer. Genau das tun die mitgelieferten Bauagenten. |

⚠️ **Schreib keine Rolle für ein einmaliges Paket.** Dann ist der Zuschnitt des
Auftrags plus `model`-Überschreibung billiger als eine Datei, die danach im
Projekt liegen bleibt.

---

## Was ins Vorgangsbuch kommt

Je Paket eine Zeile:

```
| P-3 | src/dialogs/** | AK-2 | react-specialist | opus | Welle 2 | offen |
```

Ohne diese Tabelle weißt du nach der zweiten Welle nicht mehr, welches Paket auf
welchem Modell lief — und kannst weder aus Fehlgriffen lernen noch einen
Rücklauf richtig einordnen.
