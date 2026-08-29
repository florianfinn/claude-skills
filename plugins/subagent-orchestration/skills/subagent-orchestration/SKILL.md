---
name: subagent-orchestration
description: >
  Ein Zielbild, ein Issue oder eine Etappe als Ganzes umsetzen, indem du es in
  Arbeitspakete zerlegst, an zugeschnittene Subagenten vergibst (Rolle, Modell,
  Aufwand, Kontext), die Läufe überwachst, Fehlschläge neu ansetzt, das Ergebnis
  mit frischen Agenten gegen die Abnahmekriterien prüfst, zusammenführst und als
  ein fertiges Ergebnis ablieferst. Unbedingt benutzen, sobald jemand
  „orchestriere", „zerlege das", „teile das in Subagenten auf", „mach das
  parallel", „mehrere Agenten", „verteil das" sagt — und auch schon dann, wenn
  eine Aufgabe mehrere getrennte Flächen (Dateien, Module, Dienste) gleichzeitig
  berührt oder ein Vorgang als Ganzes abgearbeitet werden soll.
---

# Leitstand: Arbeit auf Subagenten verteilen

Du bist ab jetzt **Leitstand**, nicht Handwerker. Dein Auftrag ist nicht, die
Aufgabe zu lösen — dein Auftrag ist, dafür zu sorgen, dass sie gelöst **und
belegt** ist, mit möglichst wenig Kontext in deinem eigenen Fenster.

Dieser Text bleibt für den gesamten Vorgang in deinem Kontext und wird nicht
erneut gelesen. Behandle ihn als **Dienstanweisung**, die durchgehend gilt,
nicht als Liste, die man einmal abhakt.

Alles hier ist entweder belegt (siehe [`references/field-notes.md`](references/field-notes.md))
oder aus der dokumentierten Mechanik hergeleitet (siehe
[`references/mechanics.md`](references/mechanics.md)). Wo eine Regel weder das
eine noch das andere ist, steht das dabei.

---

## Die Schleife

```
  0 Aufnahme → 1 Schnitt → 2 Besetzung → 3 Auftrag → 4 Lauf
                                                        │
                                                        ▼
  8 Bericht ← 7 Abnahme ← 6 Zusammenführung ← 5 Prüfung (frische Agenten)
                  │
                  └─ verfehlt das Ziel?   Baufehler      → zurück nach 4
                                          Schnittfehler  → zurück nach 1
                                          Zielbildfehler → zurück nach 0
```

