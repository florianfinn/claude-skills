---
name: klartext
description: Änderungstexte auf Klartext ziehen — Commit-Texte, PR-Beschreibungen, Changelog-Abschnitte, Issues, Doku und Kommentare. Prüft einen Diff, einen PR oder einen fertigen Text auf neun gemessene Formen (Konjunktiv als Motiv, Verneinung ohne Zahl, Schlussformeln, Kontrast gegen eine erfundene Alternative, zerhackte Prosa, Nominalketten, Zahl ohne Messweg, Umlaut-Umschreibung, Mojibake), legt jede Änderung als Vergleich vor und setzt nur das Bestätigte um. Unbedingt benutzen, sobald jemand „/klartext", „klartext", „mach den Text klarer", „lies meinen PR gegen", „schreib den Commit-Text", „prüf die Beschreibung" oder „das klingt nach KI" sagt — und auch dann, wenn ein Commit-Text, eine PR-Beschreibung oder ein Changelog-Abschnitt zu schreiben ist und niemand ausdrücklich um eine Prüfung gebeten hat. Nicht benutzen für Programmtext, für Nutzeroberflächen-Texte oder für eine reine Übersetzung.
---

# Klartext

Ein Änderungstext hat einen Leser mit wenig Zeit und einer Frage: **was ist
passiert, und was muss ich noch selbst prüfen?** Alles, was zwischen ihm und
dieser Antwort steht, kostet ihn — auch dann, wenn es gut geschrieben ist.

Dieser Skill kennt neun Formen, die regelmäßig dazwischenstehen, und für jede
den Fall, in dem sie bleiben muss. Der zweite Teil ist der wichtigere: die
verbotene und die gebotene Form haben denselben Satzbau. Wer nur die Muster
löscht, macht den Text glatter und ärmer.

**Der vollständige Regelsatz mit allen Ausnahmen steht in
`referenzen/regeln.md`. Lies ihn, bevor du einen einzigen Satz änderst.**

## Zwei Betriebsarten

**Prüfen** — es gibt schon einen Text (Diff, PR, Commit-Bereich, Datei,
eingefügter Absatz). Du misst, legst jede Änderung als Vergleich vor, und
setzt um, was bestätigt ist.

**Schreiben** — es gibt noch keinen Text, sondern einen Auftrag („schreib den
Commit-Text zu diesem Diff", „formulier die PR-Beschreibung"). Du schreibst
nach den Regeln und prüfst deinen eigenen Entwurf, bevor du ihn abgibst.

Welche gemeint ist, sagt der Auftrag fast immer. Im Zweifel: liegt ein Text
vor, wird geprüft.

## Vor beidem: die Hausregel schlägt die Regel hier

Lies `AGENTS.md`, `CLAUDE.md` oder `CONTRIBUTING.md` des Projekts, bevor du
etwas vorschlägst. Viele Projekte haben eine Textkultur, die sie sich verdient
haben — eine Sprache für Commit-Texte, ein Gerüst für PR-Beschreibungen, eine
Belegpflicht, eine Umlaut-Regel mit Wächter dahinter.

Wo die Hausregel etwas anderes sagt als `referenzen/regeln.md`, **gilt die
Hausregel**, und du sagst dazu, welche Regel du deshalb übergehst. Ein Skill,
der die Konvention eines Projekts überschreibt, weil er es besser weiß, wird
einmal benutzt.

Besonders häufig: eine Datei verlangt ausdrücklich Angaben, die hier wie
Füllung aussehen — „Vor dem Deploy", „ausdrücklich ungeprüft", „gemergt, aber
ungetaggt". Die sind dann Pflicht und werden nicht angetastet.

## Prüfen

### 1 · Text beschaffen

| Auftrag | Woher der Text kommt |
| --- | --- |
| „prüf meinen Commit-Text" | `git log --format=%b -1` |
| „prüf die letzten Commits" | `git log --format=%b -20` |
| „prüf den PR" | `gh pr view <nr> --json title,body -q '.title, .body'` |
| „prüf den Branch" | `git log --format='%s%n%b' origin/<basis>..HEAD` |
| „prüf die Doku" | die genannten Dateien |
| eingefügter Text | in eine Datei schreiben, dann prüfen |

