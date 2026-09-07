# Woher die Regeln kommen

Alle Warnungen im Skill stammen aus drei Vorgängen. Die Vorfälle 1 bis 10 aus
einer Nacht mit neun Agentenläufen an einem Frontend-Umbau: drei Etappen, zwölf
Dateien, drei Änderungssätze, Abnahme im Browser. Die Vorfälle 11 bis 18 aus
einem Vorgang über 12 Pakete in zwei Repos, 19 und 20 aus früheren Vorgängen
nachgetragen, 21 bis 23 aus einem Vertragsabgleich zwischen zwei Repos mit fünf
Läufen — die Nummern folgen der Reihenfolge des Eintragens, nicht der
Zeit. Nichts davon ist abgeleitet — jeder
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

**Nachtrag aus einem zweiten Lauf im geteilten Baum:** Bei vier parallelen
Paketen standen fünf `reset: moving to <basis>` im Reflog — von vier Agenten
plus dem Leitstand. Es ging nur ohne Verlust aus, weil alle Resets zeitlich vor
der ersten Änderung lagen. Zweimal fegte außerdem ein `git add -A` fremde,
unversionierte Dateien in einen fremden Änderungssatz; beide Male fiel es dem
Agenten selbst auf und wurde per `reset --soft` berichtigt. Gehalten hat am Ende
nicht die Isolation, sondern der **Schnitt**: disjunkte Dateimengen. Bei einer
geteilten Datei hätte es keine sichtbaren Konflikte gegeben, sondern stille
gegenseitige Überschreibung. Zwei Folgeregeln: kein `git add -A`, nur die
eigenen Pfade einzeln stagen — auch im eigenen Worktree, wo sonst Bauabfall
mitgeht. Und: im geteilten Baum ist ein roter Prüflauf **nicht automatisch der
eigene**; das hat mehrfach zu Fehlersuche am falschen Ort geführt.

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

## 19. Das Budget, das der eigene Auftrag sprengt

**Was passierte:** Die Rollen standen auf einem Zugbudget von 45. Der Auftrag,
den der Skill selbst vorschreibt, ist länger: Stand prüfen, Abhängigkeiten
installieren, bauen, gegenprüfen, lint/test/build als getrennte Läufe mit
echten Exit-Codes, committen, Rückmeldung. In einem Vorgang liefen **drei von
vier** Paketen bei genau 45 Zügen an — eines mit bereits grünem Build, eines
beim letzten von sechs Auftragspunkten. In einem früheren Lauf liefen zwei
Agenten ins Budget, **ohne eine einzige Zeile zu bauen**: sie waren beim
Pflichtlesen. Ein Paket verbrannte 62 Züge mit Nachschlagen im Wörterbuch des
Projekts und änderte keine einzige Datei.

**Die Regel:** Die Zahl der Züge folgt der Länge der vorgeschriebenen Kette,
nicht der Schwierigkeit der Aufgabe — also ist das Budget eine Stellschraube
bei der Besetzung, neben Typ, Modell und Zuschnitt. Wo das Werkzeug es kennt,
wird es für Bau- und Umbauaufträge angehoben, statt den Auftrag zu kürzen. Der
wirksamere Hebel ist aber der Auftrag selbst: **was der Leitstand entscheiden
kann, entscheidet er und schreibt das Ergebnis hinein.** Jede Nachschlagearbeit,
die im Auftrag stehen könnte, bezahlt der Agent aus seinem Budget — und der
Leitstand bezahlt sie noch einmal, wenn der Lauf daran abreißt.

## 20. Die Arbeit, die nie existiert hat

**Was passierte:** Drei Agenten liefen ins Zugbudget, alle drei mit
unversionierter Arbeit im Baum, einer davon mit bereits grünem Build. Sie waren
nur zu retten, weil per `SendMessage` nachgesteuert wurde und die erste Zeile
jeder Nachricht „committe sofort" lautete. Ein vierter Agent wurde nach einem
Fehlschlag abgezogen: seine gesamte Bauarbeit war weg, weil sie nie committet
worden war. Erhalten blieb nur, was er auf Nachfrage als Datei abgelegt hatte.

**Die Regel:** Committen ist eine **laufende** Handlung, keine abschließende —
nach jedem abgeschlossenen Schritt, auch unfertig. Beim Nachsteuern steht
„committe sofort" in der ersten Zeile, vor jeder inhaltlichen Anweisung: ein
Agent, der eine Korrektur bekommt, fängt sonst an zu arbeiten statt zu sichern.
Und die Bausteine stehen im Auftrag **nach Wert sortiert**, damit ein Abbruch
das Wichtigste fertig vorfindet und nicht das Vorbereitende.

