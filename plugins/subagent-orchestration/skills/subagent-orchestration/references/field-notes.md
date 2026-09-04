# Woher die Regeln kommen

Alle Warnungen im Skill stammen aus einer Nacht mit neun Agentenläufen an einem
Frontend-Umbau: drei Etappen, zwölf Dateien, drei Änderungssätze, Abnahme im
Browser. Nichts davon ist abgeleitet — jeder Punkt hat Nacharbeit gekostet, und
die Nacharbeit war jedes Mal teurer als die Zeile im Auftrag, die sie verhindert
hätte.

Diese Datei ist der Beleg. Wer eine Regel im Skill für übertrieben hält, liest
hier nach, was ohne sie passiert ist.

## 1. Der fehlende Basis-Commit

**Was passierte:** Vier Agenten liefen los, bevor auffiel, dass ihre Worktrees
am Standardbranch hängen und nicht am Arbeitsbranch. Einer sollte eine Datei
reparieren, die auf seinem Stand noch gar nicht in der zu reparierenden Form
existierte — er baute etwas Richtiges an einer Stelle, die es nicht mehr gab.
Zwei mussten ihren Stand nachträglich per `reset --hard` umsetzen und ihre
Arbeit wiederholen.

**Die Regel:** Der Basis-Commit als SHA steht in **jedem** Auftrag, auch wenn
du glaubst, der Agent stünde richtig, und der Agent prüft ihn mit
`git rev-parse HEAD`, bevor er anfängt. Die erste Fassung dieser Regel ließ den
Agenten selbst per `reset --hard` umsetzen — das fiel mit Vorfall 9: das
Worktree legt der Organisator an, der Agent setzt nichts zurück.

**Warum es nicht auffällt:** Der Agent meldet grüne Tests. Sie sind auf seinem
Stand auch grün.

## 2. Konventionen als Verweis statt wörtlich

**Was passierte:** Die Konventionsdatei des Projekts verlangt korrekte Umlaute,
ausdrücklich auch im Commit-Betreff. Vier Commit-Texte kamen mit `ae`/`oe`/`ue`
zurück und mussten amendiert werden — inklusive der Sorgfalt, dabei echte
Bezeichner und Dateinamen nicht mit zu „korrigieren".

**Die Regel:** Konventionen zu Zeichensatz, Sprache und Commit-Form stehen
**wörtlich** im Auftrag. Der Verweis auf die Datei genügt nicht.

**Warum:** Der Agent liest die Datei. Er hält die Regel trotzdem nicht ein — sie
konkurriert mit seiner eigenen Gewohnheit, und die gewinnt, solange sie nicht im
Auftrag steht.

## 3. Der Exit-Code der Pipe

**Was passierte:** `pnpm run test 2>&1 | tail -25; echo "test=$?"` meldete `0`.
Das war der Exit-Code von `tail`. Der Testlauf selbst wurde nie geprüft, und die
Aussage „grün" ging so in einen Bericht.

**Die Regel:** Ausgabe in eine Datei, Exit-Code direkt danach fangen, dann erst
das Ende ansehen.

**Nachtrag:** Der Fehler wurde offen korrigiert, statt ihn stillschweigend
richtigzustellen. Eine falsche Zahl, die einmal in einem Bericht steht, wird
weiterzitiert.

## 4. Die lautlos verfallene Marke

**Was passierte:** Ein Wächtertest hielt fest, wie viele Aufrufstellen eine
bestimmte Komponente hat: `>= 13`. Tatsächlich waren es 15. Zwei waren seit der
letzten Etappe dazugekommen, **ohne dass etwas rot wurde** — eine
Mindestschwelle wird nicht verletzt, wenn der Bestand über sie hinauswächst.

**Die Regel:** Jede `>=`-Marke bei jeder Etappe nachzählen statt sie zu
übernehmen. Der Auftrag sagt das dem Agenten ausdrücklich.