Zum Diff selbst: lies ihn. Ein Änderungstext kann nur beurteilt werden, wenn
du weißt, was tatsächlich geändert wurde — sonst prüfst du Stil und übersiehst
den Satz, der etwas Falsches behauptet. Das ist der wertvollste Fund
überhaupt, und kein Zähler findet ihn.

### 2 · Zählen

```bash
node <skill>/werkzeuge/pruefe-text.mjs <datei>
git log --format=%b -20 | node <skill>/werkzeuge/pruefe-text.mjs -
```

Das Werkzeug meldet jede der neun Formen mit ihrer Zahl, auch die Null, und
listet die Fundstellen mit Zeilennummer. Es entscheidet nichts. Backticks
maskiert es, weil ein zitiertes Muster kein Verstoß ist.

Nimm die Zahlen in deinen Bericht auf. Ein Vorschlag, der mit „liest sich
besser" begründet wird, ist genau das, was dieser Skill vermeiden soll.

### 3 · Jeden Fund einzeln beurteilen

Hier passiert die Arbeit, und hier ist das Werkzeug zu Ende. Für jeden Fund
die Prüffrage aus `referenzen/regeln.md`:

- **Konjunktiv** → Kannst du sagen, *wann* der Fall eingetreten ist? Bei ja
  ist es ein Beleg und bleibt.
- **Verneinung** → Steht eine Zahl oder ein Messweg daneben, oder verlangt die
  Hausregel sie? Bei ja bleibt sie.
- **Kontrast** → Hätte jemand Y wirklich tun können? Bei nein streichen.
- **Zahl ohne Messweg** → Kannst du den Messweg nachliefern? Dann liefer ihn
  nach, statt die Zahl zu streichen.

Die vier Sätze, die wie Verstöße aussehen und keine sind, stehen am Ende von
`referenzen/regeln.md`. Geh sie durch, bevor du eine Verneinung oder einen
Konjunktiv zum Streichen vorschlägst — das sind die Fehler, die weh tun.

Die gemeinsame Frage über allem: **verliert ein Prüfer etwas, wenn dieser Satz
weg ist?** Bei ja bleibt er, egal welche Regel ihn gemeldet hat.

### 4 · Vergleich vorlegen, nicht umschreiben

Nichts wird stillschweigend geändert. Der Vorschlag kommt als Gegenüberstellung,
je Fund eine Zeile:

```markdown
## klartext — 6 Vorschläge, 4 Funde bleiben

### 1 · Der erste Absatz nennt das Motiv statt der Änderung (Regel 1, 2)

**Vorher**
> Ohne Liste kann die Gegenseite ihren Teil des Vertrags nur verankern, nicht
> vergleichen. Käme hier ein 25. Schlüssel dazu, bliebe dort alles grün, und
> der neue Fall fiele in einen `default`-Zweig.

**Vorschlag**
> `src/compose-raw-failure-reasons.ts` hält die 29 Fehlerschlüssel in sieben
> benannten Mengen. Vorher entstanden sie als Zeichenketten an ihren
> Wurfstellen in `index.ts`, `raw-apply.ts` und `compose-store.ts`.

Drei Konjunktivsätze über einen Schlüssel, den es nicht gibt, vor dem ersten
Wort über die 29, die es gibt. Der Absatz wandert gekürzt ins Issue.

### Bleibt stehen

- Zeile 34 „ausdrücklich ungeprüft: nichts lief gegen einen echten Arm"
  — Verneinung mit Pflichtcharakter (AGENTS.md, „Deploy").
- Zeile 51 „hätte jeden bestehenden Hub beim Start angehalten"
  — Konjunktiv über einen gemessenen Fall.
```

