# Woher die Regeln kommen

Alle Warnungen im Skill stammen aus zwei Vorgängen. Die Vorfälle 1 bis 10 aus
einer Nacht mit neun Agentenläufen an einem Frontend-Umbau: drei Etappen, zwölf
Dateien, drei Änderungssätze, Abnahme im Browser. Die Vorfälle 11 bis 18 aus
einem Vorgang über 12 Pakete in zwei Repos. Nichts davon ist abgeleitet — jeder
Punkt hat Nacharbeit gekostet, und die Nacharbeit war jedes Mal teurer als die
Zeile im Auftrag, die sie verhindert hätte.

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

## Zweiter Vorgang: 12 Pakete, zwei Repos, rund 45 Läufe

Die Vorfälle 11 bis 18 stammen aus einem einzelnen Vorgang mit dieser Fassung
des Skills: 12 Pakete in zwei Repos, 11 Änderungssätze gemerged, rund 45
Agentenläufe, ein Sitzungslimit-Abriss zwischendurch. Die Zahlen sind aus dem
Vorgangsbuch gezählt und gerundet.

## 11. Das Zuglimit reißt den Agenten ab, und niemand erfährt etwas

**Was passierte:** Etwa 25 der rund 45 Läufe endeten am Zugbudget ihrer Rolle.
Die Benachrichtigung enthält dann nur den letzten Gedanken („Now the router
with the three admin routes.") — keine Rückmeldung, keine Zahlen, kein Stand.
Der Leitstand musste jedes Mal das Worktree selbst lesen, den Zwischenstand
fremd committen (sechsmal) und einen frischen Agenten mit rekonstruiertem Stand
ansetzen.

Nach Rolle:

- **Scouts** scheiterten an Aufträgen mit mehr als 5 Suchpunkten fast immer:
  3 von 7 lieferten erst nach einer Fortsetzung.
- **Umbauten** über etwa 10 Dateien brauchten 3–4 Abschnitte (einer: 135 Züge
  bei 24 Testdateien). Größter Zugfresser: große Testdateien vollständig lesen
  statt `grep -n`.
- **Prüfaufträge** mit mehr als 6 Kriterien starben dreimal, ohne ein einziges
  Urteil abzugeben — obwohl die Läufe (lint/test/build, Mutationen) schon auf
  Platte lagen.
- **Bauaufträge** schafften große Pakete in 2–3 Abschnitten; ihre Zwischencommits
  retteten den Stand nur dort, wo der Auftrag sie ausdrücklich vorschrieb.

**Die Regel:** Der Abriss ist der Regelfall, nicht die Ausnahme, also wird gegen
ihn gebaut statt auf ihn reagiert. Erstens Deckel beim Schnitt: Scout ≤ 5
Suchpunkte, Prüfauftrag ≤ 6 Kriterien und ein Prüflauf, Umbau ≤ 8–10 Dateien.
Zweitens eine Rückmeldedatei, die nach jedem Baustein fortgeschrieben wird —
beim Prüfer hat genau das sofort funktioniert, sobald der Auftrag „jedes Urteil
sofort per `>>` in die Datei" verlangte. Drittens Zwischencommit je Baustein als
Pflicht im Auftrag, nicht als Bitte. Viertens Lesedisziplin (`grep -n` statt
ganzer Datei) und ein Abbruch von sich aus, bevor das Budget reißt.

**Warum es nicht auffällt:** Ein Abriss am Zuglimit sieht aus wie ein normal
beendeter Lauf, nur ohne Antwort. Nichts in der Benachrichtigung sagt, dass die
Arbeit auf halbem Weg steht.

## 12. Nach dem Sitzungslimit gibt es kein Nachsteuern mehr

**Was passierte:** Ein `429 session limit` mitten im Vorgang. Alle laufenden
Agenten waren tot, und `SendMessage` blieb bis Sitzungsende nicht verfügbar.
Der Skill baute bis dahin auf „Nachsteuern statt Neustarten" — genau das war
nicht mehr möglich.

**Die Regel:** Der Weg für den Abriss ist Standard, nicht Ausnahme:
Zwischenstand vom Leitstand committen (Betreff „Zwischenstand", Body: „vom
Leitstand unverändert committet"), dann ein frischer Agent mit einem
Stand-Absatz im Auftrag. Das hat sich über den ganzen Vorgang als robust
erwiesen.

**Nebenbefund:** Drei gleichzeitige Läufe auf dem starken Modell plus einer auf
dem mittleren haben das Limit gerissen. Die Wellenbreite kostet nicht nur
Kontext, sondern Kontingent.

## 13. Der Nachtrag ohne Prüfkette

**Was passierte:** An einem bereits geprüften Paket wurde ein Testfall ergänzt
(57 Zeilen). Der Nachtrag lief nur seinen eigenen Einzeltest. Der
Standardbranch war danach auf einem Ratchet-Wächter rot, ohne dass es jemand
sah — bis das nächste Paket darauf aufsetzte.

**Die Regel:** Jeder Nachtrag an einem schon geprüften Paket wiederholt die
volle Prüfkette auf dem Paketstand. „Es ist nur ein Testfall" ist die
Begründung, mit der es schiefgeht.

## 14. Der Prüfer, der aus einer Kopie testete

**Was passierte:** Ein Prüfer fuhr die Wächtertests aus einer Temp-Kopie des
Verzeichnisses. Sieben Tests, die `git ls-files` und `core.hooksPath` lesen,
wurden rot — der Branch selbst war grün. Der Befund war frei erfunden, die
Nacharbeit echt.

**Die Regel:** Der Testlauf findet immer im Worktree statt. Mutationsproben
ändern GENAU EINE Datei im Worktree und stellen sie danach per
`git show HEAD:<pfad> > <pfad>` zurück — statt den ganzen Baum zu kopieren.

## 15. Der doppelt kodierte Betreff

**Was passierte:** Zweimal landete ein doppelt kodierter Betreff auf dem
Standardbranch (`â€” A4 des RÃ¼ckbaus`): einmal aus einem `--title` in
derselben Bash-Zeile wie ein `perl -pi`, einmal aus einem `printf`. Der
Squash-Merge übernimmt den PR-Titel ungeprüft, also steht er dauerhaft im
Verlauf. Dazu zweimal Betreffe mit `ae`/`oe`/`ue` von Bauagenten, obwohl der
Auftrag es verbot — die Rolle trug die Regel nicht, nur der Auftrag.

**Die Regel:** Titel und Betreffe nie inline. Text in eine UTF-8-Datei,
Übergabe per `-F` / `--body-file`, vor dem Merge den Titel gegenlesen, nach dem
Commit `git log --format=%s -1 | od -c`. Die Umlautregel steht im Rollenprompt,
nicht nur im Einzelauftrag.

## 16. Worktrees unter Windows

**Was passierte:** Drei Reibungen in Folge:

- `node_modules` zwischen Worktrees kopieren bricht pnpm
  (`confirmModulesPurge`). Der saubere Weg ist je Worktree
  `CI=true pnpm install --frozen-lockfile --prefer-offline` — 7 Sekunden bei
  warmem Store.
- `git worktree remove` scheitert an `Filename too long`. Was funktioniert:
  `Remove-Item -Recurse -Force` in PowerShell, danach `git worktree prune`.
- Tests aus dem Repo-Wurzelverzeichnis (`node --test --import tsx`) melden
  „1 test, 1 fail", wenn `tsx` nur im Paket liegt. Das sieht aus wie ein
  Baufehler des Agenten und ist keiner.

**Die Regel:** Der Befehl, der ein frisches Worktree lauffähig macht, gehört
ins Projektprofil, ebenso das Verzeichnis, aus dem die Prüfbefehle laufen. Der
dritte Punkt ist eine stille Falle wie jede andere und gehört in dieselbe
Liste.

## 17. Der rote Wächter auf „fremdem Gebiet"

**Was passierte:** Ein Bauagent meldete einen roten Wächtertest als „fremdes
Gebiet" und lieferte fertig. Die Ursache lag in seiner eigenen Datei — ein
deutscher Bezeichner, den der Wächter verbot.

**Die Regel:** Ein roter Wächter, dessen Ursache in den eigenen Dateien liegt,
ist der eigene Auftrag — auch wenn der Wächter selbst niemandem gehört. Erst
wenn die Ursache nachweislich außerhalb liegt, ist er ein Befund für die
Rückmeldung. Der Satz steht im Rollenprompt.

## 18. Das Abnahmekriterium, das Prosa traf

**Was passierte:** Zwei Abnahmekriterien waren als wörtlicher Grep gefasst
(„`ghcr.io` → 0 Treffer", „`grep notification docs/*.md` leer"). Beide trafen
auch Fließtext, Kommentare und einen Image-Namen und waren damit unerfüllbar,
obwohl die Arbeit stimmte.

**Die Regel:** Ein Grep auf ein Wort ist kein Kriterium über Code, sondern über
den ganzen Text. Kriterien werden vor dem Auftrag am Bestand gegengeprüft. Das
Verfahren im Lauf hat funktioniert und bleibt: Der Agent meldet ein falsch
gefasstes Kriterium als Befund und prüft es trotzdem wie geschrieben —
nachverhandelt wird nicht.

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

Aus dem zweiten Vorgang dazugekommen:

- **Das Vorgangsbuch als Zustand.** Eine Datei, die den Stand trägt statt des
  Verlaufs. Sie hat zwei Verdichtungen des Kontexts überstanden; ohne sie wäre
  der Vorgang beim Sitzungslimit zu Ende gewesen.
- **Mutations-Gegenproben.** Bauagent und Prüfer belegen mit einer Änderung an
  genau einer Datei, dass der Test überhaupt fallen kann. Zweimal war er es
  nicht.
- **Rückmeldevertrag in Zahlen.** Zeilen, Marken vorher/nachher, echter
  Exit-Code — daran ließ sich ein abgerissener Lauf rekonstruieren, ein
  Prosabericht hätte es nicht.
- **Die Disziplin im Rollenprompt statt im Einzelauftrag.** Alles, was nur im
  Auftrag stand, fiel bei mindestens einem Agenten aus (Umlaute, Zwischencommit,
  fremder Wächter).

## Offen

- **Leichte Modellstufe (Haiku) bei sauber gefasstem Auftrag.** Der erste
  Einsatz (Vorfall 10) war ein Rückläufer mit einem Loch im Auftrag: kein
  festgelegter Suchraum, kein verlangter Rohbefehl als Beleg. Im zweiten
  Vorgang lieferten 7 Scouts auf der leichten Stufe mit festgelegtem Suchraum
  brauchbar; 3 davon aber erst nach einer Fortsetzung, und die Grenze war
  jedes Mal das Zugbudget, nicht das Urteil (Vorfall 11). Damit ist die Stufe
  für „suchen und zählen" belegt, sobald der Auftrag den Suchraum nennt und der
  Schnitt bei 5 Punkten hält. Offen bleibt, ob es am Modell oder am Budget
  liegt, dass größere Suchaufträge scheitern — dafür fehlt ein Lauf mit
  demselben Auftrag auf der mittleren Stufe.
- **Die Zahlen hinter den Deckeln.** 5 Punkte / 6 Kriterien / 8–10 Dateien sind
  aus einem Vorgang gezählt, nicht gemessen. Sie sind belegt genug, um im Skill
  zu stehen, und ungenau genug, um sie beim nächsten Vorgang nachzuziehen.
