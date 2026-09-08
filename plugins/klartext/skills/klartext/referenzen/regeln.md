# Die neun Regeln, und wann sie nicht gelten

Jede Regel steht hier mit dem Fall, in dem sie **nicht** gilt. Das ist der
eigentliche Inhalt dieser Datei. Die Regeln selbst sind in einem Satz gesagt;
die Ausnahmen sind es, an denen ein Umschreiber Schaden anrichtet, weil eine
verbotene und eine gebotene Form denselben Satzbau haben.

Wer nur die Regeln anwendet und die Ausnahmen überliest, löscht die Sätze, an
denen ein Prüfer den Umfang einer Arbeit misst — und der Text liest sich danach
glatter, während er weniger sagt.

---

## 1 · Was gemacht wurde, steht zuerst

Der erste Absatz nennt die Änderung. Danach kommt, warum sie so aussieht, und
zuletzt, was sie nicht abdeckt.

Die häufigste Verletzung ist keine Vokabel, sondern eine Reihenfolge: der Text
öffnet mit dem Unglück, das ohne die Änderung eingetreten wäre, und kommt erst
im dritten Absatz zur Sache. Wer den Text überfliegt — und ein Prüfer
überfliegt —, hat nach zehn Sekunden ein Problem gelesen und keine Lösung.

**Gilt nicht**, wenn der Text ein Befund ist und keine Änderung: ein
Prüfbericht, eine Analyse, eine Frage an den Betreiber. Dort steht der Befund
zuerst, und das ist derselbe Grundsatz.

## 2 · Kein Konjunktiv als Motiv

„Käme ein 25. Schlüssel dazu, fiele er in einen `default`-Zweig" beschreibt
einen Fall, den es nicht gibt. Er begründet eine Entscheidung, die schon
gefallen ist. Solche Sätze gehören in das Dokument, das Begründungen führt
(`docs/design/`, ein Entwurf, ein Issue) — nicht in den Kopf eines
Änderungstextes.

**Gilt nicht für den gemessenen Fehlschlag.** „Der Lauf endete nach 71 Sekunden
mit `RangeError`" und „ein geänderter Kommentar dort hätte jeden bestehenden
Hub beim Start angehalten" stehen in derselben Verbform wie die Spekulation.
Der Unterschied liegt außerhalb des Satzes: **ist der Fall eingetreten?** Wenn
ja, ist der Satz ein Beleg und bleibt, wo er steht.

Prüffrage bei jedem Fund: *Kann ich sagen, wann das passiert ist?* Bei nein
wandert der Satz ans Ende oder fällt weg.

## 3 · Eine Verneinung braucht eine Zahl

„Kein Verhalten geändert" ohne Beleg ist Beruhigung. „Kein Schlüssel
umbenannt, hinzugefügt oder entfernt — 0 von 29 neu gegenüber `0b11766`" ist
eine Aussage, die jemand widerlegen kann.

**Gilt nicht, wo die Verneinung Pflicht ist.** In vielen Projekten trägt genau
sie die Warnung:

- „Vor dem Deploy: …" — was ein Deploy gefährden könnte
- „Ausdrücklich ungeprüft: nichts lief gegen einen echten Agenten"
- „Gemergt, aber ungetaggt — die Hosts fahren weiterhin v0.19.1"
- „Bewusst nicht behoben: …" mit dem Grund

Diese Sätze sehen aus wie Füllung und sind das Gegenteil: an ihnen misst ein
Prüfer, was er noch selbst tun muss. Wer sie streicht, macht den Text kürzer
und die Arbeit unprüfbar. **Im Zweifel bleiben sie.**

## 4 · „X, nicht Y" nur, wenn Y offenstand

„Neben `compose-raw`, nicht an seiner Stelle" nennt einen Weg, den jemand
hätte gehen können, und sagt, warum er nicht gegangen wurde. Das ist eine
Abgrenzung.

„Das ist kein Aufräumen, sondern ein Umbau" grenzt gegen nichts ab, wenn
niemand ein Aufräumen vorgeschlagen hat. Die Form täuscht Präzision vor, indem
sie eine Alternative erfindet und dann verwirft.

Prüffrage: *Hätte jemand Y wirklich tun können?* Bei nein: den Satz auf das
verkürzen, was gemacht wurde.

## 5 · Keine Schlussformeln, keine Füllvokabeln

Ersatzlos streichen: „Fazit:", „Kurz gesagt:", „Zusammenfassend", „Unter dem
Strich", „Es ist erwähnenswert", „Wichtig ist:", „im Wesentlichen",
„letztlich", „vertiefen", „fördern", „hebeln", „Frage? Antwort." als
rhetorische Figur, „Hier geht es nicht um X, sondern um Y".

