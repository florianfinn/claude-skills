# Phasen 5–7: Prüfen, Zusammenführen, Abnehmen

Zwischen „der Agent meldet fertig" und „es ist abgenommen" liegen drei
Schritte, die niemand sonst macht.

---

## 5. Prüfen mit frischen Agenten

### Warum frisch

**Wer gebaut hat, prüft nicht.** Ein Agent, der sein eigenes Werk beurteilt,
findet die Fehler nicht, die aus seiner eigenen Annahme folgen — und genau die
suchst du. Hat er die Fläche falsch verstanden, prüft er gegen dasselbe falsche
Verständnis und meldet grün.

Das gilt auch für dich: Was du selbst gebaut hast, prüft niemand. Deshalb baust
du nichts außer Konfliktauflösungen.

### Der Prüfauftrag

Nimm `orchestration-verifier`. Er hat **kein `Write`, kein `Edit`** — technisch
über `tools:` und zusätzlich im Prompt, weil Plugin-Agenten `permissionMode`
ignorieren.

⚠️ **Ein Prüfer mit Schreibrechten repariert, was er findet**, und liefert
danach ein grünes Urteil über eine Lage, die es ohne ihn nicht gäbe. Du weißt
dann nicht mehr, was der Bauagent falsch gemacht hat, und der Fehler kommt im
nächsten Paket wieder. Die Prüfrollen aus dem VoltAgent-Bestand
(`code-reviewer`, `architect-reviewer`) haben `Write` und `Edit` — für diesen
Zweck ungeeignet.

Er bekommt:

- **Das Kriterium** (`AK-n` und das Paketkriterium), wörtlich.
- **Den Diff** oder den Bereich, den er ansehen soll.
- **Die Prüfbefehle** des Projekts.
- **Die stillen Fallen** der Fläche.

Er bekommt **nicht**:

- Den Bauauftrag. Wer weiß, wie es gebaut werden sollte, prüft, ob es **so**
  gebaut wurde — und nicht, ob es stimmt.
- Die Rückmeldung des Bauagenten. Sie ist die Behauptung, die geprüft wird,
  nicht die Vorlage für das Urteil.

### Das Urteil

Je Kriterium eines von dreien, mit Beleg:

| Urteil | Bedeutet | Beleg |
| --- | --- | --- |
| **erfüllt** | Der Befund entscheidet für das Kriterium | Befehl und Ausgabe |
| **nicht erfüllt** | Der Befund entscheidet dagegen | Befehl, Ausgabe, und die Stelle |
| **nicht prüfbar** | Kein Befund erreichbar (kein Zugang, keine Umgebung, Kriterium zu unscharf) | Was fehlte |

⚠️ **„Nicht prüfbar" ist ein zulässiges und wertvolles Urteil.** Ein Prüfer, der
raten muss, um ein Urteil zu liefern, liefert Rauschen. Wird ein Kriterium
regelmäßig als „nicht prüfbar" gemeldet, war es in Phase 0 schlecht formuliert.

### Was du selbst tust

Der Prüferbericht ersetzt den Diff nicht.

- **`git diff --stat` für jedes Paket.** Immer. Kostet fast nichts und zeigt
  Randüberschreitungen sofort.
- **Vollständiger Diff** für jedes Paket mit stiller Fehlerklasse und für jedes
  mit negativem oder unsicherem Urteil.
- ⚠️ **Den echten Exit-Code fangen.** `<befehl> 2>&1 | tail -25; echo $?` meldet
  den Exit-Code von `tail` — das sieht aus wie ein grüner Lauf und ist keiner:

  ```bash
  <befehl> > lauf.txt 2>&1; echo "code=$?"; tail -25 lauf.txt
  ```

- **Jede Zahl nachzählen** (`grep -c`, `wc -l`), bevor sie in einen Commit-Text
  oder Bericht kommt.
- ⚠️ **Wächtermarken nachzählen.** Eine Marke der Form `>= N` wird **nicht rot**,
  wenn der Bestand über sie hinauswächst. Sie verfällt lautlos. Ein Test, der
  eine Untergrenze prüft, ist ein Alarm, kein Inventar — er schweigt in die
  andere Richtung.