**Zusammenhang mit Vorfall 19:** Ein höheres Budget verringert die Häufigkeit,
beseitigt die Fehlerklasse aber nicht. Beide Regeln gelten, nicht eine.

## Dritter Vorgang: ein Paket, zwei Repos, fünf Läufe, kein Abriss

Die Vorfälle 21 bis 23 stammen aus einem einzelnen Paket mit der Fassung 0.3.0
des Skills: ein Vertrag zwischen zwei Repos nachgezogen, 21 Dateien, ein
Änderungssatz gemerged. Fünf Agentenläufe — zwei Scouts, zwei Bauagenten, ein
Prüfer.

⚠️ **Null Abrisse am Zuglimit**, gegen „rund jeder zweite Lauf" aus Vorfall 11.
Der Unterschied lag nicht am Budget, das war unverändert, sondern daran, dass
die Aufträge die Messungen schon **enthielten**: der Leitstand hatte alle 30
Anker selbst gegen das Nachbarrepo gemessen und als Tabelle in den Bauauftrag
gelegt, statt den Agenten messen zu lassen. Das ist Vorfall 19, angewandt statt
nachgelesen — und es ist der bislang stärkste Beleg dafür, dass die
Abrisshäufigkeit an der Vorarbeit hängt und nicht am Modell.

## 21. Der Wächter, der in dieser Umgebung nie grün werden kann

**Was passierte:** Der Push scheiterte viermal in Folge. Der Fehltext lautete
`failed to push some refs to …` — die Form, in der auch ein Netzwerkfehler
erscheint. Also lief die vorgesehene Wiederholung mit Backoff durch, 2s, 4s,
8s, 16s, und scheiterte jedes Mal. Erst der Blick in den `pre-push`-Haken zeigte
die Ursache: er fährt die volle Prüfkette, und zwei Tests fallen in dieser
Umgebung aus einem strukturellen Grund — sie binden auf IPv6, das die
Cloud-Maschine nicht hat.

**Warum das teuer war:** Der Haken kann dort für **keinen** Commit grün werden,
auch nicht für den unveränderten Standardbranch. Keine Wiederholung konnte je
helfen. Die vier Anläufe waren nicht nur verloren, sie sahen aus wie ein
Infrastrukturproblem und lenkten von der Ursache weg.

**Regel:** Ein fehlgeschlagener Push wird **einmal** gelesen, bevor er
wiederholt wird. Wiederholen ist nur bei einem belegten Netzwerkfehler richtig;
ein Haken, der die Prüfkette fährt, scheitert deterministisch. Und: bevor
`--no-verify` fällt, wird die Kette von Hand gefahren, ihre echten Exit-Codes
kommen in den Änderungstext, und im PR steht, dass der Haken auf einer
tauglichen Maschine nachzufahren ist. Ein `--no-verify` ohne diese Kette bleibt
das Abschalten der einzigen Schranke.

**Übertragbar:** Zum Projektprofil gehört nicht nur, welche Tests in dieser
Umgebung fallen, sondern **was das für den Push bedeutet**. Das eine ohne das
andere ist die Hälfte, und die fehlende Hälfte kostet einen Anlauf.

## 22. Der Messweg, den der Leitstand gehen kann und der Agent nicht

**Was passierte:** Der Bauauftrag nannte als Messweg `git -C <nachbarrepo> show
<sha>:<datei>`. Der Leitstand hatte diesen Weg selbst benutzt, um die Tabelle im
Auftrag zu erzeugen. Beim Agenten verweigerte die Worktree-Isolation **jeden**
git-Aufruf auf jenes Verzeichnis — `git -C` genauso wie `cd && git`. Er merkte
es erst mitten in der Arbeit und wich auf das Lesen der Dateien aus.

**Warum das gefährlich ist:** Es ging hier gut, weil der Agent selbst umschwenkte
und es meldete. Ein Agent, der stattdessen die Zahlen aus dem Auftrag ungeprüft
übernimmt, liefert eine Arbeit, deren Gegenprobe nie gelaufen ist — und niemand
sieht es, weil das Ergebnis richtig aussieht.

**Regel:** Der Leitstand hat Zugriffe, die der Agent nicht hat. **Jeder Messweg
im Auftrag wird daraufhin geprüft, ob der Agent ihn überhaupt gehen kann** —
Nachbarrepos, Netz, Anmeldedaten, Werkzeuge. Wo er es nicht kann, nennt der
Auftrag den Weg, den er gehen kann, und dazu, woran der Stand der fremden Quelle
zu belegen ist. Und der Agent bekommt ausdrücklich gesagt, dass die Zahlen im
Auftrag Vorgabe sind, die Gegenprobe am Ende aber trotzdem Pflicht.

## 23. Zwei Wächter, die einander ausschlossen

