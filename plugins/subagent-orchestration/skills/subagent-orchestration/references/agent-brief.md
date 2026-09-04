# Die Auftragsvorlage

Zwei Fassungen: die **volle** für Bauagenten, die Dateien ändern und
committen, und die **Kurzvorlage für Scouts** am Ende dieser Datei, für Agenten,
die nur suchen, zählen und melden.

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

## Prüfen, bevor du fertig meldest

    <Prüfbefehle des Projekts, z. B. lint / test / build>

Fang den echten Exit-Code. `… | tail -20; echo $?` meldet den Code von `tail`
und sieht dabei grün aus.

## Rückmeldung

Antworte in Zahlen, nicht in Prosa:

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

```
Du suchst <was genau>, du änderst nichts.

## Suchraum

Der ganze Baum ab <wurzel>, ausdrücklich auch <docker/, ci/, scripts/,
Infrastruktur-Konfiguration, …>. Ausgenommen nur: <node_modules/, dist/, …>.

## Frage

<Die eine Frage, präzise. Z. B.: Welche der folgenden Klassen werden nirgends
außerhalb ihrer Definition referenziert? Liste: …>

## Rückmeldung

Zu jeder Aussage der Befehl, der sie belegt, und seine Ausgabe (gekürzt auf die
relevanten Zeilen). Keine Aussage ohne Befehl:

- „existiert / existiert nicht" → `ls` oder `find` mit Ausgabe
- „wird benutzt / ist tot" → `grep -rn` über den ganzen Suchraum mit Ausgabe
  oder der leeren Ausgabe samt Exit-Code
- Zahlen → der Befehl, der sie erzeugt hat (`grep -c`, `wc -l`)

Was du nicht prüfen konntest, nennst du als ungeprüft. Keine Vermutungen.
```