**Die allgemeinere Form:** Ein Test, der eine Untergrenze prüft, misst nur eine
Richtung. Er ist kein Inventar, sondern ein Alarm — und schweigt in die andere
Richtung.

## 5. Der Wächter, der per Bauart fällt

**Was passierte:** Ein Test hielt einen Übergang fest und behauptete
`gefunden > 0` — solange noch Altbestand da ist, ist er grün. Nach der letzten
Migration sind es null Treffer, und er fällt. Das war beabsichtigt und stand in
seinem eigenen Kopf.

**Die Folge für den Schnitt:** Der geplante Änderungssatz „nur die alten
Regeln löschen" war nicht baubar. Der Satz davor wäre rot gewesen, sobald zwei
Vorarbeiten zusammenkamen. Der Schnitt musste umgebaut werden, nachdem er
schon stand.

**Die Regel:** Vor dem Schnitt prüfen, welcher Wächter bei welcher Kombination
kippt. Der Schnitt folgt den Wächtern, nicht der Ästhetik.

## 6. Der Fall, der ohne den Fix falsch wäre

**Was passierte:** Eine Größentabelle mit acht Werten wurde live geprüft. Die
Prüfung am größten Wert (880 px) hätte auch ohne den Fix bestanden — die
Bündelreihenfolge sortiert nach Wert, der größte gewinnt ohnehin. Erst die
Prüfung am **kleinsten** (440 px) belegte, dass der Fix wirkt: ohne ihn hätten
vier der sieben Größen still verloren.

**Die Regel:** Prüfe den Fall, der ohne den Fix falsch wäre. Eine Abnahme am
Fall, der ohnehin gewinnt, beweist nichts und fühlt sich trotzdem gut an.

## 7. Der Schnitt aus dem Vorgang war falsch

**Was passierte:** Der Vorgang schrieb eine Reihenfolge vor („Ordner A zuerst").
Die Messung zeigte: die CSS-Datei in Ordner A ist keine Flächendatei, sondern
eine gemeinsame Sprachdatei mit 16 Importeuren aus beiden Ordnern. Ordner A
konnte gar nicht zuerst fertig werden.

**Die Regel:** Vor dem Schnitt messen, wer wen importiert. Die vorgegebene
Reihenfolge ist eine Vermutung, bis sie geprüft ist — und eine falsche
Reihenfolge merkst du erst, wenn drei Agenten schon darauf aufsetzen.

## 8. Zwei Agenten in einer Datei

**Was passierte:** Zwei Arbeitssätze berührten dieselbe Komponente und
dieselbe Testdatei. Beim Zusammenführen mussten drei Konflikte von Hand
aufgelöst werden — darunter einer, bei dem ein Agent eine Regel
wiederhergestellt hatte, die der andere gelöscht hatte, weil sein Basisstand sie
noch enthielt.

**Die Regel:** Eine Datei gehört genau einem Agenten. Wenn zwei sie brauchen,
laufen sie nacheinander, nicht parallel.

## 9. Der Hauptcheckout statt eigenes Worktree

**Was passierte:** Ein Auftrag enthielt wie vorgeschrieben `git reset --hard
<sha>`. Die Agenten liefen aber nicht in einem eigenen Worktree, sondern im
Hauptcheckout — demselben Stand, in dem der Auftraggeber selbst arbeitete.
Ein `git reset --hard` dort hätte echte, ungesicherte Arbeit gelöscht. Beim
Nachprüfen zeigte das Reflog keinen ausgeführten Reset, und der Hauptcheckout
stand ohnehin schon auf der verlangten SHA — es ging nichts verloren, aber nur
durch Zufall.

**Die Regel:** Jedes Baupaket bekommt sein **eigenes** Worktree, angelegt vom
Organisator — über die Worktree-Isolation des Agent-Werkzeugs, wo es sie gibt,
sonst per `git worktree add <pfad> <sha>` — nicht nur eine Basis-SHA zum
Selbst-Zurücksetzen. Der Auftrag nennt den Worktree-Pfad wörtlich, und der
Agent prüft Pfad und SHA, statt etwas zurückzusetzen. Ein `reset --hard` im
Auftrag ist damit ganz gefallen.

**Warum es nicht auffällt:** Ein `reset --hard`, der zufällig auf dem
richtigen Stand landet, sieht wie ein normaler Lauf aus. Der Unterschied
zwischen „im eigenen Worktree" und „im geteilten Hauptcheckout" steht in
keiner Ausgabe, die der Agent von sich aus meldet.

## 10. Die unbelegte Bestandsaussage

**Was passierte:** Ein Scout-Auftrag sollte die Karte eines Repos ziehen:
welche Verzeichnisse es gibt, welche Klassen tot sind. Der Bericht behauptete,
`web/tests/ui/` und `browser/` existierten nicht, und 29 Klassen seien totes
Fläche. Beides war falsch — beide Verzeichnisse existierten, und die 29
Klassen wurden aus `docker/`-Dateien heraus benutzt, einem Verzeichnis, das
eine Quellcode-Suche typischerweise nicht mitnimmt. Erst das Nachzählen von
Hand deckte es auf.

**Die Regel:** Bestands- und Totcode-Aussagen sind Behauptungen, keine
Fakten. Der Auftrag verlangt zu jeder solchen Aussage den Rohbefehl und seine
Ausgabe (`ls`/`find` für Existenz, `grep -r` über den **ganzen** Baum für
Totcode) — und der Suchraum wird ausdrücklich genannt, inklusive
Verzeichnissen, die keine Quelldateien im engeren Sinn enthalten (`docker/`,
`ci/`, `scripts/`, Infrastruktur-Konfiguration). Eine Suche, die sich auf
„übliche" Quellverzeichnisse beschränkt, liefert ein falsches Negativ, das
wie ein Fakt aussieht.

**Nachtrag zur leichten Modellstufe:** Das war der erste Einsatz von Haiku für
„suchen, zählen" (siehe „Offen" unten) — und ein Rückläufer. Nicht zwingend
weil Haiku dafür ungeeignet wäre, sondern weil der Auftrag den Suchraum nicht
festgelegt und keinen Rohbefehl als Beleg verlangt hatte. Die Fehlerklasse
war für das Modell nicht vermeidbar, weil sie im Auftrag fehlte.

