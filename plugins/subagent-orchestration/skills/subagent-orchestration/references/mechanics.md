# Mechanik: wie Subagenten in Claude Code wirklich laufen

Die belegte Grundlage der Regeln im Skill. Alles hier stammt aus der
offiziellen Dokumentation (<https://code.claude.com/docs/en/sub-agents> und
<https://code.claude.com/docs/en/skills>), Stand **August 2026**.

⚠️ Diese Datei veraltet. Widerspricht sie deiner Beobachtung, gilt die
Beobachtung — und die Datei gehört korrigiert.

---

## 1. Was in einem frischen Subagenten steht

Ein Subagent startet mit **eigenem, leerem Kontextfenster**. Darin liegen beim
Start:

| Enthalten | Nicht enthalten |
| --- | --- |
| Der eigene Systemprompt der Agentendefinition | Dein Gesprächsverlauf |
| Die Auftragsnachricht, die du schreibst | Die Dateien, die du gelesen hast |
| **Die gesamte CLAUDE.md-Kette** deiner Sitzung | Die Skills, die du aufgerufen hast |
| Ein Git-Status-Abzug vom Sitzungsstart | Dein Ausgabestil |
| Skills aus dem Feld `skills:` der Definition, vollständig | Der Auto-Memory der Hauptsitzung |
| Eine Liste der Geschwisteragenten | |

**Was daraus folgt:**

- Der Auftrag muss selbsttragend sein. Was nicht drinsteht, wird hergeleitet.
- Der Git-Status ist ein **Abzug vom Sitzungsstart**, nicht der aktuelle Stand.
  Verlass dich nicht darauf, dass der Agent den Branch kennt, auf dem du gerade
  arbeitest.
- CLAUDE.md **erreicht** den Agenten. Dass Konventionen trotzdem verletzt
  werden, ist deshalb kein Verfügbarkeits-, sondern ein **Auffälligkeits­problem**
  — genau darum stehen die fünf Regeln, die tatsächlich verletzt werden, noch
  einmal wörtlich im Auftrag, und der Rest bleibt als Verweis.
- Die eingebauten Agenten `Explore` und `Plan` überspringen CLAUDE.md und den
  Git-Status. Für sie gilt „selbsttragend" doppelt.

## 2. Was zurückkommt

Nur die **Abschlussmeldung** des Agenten landet in deinem Fenster — seine
Werkzeugaufrufe, gelesenen Dateien und Zwischenschritte nicht. Genau daraus
entsteht die Kontextersparnis: der lange Testlauf bleibt beim Agenten, das
Ergebnis kommt zu dir.

**Die Ersparnis ist nicht garantiert, sondern eine Folge deines
Rückmeldevertrags.** Ohne Deckel schreibt ein Agent so viel zurück, wie er für
angemessen hält — und zehn ausführliche Berichte sind teurer als das Problem,
das du auslagern wolltest.

Eine Ausnahme: ein **Fork** erbt den Elternkontext und sieht dein volles
Fenster; auch dort kommt nur das Endergebnis zurück.

## 3. Die Stellschrauben — und wo sie sitzen

Entscheidend für die Besetzung: **nur ein Teil ist pro Aufruf steuerbar.**

| Stellschraube | Pro Aufruf | In der Agentendefinition |
| --- | --- | --- |
| Rolle (`subagent_type`) | ✅ | — |
| Auftragstext (`prompt`) | ✅ | — |
| **Modell** | ✅ `model` | ✅ `model:` |
| Hintergrund / Vordergrund | ✅ | ✅ `background:` |
| Worktree-Isolation | ✅ `isolation` | ✅ `isolation:` |
| **Aufwand** | ❌ | ✅ `effort:` |
| **Werkzeuge** | ❌ | ✅ `tools:` / `disallowedTools:` |
| **Zugrenze** | ❌ | ✅ `maxTurns:` |
| **Vorgeladene Skills** | ❌ | ✅ `skills:` |
| Gedächtnis | ❌ | ✅ `memory:` |

Modellauflösung, in dieser Reihenfolge:

1. Umgebungsvariable `CLAUDE_CODE_SUBAGENT_MODEL`
2. Der `model`-Parameter deines Aufrufs
3. Das `model:` der Agentendefinition
4. Das Modell der Hauptsitzung

**Konsequenz für den Aufwand:** Du kannst den Aufwand eines fremden Agenten
nicht pro Aufruf hochdrehen. Drei Wege bleiben:

- **Eigene Agentendatei** unter `.claude/agents/` im Projekt, mit dem passenden
  `effort:`, `tools:`, `maxTurns:` und `skills:`. Der Weg für Arbeitsklassen,
  die im Projekt wiederkehren. ⚠️ Prüfe, ob eine neu angelegte Datei in der
  laufenden Sitzung schon greift, bevor du dich darauf verlässt.
- **Zuschnitt des Auftrags.** Eine Etappe, genannte Dateiliste, genanntes
  Kriterium — das begrenzt den Aufwand zuverlässiger als jede Einstellung.
- **Modellwahl.** Kein Ersatz für Aufwand, aber der wirksamste Hebel, der pro
  Aufruf zur Verfügung steht.

Die beiden mitgelieferten Agenten (`orchestration-scout`,
`orchestration-verifier`) setzen `effort:` und `tools:` deshalb fest — dafür
gibt es sie.

## 4. Worktrees hängen am Standardbranch

`isolation: worktree` gibt dem Agenten eine eigene Kopie des Repos. Sie wird
**standardmäßig vom Standardbranch abgezweigt, nicht vom `HEAD` deiner
Sitzung.**

Das ist die Ursache des häufigsten und teuersten Fehlers: Der Agent arbeitet
korrekt — auf einem Stand, auf dem deine Vorarbeit fehlt. Er meldet grüne Tests,
weil sie auf seinem Stand grün sind.

Gegenmittel, in jedem Auftrag:

```
git fetch --all && git reset --hard <basis-sha>
git log --oneline -1     # muss <basis-sha> zeigen
```

Ein Worktree, in dem nichts geändert wurde, wird automatisch aufgeräumt.

## 5. Hintergrundläufe

- In einer interaktiven Sitzung laufen Subagenten standardmäßig im
  **Hintergrund**; ihr Ergebnis erreicht dich als Benachrichtigung in einem
  späteren Zug.
- ⚠️ **Hintergrundagenten haben einen kleineren eingebauten Werkzeugsatz** als
  Vordergrundagenten. Braucht ein Paket ein bestimmtes Werkzeug, nenn es in der
  Agentendefinition, statt darauf zu hoffen.
- Jede Rechteabfrage eines Hintergrundagenten erscheint in **deiner** Sitzung.
  Antwortest du dort mit einer Wahl, die über den einen Aufruf hinausgeht, gilt
  sie für die **ganze Sitzung**, auch für dein Hauptgespräch. Sei bei
  Sammelfreigaben sparsam, während zwölf Agenten laufen.

## 6. Nachsteuern statt neu starten

- Jeder Aufruf des Agenten-Werkzeugs erzeugt eine **neue Instanz**. Es gibt kein
  „denselben Agenten noch einmal aufrufen".
- Fortsetzen geht über `SendMessage` mit Name oder ID des Agenten. Der Agent
  behält seinen vollständigen Verlauf — Werkzeugaufrufe, Ergebnisse,
  Überlegungen — und macht dort weiter, wo er stehen geblieben ist.
- Nachrichten des startenden Agenten behandelt er als normale Auftragsführung,
  **einschließlich Kurskorrekturen mitten in der Arbeit**.
- Erreicht ein Agent seine `maxTurns`-Grenze, wird sein Ergebnis als
  **unvollständig** gekennzeichnet und ist fortsetzbar.
- ⚠️ Die eingebauten Agenten `Explore` und `Plan` sind Einmalläufer und geben
  keine ID zurück — sie sind **nicht fortsetzbar**. Brauchst du Fortsetzbarkeit,
  nimm `general-purpose` oder einen eigenen Agenten.

## 7. Verschachtelung

Subagenten dürfen selbst Subagenten starten, standardmäßig bis zu drei Ebenen
unter dem Hauptgespräch. An der Grenze wird ihnen das Agenten-Werkzeug
entzogen.

**Nutze das im Regelfall nicht.** Ein verschachtelter Orchestrator ist ein
Leitstand ohne Vorgangsbuch und ohne Zugriff auf den Auftraggeber: er kann nicht
nachfragen, nicht zusammenführen und nicht abnehmen. Die Verschachtelung ist ein
Ventil für einen einzelnen teuren Teilschritt, kein Bauprinzip.

Der Bestand aus `awesome-claude-code-subagents` hat das Agenten-Werkzeug in
**keiner** seiner Definitionen — auch die „Orchestrierer" dort können nichts
starten. Sie schreiben Pläne.

## 8. Skills: was das für diesen Skill bedeutet

- Ein aufgerufener Skill bleibt als **eine Nachricht** im Kontext und wird in
  späteren Zügen **nicht neu gelesen**. Deshalb ist die `SKILL.md` als
  durchgehende Dienstanweisung geschrieben und nicht als Schrittliste.
- Referenzdateien werden **nicht** automatisch geladen. Sie kosten nichts, bis
  du sie liest — deshalb liegt das Ausführliche dort und nicht in der
  `SKILL.md`.
- Das Feld `skills:` einer Agentendefinition lädt einen Skill **vollständig** in
  den Subagenten. Für Projektkonventionen ist das der sauberste Weg: einmal als
  Projektskill schreiben, in der Agentendefinition nennen, statt sie in jeden
  Auftrag zu kopieren. ⚠️ Ein Skill mit `disable-model-invocation: true` lässt
  sich so **nicht** vorladen.
- In Plugin-Skills stehen `${CLAUDE_PLUGIN_ROOT}` und `${CLAUDE_SKILL_DIR}` zur
  Verfügung — damit findest du die Referenzdateien unabhängig vom
  Arbeitsverzeichnis.

## 9. Plugin-Agenten: was ignoriert wird

Kommt eine Agentendefinition aus einem **Plugin**, ignoriert Claude Code die
Felder `permissionMode`, `mcpServers` und `hooks`.

Deshalb verlassen sich die mitgelieferten Agenten allein auf `tools:`,
`model:`, `effort:` und `maxTurns:` — und deshalb steht das Verbot, etwas zu
ändern, zusätzlich **im Prompt** des Prüfers und nicht nur in seiner
Werkzeugliste.
