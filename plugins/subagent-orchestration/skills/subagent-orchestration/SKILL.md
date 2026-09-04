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
2. Es lohnt sich gegen die Kosten: jeder Agent beginnt ohne deinen Verlauf, und
   du liest am Ende jeden Diff. Die Schwelle hängt von der Arbeit ab:
   - **Bauarbeit** (Diffs, die du prüfen musst): ab **drei** Agenten, die
     gleichzeitig laufen. Bei zweien liest du zwei Diffs und sparst kaum Zeit.
   - **Bau plus unabhängige Prüfung**: schon **zwei** — ein Agent baut, einer
     prüft ohne dessen Kontext. Das kaufst du dir nicht mit Zeit, sondern mit
     einem zweiten Blick, den du selbst nicht hast.
   - **Scouts** (nur lesen, Zahlen zurück): schon **einer**, sobald die Suche
     deinen Kontext mehr füllen würde als seine Rückmeldung.

Für eine Datei und für alles, wo der Schnitt noch nicht feststeht, ist der
Alleingang schneller. **Ein unklarer Schnitt ist kein Grund zu verteilen,
sondern der Grund, es nicht zu tun.**

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
- ⚠️ **Ein Paket, das das Zugbudget des Agenten sprengt, endet ohne
  Rückmeldung** (Vorfall 11). Deckel, die sich gehalten haben: Scout höchstens
  **5** Suchpunkte, Prüfauftrag höchstens **6** Kriterien und **ein** Prüflauf,
  Umbau höchstens **8–10** Dateien. Darüber wird geschnitten, nicht gehofft.
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
- **Prüfer** (fährt die Prüfkette auf einem fertigen Stand, zählt gemeldete
  Zahlen gegen, belegt mit Mutationen, dass die Tests greifen): eigenes
  Worktree auf dem zu prüfenden Stand, aber keine Commits. Kurzvorlage für
  Prüfaufträge aus derselben Datei. Er bekommt das Ergebnis, nicht den Verlauf
  des Bauagenten — das ist der zweite Blick, den du selbst nicht hast.

Das Modell folgt der **Fehlerklasse**, nicht der Textmenge:

| Arbeit | Modell | Warum |
| --- | --- | --- |
| Neue Bauart, Nebenläufigkeit, Zustand, Sicherheit | stark (Opus oder höher) | Fehler bleiben **still**: Tests grün, Verhalten falsch. |
| Fläche umstellen, Bestand löschen mit Nachweis, Logik debuggen | mittel (Sonnet) | Ein Test fängt den Fehler, aber der Agent muss den Code erst verstehen. |
| Suchen, zählen, Marken nachziehen, Doku im vorgegebenen Ton | leicht (Haiku) | Feste Regel anwenden, kein Urteil. Ein Fehler fällt sofort auf. |

⚠️ **Das Zugbudget ist die vierte Stellschraube**, neben Typ, Modell und
Zuschnitt (Vorfälle 11, 19). Die Zahl der Züge folgt der Länge der
vorgeschriebenen Kette, nicht der Schwierigkeit der Aufgabe: Stand prüfen,
Abhängigkeiten installieren, bauen, gegenprüfen, drei Prüfläufe, committen,
melden. Kennt dein Werkzeug ein Budget je Rolle, hebe es für Bau- und
Umbauaufträge an, statt den Auftrag zu kürzen — in Claude Code überschreibt eine
gleichnamige Rollendatei in `.claude/agents/` die des Plugins: Original
kopieren, nur das Budget ändern, damit die Disziplin im Rollenprompt erhalten
bleibt. Das Verzeichnis muss beim Sitzungsstart schon existieren.

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
   Ein frisches Worktree ist noch nicht lauffähig: Abhängigkeiten je Worktree
   neu installieren, statt `node_modules` zu kopieren. Zum Aufräumen unter
   Windows das Verzeichnis löschen und `git worktree prune` — `git worktree
   remove` scheitert an „Filename too long" (Vorfall 16).
2. ⚠️ **Konventionen wörtlich**, nicht als Verweis. Agenten lesen die
   Konventionsdatei und halten sie trotzdem nicht ein (Vorfall 2).
3. ⚠️ **Die stillen Fallen der Fläche namentlich** — jede Fehlerklasse, die die
   Tests nicht fangen. Was ein Test fängt, muss nicht hinein; was grün
   durchkommt, unbedingt.
4. **Auftrag und Nicht-Auftrag.** Welche Dateien er anfasst, welche anderen
   Agenten gehören. Wer „im Vorbeigehen" aufräumt, kostet dich den Schnitt.
   Umgekehrt gilt: ein roter Wächter, dessen Ursache in **seinen** Dateien
   liegt, ist sein Auftrag — auch wenn der Wächter selbst fremdes Gebiet ist
   (Vorfall 17).