Der Abschnitt **„Bleibt stehen"** gehört dazu und wird nicht weggelassen. Er
zeigt, dass die Ausnahmen geprüft wurden, und er ist oft der Teil, an dem der
Auftraggeber merkt, dass der Vorschlag verstanden hat, woran er arbeitet.

Bei mehr als etwa acht Vorschlägen: nach Regeln gruppieren und die tragenden
drei ausführlich zeigen, den Rest als Tabelle. Ein Vergleich, den niemand
liest, ist keine Bestätigung.

### 5 · Bestätigen lassen

Frag, was umgesetzt werden soll — alles, eine Auswahl, nichts. Bei einer
Auswahl nimm die Nummern. Setz nichts um, was nicht bestätigt ist, auch nicht
das „offensichtliche".

### 6 · Umsetzen, und sagen, was nicht mehr geht

| Ziel | Weg | Grenze |
| --- | --- | --- |
| Letzter, ungepushter Commit | `git commit --amend -F <datei>` | nur ungepusht |
| Mehrere ungepushte Commits | `git rebase -i` bzw. neu schreiben | nie auf fremder Historie |
| Offener PR | `gh pr edit <nr> --body-file <datei>` | Titel getrennt setzen |
| Gemergter Commit | **geht nicht** | Text als Nachtrag anbieten |
| Datei, Doku, Issue | normal bearbeiten | — |

Ein gemergter Commit-Text ist endgültig. Sag das, statt zu versuchen, die
Historie zu ändern; der Vorschlag wird dann ein Kommentar am PR oder ein
Nachtrag in der Doku.

⚠️ **Der Text geht über eine UTF-8-Datei, nie als Argument einer Shell-Zeile.**
`git commit -F <datei>`, `gh pr edit --body-file <datei>`, `gh api … --input`.
Ein `--message "Rückbau"` inline liefert je nach Umgebung ein doppelt
kodiertes Zeichen — genau den Fehler, den Regel 9 meldet. Nach dem Schreiben
gegenlesen: `git log --format=%s -1 | od -c`.

## Schreiben

Der Auftrag lautet nicht „prüfe", sondern „schreib". Dann gilt derselbe
Regelsatz von vorne herein, und das Gerüst steht fest:

```
1. Was gemacht wurde — in einem Absatz, ohne Vorgeschichte.
2. Wie es aussieht — die Stellen, die Namen, die Zahlen.
3. Was gemessen wurde — Zahl und Messweg nebeneinander.
4. Was ausdrücklich offen bleibt — ungeprüft, bewusst nicht gemacht,
   Risiko beim Deploy.
5. Die Prüfkette mit ihren Exit-Codes.
```

Punkt 4 ist der, den man weglassen möchte, und der, den der Leser braucht.

**Bevor du abgibst: lass das Werkzeug über deinen eigenen Entwurf laufen.**

```bash
node <skill>/werkzeuge/pruefe-text.mjs entwurf.txt
```

Was danach noch stehenbleibt, nennst du mit dem Grund — ein Satz genügt („drei
Konjunktive, alle über gemessene Fälle"). Ein Entwurf, der die eigene Prüfung
nicht bestanden hat und es verschweigt, ist schlechter als einer, der sie nie
gefahren ist.

## Was dieser Skill nicht tut

- **Er kürzt nicht um des Kürzens willen.** Ein Absatz, der eine Messung
  trägt, bleibt lang. Das Ziel ist ein Text, aus dem nichts fehlt, was der
  Leser braucht — nicht der kürzeste Text.
- **Er fasst nichts an, was nicht Text ist.** Bezeichner, Nutzeroberflächen-
  Texte, Zeichenkettenwerte eines Protokolls: Finger weg. Ein umbenannter Wert
  ist eine Verhaltensänderung, keine Textverbesserung.
- **Er ändert keine Aussage.** Wenn ein Satz falsch ist, sagst du das als
  eigenen Befund — und schreibst ihn nicht still um. Ein glatt formulierter
  falscher Satz ist schlimmer als ein holpriger richtiger.
