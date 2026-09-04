---
name: subagent-orchestration
description: Arbeit auf mehrere Subagenten aufteilen und wieder zusammenführen. Benutzen, sobald jemand „in Subagenten aufteilen", „mach das parallel", „mehrere Agenten", „verteil das", „split into subagents", „fan out" oder „run in parallel" sagt — oder eine Aufgabe mehrere getrennte Flächen (Dateien, Module, Dienste) gleichzeitig berührt.
---

# Arbeit auf Subagenten verteilen

Zuschnitt, Rolle des Organisators und die Prüfungen zwischen „der Agent meldet
fertig" und „es ist abgenommen". Jede Warnung (⚠️) ist gemessen; der Vorfall
dahinter steht unter seiner Nummer in
[`references/field-notes.md`](references/field-notes.md).

## Erst prüfen, ob überhaupt verteilt wird

Verteile nur, wenn **beides** zutrifft:

1. Der Auftraggeber hat es verlangt — oder die Aufgabe berührt mehrere Flächen,
   die einander nicht anfassen.
2. Mindestens drei Agenten können **gleichzeitig** laufen.

Verteilen kostet: jeder Agent beginnt ohne deinen Verlauf, und du liest am Ende
jeden Diff. Für eine Datei, für eine explorative Suche und für alles, wo der
Schnitt noch nicht feststeht, ist der Alleingang schneller. **Ein unklarer
Schnitt ist kein Grund zu verteilen, sondern der Grund, es nicht zu tun.**

## Deine Rolle

Du schneidest, rüstest aus, prüfst, führst zusammen. Gebaut wird von den Agenten.
**Was du selbst baust, prüft niemand.** Behalte nur, was kein Agent übernehmen
kann: Konfliktauflösung, Schnitt in Änderungssätze, Abnahme, Fragen an den
Auftraggeber.

## 0. Projektprofil

Suche zuerst `.claude/subagent-profile.md`. Fehlt es, leite es aus `CLAUDE.md`
oder `AGENTS.md` ab und schreibe nur nach, was dort fehlt — meist Wächtertests
und stille Fallen. Vorlage:
[`references/project-profile.md`](references/project-profile.md). Ohne Profil
schreibst du unvollständige Aufträge und merkst es erst an den Rückläufern.

## 1. Schneiden

Der Schnitt steht **schriftlich, bevor der erste Agent läuft**.

- **Eine Datei gehört genau einem Agenten.** Zwei Agenten in derselben Datei
  erzeugen Konflikte, die du von Hand auflöst — dann liest du beide Arbeiten
  statt eine zu prüfen (Vorfall 8).
- Schneide entlang der **Fläche** (Datei, Modul, Dienst), nicht entlang der
  Tätigkeit. „Alle Dialoge" ist ein Schnitt. „Alle Tests nachziehen" fasst jede
  Fläche an.
- Abhängiges läuft **nacheinander**, Unabhängiges parallel. Schreibe Ketten und
  Gabeln auf, bevor du startest.
- **Ein Agent bekommt eine Etappe.** Zwei Etappen in einem Diff lassen sich
  hinterher nicht mehr in zwei Änderungssätze schneiden.
- ⚠️ **Die vorgegebene Reihenfolge ist eine Vermutung, bis du sie gemessen
  hast.** Prüfe vorher, wer wen importiert (`grep -rl`). Eine vermeintliche
  Flächendatei kann eine gemeinsame Datei mit Dutzenden Importeuren sein
  (Vorfall 7).

## 2. Agententyp und Modell wählen

**Erst der Typ, dann das Modell.**

- **Scout** (suchen, zählen, Bestand kartieren): ein **nur lesender** Agent — in
  Claude Code der Typ `Explore`. Kein Worktree, kein Commit, Kurzvorlage aus
  [`references/agent-brief.md`](references/agent-brief.md).