5. ⚠️ **Eine Rückmeldedatei, die fortlaufend wächst** — Pfad wörtlich im
   Auftrag, fortgeschrieben nach jedem Baustein, nicht erst am Ende
   (Vorfall 11). Bauaufträge tragen zusätzlich die Pflicht zum
   **Zwischencommit** je Baustein und die **Lesedisziplin** (`grep -n` statt
   ganzer Datei). Beides kostet wenige Züge und rettet den Stand beim Abriss.
6. **Die Bausteine nach Wert sortiert**, nicht nach Bequemlichkeit. Ein Abbruch
   soll das Wichtigste fertig vorfinden und nicht das Vorbereitende
   (Vorfall 20).

Dazu: Rückmeldung in **Zahlen**, dass er nur **eigene Pfade** stagt (nie
`git add -A`, Vorfall 9), und was er nicht tut (mergen, deployen,
Wächtermarken senken).

⚠️ **Was du entscheiden kannst, entscheidest du und schreibst das Ergebnis in
den Auftrag** (Vorfall 19). Jede Nachschlagearbeit, die im Auftrag stehen
könnte, bezahlt der Agent aus seinem Zugbudget — ein Paket verbrannte 62 Züge im
Wörterbuch des Projekts und änderte dabei keine einzige Datei.

⚠️ **Abnahmekriterien mit wörtlichem Grep prüfst du am Kriterium selbst**,
bevor es in den Auftrag geht (Vorfall 18): ein Wort trifft auch Prosa,
Kommentare und Image-Namen. Ein falsch gefasstes Kriterium meldet der Agent als
Befund; nachverhandelt wird es nicht.

## 4. Starten und führen

- Unabhängige Agenten startest du **in einem Aufruf**, im Hintergrund. Ketten
  Glied für Glied, jedes auf der SHA des Vorgängers.
- Nachsteuern per `SendMessage`, **nicht** per neuem Agenten — der fängt kalt
  an und leitet denselben Kontext noch einmal her. ⚠️ **Die erste Zeile jeder
  Nachricht an einen laufenden Agenten lautet „committe sofort"**, vor jeder
  inhaltlichen Anweisung (Vorfall 20). Wer eine Korrektur bekommt, fängt sonst
  an zu arbeiten, statt zu sichern.
- ⚠️ **Der Abriss am Zuglimit ist der Regelfall, nicht die Ausnahme**: rund
  jeder zweite Lauf endete so, und die Benachrichtigung trägt dann nur den
  letzten Gedanken, keine Zahlen (Vorfall 11). Der Standardweg danach:
  Zwischenstand **vom Leitstand** committen (Betreff „Zwischenstand", Body:
  „vom Leitstand unverändert committet"), dann einen frischen Agenten mit einem
  Stand-Absatz im Auftrag ansetzen — Rückmeldedatei und Zwischencommits sagen
  dir, was hineingehört.
- ⚠️ **Nach einem Sitzungslimit (`429`) sind alle laufenden Agenten tot und
  `SendMessage` bleibt bis Sitzungsende weg** (Vorfall 12). Nachsteuern ist dann
  keine Option mehr; es bleibt der Standardweg oben.
- **Die Wellenbreite begrenzt auch dein Kontingent.** Drei gleichzeitige Läufe
  auf dem starken Modell plus einer auf dem mittleren haben das Sitzungslimit
  gerissen.
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
- ⚠️ **Prüfläufe laufen im Worktree, nie aus einer Kopie** (Vorfall 14). Tests,
  die `git ls-files` oder `core.hooksPath` lesen, werden außerhalb des
  Arbeitsbaums falsch rot. Eine Mutationsprobe ändert genau eine Datei im
  Worktree und stellt sie danach mit `git show HEAD:<pfad>` zurück.
- ⚠️ **Jeder Nachtrag an einem schon geprüften Paket wiederholt die volle
  Prüfkette** auf dem Paketstand (Vorfall 13). Ein Nachtrag von 57 Zeilen lief
  nur seinen Einzeltest und ließ einen Wächter rot zurück, bis das nächste Paket
  darauf aufsetzte.

## 6. Zusammenführen und in Änderungssätze schneiden

Ein Integrationsbranch, `git cherry-pick` in Abhängigkeitsreihenfolge.

⚠️ **Betreffs und PR-Titel nie inline** (Vorfall 15). Zweimal landete ein
doppelt kodierter Betreff auf dem Standardbranch (`â€” A4 des RÃ¼ckbaus`) —
einmal aus einem `--title` in derselben Bash-Zeile wie ein `perl -pi`, einmal
aus einem `printf`. Der Squash-Merge übernimmt den PR-Titel ungeprüft. Also:
Text in eine UTF-8-Datei, Übergabe per `-F` / `--body-file`, vor dem Merge den
Titel gegenlesen und nach dem Commit `git log --format=%s -1 | od -c`.

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