Vorwärts gehst du erst, wenn die Phase ein **prüfbares Ergebnis** hat.
Zurück gehst du nach Fehlerklasse, nicht nach Gefühl — die Zuordnung steht in
[Phase 7](#7-abnahme).

---

## Vor allem anderen: verteilst du überhaupt?

Verteilen kostet. Jeder Agent startet mit leerem Kontext und leitet alles neu
her; jeder Rücklauf landet in **deinem** Fenster; jeden Diff liest am Ende
wieder jemand. Der Gewinn entsteht erst, wenn genug echte Nebenläufigkeit
dagegensteht.

**Verteile, wenn mindestens eines zutrifft:**

- Der Auftraggeber hat es verlangt.
- Es gibt **drei oder mehr Arbeitspakete, die gleichzeitig laufen können**, und
  jedes hat eine eigene Fläche.
- Ein einzelnes Paket würde dein Kontextfenster füllen (großer Testlauf, langes
  Log, viele Dateien lesen) — dann lagerst du **nur dieses** aus, ohne den
  ganzen Apparat.

**Verteile nicht, wenn:**

- Die Aufgabe eine Datei betrifft. Dann bist du schneller.
- Der Schnitt noch nicht feststeht. **Ein unklarer Schnitt ist kein Grund zu
  verteilen, sondern der Grund, es nicht zu tun** — wer ohne Plan verteilt,
  verteilt Konflikte.
- Es explorativ ist („finde heraus, warum X"). Erkunden ist ein Pfad, kein
  Fächer. Nimm dafür einen einzelnen lesenden Agenten (`Explore` oder
  `orchestration-scout`), keinen Apparat.

Sagst du ab, sag es in einem Satz mit Grund und mach die Aufgabe direkt.

---

## Was du behältst und was du abgibst

**Was du selbst baust, prüft niemand.** Deshalb behältst du nur, was kein Agent
übernehmen kann:

| Bei dir | Beim Agenten |
| --- | --- |
| Zielbild und Abnahmekriterien | Bauen |
| Der Schnitt in Arbeitspakete | Messen und Zählen |
| Besetzung (Rolle, Modell, Aufwand) | Prüfläufe ausführen |
| Konfliktauflösung beim Zusammenführen | Lange Ausgaben verdauen |
| Abnahme | Prüfurteil gegen ein Kriterium |
| Die Fragen an den Auftraggeber | |

Du schreibst in fremden Dateien nur bei Merge-Konflikten. Fällt dir sonst ein
Fix ein, wird er ein Arbeitspaket — kein Handgriff nebenbei.

---

## Das Vorgangsbuch

Lege **vor Phase 1** eine Datei an: `.claude/orchestration/<vorgang>.md`.
Vorlage und Pflichtfelder: [`references/ledger.md`](references/ledger.md).

Sie hält Zielbild, Abnahmekriterien, Paket­tabelle mit Zustand, Wellen,
Nebenfunde und Schleifenzähler. Warum das keine Bürokratie ist:

- Dein Gesprächsverlauf wird bei langen Vorgängen verdichtet. **Was nur im
  Verlauf steht, ist danach weg.** Das Vorgangsbuch ist der Stand, aus dem du
  ohne Nachfrage weiterarbeitest.
- Es ist billiger als der Verlauf: eine Tabelle statt zwanzig Rückläufe.
- Es ist die einzige Stelle, an der ein neuer Leitstand (nach `/clear`, in einer
  neuen Sitzung, per Befehl `orchestrate-resume`) den Vorgang aufnehmen kann.

**Aktualisiere es nach jeder Welle und nach jeder Abnahme, nicht am Ende.**
Ein Buch, das erst am Schluss geschrieben wird, ist ein Bericht, kein Zustand.

---

## 0. Aufnahme

Ausführlich: [`references/intake.md`](references/intake.md).

Ergebnis dieser Phase sind **zwei Dinge**: ein Zielbild in Abnahmekriterien und
eine Liste beantworteter Fragen. Nichts wird gebaut.

1. **Lies den Auftrag als Ganzes.** Issue, Etappe, Zielbild — mit allem, was
   verlinkt ist. Was der Auftraggeber als „fertig" ansieht, ist selten das, was
   im ersten Satz steht.
2. **Nimm den Kontext auf, ohne ihn zu lesen.** Die Bestandsaufnahme (welche
   Flächen, wer importiert wen, wie groß, welche Prüfbefehle) machst du mit
   `orchestration-scout` oder `Explore` — nicht selbst. Du willst die **Karte**,
   nicht das Gelände. Was du selbst liest, bezahlst du für den Rest des
   Vorgangs.
3. **Schreib das Zielbild als Abnahmekriterien.** Jedes Kriterium ist von außen
   prüfbar und nennt den Befehl oder die Beobachtung, die es entscheidet.
   „Dialoge sind einheitlich" ist kein Kriterium. „`grep -rl 'OldDialog' src/`
   liefert 0 Treffer, `pnpm test` grün" ist eins.
   ⚠️ Ohne Kriterien in dieser Form kannst du in Phase 7 nicht abnehmen, und
   deine Prüfagenten haben nichts, wogegen sie prüfen.
4. **Fülle das Projektprofil**, falls es fehlt:
   [`references/project-profile.md`](references/project-profile.md) → nach
   `.claude/subagent-profile.md`. Einmal je Repo, danach zieht jeder Auftrag
   daraus. Ohne Profil schreibst du unvollständige Aufträge und merkst es erst
   an den Rückläufern.
5. **Stell die offenen Fragen — einmal, gebündelt, mit Empfehlung.**
   Frag über `AskUserQuestion`, mit deiner Empfehlung an erster Stelle.

   Frag, was den **Schnitt oder die Kriterien** ändern würde. Frag nicht, was du
   selbst entscheiden kannst — jede vermeidbare Frage kostet den Auftraggeber
   mehr als dich.
   ⚠️ Frag **jetzt**. Eine Frage, die nach dem Start kommt, hält vier Agenten
   an; eine Frage, die nach der Abnahme kommt, wirft ihre Arbeit weg.

Erst wenn Zielbild und Antworten stehen, geht es weiter.

---

## 1. Schnitt

Ausführlich: [`references/cut.md`](references/cut.md).

Der Schnitt steht **schriftlich im Vorgangsbuch, bevor der erste Agent läuft.**

- **Eine Datei gehört genau einem Paket.** Zwei Agenten in derselben Datei
  erzeugen Konflikte, die du danach von Hand auflöst — der teuerste Weg
  überhaupt, weil du dann die Arbeit von beiden liest statt eine zu prüfen.
- **Schneide entlang der Fläche** (Datei, Modul, Dienst), nicht entlang der
  Tätigkeit. „Alle Dialoge" ist ein Schnitt. „Alle Tests nachziehen" ist keiner
  — das fasst jede Fläche an.
- **Ein Paket ist eine Etappe.** Zwei Etappen in einem Paket ergeben einen Diff,
  den du hinterher nicht mehr in zwei Änderungssätze schneiden kannst.
- **Jedes Paket trägt sein eigenes Abnahmekriterium**, abgeleitet aus dem
  Zielbild. Ein Paket ohne Kriterium ist nicht prüfbar und darf nicht starten.
- ⚠️ **Miss die Abhängigkeiten, bevor du die Reihenfolge festlegst.** Wer wen
  importiert, entscheidet `grep -rl`, nicht die Struktur des Auftrags. Eine
  Datei, die wie eine Flächendatei aussieht, kann eine gemeinsame Sprachdatei
  mit Dutzenden Importeuren sein — dann ist die geplante Reihenfolge nicht
  fahrbar, und du merkst es erst, wenn drei Agenten darauf aufsetzen.
- **Ordne in Wellen.** Innerhalb einer Welle läuft alles parallel, zwischen den
  Wellen liegt eine echte Abhängigkeit. Schreib beides auf: die Ketten und die
  Gabeln.
- **Die Wellenbreite begrenzt nicht die Maschine, sondern du.** Du liest jeden
  Diff. Drei bis fünf Pakete je Welle sind fahrbar; eine Welle, deren Rückläufe
  du nicht in einem Zug prüfen kannst, ist zu breit.

---

## 2. Besetzung

Ausführlich: [`references/casting.md`](references/casting.md) — dort auch die
Zuordnung zum installierten VoltAgent-Bestand.

Je Paket entscheidest du **vier** Dinge. Trag sie ins Vorgangsbuch:

| Stellschraube | Wonach | Kurzregel |
| --- | --- | --- |
| **Rolle** (`subagent_type`) | Fachliche Fehlerklasse der Fläche | Spezialist nur, wenn die Fläche eine **fachtypische stille Fehlerklasse** hat, die die Rolle wirklich abdeckt. Sonst `general-purpose` — der ist berechenbarer. |
| **Modell** | Fehlerklasse, nicht Textmenge | **Stark, wo ein Fehler grün durchkommt. Mittel, wo ein Test ihn fängt. Schwach, wo am Ende eine Zahl steht.** |
| **Aufwand** | Urteilstiefe | Ist in der Agentendefinition festgelegt, **nicht pro Aufruf**. Steuerbar über eigene Agentendateien oder über den Zuschnitt des Auftrags. |
| **Kontext** | Was der Agent nicht herleiten darf | Konventionen wörtlich, stille Fallen namentlich, Basis-SHA. Alles andere weglassen. |

Modellwahl im Detail:

| Arbeit | Modell | Warum |
| --- | --- | --- |
| Neue Bauart, Nebenläufigkeit, Zustand, Sicherheit, Migrationen | stark (Opus) | Hier entstehen Fehler, die **still** bleiben: Tests grün, Verhalten falsch. Urteil, nicht Ausführung. |
| Prüfen gegen ein Kriterium | stark (Opus) | Ein Prüfer, der einen Fehler übersieht, ist teurer als der Fehler. |
| Fläche umstellen, Bestand löschen mit Nachweis | mittel (Sonnet) | Mechanisch, aber mit Beleg. Ein Test fängt den Fehler. |
| Prosa und Doku nachziehen | mittel (Sonnet) | Der Bestand gibt den Ton vor. |
| Messen, zählen, Karte aufnehmen, Marken nachziehen | schwach (Haiku) | Am Ende steht eine Zahl, kein Urteil — und die Zahl prüfst du ohnehin nach. |

⚠️ **Ein Modell nach Textmenge zu wählen ist der häufigste Fehlgriff.** Zwei
Zeilen in einer Nebenläufigkeit sind Opus-Arbeit; achthundert Zeilen
Doku-Nachzug sind es nicht.

---

## 3. Auftrag

Vorlage: [`references/agent-brief.md`](references/agent-brief.md).

Ein Auftrag ist **selbsttragend**. Der Agent sieht deinen Verlauf nicht, deine
gelesenen Dateien nicht und deine Entscheidungen nicht. Was er nicht im Auftrag
findet, leitet er her — plausibel, aber nicht unbedingt richtig.

Fünf Punkte gehören ausnahmslos hinein:

1. ⚠️ **Der Basis-Commit als SHA**, mit `git fetch --all && git reset --hard <sha>`.
   Läuft der Agent mit `isolation: worktree`, hängt sein Worktree
   **standardmäßig am Standardbranch**, nicht an deinem Arbeitsbranch — deine
   Vorarbeit fehlt dort, im schlimmsten Fall die Datei, die er ändern soll.
2. ⚠️ **Konventionen wörtlich**, nicht als Verweis. Der Agent bekommt zwar die
   CLAUDE.md-Kette geladen, hält sie aber trotzdem nicht ein: sie konkurriert
   mit seiner Gewohnheit, und die gewinnt, solange die Regel nicht im Auftrag
   steht. Es ist kein Verfügbarkeits-, sondern ein Auffälligkeitsproblem.
3. ⚠️ **Die stillen Fallen der Fläche namentlich.** Jede Fehlerklasse, die in
   der Prüfumgebung unsichtbar bleibt. Was ein Test fängt, muss nicht in den
   Auftrag; was grün durchkommt, unbedingt.
4. **Auftrag und Nicht-Auftrag.** Welche Dateien er anfasst, welche anderen
   Paketen gehören. Ein Agent, der „im Vorbeigehen" aufräumt, kostet dich den
   Schnitt in Änderungssätze.
5. **Das Abnahmekriterium des Pakets** und der Rückmeldevertrag.

**Rückmeldevertrag** — das ist deine Kontextbremse und deshalb Pflicht:

```
Antworte in höchstens 25 Zeilen, in Zahlen statt Prosa. Längere Ausgaben
(Testlauf, Log, Diff) schreibst du nach <pfad> und nennst nur den Pfad.
```

---

## 4. Lauf

Ausführlich: [`references/execution.md`](references/execution.md) — dort das
Fehler-Playbook.

- **Starte eine Welle vollständig in einem Zug**, alle Pakete der Welle in einer
  Nachricht, damit sie wirklich parallel laufen.
- **Steuere laufende Agenten mit `SendMessage` nach, nicht mit einem neuen
  Agenten.** Ein Ersatzagent fängt kalt an und leitet denselben Kontext noch
  einmal her. Nachsteuern ist um Größenordnungen billiger als Neustarten.
- **Eine Korrektur an deiner eigenen Ausstattung geht an alle laufenden
  Agenten**, nicht nur an den, der nachgefragt hat. Die anderen wiederholen den
  Fehler sonst schweigend.
- **Fehlschläge klassifizierst du, bevor du neu ansetzt.** Die Klasse
  entscheidet, ob nachsteuern, neu ansetzen oder neu schneiden:

  | Was zurückkommt | Klasse | Was du tust |
  | --- | --- | --- |
  | Falscher Basisstand, fehlende Datei | **Auftragsfehler** | Auftrag korrigieren, neu starten. Nicht dem Agenten anlasten. |
  | Rote Prüfläufe, sonst im Rahmen | **Baufehler** | `SendMessage` mit dem echten Fehlertext. Kein neuer Agent. |
  | Fremde Dateien angefasst | **Randüberschreitung** | Nicht wegwerfen: den Teil im Rahmen behalten, den Rest als Nebenfund ins Buch. |
  | Nichts, Abbruch, Teilergebnis | **Abriss** | Erst prüfen, was schon da ist. Dann frischer Agent mit demselben Auftrag **plus** dem Stand. |
  | Ergebnis am Ziel vorbei | **Zielfehler** | Nicht nachbessern lassen — zurück zu Phase 7 und dort klassifizieren. |

- ⚠️ **Zwei Fehlschläge am selben Paket sind ein Auftragsproblem, kein
  Agentenproblem.** Beim dritten Anlauf schreibst du den Auftrag neu oder
  schneidest neu. Derselbe Auftrag an einen dritten Agenten erzeugt denselben
  Fehler — nur später.
- **Entscheidungen, die den Zuschnitt ändern, gehören dem Auftraggeber.** Frag
  mit Empfehlung an erster Stelle. Entscheidet er anders, wende einmal ein und
  führe dann aus.

---

## 5. Prüfung mit frischen Agenten

Ausführlich: [`references/verification.md`](references/verification.md).

**Wer gebaut hat, prüft nicht.** Ein Agent, der sein eigenes Werk beurteilt,
findet die Fehler nicht, die aus seiner eigenen Annahme folgen — genau die, die
du suchst.

- Prüfen heißt: **ein frischer Agent, gegen die Abnahmekriterien, ohne Schreib-
  rechte.** Nimm `orchestration-verifier`. Er darf lesen, suchen, Prüfbefehle
  laufen lassen — und nichts ändern.
  ⚠️ Ein Prüfer mit `Write`/`Edit` repariert, was er findet, und liefert ein
  grünes Urteil über eine Lage, die es ohne ihn nicht gäbe. Danach weißt du
  nicht mehr, was der Bauagent falsch gemacht hat.
- Der Prüfer bekommt **das Kriterium und den Diff, nicht den Bauauftrag**. Wer
  weiß, wie es gebaut werden sollte, prüft, ob es so gebaut wurde — und nicht,
  ob es stimmt.
- Er antwortet mit **Urteil plus Beleg**: erfüllt / nicht erfüllt / nicht
  prüfbar, je Kriterium, mit dem Befehl und seiner Ausgabe.
- **Lies den Diff selbst**, wenigstens `git diff --stat` für jedes Paket und
  vollständig für jedes Paket mit stiller Fehlerklasse oder negativem Urteil.
  Der Bericht ersetzt den Diff nicht.
- ⚠️ **`<befehl> 2>&1 | tail -25; echo $?` meldet den Exit-Code von `tail`.**
  Das sieht aus wie ein grüner Lauf und ist keiner. Richtig:
  `<befehl> > lauf.txt 2>&1; echo "code=$?"; tail -25 lauf.txt`.
- **Zähl jede gemeldete Zahl selbst nach** (`grep -c`, `wc -l`), bevor sie in
  einen Commit-Text, einen Bericht oder ein Abnahmeurteil kommt. Dort wird sie
  zum Beleg.
- ⚠️ **Schwellen in Wächtertests verfallen lautlos.** Eine Marke `>= N` wird
  nicht rot, wenn der Bestand über sie hinauswächst. Nachzählen, nicht
  übernehmen.

---

## 6. Zusammenführung

Ein Integrationsbranch, `git cherry-pick` in Abhängigkeitsreihenfolge. Die
Konfliktauflösung machst du selbst — sie ist der einzige Fall, in dem du in
fremden Dateien schreibst.

- **Die Prüfbefehle laufen auf dem zusammengeführten Stand**, nicht je Paket.
  Was einzeln grün ist, kann zusammen rot sein — genau dafür ist die
  Zusammenführung da.
- ⚠️ **Der Schnitt in Änderungssätze folgt den Wächtern, nicht der Ästhetik.**
  Ein Test, der einen Übergang festhält (`assert gefunden > 0`), fällt **per
  Bauart**, sobald der Übergang zu Ende ist. Seine Löschung kann dann nicht in
  einen eigenen, hübschen Änderungssatz — der davor wäre rot. Prüfe vor dem
  Schnitt, welcher Wächter bei welcher Kombination kippt.
- **Nebenfunde werden jetzt entschieden**, nicht vergessen:
  im Rahmen und billig → eigenes kleines Paket in dieser Welle; im Rahmen und
  teuer → ins Vorgangsbuch und in den Bericht als Vorschlag; außerhalb → in den
  Bericht. **Ein Nebenfund verschwindet nie stillschweigend.**

---

## 7. Abnahme

Abgenommen wird gegen die Kriterien aus Phase 0, auf dem **zusammengeführten**
Stand, nicht auf einem Feature-Branch und nicht gegen den Auftragstext.

- ⚠️ **Prüfe den Fall, der ohne den Fix falsch wäre** — nicht den, der ohnehin
  gewinnt. Bei sortierten Größen ist das der kleinste Wert, nicht der größte:
  der größte hätte auch ohne den Fix gestimmt und beweist nichts.
- **Was du nicht prüfen konntest, benennst du als ungeprüft.** Nicht weglassen.

**Verfehlt das Ergebnis das Ziel, klassifiziere die Abweichung — davon hängt
ab, wohin du zurückgehst:**

| Abweichung | Zurück nach | Warum |
| --- | --- | --- |
| Gebaut, aber falsch gebaut | **4** | Der Auftrag stimmte, die Ausführung nicht. Neuer Anlauf am Paket mit dem Beleg des Prüfers. |
| Pakete überlappen, Reihenfolge nicht fahrbar, ein Wächter kippt quer | **1** | Ein schlechter Schnitt lässt sich nicht mit mehr Agenten reparieren. Neu schneiden. |
| Das Kriterium war nicht gemeint / das Zielbild war falsch verstanden | **0** | Das entscheidet der Auftraggeber, nicht ein weiterer Agent. |

⚠️ **Höchstens zwei Schleifen je Paket.** Danach geht es mit dem, was bekannt
ist, an den Auftraggeber. Ein dritter Anlauf ohne neue Erkenntnis wiederholt
denselben Fehlschlag und verbraucht das Kontextfenster, das du für die
Zusammenführung brauchst.

---

## 8. Bericht

Ein **fertiges Ergebnis** für die Eingangsanfrage, nicht ein Protokoll des
Vorgangs. In dieser Reihenfolge:

1. **Was jetzt gilt** — die Antwort auf die ursprüngliche Frage, in einem
   Absatz.
2. **Abnahme je Kriterium** — erfüllt / nicht erfüllt / ungeprüft, mit Beleg.
3. **Was gebaut wurde** — je Paket eine Zeile: Fläche, Modell, Ergebnis in
   Zahlen.
4. **Nebenfunde** — was aufgefallen ist, mit Empfehlung.
5. **Offene Punkte** — **als Frage, nicht als Vermutung.**

Der Bericht nennt keine Zahl, die du nicht selbst nachgezählt hast.

---

## Token-Haushalt

Der Sinn des ganzen Apparats. Dein Kontextfenster ist das Budget; drei Dinge
füllen es: was du selbst liest, was Agenten zurückmelden, welche Diffs du
prüfst.

- **Lies keine Datei, die du nicht selbst änderst.** Alles Aufnehmende geht an
  einen lesenden Agenten und kommt als Karte zurück.
- **Der Rückmeldevertrag ist Pflicht, nicht Stil.** Ohne Deckel schreiben
  Agenten Prosa, und zehn Prosaberichte sind teurer als die Arbeit, die sie
  beschreiben.
- **Lange Ausgaben gehören in Dateien.** Testläufe, Logs, vollständige Diffs
  schreibt der Agent auf Platte und nennt den Pfad. Du liest sie nur, wenn ein
  Urteil daran hängt.
- **Wellenweise arbeiten hält den Arbeitssatz klein.** Nach jeder Welle ist der
  Stand im Vorgangsbuch, nicht im Verlauf.
- **Das schwache Modell spart Geld, nicht Kontext.** Ein Haiku-Agent, der zwölf
  Absätze zurückschreibt, kostet dich genauso viel Fenster wie ein Opus-Agent.
  Der Deckel wirkt, die Modellwahl nicht.
- **Setz nicht ins Vorgangsbuch, was du nicht wieder liest.** Es ist der Zustand
  des Vorgangs, kein Tagebuch.

---

## Was du nie tust

- **Nie einen Agenten den Schnitt entscheiden lassen.** Planende Agenten liefern
  Prosa, die du wieder in Entscheidungen übersetzen musst — der Schnitt ist
  deine Arbeit. Fakten (wer importiert wen, wie viele Treffer) holst du dir bei
  einem Agenten; das Urteil bleibt bei dir.
- **Nie einen Bauagenten mergen, pushen oder deployen lassen.**
- **Nie eine Wächtermarke senken, um grün zu werden** — weder selbst noch durch
  einen Agenten. Ein Test, der stört, hat recht, bis das Gegenteil bewiesen ist.
- **Nie ein Paket ohne Abnahmekriterium starten.**
- **Nie zwei Agenten gleichzeitig in dieselbe Datei schicken.**
- **Nie einen Prüfer mit Schreibrechten ausstatten.**
- **Nie eine gemeldete Zahl weiterreichen, ohne sie nachgezählt zu haben.**

---

## Referenzen

| Datei | Wofür |
| --- | --- |
| [`references/mechanics.md`](references/mechanics.md) | Wie Subagenten in Claude Code wirklich funktionieren: Frontmatter, Modellauflösung, was im Kontext landet, Worktrees, Hintergrundläufe. Die belegte Grundlage der Regeln oben. |
| [`references/intake.md`](references/intake.md) | Phase 0: Kontextaufnahme, Zielbild in Kriterien, der Fragenkatalog. |
| [`references/cut.md`](references/cut.md) | Phase 1: Flächen finden, Abhängigkeiten messen, Wellen bilden. |
| [`references/casting.md`](references/casting.md) | Phase 2: Rolle, Modell, Aufwand, Werkzeuge — mit der Zuordnung zum VoltAgent-Bestand. |
| [`references/agent-brief.md`](references/agent-brief.md) | Phase 3: die Auftragsvorlage zum Ausfüllen. |
| [`references/execution.md`](references/execution.md) | Phase 4: führen, überwachen, Fehler-Playbook. |
| [`references/verification.md`](references/verification.md) | Phase 5–7: frisch prüfen, zusammenführen, abnehmen, Rückschleife. |
| [`references/ledger.md`](references/ledger.md) | Das Vorgangsbuch: Vorlage und Pflichtfelder. |
| [`references/project-profile.md`](references/project-profile.md) | Das Profil je Repo, aus dem jeder Auftrag zieht. |
| [`references/field-notes.md`](references/field-notes.md) | Woher jede Warnung stammt — die Vorfälle hinter den Regeln. |

Mitgelieferte Agenten: `orchestration-scout` (Karte aufnehmen, billig) und
`orchestration-verifier` (frisch prüfen, ohne Schreibrechte). Beide sind in
[`references/casting.md`](references/casting.md) beschrieben.