### Wenn die Messung selbst falsch sein kann

Ein negatives Urteil ist erst dann ein Befund, wenn du weißt, dass dein
Messmittel überhaupt ein positives liefern **könnte**. Sonst misst du dein
Werkzeug statt die Arbeit — und ein kaputtes Werkzeug meldet in aller Regel
„nicht erfüllt", nie „ich bin kaputt".

Bau dir deshalb eine **Kontrolle mit bekanntem Ergebnis**, bevor du auf ein
Nullresultat hin handelst: derselbe Aufbau, aber ein Fall, der bestehen **muss**.

- Der Prüflauf meldet 0 Treffer → lass ihn einmal gegen einen Stand laufen, auf
  dem es Treffer geben muss. Meldet er dort auch 0, liegt es am Befehl.
- Ein Agent meldet ein Kriterium als nicht erfüllt → gib ihm einen Fall, der es
  offensichtlich erfüllt. Erkennt er den nicht, liegt es am Auftrag.
- Eine ganze Reihe von Prüfungen fällt gleichförmig aus → das ist fast nie die
  Arbeit. Gleichförmigkeit ist das Erkennungszeichen eines Aufbaufehlers, nicht
  eines Baufehlers.

⚠️ **Verdächtig ist Einheitlichkeit, nicht Auffälligkeit.** Ein einzelnes
negatives Urteil ist plausibel. Zehn identische negative Urteile über
unterschiedliche Flächen sind es nicht — dort prüfst du zuerst den Aufbau.

Zwei Fehlerarten, die sich in einem Prüfaufbau besonders gern verstecken:

| Fehler | Woran du ihn erkennst |
| --- | --- |
| **Geteilter Zustand zwischen parallelen Prüfungen** (dasselbe Verzeichnis, dieselbe Datei, derselbe Branch) | Die Ergebnisse schwanken zwischen Läufen, ohne dass sich die Arbeit ändert. |
| **Eine Prüfumgebung, in der die Frage sinnlos ist** (leeres Repo, fehlende Abhängigkeiten, kein Bezugsstand) | Der Prüfer antwortet mit Rückfragen statt mit einem Urteil. |

Das ist dieselbe Regel wie „prüfe den Fall, der ohne den Fix falsch wäre" — nur
eine Ebene höher: Dort prüfst du, ob die **Arbeit** wirkt, hier, ob die
**Prüfung** wirkt.

---

## 6. Zusammenführen

Ein Integrationsbranch, `git cherry-pick` in Abhängigkeitsreihenfolge. Die
Konfliktauflösung machst du selbst — der einzige Fall, in dem du in fremden
Dateien schreibst.

```bash
git checkout -b integration/<vorgang> <basis-sha>
git cherry-pick <commit aus P-1>
git cherry-pick <commit aus P-2>
# ...
```

- **Die Prüfbefehle laufen auf dem zusammengeführten Stand**, nicht je Paket.
  Was einzeln grün ist, kann zusammen rot sein — genau dafür ist die
  Zusammenführung da.
- **Bei einem Konflikt: erst verstehen, dann lösen.** Ein Konflikt, in dem ein
  Agent etwas wiederherstellt, was ein anderer gelöscht hat, bedeutet, dass
  einer auf einem älteren Basisstand saß. Das ist ein Auftragsfehler, kein
  Merge-Problem — löse den Konflikt und **prüfe, ob weitere Pakete denselben
  Stand hatten**.

### Der Schnitt in Änderungssätze folgt den Wächtern

⚠️ Ein Test, der einen Übergang festhält (`assert gefunden > 0`), fällt **per
Bauart**, sobald der Übergang zu Ende ist. Seine Löschung kann dann nicht in
einen eigenen, hübschen Änderungssatz — der davor wäre rot.

Prüfe vor dem Schnitt, welcher Wächter bei welcher Kombination kippt, und leg
den Schnitt danach. Nicht nach Ästhetik.

