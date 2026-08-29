# Phase 4: Lauf, Überwachung, Fehler-Playbook

Wellen starten, laufende Agenten führen, Fehlschläge einordnen und richtig neu
ansetzen.

---

## Eine Welle starten

**Alle Pakete einer Welle in einer Nachricht.** Nacheinander abgeschickte
Aufrufe laufen nacheinander — dann hast du den Aufwand der Verteilung ohne ihren
Ertrag.

Je Aufruf: `subagent_type` aus der Besetzung, `prompt` aus der Auftragsvorlage,
`model` überschrieben, wo die Rolle die falsche Stufe voreinstellt.

Vor dem Start prüfen:

- [ ] Jedes Paket hat den **aktuellen** Basis-SHA (nach der letzten
      Zusammenführung neu gesetzt, nicht den vom Vorgangsbeginn)
- [ ] Keine Datei kommt in zwei Aufträgen dieser Welle vor
- [ ] Jeder Auftrag nennt sein Kriterium und den Rückmeldevertrag
- [ ] Die Pakete stehen im Vorgangsbuch auf `läuft`

## Während die Welle läuft

Du wartest nicht untätig. Nutze die Zeit für das, was der Zusammenführung
vorausgeht: die Reihenfolge der Cherry-Picks festlegen, prüfen, welcher Wächter
bei welcher Kombination kippt, den Prüfauftrag für Phase 5 vorbereiten.

**Was du in dieser Zeit nicht tust:** selbst in einer Datei arbeiten, die einem
laufenden Paket gehört. Auch nicht „nur eine Kleinigkeit".

### Nachsteuern statt neu starten

**Steuere laufende Agenten mit `SendMessage` nach.** Ein Ersatzagent fängt kalt
an und leitet denselben Kontext noch einmal her; ein laufender Agent behält
seinen vollständigen Verlauf und ist in Minuten wieder auf Kurs.

Nachsteuern lohnt bei: falscher Datei, fehlender Konvention, einer stillen
Falle, die du vergessen hast, einem roten Prüflauf.

Neu starten lohnt bei: falschem Basisstand (siehe unten), einer Rolle, die sich
als falsch erweist, einem Auftrag, der neu geschnitten werden muss.

### Eine Korrektur geht an alle

⚠️ Fällt dir ein Fehler in deiner **eigenen Ausstattung** auf — eine falsche
Konvention im Auftrag, ein falscher Basis-SHA, eine übersehene stille Falle —,
geht die Korrektur an **alle laufenden Agenten**, nicht nur an den, der
nachgefragt hat. Die anderen wiederholen den Fehler sonst schweigend, und du
findest ihn erst beim Zusammenführen.

### Entscheidungen, die den Zuschnitt ändern

Gehören dem Auftraggeber. Frag mit Empfehlung an erster Stelle. Entscheidet er
anders, wende **einmal** ein und führe dann aus.

---

## Fehler-Playbook

Ordne jeden Rücklauf **erst ein**, bevor du reagierst. Die Klasse entscheidet
über die Reaktion; ohne Einordnung ist die Reaktion immer „nochmal versuchen",
und das ist meistens falsch.

### Auftragsfehler

**Zeichen:** Der Agent arbeitet auf einem falschen Stand; eine Datei fehlt, die
er ändern sollte; er hält eine Konvention nicht ein, die nicht im Auftrag stand;
er baut etwas Richtiges an einer Stelle, die es nicht mehr gibt.

**Ursache:** Deine Ausstattung, nicht seine Ausführung.

**Reaktion:** Auftrag korrigieren, neu starten. **Nicht dem Agenten anlasten** —
und den Fehler in allen anderen Aufträgen derselben Welle mitkorrigieren.

⚠️ Der teuerste Vertreter ist der falsche Basisstand: Der Agent meldet grüne
Tests, weil sie **auf seinem Stand** grün sind. Verlangt der Auftrag den
`reset --hard` mit Kontrollausgabe, siehst du es an der Rückmeldung; ohne ihn
siehst du es beim Zusammenführen.

### Baufehler

**Zeichen:** Rote Prüfläufe, Kriterium nicht erfüllt, sonst innerhalb des
Rahmens.

**Reaktion:** `SendMessage` mit dem **echten Fehlertext**, nicht mit „bitte
korrigieren". Kein neuer Agent — der hat den Kontext nicht, in dem der Fehler
entstanden ist.

