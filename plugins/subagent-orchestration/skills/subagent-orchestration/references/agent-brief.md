# Phase 3: Die Auftragsvorlage

Was ein Subagent mitbekommt. Platzhalter in `<spitzen Klammern>` aus
Vorgangsbuch und Projektprofil ersetzen, den Rest wörtlich stehen lassen.

Ein Auftrag ist **selbsttragend**: Der Agent sieht deinen Verlauf nicht, deine
gelesenen Dateien nicht und deine Entscheidungen nicht. Was er nicht im Auftrag
findet, leitet er her — plausibel, aber nicht unbedingt richtig. Was er dennoch
mitbekommt (CLAUDE.md-Kette, Git-Status vom Sitzungsstart), steht in
[`mechanics.md`](mechanics.md), Abschnitt 1.

---

## Die Vorlage

```
Du baust <Paketkennung>: <Etappe in einem Satz>.

## Basis

Setze deinen Stand zuerst um — dein Worktree hängt am Standardbranch, das ist
NICHT der Stand, auf dem gearbeitet wird:

    git fetch --all && git reset --hard <basis-sha>
    git log --oneline -1     # muss <basis-sha> zeigen

Deine Arbeit beginnt erst danach.

## Auftrag

<Was zu tun ist, mit vollständiger Dateiliste.>

<Falls Alt gegen Neu getauscht wird: Das Alte fällt im selben Commit, in dem
sein Ersatz entsteht. Ein Umbau, der den Bestand stehen lässt, ist nicht
fertig, sondern doppelt.>

## Fertig ist es, wenn

<Das Abnahmekriterium des Pakets, mit dem Befehl, der es entscheidet. Beispiel:>

    grep -rc 'OldDialog' src/dialogs/ | grep -v ':0$'   # muss leer sein
    pnpm run test                                        # Exit-Code 0

Prüfe das selbst, bevor du fertig meldest. Meldest du fertig, ohne es geprüft
zu haben, wird es beim Zusammenführen gefunden und dein Lauf wiederholt.

## Nicht dein Auftrag

Der Diff enthält nichts Fremdes. Diese Dateien fasst du NICHT an:
<Dateien, die anderen Paketen gehören.>

Fällt dir dort etwas auf, schreib es in die Rückmeldung, nicht in den Diff.

Du mergst nicht, du pushst nicht, du deployst nicht, und du machst keinen
Wächtertest „grün", indem du seine Marke senkst.

## Konventionen

<Die Regeln des Projekts WÖRTLICH einsetzen, nicht als Verweis. Mindestens:
Zeichensatz und Sprache, Commit-Form, was der Commit-Body nennen muss.
Beispiel aus einem deutschsprachigen Repo:>

- Umlaute und ß werden richtig gesetzt — auch im Commit-Betreff. Kein `ae`,
  `oe`, `ue`, `ss` als Ersatz. Bezeichner und Dateinamen bleiben englisch und
  unverändert.
- Commit: Conventional Commits, deutscher Betreff, `(#<vorgang>)` am Ende. Der
  Body nennt, was raus ist, was bewusst verloren geht, die Messwerte und die
  Testzahlen.
- Jede Aussage über Größe oder Bestand trägt die Zahl UND den Befehl, der sie
  erzeugt hat.

## Stille Fallen auf dieser Fläche

<Jede Fehlerklasse, die in der Prüfumgebung unsichtbar bleibt, namentlich und
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

Fang den echten Exit-Code:

    <befehl> > /tmp/<paket>-test.txt 2>&1; echo "code=$?"; tail -25 /tmp/<paket>-test.txt

`<befehl> | tail -20; echo $?` meldet den Exit-Code von `tail` und sieht dabei
grün aus.

## Rückmeldung

Antworte in HÖCHSTENS 25 ZEILEN, in Zahlen statt Prosa. Längere Ausgaben
(Testlauf, Log, vollständiger Diff) schreibst du nach /tmp/<paket>-*.txt und
nennst nur den Pfad.

- Basis-SHA, auf dem du gearbeitet hast
- Zeilen raus / rein je Datei
- Kriterium erfüllt? Mit dem Befehl und seiner Ausgabe
- Wächtermarken vorher → nachher
- Ergebnis der Prüfläufe mit dem ECHTEN Exit-Code
- Was du bewusst NICHT gemacht hast und warum
- Was dir auf fremdem Gebiet aufgefallen ist

Commit auf deinem Branch, nicht gepusht — die Commits werden per cherry-pick
abgeholt.
```

---

## Kurzfassung für die mitgelieferten Rollen

`orchestration-mechanic` und `orchestration-builder` tragen die Disziplin schon
im Systemprompt: Basisstand herstellen, im Rand bleiben, nicht mergen oder
pushen, keine Wächtermarke senken, echten Exit-Code fangen, gedeckelt in Zahlen
melden. An sie schreibst du nur noch die Abschnitte, die **projekt- und
paketspezifisch** sind:

- **Basis** (nur der SHA — die Anleitung kennt die Rolle)
- **Auftrag** mit vollständiger Dateiliste
- **Fertig ist es, wenn** — das Kriterium mit seinem Befehl
- **Nicht dein Auftrag** — die Dateien anderer Pakete
- **Konventionen** wörtlich
- **Stille Fallen auf dieser Fläche**
- **Wächter**, die nachzuziehen sind
- **Prüfbefehle** des Projekts

Das halbiert den Auftrag gegenüber der vollen Vorlage. Bei einer fremden Rolle
(VoltAgent, `general-purpose`) nimmst du die **volle** Vorlage — dort trägt
nichts die Disziplin außer deinem Text.

---

## Der Rückmeldevertrag ist Pflicht

Die letzten Zeilen sind keine Höflichkeit, sondern deine Kontextbremse. Ohne
Deckel schreibt ein Agent so viel zurück, wie er für angemessen hält — und zehn
ausführliche Berichte sind teurer als die Arbeit, die sie beschreiben.

Drei Bestandteile, alle drei nötig:

1. **Ein Deckel** in Zeilen. Zahlen sind wirksamer als „kurz".
2. **Zahlen statt Prosa.** Eine Zahl trägt den Befund; ein Absatz trägt eine
   Meinung, die du nicht nachprüfen kannst.
3. **Ein Ablageort für Langes.** Ohne Alternative schreibt der Agent den
   Testlauf in die Antwort, weil er ihn für wichtig hält.

## Was je Auftragsart dazukommt

| Art | Zusatz |
| --- | --- |
| Neue Bauart (Bibliothek, Framework, Muster) | Woher die Vorlage geholt wird, und der Herkunftsnachweis, falls das Projekt einen verlangt. |
| Bestand löschen | Der Nachweis, dass niemand mehr darauf zugreift — der Befehl gehört in den Commit-Body, nicht nur in die Rückmeldung. |
| Messen | Der Vergleichsstand als SHA und der Messbefehl, damit die Zahl reproduzierbar ist. |
| Doku | Ob das Projekt Statusangaben in der Doku verbietet. Ein „ist live" veraltet still. |
| Zweiter Anlauf nach Fehlschlag | Was beim ersten Anlauf schiefging, als Befund — nicht als Vorwurf. Und was der Vorgänger schon gebaut hat, damit er nicht bei null anfängt. |
| Migration, Nebenläufigkeit, Zustand | Der Zustand vorher und nachher, ausgeschrieben. „Migriere die Tabelle" ist kein Auftrag; „von Spalte A (nullable text) nach B (not null uuid), Altwerte nach Regel X" ist einer. |

## Die drei häufigsten Fehler beim Schreiben eines Auftrags

1. **Das Ziel steht drin, der Rahmen nicht.** Der Agent baut etwas Richtiges an
   der falschen Stelle, auf dem falschen Stand, in der falschen Schreibweise —
   und das fällt erst beim Zusammenführen auf, wenn drei weitere Agenten schon
   darauf aufgebaut haben.
2. **Konventionen als Verweis.** „Halte dich an AGENTS.md" ist wirkungslos. Der
   Agent liest die Datei und hält die Regel trotzdem nicht ein: sie konkurriert
   mit seiner Gewohnheit, und die gewinnt, solange sie nicht im Auftrag steht.
   Nimm die fünf Regeln, die tatsächlich verletzt werden, wörtlich auf; für den
   Rest genügt der Verweis.
3. **Vollständigkeit statt Auswahl.** Ein Auftrag, in dem jede denkbare Warnung
   steht, macht die echten unsichtbar. Was ein Test fängt, gehört nicht in die
   stillen Fallen. Ein Auftrag über zwei Bildschirmseiten ist ein Zeichen, dass
   das Paket zu groß ist.
