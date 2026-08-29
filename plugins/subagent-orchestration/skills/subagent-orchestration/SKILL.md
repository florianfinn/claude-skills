---
name: subagent-orchestration
description: Arbeit auf mehrere zugeschnittene Subagenten aufteilen und das Ergebnis wieder zusammenführen — schneiden, Modell wählen, Auftrag schreiben, führen, prüfen, zusammenführen, abnehmen. Unbedingt benutzen, sobald jemand „teile das in Subagenten auf", „mach das parallel", „mehrere Agenten" oder „verteil das" sagt, und auch dann schon, wenn eine Aufgabe mehrere getrennte Flächen (Dateien, Module, Dienste) gleichzeitig berührt und eine Verteilung überhaupt erwogen wird. Enthält die Auftragsvorlage und die Fehler, die ohne sie regelmäßig auftreten.
---

# Arbeit auf Subagenten verteilen

Der Zuschnitt einer Aufgabe auf mehrere Agenten, die Rolle des Organisators und
die Prüfungen zwischen „der Agent meldet fertig" und „es ist abgenommen".

Die Warnungen hier sind gemessen, nicht abgeleitet. Woher jede stammt, steht in
[`references/field-notes.md`](references/field-notes.md).

## Erst prüfen, ob überhaupt verteilt wird

Verteile nur, wenn **beides** zutrifft:

1. Der Auftraggeber hat es verlangt — oder die Aufgabe berührt mehrere Flächen,
   die einander nicht anfassen.
2. Mindestens drei Agenten können **gleichzeitig** laufen.

Verteilen kostet: jeder Agent beginnt ohne deinen Verlauf und leitet alles neu
her, und du liest am Ende jeden Diff. Für eine Datei, für eine explorative Suche
und für alles, wo der Schnitt noch nicht feststeht, ist der Alleingang schneller.

**Ein unklarer Schnitt ist kein Grund zu verteilen, sondern der Grund, es nicht
zu tun.** Wer ohne Plan verteilt, verteilt Konflikte.

## Deine Rolle

Du schneidest, rüstest aus, prüfst, führst zusammen. Gebaut wird von den Agenten.

**Was du selbst baust, prüft niemand.** Behalte deshalb nur, was kein Agent
übernehmen kann: die Konfliktauflösung beim Zusammenführen, den Schnitt in
Änderungssätze, die Abnahme — und die Fragen an den Auftraggeber.

## 0. Projektprofil

Fülle einmal je Repo [`references/project-profile.md`](references/project-profile.md)
aus: Standardbranch, Prüfbefehle, Konventionsdatei, Wächtertests, bekannte
stille Fallen, Abnahmeweg. Jeder Auftrag zieht daraus.

Ohne Profil schreibst du unvollständige Aufträge — und merkst es erst an den
Rückläufern.

## 1. Schneiden

Der Schnitt steht **schriftlich, bevor der erste Agent läuft**.

- **Eine Datei gehört genau einem Agenten.** Zwei Agenten in derselben Datei
  erzeugen Konflikte, die du später von Hand auflöst — der teuerste Weg
  überhaupt, weil du dann die Arbeit von beiden liest statt eine zu prüfen.
- Schneide entlang der **Fläche** (Datei, Modul, Dienst), nicht entlang der
  Tätigkeit. „Alle Dialoge" ist ein Schnitt. „Alle Tests nachziehen" ist keiner
  — das fasst jede Fläche an.
- Abhängiges läuft **nacheinander**, Unabhängiges parallel. Schreibe die Ketten
  und die Gabeln auf, bevor du startest.
- **Ein Agent bekommt eine Etappe.** Zwei Etappen in einem Agenten ergeben einen
  Diff, den du hinterher nicht mehr in zwei Änderungssätze schneiden kannst.