## Was gut funktioniert hat

- **Modellwahl nach Fehlerklasse.** Die Arbeiten mit stillen Fehlerklassen
  (Radix, Fokus, Spezifität) liefen auf dem starken Modell, die messenden und
  löschenden auf dem mittleren. Kein einziger Rückläufer kam aus einer
  Fehleinschätzung der Modellstufe.
- **Nachsteuern statt Neustarten.** Ein laufender Agent, der eine Korrektur per
  Nachricht bekam, war in Minuten wieder auf Kurs. Ein Ersatzagent hätte den
  ganzen Kontext neu hergeleitet.
- **Korrektur an alle.** Als ein Fehler in der eigenen Ausstattung auffiel, ging
  die Korrektur an alle laufenden Agenten. Die drei, die noch nicht gefragt
  hatten, hätten ihn sonst wiederholt.
- **Fragen statt raten.** Vier Entscheidungen, die den Zuschnitt änderten, gingen
  mit Empfehlung an den Auftraggeber zurück. Eine wurde gegen die Empfehlung
  entschieden — das war sein Recht und kostete nichts, weil die Frage vorher
  kam und nicht hinterher.

## Offen

- **Leichte Modellstufe (Haiku) bei sauber gefasstem Auftrag.** Der erste
  Einsatz (Vorfall 10) war ein Rückläufer, aber mit einem eindeutigen Loch im
  Auftrag: kein festgelegter Suchraum, kein verlangter Rohbefehl als Beleg. Ob
  Haiku bei einem Auftrag reicht, der beides nennt, ist noch nicht gemessen —
  das gehört oben in „Was gut funktioniert hat" oder als neuer Vorfall nach,
  sobald es so einen Lauf gab.