- **Bauagent** (ändert Dateien, committet): eigenes Worktree, volle
  Auftragsvorlage. Ist [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
  installiert, nimm dessen spezialisierten Typ für die Fläche (z. B.
  `backend-developer`, `security-auditor`); sonst den generischen Agenten.

Das Modell folgt der **Fehlerklasse**, nicht der Textmenge:

| Arbeit | Modell | Warum |
| --- | --- | --- |
| Neue Bauart, Nebenläufigkeit, Zustand, Sicherheit | stark (Opus) | Fehler bleiben **still**: Tests grün, Verhalten falsch. |
| Fläche umstellen, Bestand löschen mit Nachweis, Logik debuggen | mittel (Sonnet) | Ein Test fängt den Fehler, aber der Agent muss den Code erst verstehen. |
| Suchen, zählen, Marken nachziehen, Doku im vorgegebenen Ton | leicht (Haiku) | Feste Regel anwenden, kein Urteil. Ein Fehler fällt sofort auf. |

⚠️ **Ein Scout-Auftrag ohne festgelegten Suchraum liefert falsche Negative, die
wie Fakten aussehen** (Vorfall 10). Nenne den Suchraum vollständig — auch
`docker/`, `ci/`, `scripts/` — und verlange zu jeder Bestandsaussage den
Rohbefehl samt Ausgabe.

## 3. Auftrag schreiben

Vorlage: [`references/agent-brief.md`](references/agent-brief.md). Ein Auftrag
ist **selbsttragend**: der Agent hat weder deinen Verlauf noch den Vorgang
gelesen. Was fehlt, leitet er her — plausibel, nicht unbedingt richtig. In jeden
Bauauftrag gehören:

1. ⚠️ **Ein eigenes Worktree auf dem Basis-Commit als SHA.** Bietet das
   Agent-Werkzeug Worktree-Isolation je Aufruf (in Claude Code
   `isolation: "worktree"`), nimm sie. Sonst legst **du** es an
   (`git worktree add <pfad> <sha>`) und nennst den Pfad wörtlich. Der Agent
   prüft die SHA mit `git rev-parse HEAD` und **stoppt bei Abweichung** — kein
   `reset --hard`, das trifft im Hauptcheckout fremden Stand (Vorfälle 1, 9).
2. ⚠️ **Konventionen wörtlich**, nicht als Verweis. Agenten lesen die
   Konventionsdatei und halten sie trotzdem nicht ein (Vorfall 2).
3. ⚠️ **Die stillen Fallen der Fläche namentlich** — jede Fehlerklasse, die die
   Tests nicht fangen. Was ein Test fängt, muss nicht hinein; was grün
   durchkommt, unbedingt.
4. **Auftrag und Nicht-Auftrag.** Welche Dateien er anfasst, welche anderen
   Agenten gehören. Wer „im Vorbeigehen" aufräumt, kostet dich den Schnitt.

Dazu: Rückmeldung in **Zahlen**, und was er nicht tut (mergen, deployen,
Wächtermarken senken).

## 4. Starten und führen

- Unabhängige Agenten startest du **in einem Aufruf**, im Hintergrund. Ketten
  Glied für Glied, jedes auf der SHA des Vorgängers.
- Nachsteuern per `SendMessage`, **nicht** per neuem Agenten — der fängt kalt
  an und leitet denselben Kontext noch einmal her.
- Ein Fehler in deiner Ausstattung geht korrigiert an **alle** laufenden
  Agenten, nicht nur an den, der nachfragt.
- Entscheidungen, die den Zuschnitt ändern, gehören dem Auftraggeber. Frag mit
  Empfehlung an erster Stelle; entscheidet er anders, wende einmal ein und
  führe aus.

## 5. Prüfen

Lies den **Diff**, nicht den Bericht.

- ⚠️ **`<befehl> 2>&1 | tail -25; echo $?` meldet den Exit-Code von `tail`**
  (Vorfall 3). Richtig: `<befehl> > lauf.txt 2>&1; echo "code=$?"; tail -25 lauf.txt`.
- **Zähl jede gemeldete Zahl nach** (`grep -c`, `wc -l`), bevor sie in einen
  Commit- oder Änderungstext kommt.
- ⚠️ **Bestands- und Totcode-Aussagen ohne Rohbefehl und Ausgabe gelten als
  ungeprüft** (Vorfall 10).
- ⚠️ **`>= N`-Marken in Wächtertests verfallen lautlos** (Vorfall 4). Nachzählen
  statt übernehmen.
- Prüfbefehle laufen auf dem **zusammengeführten** Stand. Was einzeln grün ist,
  kann zusammen rot sein.

## 6. Zusammenführen und in Änderungssätze schneiden

Ein Integrationsbranch, `git cherry-pick` in Abhängigkeitsreihenfolge.

⚠️ **Der Schnitt folgt den Wächtern, nicht der Ästhetik** (Vorfall 5). Ein Test
mit `assert gefunden > 0` fällt **per Bauart**, sobald der Übergang zu Ende ist;
seine Löschung kann dann nicht in einen eigenen Änderungssatz. Prüfe vor dem
Schnitt, welcher Wächter bei welcher Kombination kippt.

## 7. Abnehmen

- Abgenommen wird auf dem **zusammengeführten** Stand.
- ⚠️ **Prüfe den Fall, der ohne den Fix falsch wäre**, nicht den, der ohnehin
  gewinnt (Vorfall 6). Bei sortierten Größen den kleinsten Wert, nicht den
  größten.
- Was du nicht prüfen konntest, **benenne als ungeprüft**.

## 8. Bericht

Je Agent: Typ, Modell, Auftrag, Ergebnis in Zahlen. Dazu die Summe und die
offenen Punkte — **als Frage, nicht als Vermutung**.