- Ist das Plugin [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
  installiert, rüste die Etappe mit dessen spezialisiertem Subagent-Typ aus
  (z. B. `backend-developer`, `security-auditor`), statt mit einem generischen
  Agenten — der Katalog deckt die meisten Flächen ab. Ohne passenden Treffer
  bleibt es beim generischen Agenten.
- ⚠️ **Die vorgegebene Reihenfolge ist eine Vermutung, bis du sie gemessen
  hast.** Prüfe vor dem Schnitt, wer wen importiert (`grep -rl`). Eine Datei,
  die wie eine Flächendatei aussieht, kann eine gemeinsame Sprachdatei mit
  Dutzenden Importeuren sein — dann ist die geplante Reihenfolge nicht fahrbar.

## 2. Modell wählen

Das Modell folgt der **Fehlerklasse**, nicht der Textmenge:

| Arbeit | Modell | Warum |
| --- | --- | --- |
| Neue Bauart, Nebenläufigkeit, Zustand, Sicherheit | stark (Opus) | Hier entstehen Fehler, die **still** bleiben: Tests grün, Verhalten falsch. Urteil, nicht Ausführung. |
| Fläche umstellen, Bestand löschen mit Nachweis | mittel (Sonnet) | Mechanisch, aber mit Beleg. Ein Test fängt den Fehler. |
| Messen, zählen, Marken nachziehen | mittel (Sonnet) | Am Ende steht eine Zahl, kein Urteil. |
| Prosa und Doku nachziehen | mittel (Sonnet) | Der Bestand gibt den Ton vor. |

**Faustregel: stark dort, wo ein Fehler grün durchkommt. Mittel dort, wo ein
Test ihn fängt.**

Den *Aufwand* steuert nicht das Modell, sondern der Zuschnitt des Auftrags:
eine Etappe, genannte Dateiliste, genannte Rückmeldung.

## 3. Auftrag schreiben

Vorlage: [`references/agent-brief.md`](references/agent-brief.md).

Ein Auftrag ist **selbsttragend**. Der Agent hat weder deinen Verlauf noch den
Vorgang gelesen. Was er nicht im Auftrag findet, leitet er her — plausibel, aber
nicht unbedingt richtig. Vier Punkte gehören ausnahmslos hinein:

1. ⚠️ **Der Basis-Commit als SHA, mit `git fetch --all && git reset --hard <sha>`.**
   Agenten-Worktrees hängen am **Standardbranch**, nicht an deinem
   Arbeitsbranch. Ohne diese Zeile arbeiten sie auf einem Stand, auf dem deine
   Vorarbeit fehlt — im schlimmsten Fall fehlt die Datei, die sie ändern sollen.
2. ⚠️ **Konventionen wörtlich**, nicht als Verweis. Zeichensatz, Sprache,
   Commit-Form. Ein Verweis auf die Konventionsdatei ersetzt sie nicht: Agenten
   lesen sie und halten sie trotzdem nicht ein.
3. ⚠️ **Die stillen Fallen der Fläche namentlich** — jede Fehlerklasse, die in
   der Testumgebung unsichtbar bleibt. Was ein Test fängt, muss nicht in den
   Auftrag; was grün durchkommt, unbedingt.
4. **Auftrag und Nicht-Auftrag.** Welche Dateien er anfasst, welche anderen
   Agenten gehören. Ein Agent, der „im Vorbeigehen" aufräumt, kostet dich den
   Schnitt in Änderungssätze.

Dazu: was er zurückmeldet (**Zahlen**, nicht Prosa) und was er nicht tut
(mergen, deployen, Wächtermarken senken).

## 4. Führen

- Steuere laufende Agenten mit `SendMessage` nach, **nicht** mit einem neuen
  Agenten — der fängt kalt an und leitet denselben Kontext noch einmal her.
- Fällt dir ein Fehler in deiner eigenen Ausstattung auf, geht die Korrektur an
  **alle** laufenden Agenten, nicht nur an den, der nachfragt.
- Entscheidungen, die den Zuschnitt ändern, gehören dem Auftraggeber. Frag mit
  Empfehlung an erster Stelle. Entscheidet er anders, wende einmal ein und
  führe dann aus.

## 5. Prüfen

Lies den **Diff**, nicht den Bericht.

- ⚠️ **`<befehl> 2>&1 | tail -25; echo $?` meldet den Exit-Code von `tail`.**
  Das sieht wie ein grüner Lauf aus und ist keiner. Fang den echten Code:
  `<befehl> > lauf.txt 2>&1; echo "code=$?"; tail -25 lauf.txt`.
- **Zähl jede gemeldete Zahl selbst nach** (`grep -c`, `wc -l`), bevor sie in
  einen Commit- oder Änderungstext kommt. Dort wird sie zum Beleg.
- ⚠️ **Schwellen in Wächtertests verfallen lautlos.** Eine Marke der Form
  `>= N` wird nicht rot, wenn der Bestand über sie hinauswächst. Zähl bei jeder
  Etappe nach, statt sie zu übernehmen.
- Die Prüfbefehle laufen auf dem **zusammengeführten** Stand, nicht je Agent.
  Was einzeln grün ist, kann zusammen rot sein — genau dafür ist die
  Zusammenführung da.

## 6. Zusammenführen und in Änderungssätze schneiden

Ein Integrationsbranch, `git cherry-pick` in Abhängigkeitsreihenfolge.

⚠️ **Der Schnitt folgt den Wächtern, nicht der Ästhetik.** Ein Test, der einen
Übergang festhält (`assert gefunden > 0`), fällt **per Bauart**, sobald der
Übergang zu Ende ist. Seine Löschung kann dann nicht in einen eigenen, hübschen
Änderungssatz — der davor wäre rot. Prüfe vor dem Schnitt, welcher Wächter bei
welcher Kombination kippt.

## 7. Abnehmen

- Abgenommen wird auf dem **zusammengeführten** Stand, nicht auf einem
  Feature-Branch.
- ⚠️ **Prüfe den Fall, der ohne den Fix falsch wäre** — nicht den, der ohnehin
  gewinnt. Bei sortierten Größen ist das der kleinste Wert, nicht der größte:
  der größte hätte auch ohne den Fix gestimmt und beweist nichts.
- Was du nicht prüfen konntest, **benenne als ungeprüft**. Nicht weglassen.

## 8. Bericht

Je Agent: Modell, Auftrag, Ergebnis in Zahlen. Dazu die Summe über alle und die
offenen Punkte — **als Frage, nicht als Vermutung**.
