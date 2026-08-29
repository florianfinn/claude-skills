# Phase 0: Aufnahme

Aus einer Anfrage wird ein **Zielbild in Abnahmekriterien** und eine Liste
beantworteter Fragen. Es wird nichts gebaut und nichts geschnitten.

Diese Phase ist die einzige, in der Fehler noch billig sind. Ein falsch
verstandenes Ziel kostet in Phase 7 den ganzen Vorgang.

---

## 1. Den Auftrag als Ganzes lesen

Nimm den Auftrag mit allem, was daran hängt: das Issue mit seinen Kommentaren,
die verlinkte Etappe, den Vorgang, in dem sie steht.

Achte auf drei Dinge, die selten im ersten Satz stehen:

- **Was „fertig" bedeutet.** Ist der Vorgang fertig, wenn der Code steht — oder
  erst, wenn es live läuft, dokumentiert ist, migriert wurde?
- **Was ausdrücklich nicht dazugehört.** Ein Auftrag ohne Rand wächst.
- **Woran der Auftraggeber es merken würde.** Das ist der Kandidat für dein
  erstes Abnahmekriterium.

## 2. Kontext aufnehmen, ohne ihn zu lesen

Du brauchst eine **Karte**, kein Gelände. Was du selbst liest, trägst du für den
ganzen Vorgang mit.

Schick `orchestration-scout` (oder `Explore`) los und verlange genau das:

```
Nimm die Karte für <Fläche/Auftrag> auf. Antworte in höchstens 30 Zeilen.

1. Beteiligte Dateien mit Zeilenzahl (`wc -l`).
2. Wer importiert wen: je Kandidatendatei die Zahl der Importeure
   (`grep -rl '<name>' <wurzel> | wc -l`) und ob sie aus einem oder aus
   mehreren Bereichen kommen.
3. Prüfbefehle des Projekts, wie sie wirklich heißen (aus package.json,
   Makefile, CI-Konfiguration — nicht geraten).
4. Tests, die den Quelltext lesen statt Verhalten zu prüfen, mit ihren
   Schwellenwerten.
5. Was du NICHT feststellen konntest.

Jede Zahl mit dem Befehl, der sie erzeugt hat. Keine Empfehlung, kein Urteil,
keine Einschätzung — nur Befunde.
```

⚠️ **Verlange ausdrücklich keine Empfehlung.** Ein Aufnahme-Agent, der urteilen
darf, liefert dir eine Meinung, die du nicht nachprüfen kannst, und du wirst sie
trotzdem übernehmen. Der Schnitt ist deine Arbeit.

## 3. Das Zielbild in Abnahmekriterien schreiben

Ein Abnahmekriterium ist **von außen prüfbar** und nennt, was es entscheidet.

| Kein Kriterium | Kriterium |
| --- | --- |
| „Die Dialoge sind einheitlich." | `grep -rl 'OldDialog' src/` liefert 0 Treffer; `pnpm test` beendet mit 0. |
| „Die API ist schneller." | `bench/list.js` meldet p95 < 200 ms auf dem Vergleichsstand `<sha>`. |
| „Sauber refaktoriert." | Keine Datei in `src/legacy/` mehr importiert; öffentliche Signaturen unverändert (`git diff --stat` zeigt keine Änderung in `*.d.ts`). |
| „Gut dokumentiert." | Jede neue öffentliche Funktion hat einen Eintrag in `docs/api.md`; `pnpm run docs:check` grün. |

Schreib zwischen drei und acht Kriterien. Weniger heißt, du hast das Ziel nicht
zerlegt; mehr heißt, du hast Arbeitsschritte als Kriterien getarnt.

**Jedes Kriterium bekommt eine Kennung** (`AK-1`, `AK-2`, …). Pakete, Prüfer und
Bericht verweisen darauf. Ohne Kennungen kannst du in Phase 7 nicht sagen, was
offen ist.

⚠️ **Ein Kriterium, das nur durch dich prüfbar ist, ist keins.** Wenn du es
einem frischen Agenten nicht in drei Zeilen erklären kannst, formulier es um.

### Auch der negative Fall gehört ins Kriterium

Ein Kriterium, das ohne die Arbeit ohnehin erfüllt wäre, prüft nichts. Frag bei
jedem: **Was wäre der Befund, wenn wir nichts getan hätten?** Steht dort dasselbe
Ergebnis, ist das Kriterium wertlos.

## 4. Projektprofil sicherstellen

Prüfe, ob `.claude/subagent-profile.md` existiert. Falls nicht, leg es aus
[`project-profile.md`](project-profile.md) an — oder ruf den Befehl
`orchestrate-profile` auf.

Das kostet einmal je Repo ein paar Minuten und speist danach jeden Auftrag:
Standardbranch, Prüfbefehle, Konventionen, Wächtertests, stille Fallen.

## 5. Fragen — einmal, gebündelt, mit Empfehlung

Nimm `AskUserQuestion`. Deine Empfehlung steht an erster Stelle.

**Frag, was den Schnitt oder die Kriterien ändern würde:**

- Rand: „Gehört die Migration der Altdaten dazu, oder nur der neue Pfad?"
- Ziel: „Fertig heißt gemergt, oder fertig heißt live?"
- Weg, wenn zwei tragfähige Wege bestehen und einer teurer, aber sauberer ist.
- Risiko: „Der Umbau berührt die Zahlungsstrecke. Mit Feature-Flag oder direkt?"
- Vorrang, wenn nicht alles in eine Etappe passt.

**Frag nicht:**

- Was im Projektprofil, in CLAUDE.md oder im Issue steht — lies es.
- Was du selbst entscheiden kannst und nachträglich billig zu ändern ist
  (Dateinamen, Reihenfolge innerhalb einer Welle, Modellwahl).
- Um Bestätigung eines Plans, den du gleich ohnehin ausführst. „Soll ich
  anfangen?" ist keine Frage, sondern Zögern.

**Regeln für den Zeitpunkt:**

- ⚠️ **Jetzt fragen.** Eine Frage nach dem Start hält vier Agenten an; eine
  Frage nach der Abnahme wirft ihre Arbeit weg.
- **Höchstens eine Fragerunde**, außer ein Befund macht eine zweite zwingend.
- Kommt keine Antwort, arbeite unter **ausdrücklich benannter Annahme** weiter
  und schreib sie ins Vorgangsbuch. Eine benannte Annahme ist prüfbar, eine
  stillschweigende nicht.

## 6. Vorgangsbuch anlegen

Zum Abschluss der Aufnahme legst du `.claude/orchestration/<vorgang>.md` an
(Vorlage: [`ledger.md`](ledger.md)) und trägst ein: Auftrag, Zielbild,
Abnahmekriterien mit Kennung, Antworten und Annahmen, Basis-SHA.

Ab hier ist das Vorgangsbuch der Stand — nicht dein Verlauf.

---

## Ausstieg aus dieser Phase

Weiter geht es erst, wenn **alle vier** stehen:

- [ ] Abnahmekriterien mit Kennung, jedes von außen prüfbar
- [ ] Karte der Flächen mit gemessenen Abhängigkeiten
- [ ] Projektprofil vorhanden
- [ ] Fragen beantwortet oder Annahmen benannt

Fehlt eines davon, ist der Schnitt eine Vermutung.
