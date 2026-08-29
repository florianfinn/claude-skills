# Das Vorgangsbuch

Eine Datei je Vorgang: `.claude/orchestration/<vorgang>.md`.

Sie ist **nicht** die Dokumentation des Vorgangs, sondern sein **Zustand**. Der
Unterschied entscheidet, was hineingehört: alles, was du wieder liest, und
nichts sonst.

---

## Warum es das gibt

- **Dein Verlauf wird verdichtet.** Bei langen Vorgängen fasst die Sitzung
  zusammen, was war. Was nur im Verlauf stand, ist danach weg — der Basis-SHA,
  die Modellwahl je Paket, der Schleifenzähler, der Nebenfund aus Welle 1.
- **Es ist billiger als der Verlauf.** Eine Tabelle statt zwanzig Rückläufe.
- **Es ist die einzige Stelle, an der ein neuer Leitstand aufnehmen kann** —
  nach `/clear`, in einer neuen Sitzung, per Befehl `orchestrate-resume`.
- **Es macht den Schleifenzähler sichtbar.** Ohne ihn fühlt sich die dritte
  Schleife wie die zweite an.

⚠️ **Aktualisiere es nach jeder Welle und nach jeder Abnahme, nicht am Ende.**
Ein Buch, das erst am Schluss geschrieben wird, ist ein Bericht — und war
während des Vorgangs wertlos.

Es ist eine Arbeitsdatei. Ob sie eingecheckt wird, entscheidet das Projekt; in
den meisten Repos gehört `.claude/orchestration/` in die `.gitignore`.

---

## Vorlage

```markdown
# Vorgang: <Titel>

| Feld | Wert |
| --- | --- |
| Anfrage | <ein Satz, wörtlich aus dem Auftrag> |
| Quelle | <Issue-Link / Etappe / mündlich> |
| Stand | Aufnahme / Schnitt / Welle N läuft / Zusammenführung / Abnahme / fertig |
| Basis-SHA (aktuell) | <sha> — gilt für die laufende Welle |
| Integrationsbranch | <branch> |
| Angelegt / zuletzt geändert | <datum> / <datum> |

## Zielbild

<Zwei bis vier Sätze: was nach dem Vorgang gilt, was nicht dazugehört.>

## Abnahmekriterien

| Nr. | Kriterium | Entscheidet | Stand |
| --- | --- | --- | --- |
| AK-1 | <von außen prüfbar> | `<befehl>` → <erwartetes Ergebnis> | offen |
| AK-2 | | | offen |

Stand: offen / erfüllt / nicht erfüllt / ungeprüft

## Antworten und Annahmen

| Frage | Antwort | Von wem |
| --- | --- | --- |
| <Frage aus Phase 0> | <Antwort> | Auftraggeber |
| <unbeantwortet> | **Annahme:** <…> | Leitstand |

Eine benannte Annahme ist prüfbar, eine stillschweigende nicht.

## Karte

<Befunde des Scouts, gekürzt: Flächen mit Größe, gemessene Importbeziehungen,
Prüfbefehle wie sie wirklich heißen, Wächtertests mit ihren Schwellen.>

## Pakete

| Nr. | Fläche | AK | Rolle | Modell | Welle | Stand | Anläufe |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P-1 | <dateien> | AK-1 | general-purpose | opus | 1 | fertig | 1 |
| P-2 | <dateien> | AK-2 | react-specialist | sonnet | 2 | läuft | 1 |

Stand: geplant / läuft / zurück / fertig / geprüft / zusammengeführt
Anläufe: bei **3** wird neu geschnitten, nicht neu gestartet.

## Wellen

| Welle | Pakete | Basis-SHA | Ergebnis |
| --- | --- | --- | --- |
| 1 | P-1 | <sha> | zusammengeführt als <sha> |
| 2 | P-2, P-3, P-4 | <sha> | läuft |

## Nebenfunde

| Nr. | Fund | Von | Entscheidung |
| --- | --- | --- | --- |
| N-1 | <was aufgefallen ist, mit Fundstelle> | P-2 | eigenes Paket P-7 |
| N-2 | | P-3 | in den Bericht |

Entscheidung: offen / eigenes Paket / in den Bericht / verworfen (mit Grund)
**Kein Nebenfund verschwindet stillschweigend.**

## Schleifen

| Nr. | Was verfehlt wurde | Klasse | Zurück nach | Ergebnis |
| --- | --- | --- | --- | --- |
| 1 | <AK-2 nicht erfüllt: …> | Baufehler | 4 | behoben in P-3, Anlauf 2 |

Klasse: Baufehler → 4 · Schnittfehler → 1 · Zielbildfehler → 0
**Höchstens zwei Schleifen je Paket**, danach geht es an den Auftraggeber.

## Offen

<Was zum Schluss noch aussteht — als Frage, nicht als Vermutung.>
```

---

## Was hineingehört und was nicht

| Hinein | Nicht hinein |
| --- | --- |
| Basis-SHA je Welle | Der Auftragstext im Wortlaut (steht im Auftrag) |
| Rolle und Modell je Paket | Diffs oder Codeausschnitte |
| Anlauf- und Schleifenzähler | Testausgaben (die liegen als Datei) |
| Jeder Nebenfund mit Entscheidung | Was du ohnehin nicht wieder liest |
| Benannte Annahmen | Erzählung des Verlaufs |
| Was **nicht** feststellbar war | Zwischenstände, die überholt sind |

**Setz nicht hinein, was du nicht wieder liest.** Ein Vorgangsbuch, das mit dem
Vorgang mitwächst, wird selbst zum Kontextproblem — halte es auf einer
Bildschirmseite plus Tabellen.

---

## Einen Vorgang wieder aufnehmen

Nach `/clear`, in einer neuen Sitzung oder per Befehl `orchestrate-resume`:

1. Vorgangsbuch lesen. **Es ist der Stand**, nicht der Verlauf.
2. `git log --oneline` auf dem Integrationsbranch: Stimmt der eingetragene Stand
   mit dem Repo überein?
3. Prüfen, ob noch Agenten laufen. Ein Paket auf `läuft`, dessen Agent es nicht
   mehr gibt, ist ein **Abriss** — nach Playbook behandeln, nicht neu starten.
4. Da weitermachen, wo `Stand` steht.

⚠️ **Weicht das Vorgangsbuch vom Repo ab, gilt das Repo.** Korrigiere das Buch,
bevor du weiterarbeitest — ein falscher Basis-SHA im Buch erzeugt genau den
Fehler, gegen den das Buch geschrieben wurde.
