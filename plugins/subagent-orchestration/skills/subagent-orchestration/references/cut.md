# Phase 1: Schnitt

Aus dem Zielbild werden **Arbeitspakete** und eine **Wellenordnung**. Beides
steht schriftlich im Vorgangsbuch, bevor der erste Agent läuft.

Der Schnitt ist die Entscheidung, die alles Spätere trägt. Ein schlechter
Schnitt lässt sich nicht mit mehr Agenten, besseren Modellen oder längeren
Aufträgen reparieren — nur durch einen neuen Schnitt.

---

## Was ein Arbeitspaket ist

Ein Paket hat **genau sechs** Eigenschaften. Fehlt eine, ist es keins:

1. **Eine Fläche.** Eine Menge von Dateien, die niemand sonst anfasst.
2. **Eine Etappe.** Ein Zustandsübergang, nicht zwei.
3. **Ein Abnahmekriterium**, abgeleitet aus einem `AK-n` des Zielbilds.
4. **Eine Fehlerklasse**, aus der Modell und Rolle folgen.
5. **Eine Stellung in der Ordnung**: Welle, und wovon es abhängt.
6. **Einen Rand**: was ausdrücklich nicht dazugehört.

## Die vier Schnittregeln

### Eine Datei gehört genau einem Paket

Die härteste Regel, und die mit dem größten Ertrag. Zwei Agenten in derselben
Datei erzeugen Konflikte, die **du** danach von Hand auflöst — der teuerste Weg
überhaupt, weil du dann die Arbeit von beiden liest, statt eine zu prüfen.

Brauchen zwei Pakete dieselbe Datei, gibt es drei Auswege, in dieser Reihenfolge:

1. **Nacheinander statt nebeneinander.** Verschiedene Wellen.
2. **Die Datei zu einem eigenen kleinen Paket machen**, das beide vorbereitet.
3. **Anders schneiden.** Wenn zwei Pakete dieselbe Datei brauchen, ist die
   Fläche oft falsch gewählt.

Nicht dazu gehört: „die machen schon nicht dieselbe Stelle". Das stimmt genau so
lange, bis es nicht stimmt.

### Schneide entlang der Fläche, nicht entlang der Tätigkeit

| Tätigkeitsschnitt (falsch) | Flächenschnitt (richtig) |
| --- | --- |
| „Alle Tests nachziehen" | „Modul `auth`, samt seiner Tests" |
| „Überall Typen ergänzen" | „`src/api/**`, samt Typen" |
| „Doku aktualisieren" | „Die Doku zu den in dieser Etappe geänderten Endpunkten" |

Ein Tätigkeitsschnitt fasst **jede** Fläche an. Er kollidiert mit allem und
lässt sich nicht parallelisieren. Tests, Typen und Doku gehören zu dem Paket,
das den Code ändert — nicht in ein eigenes.

**Die Ausnahme:** eine Tätigkeit, die wirklich nur eine Fläche berührt
(Abhängigkeiten aktualisieren, eine CI-Datei umstellen), ist ein zulässiges
Paket. Prüfbar an der Frage: Wie viele Dateien außerhalb deiner Fläche fasst es
an? Antwort > 0 → kein Paket.

### Ein Paket ist eine Etappe

Zwei Etappen in einem Paket ergeben einen Diff, den du hinterher nicht mehr in
zwei Änderungssätze schneiden kannst. Erkennungszeichen: Im Auftrag steht ein
„und dann" oder „außerdem".

Grobe Größenordnung: Was ein Agent in einem Lauf ohne Nachfrage schafft. Kommt
ein Paket regelmäßig als Teilergebnis zurück, war es zwei.

### Jedes Paket trägt sein Kriterium

Ohne Kriterium kann der Prüfer in Phase 5 nur „sieht gut aus" sagen. Das
Paketkriterium ist enger als das `AK-n` des Zielbilds, aber davon abgeleitet:

```
P-3  src/dialogs/**          → AK-2 (0 Treffer für 'OldDialog' in src/dialogs)
P-4  src/settings/**         → AK-2 (0 Treffer für 'OldDialog' in src/settings)
P-5  tests/guards/dialogs.js → AK-2 (Marke auf den gemessenen Bestand gesetzt)
```

Erst alle drei zusammen erfüllen `AK-2`. Das gehört so ins Vorgangsbuch.

---

## Abhängigkeiten messen, nicht annehmen