Gib den Fehlertext ungekürzt, aber gedeckelt weiter: die Zeilen um den Fehler
herum, nicht das ganze Log.

### Randüberschreitung

**Zeichen:** Der Diff enthält Dateien, die dem Paket nicht gehören.

**Reaktion:** **Nicht wegwerfen.** Den Teil im Rahmen behalten, den Rest als
Nebenfund ins Vorgangsbuch:

```bash
git diff <basis>..<agentenbranch> -- <dateien des pakets>   # das ist deins
git diff <basis>..<agentenbranch> -- <fremde dateien>       # das wird Nebenfund
```

Beim Cherry-Pick nimmst du nur den Teil im Rahmen. Der Rest wird in Phase 6
entschieden — oft ist er richtig und gehört in ein eigenes Paket.

Häufige Ursache: Der Auftrag nannte den Rand nicht oder nannte ihn zu spät. Prüf
das, bevor du es dem Agenten anlastest.

### Abriss

**Zeichen:** Keine Rückmeldung, Abbruch, oder ein als unvollständig
gekennzeichnetes Teilergebnis (etwa an der `maxTurns`-Grenze).

**Reaktion, in dieser Reihenfolge:**

1. **Erst prüfen, was schon da ist.** `git log` und `git diff` auf dem Branch
   des Agenten. Oft sind achtzig Prozent fertig.
2. **Fortsetzen, wenn möglich.** Ein an `maxTurns` gestoppter Agent ist per
   `SendMessage` fortsetzbar. ⚠️ `Explore` und `Plan` sind Einmalläufer und
   **nicht** fortsetzbar — für fortsetzbare Arbeit `general-purpose` oder eine
   eigene Rolle nehmen.
3. **Sonst frischer Agent mit demselben Auftrag plus dem Stand:** „Der Vorgänger
   hat <X> bereits gebaut, Stand `<sha>`. Baue darauf auf." Ohne diesen Satz
   fängt er bei null an.

### Zielfehler

**Zeichen:** Alles grün, Kriterium formal erfüllt, Ergebnis trotzdem nicht das,
was gemeint war.

**Reaktion:** **Nicht nachbessern lassen.** Das ist eine Abnahmefrage — geh nach
Phase 7 und klassifiziere dort. Ein Agent, der ein falsches Ziel nachbessert,
trifft es beim zweiten Versuch genauso wenig.

---

## Die Zwei-Fehlschläge-Regel

⚠️ **Zwei Fehlschläge am selben Paket sind ein Auftragsproblem, kein
Agentenproblem.**

Beim dritten Anlauf schreibst du den Auftrag neu oder schneidest neu.
Denselben Auftrag an einen dritten Agenten zu geben, erzeugt denselben Fehler —
nur später und teurer.

Fragen für den dritten Anlauf:

- Ist die **Etappe** zu groß? (Kommt regelmäßig ein Teilergebnis zurück → ja.)
- Ist das **Kriterium** überhaupt erfüllbar, so wie es dasteht?
- Fehlt eine **stille Falle**, die drei Agenten unabhängig getroffen haben?
- Ist die **Fläche** falsch geschnitten? (Braucht der Agent jedes Mal eine
  Datei, die ihm nicht gehört → ja.)

Der Zähler steht im Vorgangsbuch. Ohne ihn merkst du den dritten Anlauf nicht.

---

## Überwachungsblick nach jeder Welle

Bevor die nächste Welle startet, gehst du die Rückläufe **in Zahlen** durch:

| Prüfung | Womit |
| --- | --- |
| Lief jedes Paket auf dem richtigen Basisstand? | Der SHA aus der Rückmeldung gegen das Vorgangsbuch |
| Blieb jeder Diff im Rahmen? | `git diff --stat <basis>..<branch>` je Paket |
| Sind die Prüfläufe wirklich grün? | Der **echte** Exit-Code, nicht der von `tail` |
| Stimmen die gemeldeten Zahlen? | Selbst nachzählen: `grep -c`, `wc -l` |
| Gibt es Nebenfunde? | Ins Vorgangsbuch, sofort — nicht „später merken" |

⚠️ **Zähl jede gemeldete Zahl selbst nach**, bevor sie in einen Commit-Text,
einen Bericht oder ein Abnahmeurteil kommt. Dort wird sie zum Beleg, und eine
falsche Zahl, die einmal in einem Bericht steht, wird weiterzitiert.

Dann: Vorgangsbuch aktualisieren, zusammenführen, prüfen, nächste Welle.