Auch: erfundene Bindestrich-Prägungen, die einmal vorkommen und nichts
benennen, was es im Projekt gibt. Ein Begriff, der zweimal steht, ist
Vokabular; einer, der einmal steht, ist Ornament.

Der letzte Absatz eines Änderungstextes ist die Prüfkette mit ihren
Exit-Codes, nicht eine Wiederholung des ersten.

## 6 · Prosa trägt, die Liste zählt auf

Eine Liste steht für Gleichartiges: Prüfläufe, Befunde, Routen, Dateien. Ein
Gedanke, der sich entwickelt und in dem ein Satz auf dem vorigen aufbaut,
gehört in einen Absatz. Verschachtelt wird nicht — wer eine zweite Ebene
braucht, hat meist zwei Themen in einer Liste.

Der Fehler geht fast immer in eine Richtung: Prosa wird zu Stichpunkten
zerhackt, weil das nach Struktur aussieht. Dabei geht verloren, wie die Punkte
zusammenhängen, und genau das war die Information.

## 7 · Aktiv, konkrete Verben, keine Nominalketten

„Die Zusammenführung der Fehlerbehandlung führte zur Reduzierung der
Codeduplizierung" sagt dasselbe wie „vier Kopien der Rechnung stehen jetzt an
einer Stelle" und braucht doppelt so lange.

Drei Wörter auf `-ung` in einem Satz sind das Signal. Eines ist normal —
Deutsch nominalisiert, das ist keine Krankheit.

**Gilt nicht** für die Fachbegriffe des Projekts. `Migration`, `Freigabe`,
`Prüfung`, `Bestätigung` sind Namen von Dingen und werden nicht in Verben
aufgelöst.

## 8 · Jede Zahl trägt ihren Messweg

Eine Zahl ohne den Weg, auf dem sie entstanden ist, kann niemand nachprüfen
und niemand widerlegen. Nebeneinander gehören die Zahl und der Befehl, der
Lauf, der Commit oder das Datum.

```
33 von 53 Fundstellen richtiggestellt
    → nachgezählt mit `grep -c` auf dem Stand von a3c27fd
```

**Gilt nicht** für Zahlen, die keine Behauptung tragen: Versionsnummern,
Datumsangaben, Aufzählungen, Zeilennummern in einem Verweis.

Der häufigste Fall in der Praxis ist eine geerbte Zahl: eine Marke aus einem
Wächtertest oder eine Angabe aus einem alten Kommentar, die niemand
nachgerechnet hat. Sie verfällt lautlos. Wer sie in einen Text übernimmt,
misst sie neu oder nennt ihre Quelle.

## 9 · Umlaute richtig, kein Mojibake

`fuer`, `ueber`, `gekuerzt` gehören in kein deutsches Textstück außer dort, wo
eine Datei kein UTF-8 verträgt (klassisch: `Dockerfile`).

Ein `Ã` oder `Â` vor einem Umlaut heißt: der Text ist als UTF-8 geschrieben und
als Windows-1252 gelesen worden. Das passiert auf dem Weg über Argumente einer
Kommandozeile, nicht über Dateien. Die Abhilfe ist nicht Suchen und Ersetzen,
sondern der Weg: Text in eine UTF-8-Datei schreiben und mit `git commit -F`,
`gh pr create --body-file` oder `gh api … --input` übergeben.

Mojibake ist der schlimmere der beiden Fehler, weil er aus einem korrekt
gesetzten Umlaut entsteht — der Text war einmal richtig.

---

## Die vier Sätze, die wie Verstöße aussehen und keine sind

Wer diese vier löscht, hat den Text verschlechtert. Sie stehen hier zusammen,
weil sie in jedem echten Änderungstext vorkommen und ein Zähler sie alle
meldet.

1. **„Ausdrücklich ungeprüft: …"** — Regel 3 sieht eine Verneinung. Sie ist
   die Angabe, an der ein Prüfer erkennt, was noch offen ist.
2. **„Ein geänderter Kommentar dort hätte jeden Hub beim Start angehalten."**
   — Regel 2 sieht einen Konjunktiv. Der Fall ist gemessen worden; der
   Konjunktiv beschreibt die Folge, die dadurch verhindert wurde.
3. **„Kein Verhalten geändert — 0 von 29 Schlüsseln neu gegenüber `0b11766`."**
   — Regel 3 sieht eine Verneinung, und die Zahl steht daneben. Bleibt.
4. **„Neben `compose-raw`, nicht an seiner Stelle."** — Regel 4 sieht einen
   Kontrast. Der Weg stand offen, die Entscheidung dagegen ist die
   Information.

Die gemeinsame Prüffrage aller vier: **verliert ein Prüfer etwas, wenn dieser
Satz weg ist?** Bei ja bleibt er, egal welche Regel ihn meldet.
