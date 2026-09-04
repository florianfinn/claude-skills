# Die Auftragsvorlage

Drei Fassungen: die **volle** für Bauagenten, die Dateien ändern und committen,
die **Kurzvorlage für Scouts**, die nur suchen, zählen und melden, und die
**Kurzvorlage für Prüfaufträge** für den unabhängigen Blick auf einen fertigen
Stand. Beide Kurzfassungen stehen am Ende dieser Datei.

Was ein Subagent mitbekommt. Platzhalter in `<spitzen Klammern>` aus dem
Projektprofil ersetzen, den Rest wörtlich stehen lassen.

Ein Auftrag ist **selbsttragend**: der Agent hat weder deinen Verlauf noch den
Vorgang gelesen. Was er nicht im Auftrag findet, leitet er her — plausibel, aber
nicht unbedingt richtig.

---

```
Du baust <Etappe/Teilaufgabe>. Die Begründung und die Dateiliste stehen in
<Plandokument>; lies dort zuerst den Abschnitt zu dieser Etappe.

## Basis

Du arbeitest in deinem eigenen Worktree unter <worktree-pfad> auf dem Stand
<basis-sha> — nicht im Hauptcheckout. Prüfe beides, bevor du irgendetwas tust:

    git rev-parse --show-toplevel   # muss <worktree-pfad> sein
    git rev-parse HEAD              # muss <basis-sha> sein

Stimmt eines nicht, **stopp und melde es** — kein `checkout`, kein
`reset --hard`, kein `fetch`. Ein Reset im falschen Checkout trifft fremden,
ungesicherten Stand. Deine Arbeit beginnt erst, wenn beides stimmt.

## Auftrag

<Was zu tun ist, mit vollständiger Dateiliste.>

<Falls Alt gegen Neu getauscht wird: Das Alte fällt im selben Commit, in dem
sein Ersatz entsteht. Ein Umbau, der den Bestand stehen lässt, ist nicht
fertig, sondern doppelt.>

## Nicht dein Auftrag

Der Diff enthält nichts Fremdes. Diese Dateien fasst du NICHT an:
<Dateien, die anderen Agenten gehören.>

Fällt dir dort etwas auf, schreib es in die Rückmeldung, nicht in den Diff.

Du mergst nicht, du deployst nicht, und du machst keinen Wächtertest „grün",
indem du seine Marke senkst.

## Konventionen

<Hier die Regeln des Projekts WÖRTLICH einsetzen, nicht als Verweis.
Mindestens: Zeichensatz und Sprache, Commit-Form, was der Commit-Body nennen
muss. Beispiel aus einem deutschsprachigen Repo:>

- Umlaute und ß werden richtig gesetzt — auch im Commit-Betreff. Kein `ae`,
  `oe`, `ue`, `ss` als Ersatz. Bezeichner und Dateinamen bleiben englisch und
  unverändert.
- Commit: Conventional Commits, deutscher Betreff, `(#<vorgang>)` am Ende. Der
  Body nennt, was raus ist, was bewusst verloren geht, die Messwerte und die
  Testzahlen.
- Commit-Betreff und PR-Titel schreibst du in eine UTF-8-Datei und übergibst
  sie per `git commit -F <datei>` bzw. `--body-file`. Inline in einer Bash-Zeile
  kippen Umlaute still zu `RÃ¼ck` / `â€”`, und der Squash-Merge übernimmt das
  ungeprüft.
- Jede Aussage über Größe oder Bestand trägt die Zahl UND den Befehl, der sie
  erzeugt hat.

## Stille Fallen auf dieser Fläche

<Jede Fehlerklasse, die in der Testumgebung unsichtbar bleibt, namentlich und
mit der Bauart dagegen. Was ein Test fängt, gehört hier NICHT hin — nur was
grün durchkommt. Beispiel:>

- `cn` ist ohne `tailwind-merge` gebaut: zwei gleichartige Utilities am selben
  Element lösen sich NICHT auf, es entscheidet die Reihenfolge im erzeugten
  Bündel. In jsdom unsichtbar — die Tests bleiben grün, die Fläche ist falsch.
  Bauart dagegen: Datenattribut plus `data-[…]:`-Präfix.

## Wächter

Diese Tests ziehst du nach: <Liste>.

Zähl jede Marke der Form `>= N` darin NACH, statt sie zu übernehmen. Solche
Marken verfallen lautlos: nichts wird rot, wenn der Bestand über sie
hinauswächst. Stimmt eine Zahl nicht mehr, korrigierst du sie und nennst beide
Werte in der Rückmeldung.

Ein roter Wächter, dessen Ursache in DEINEN Dateien liegt, ist dein Auftrag —
auch wenn der Wächter selbst fremdes Gebiet ist. Erst wenn die Ursache
nachweislich außerhalb deiner Dateien liegt, ist er ein Befund für die
Rückmeldung.

## Zugbudget

Dein Lauf hat ein Zugbudget, und er endet daran ohne Vorwarnung — mitten im
Satz, ohne dass jemand deine Rückmeldung liest. Dagegen:

- Nach JEDEM Baustein schreibst du deinen Stand in `<rückmeldedatei>` fort:
  was fertig ist, die Zahlen dazu, was offen ist, was als Nächstes kommt. Diese
  Datei ist die Rückmeldung — nicht dein Schlusstext.
- **Committen ist eine laufende Handlung, keine abschließende.** Nach JEDEM
  Baustein committest du den Zwischenstand auf deinem Branch (Betreff
  `Zwischenstand: <was fertig ist>`), auch unfertig. Was beim Abriss nicht
  committet ist, ist verloren, und der Lauf ist nicht fortsetzbar.
- Du stagst **nur deine eigenen Pfade**, einzeln benannt. Kein `git add -A`: es
  nimmt Bauabfall und im geteilten Baum fremde Arbeit mit.
- Die Bausteine oben stehen nach Wert sortiert. Halte dich daran, statt das
  Vorbereitende zuerst fertigzumachen — reißt der Lauf ab, zählt nur, was schon
  steht.
- Wird das Budget knapp, hörst du VON DIR AUS auf: committen,
  Rückmeldedatei abschließen, melden was offen ist. Ein sauber abgebrochener
  Lauf kostet weniger als ein abgerissener ohne Stand.

## Lesedisziplin

Züge gehen beim Lesen verloren, nicht beim Schreiben. Was in diesem Auftrag
steht, schlägst du nicht noch einmal nach. `grep -n <muster>
<datei>` statt die Datei zu öffnen; große Test- und Bestandsdateien liest du
nie vollständig, sondern nur die Stellen, die dein Auftrag betrifft.

## Prüfen, bevor du fertig meldest

    <Prüfbefehle des Projekts, z. B. lint / test / build>

Fang den echten Exit-Code. `… | tail -20; echo $?` meldet den Code von `tail`
und sieht dabei grün aus.

## Rückmeldung

Sie steht in `<rückmeldedatei>` und wächst mit der Arbeit. Antworte in Zahlen,
nicht in Prosa:

- Zeilen raus / rein je Datei
- Wächtermarken vorher → nachher
- Ergebnis der Prüfläufe mit dem echten Exit-Code
- Was du bewusst NICHT gemacht hast und warum
- Was dir auf fremdem Gebiet aufgefallen ist

Commit auf deinem Branch, nicht gepusht — die Commits werden per cherry-pick
abgeholt.
```

---

## Was je Auftragsart dazukommt

| Art | Zusatz |
| --- | --- |
| Neue Bauart (Bibliothek, Framework, Muster) | Woher die Vorlage geholt wird, und der Herkunftsnachweis, falls das Projekt einen verlangt. |
| Bestand löschen | Der Nachweis, dass niemand mehr darauf zugreift — der Befehl gehört in den Commit-Body, nicht nur ins Ergebnis. |
| Messen | Der Vergleichsstand als SHA und der Messbefehl, damit die Zahl reproduzierbar ist. |
| Doku | Ob das Projekt Statusangaben in der Doku verbietet. Ein „ist live" veraltet still. |

## Zusatzblock: geteilter Arbeitsbaum

Nur für den Ausnahmefall, dass ein Agent **kein** eigenes Worktree bekommen kann
und im Baum des Leitstands läuft. Dann gehört dieser Block wörtlich in den
Auftrag — und der Schnitt muss auf disjunkte Dateimengen halten, denn eine
geteilte Datei erzeugt hier keine Konflikte, sondern stille gegenseitige
Überschreibung (field-notes, Vorfall 9).

```
Du läufst im geteilten Arbeitsbaum: andere Agenten schreiben gerade im selben
Verzeichnis.

- Kein `git reset --hard`, kein `git checkout -- .`, kein `git stash`, kein
  `git clean`, kein `git add -A`. Du stagst deine Pfade einzeln.
- Ein roter Prüflauf ist NICHT automatisch deiner. Prüfe erst, ob die
  betroffene Datei überhaupt dir gehört, bevor du suchst.
- Fremde unversionierte Dateien im Status sind fremde Arbeit. Nicht anfassen,
  nicht committen, nicht aufräumen.
```

## Häufigster Fehler beim Schreiben eines Auftrags

Der Auftrag beschreibt das **Ziel** und verschweigt den **Rahmen**. Der Agent
baut dann etwas Richtiges an der falschen Stelle, auf dem falschen Stand, in
der falschen Schreibweise — und das fällt erst beim Zusammenführen auf, wenn
drei weitere Agenten schon darauf aufgebaut haben.

## Kurzvorlage für Scouts

Für Aufträge, die nur lesen: suchen, zählen, Bestand kartieren, Totcode finden.
Nimm dafür einen **nur lesenden** Agententyp (in Claude Code `Explore`). Kein
Worktree, keine Konventionen, keine Wächter — der Scout ändert nichts. Was er
stattdessen zwingend braucht: den **Suchraum** und den **Rohbefehl als Beleg**.
Ohne beides liefert er falsche Negative, die wie Fakten aussehen
(field-notes, Vorfall 10).

Höchstens **fünf** Suchpunkte je Auftrag. Darüber endet der Lauf am Zugbudget,
bevor die Antwort geschrieben ist (Vorfall 11) — dann wird geschnitten.

```
Du suchst <was genau>, du änderst nichts.

## Suchraum

Der ganze Baum ab <wurzel>, ausdrücklich auch <docker/, ci/, scripts/,
Infrastruktur-Konfiguration, …>. Ausgenommen nur: <node_modules/, dist/, …>.

## Frage

<Die eine Frage, präzise. Z. B.: Welche der folgenden Klassen werden nirgends
außerhalb ihrer Definition referenziert? Liste: …>

## Rückmeldung

Du schreibst sie fortlaufend nach `<rückmeldedatei>`: jede beantwortete Frage
sofort per `>>` dorthin, nicht erst am Ende. Zu jeder Aussage der Befehl, der
sie belegt, und seine Ausgabe (gekürzt auf die relevanten Zeilen). Keine
Aussage ohne Befehl:

- „existiert / existiert nicht" → `ls` oder `find` mit Ausgabe
- „wird benutzt / ist tot" → `grep -rn` über den ganzen Suchraum mit Ausgabe
  oder der leeren Ausgabe samt Exit-Code
- Zahlen → der Befehl, der sie erzeugt hat (`grep -c`, `wc -l`)

Was du nicht prüfen konntest, nennst du als ungeprüft. Keine Vermutungen.
```

## Kurzvorlage für Prüfaufträge

Für den unabhängigen Blick auf einen fertigen Stand: Prüfkette fahren,
gemeldete Zahlen gegenzählen, mit Mutationen belegen, dass die Tests überhaupt
greifen. Der Prüfer ändert nichts dauerhaft und committet nicht.

Höchstens **sechs** Kriterien und **ein** Durchlauf der Prüfkette je Auftrag.
Größere Prüfaufträge endeten dreimal am Zugbudget, ohne ein einziges Urteil
abzugeben, obwohl die Läufe auf Platte lagen (field-notes, Vorfall 11).

```
Du prüfst <Paket> auf dem Stand <basis-sha> im Worktree <worktree-pfad>. Du
änderst nichts dauerhaft, du committest nicht, du mergst nicht.

## Kriterien

<Höchstens sechs, je als Ja/Nein-Frage mit dem Befehl, der sie entscheidet.>

## Prüflauf

<Prüfbefehle>, EINMAL, und zwar im Worktree — nicht in einer Kopie und nicht in
einem Temp-Verzeichnis. Tests, die `git ls-files`, `core.hooksPath` oder sonst
den Arbeitsbaum lesen, werden außerhalb des Worktrees falsch rot.

Fang den echten Exit-Code: `<befehl> > lauf.txt 2>&1; echo "code=$?"; tail -25
lauf.txt`.

## Mutationsproben

Zu <Kriterium>: ändere GENAU EINE Datei im Worktree so, dass der Test fallen
MUSS, lass nur den betroffenen Test laufen und stelle das Original danach mit
`git show HEAD:<pfad> > <pfad>` zurück. Bleibt der Test grün, ist das dein
wichtigster Befund.

## Rückmeldung

Jedes Urteil schreibst du SOFORT nach seiner Prüfung per `>>` nach
<rückmeldedatei> — nicht erst am Ende. Je Kriterium: Urteil (erfüllt / nicht
erfüllt / ungeprüft), der Befehl, seine Ausgabe (gekürzt), der echte Exit-Code.

Ein Kriterium, das du für falsch gefasst hältst (ein Grep auf ein Wort trifft
auch Prosa und Image-Namen), meldest du als Befund und prüfst es trotzdem wie
geschrieben. Nachverhandelt wird nicht.
```