**Was passierte:** Beim Zuschnitt fiel auf, dass ein Wächter jede getrackte
Datei liest und dort eine Fassungsangabe auf einem einheitlichen Stand verlangt.
Zwei dieser Angaben standen in **angewandten Datenbank-Migrationen**, die ein
anderer Mechanismus per Prüfsumme einfriert. Ein geänderter **Kommentar** in
einer davon hätte jede bestehende Installation beim Start anhalten lassen.

**Warum das kein Testproblem war:** Beide Wächter waren einzeln richtig. Zusammen
waren sie unerfüllbar, sobald die Fassung wechselt — und gemerkt hatte es
niemand, weil sie seit Einführung des einen Wächters nicht gewechselt hatte. Der
Fund kam aus der Messung vor dem Schneiden, nicht aus einem roten Lauf. Wäre er
erst beim Bauen aufgefallen, hätte der naheliegende Ausweg (Kommentar
mitziehen) einen Ausfall im Betrieb erzeugt, den keine Prüfkette gefangen hätte.

**Regel:** Vor dem Schneiden prüfen, ob der Änderungssatz eine Datei berührt, die
ein **anderer** Mechanismus als unveränderlich führt — Migrationen,
Archivstücke, Prüfsummen, Sperrdateien. Das ist die Fortsetzung von Vorfall 5
(„der Schnitt folgt den Wächtern") um einen Fall, den man nicht sieht, indem man
die Tests liest: die zweite Regel steht gar nicht im Testverzeichnis.

**Und der Ausweg gehört dem Auftraggeber, nicht dem Agenten.** Er lief hier auf
eine Ausnahme im Wächter hinaus und damit auf eine **gesenkte Marke** — zulässig
allein deshalb, weil sich die Zählweise änderte und nicht weil ein Fall riss.
Der Unterschied gehört als Satz neben die Marke, sonst liest der Nächste sie als
Erlaubnis.

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

Aus dem dritten Vorgang dazugekommen:

- ⚠️ **Der Prüfer hat gefunden, was drei andere übersahen.** Zwei Bauagenten und
  der Leitstand hielten das Paket für fertig; die Prüfkette war grün, die
  Abnahme lief mit Rückgabecode 0. Der Prüfer fand **fünf falsche Zahlen** in
  der Begründung — die Datei zählte ihren eigenen Bestand falsch, unter anderem
  „53 Anker in 24 Dateien" statt 58 Vorkommen auf 53 Zeilen in 25 Dateien.
  Der Grund, aus dem es niemandem auffiel: die neue Zeilenzahl **glich zufällig
  der alten Vorkommenzahl**, die Stelle sah also richtig aus. Das ist die
  Fehlerklasse, gegen die kein grüner Lauf hilft, und der Beleg dafür, dass sich
  die Prüferrolle schon bei zwei Läufen lohnt.
- **Der Leitstand misst, der Agent trägt ein.** Alle Zeilennummern gegen das
  Nachbarrepo waren vor dem ersten Bauauftrag gemessen und lagen als Tabelle
  darin. Kein Lauf riss ab (gegen rund die Hälfte im zweiten Vorgang), und der
  Bauagent verbrauchte seine Züge auf Bauen statt auf Nachschlagen.
- **Der benannte Befund statt der stillen Entscheidung.** Der Auftrag verlangte
  ausdrücklich, ein mehrdeutiges Suchmuster **entweder** zu schärfen **oder** zu
  begründen — „nicht stillschweigend so lassen". Der Agent schärfte es und
  begründete zusätzlich eine Stelle, an der er bewusst auf einen Anker
  verzichtete, weil zwei Fundstellen zeichengleich sind. Beides wäre ohne die
  Zeile im Auftrag unsichtbar geblieben.
- **Die Gegenprobe gegen die alte Basis.** Vor dem Nachziehen wurde gemessen,
  dass alle Anker gegen den **alten** Stand noch trafen. Damit stand fest, dass
  ein Fassungswechsel ansteht und keine Fehlerbehebung — und der Auftrag konnte
  sagen „du trägst ein, du misst nicht neu", ohne zu raten.

## Offen

- ⚠️ **Ob eine Marke sinken darf, ist die eine Regel, die ein Agent nicht allein
  entscheiden kann.** Im dritten Vorgang war die Senkung richtig (geänderte
  Zählweise) und wurde vom Leitstand vorentschieden und in den Auftrag
  geschrieben. Ungeprüft ist, ob ein Agent den Unterschied zwischen „Zählweise
  geändert" und „Fall gerissen" ohne diese Vorentscheidung zuverlässig trifft.
  Bis dahin gilt: **der Leitstand entscheidet jede Senkung, der Agent führt sie
  aus.**
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