### Nebenfunde entscheiden

Jetzt, nicht später. **Ein Nebenfund verschwindet nie stillschweigend.**

| Fund | Entscheidung |
| --- | --- |
| Im Rahmen des Zielbilds und billig | Eigenes kleines Paket, noch in diesem Vorgang |
| Im Rahmen, aber teuer | Ins Vorgangsbuch und in den Bericht, als Vorschlag mit Aufwandsschätzung |
| Außerhalb des Zielbilds | In den Bericht, mit Fundstelle |
| Ein Fehler, der die Abnahme berührt | Wird zum Paket. Keine Wahl. |

⚠️ **Ein Nebenfund wird nicht nebenbei repariert.** Ein Handgriff „im
Vorbeigehen" landet im Diff eines fremden Pakets, kostet den Schnitt in
Änderungssätze und ist von niemandem geprüft.

---

## 7. Abnehmen

Abgenommen wird gegen die Kriterien aus Phase 0, auf dem **zusammengeführten**
Stand — nicht auf einem Feature-Branch und nicht gegen den Auftragstext.

- ⚠️ **Prüfe den Fall, der ohne den Fix falsch wäre**, nicht den, der ohnehin
  gewinnt. Bei sortierten Größen ist das der kleinste Wert, nicht der größte:
  der größte hätte auch ohne den Fix gestimmt und beweist nichts. Die Prüfung am
  einfachen Fall fühlt sich gut an und belegt nichts.
- **Was du nicht prüfen konntest, benennst du als ungeprüft.** Nicht weglassen,
  nicht als „vermutlich in Ordnung" tarnen.
- **Ein erfülltes Kriterium wird nicht nachverhandelt.** Wenn ein Kriterium sich
  als schlecht gewählt erweist, ist das ein Befund für den Bericht — kein Grund,
  es umzuformulieren, bis es passt.

### Die Rückschleife

Verfehlt das Ergebnis das Ziel, **klassifiziere die Abweichung**. Davon hängt
ab, wohin du zurückgehst — und die falsche Rückschleife ist teuer.

| Abweichung | Zeichen | Zurück nach | Warum |
| --- | --- | --- | --- |
| **Baufehler** | Der Auftrag stimmte, die Umsetzung nicht | **4** | Neuer Anlauf am Paket, mit dem Beleg des Prüfers. Meist per `SendMessage`. |
| **Schnittfehler** | Pakete überlappen; die Reihenfolge war nicht fahrbar; ein Wächter kippt quer; dieselbe Datei kommt immer wieder vor | **1** | Ein schlechter Schnitt lässt sich nicht mit mehr Agenten reparieren. Neu schneiden — auch wenn schon Arbeit drinsteckt. |
| **Zielbildfehler** | Alles formal erfüllt, das Ergebnis ist trotzdem nicht gemeint | **0** | Das entscheidet der Auftraggeber, nicht ein weiterer Agent. Mit Befund und Empfehlung zurück zu ihm. |

⚠️ **Höchstens zwei Schleifen je Paket.** Danach geht es mit dem, was bekannt
ist, an den Auftraggeber: was steht, was fehlt, was du versucht hast, was du
empfiehlst. Ein dritter Anlauf ohne neue Erkenntnis wiederholt denselben
Fehlschlag und verbraucht das Kontextfenster, das du für die Zusammenführung
brauchst.

Der Schleifenzähler steht im Vorgangsbuch. Ohne ihn merkst du die dritte
Schleife nicht — sie fühlt sich jedes Mal wie die zweite an.

### Wann der Vorgang abgenommen ist

- [ ] Jedes `AK-n` hat ein Urteil: erfüllt oder ausdrücklich ungeprüft
- [ ] Die Prüfbefehle laufen auf dem zusammengeführten Stand mit echtem
      Exit-Code 0
- [ ] Jede Zahl im Bericht ist nachgezählt
- [ ] Jeder Nebenfund ist entschieden, keiner ist verschwunden
- [ ] Was offen bleibt, steht als **Frage** im Bericht, nicht als Vermutung