⚠️ **Die Reihenfolge aus dem Auftrag ist eine Vermutung, bis du sie gemessen
hast.** Eine falsche Reihenfolge merkst du erst, wenn drei Agenten darauf
aufsetzen.

Messen heißt zählen:

```bash
# Wer importiert diese Datei?
grep -rl "components/dialog" src/ | wc -l
grep -rl "components/dialog" src/ | cut -d/ -f2 | sort -u   # aus welchen Bereichen?

# Wie groß ist die Fläche wirklich?
grep -rl "OldDialog" src/ | wc -l
```

Drei Muster, die den Plan kippen:

| Befund | Warum es kippt |
| --- | --- |
| Eine Datei mit Importeuren aus **mehreren** Bereichen | Sie ist keine Flächendatei, sondern eine gemeinsame Sprachdatei. Kein Bereich kann vor ihr fertig werden. |
| Zwei Flächen importieren einander | Es gibt keine Reihenfolge. Entweder ein Paket, oder der Zyklus wird zuerst aufgelöst. |
| Ein Wächtertest liest beide Flächen | Er kippt, sobald **eine** von beiden fertig ist. Siehe unten. |

## Wächter im Schnitt berücksichtigen

Ein Test, der einen Übergang festhält (`assert gefunden > 0`), fällt **per
Bauart**, sobald der Übergang zu Ende ist. Das ist beabsichtigt und trotzdem ein
Problem für den Schnitt: Der Änderungssatz, der den letzten Rest entfernt, macht
den Wächter rot; der Änderungssatz, der den Wächter entfernt, ist ohne ihn
sinnlos.

**Prüfe vor dem Schnitt, welcher Wächter bei welcher Kombination kippt.** Löse
es, indem der Wächter im selben Paket fällt wie der letzte Rest — nicht in einem
eigenen, hübschen Änderungssatz danach.

---

## Wellen bilden

Eine Welle ist eine Menge von Paketen ohne gegenseitige Abhängigkeit. Sie laufen
gleichzeitig.

```
Welle 1  P-1 (Grundlage: gemeinsame Typen)
Welle 2  P-2  P-3  P-4        ← parallel, verschiedene Flächen
Welle 3  P-5 (Wächter nachziehen)  P-6 (Doku)
```

Regeln:

- **Eine Welle ist so breit, wie du Diffs prüfen kannst.** Drei bis fünf Pakete
  sind fahrbar. Eine Welle, deren Rückläufe du nicht in einem Zug prüfen kannst,
  ist zu breit — teile sie, auch wenn technisch mehr gleichzeitig ginge. Der
  Engpass ist der Leitstand, nicht die Maschine.
- **Zwischen zwei Wellen liegt eine echte Abhängigkeit**, nicht Vorsicht. Eine
  Welle mit einem Paket ist ein Alleingang mit Zusatzkosten — mach ihn selbst
  oder häng ihn an die nächste Welle.
- **Nach jeder Welle wird zusammengeführt und geprüft**, bevor die nächste
  startet. Sonst bauen drei Pakete der Welle 3 auf einem Fehler aus Welle 2 auf.
- **Die erste Welle enthält, was alle brauchen.** Gemeinsame Typen, Schemata,
  Grundgerüst. Sie ist oft schmal und fast immer ein starkes Modell wert.

## Der Basis-SHA

Vor der ersten Welle: Basis-Commit festhalten.

```bash
git rev-parse HEAD
```

Nach jeder Zusammenführung wird der Basis-SHA der **nächsten** Welle neu
gesetzt. Er steht im Vorgangsbuch und in jedem Auftrag — siehe
[`mechanics.md`](mechanics.md), Abschnitt 4, warum das nicht optional ist.

---

## Wann der Schnitt fertig ist

- [ ] Jede beteiligte Datei ist genau einem Paket zugeordnet
- [ ] Jedes Paket hat Fläche, Etappe, Kriterium, Fehlerklasse, Welle, Rand
- [ ] Die Abhängigkeiten sind **gemessen**, nicht vermutet
- [ ] Für jeden Wächtertest ist klar, bei welcher Kombination er kippt
- [ ] Jedes `AK-n` des Zielbilds ist durch mindestens ein Paket abgedeckt
- [ ] Kein Paket ohne `AK-n` — sonst baust du etwas, das niemand verlangt hat

Die letzten beiden Punkte sind die Gegenprobe: Kriterien ohne Paket sind Arbeit,
die du vergessen hast. Pakete ohne Kriterium sind Arbeit, die keiner braucht.
