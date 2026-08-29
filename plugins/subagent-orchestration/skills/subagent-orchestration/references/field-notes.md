# Woher die Regeln kommen

Diese Datei ist der Herkunftsnachweis. Wer eine Regel im Skill für übertrieben
hält, liest hier nach, worauf sie beruht.

Die Regeln haben **zwei** Quellen, und der Unterschied ist wichtig:

| Quelle | Was das heißt | Wo sie steht |
| --- | --- | --- |
| **Vorfall** | Einmal schiefgegangen, hat Nacharbeit gekostet | Teil A |
| **Mechanik** | Aus dem dokumentierten Verhalten von Claude Code hergeleitet | Teil B, ausführlich in [`mechanics.md`](mechanics.md) |
| **Messung** | Am Skill selbst gemessen, mit Aufbau und Zahlen | Teil C |

Was weder das eine noch das andere ist — eine bloße Meinung darüber, wie man
arbeiten sollte —, gehört nicht in den Skill. Findest du dort eine Regel, die
hier keinen Eintrag hat und sich auch nicht auf die Mechanik stützt, ist das ein
Mangel; sie gehört belegt oder gestrichen.

---

# Teil A: Vorfälle

Aus einer Nacht mit neun Agentenläufen an einem Frontend-Umbau: drei Etappen,
zwölf Dateien, drei Änderungssätze, Abnahme im Browser. Jeder Punkt hat
Nacharbeit gekostet, und die Nacharbeit war jedes Mal teurer als die Zeile im
Auftrag, die sie verhindert hätte.

## 1. Der fehlende Basis-Commit

**Was passierte:** Vier Agenten liefen los, bevor auffiel, dass ihre Worktrees
am Standardbranch hängen und nicht am Arbeitsbranch. Einer sollte eine Datei
reparieren, die auf seinem Stand noch gar nicht in der zu reparierenden Form
existierte — er baute etwas Richtiges an einer Stelle, die es nicht mehr gab.
Zwei mussten ihren Stand nachträglich per `reset --hard` umsetzen und ihre
Arbeit wiederholen.

**Die Regel:** Der Basis-Commit als SHA plus `git fetch --all && git reset
--hard <sha>` steht in **jedem** Auftrag, auch wenn du glaubst, der Agent stünde
richtig.

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

---

# Teil B: aus der Mechanik hergeleitet

Regeln, die kein Vorfall belegt, die aber aus dem dokumentierten Verhalten von
Claude Code folgen. Quelle und Datum stehen in [`mechanics.md`](mechanics.md);
widerspricht eine Beobachtung, gilt die Beobachtung.

| Regel im Skill | Woraus sie folgt |
| --- | --- |
| Der Auftrag ist selbsttragend | Ein Subagent startet mit eigenem, leerem Kontextfenster: kein Verlauf, keine gelesenen Dateien, keine aufgerufenen Skills. |
| Konventionen wörtlich, nicht als Verweis | Die CLAUDE.md-Kette **erreicht** den Agenten. Dass Regeln trotzdem fallen, ist kein Verfügbarkeits-, sondern ein Auffälligkeitsproblem — das schränkt die Regel ein und begründet sie zugleich. |
| Der Rückmeldevertrag ist Pflicht | Nur die Abschlussmeldung des Agenten landet in deinem Fenster. Die Ersparnis ist also eine Folge des Deckels, keine Eigenschaft von Subagenten. |
| Nachsteuern statt neu starten | Jeder Aufruf erzeugt eine **neue Instanz**; `SendMessage` setzt die bestehende mit vollem Verlauf fort und wird als normale Auftragsführung behandelt, auch mitten in der Arbeit. |
| Aufwand und Werkzeuge über die Definition, nicht über den Aufruf | `effort`, `tools`, `maxTurns` und `skills` stehen **nur** in der Agentendefinition. Pro Aufruf steuerbar sind Rolle, Auftragstext, Modell, Hintergrund und Isolation. |
| Rollen dürfen mitten im Vorgang entstehen | Claude Code beobachtet `.claude/agents/` und `~/.claude/agents/` und übernimmt neue oder geänderte Dateien binnen Sekunden ohne Neustart. |
| `.claude/agents/` gehört in Phase 0 angelegt | Der Beobachter deckt nur Verzeichnisse ab, die beim Sitzungsstart existierten — die erste Datei in einem neu angelegten Verzeichnis greift erst nach einem Neustart. |
| Eine Projektrolle schlägt eine Plugin-Rolle | Bei gleichem Namen gewinnt der höherrangige Ort: verwaltete Einstellungen, `--agents`, `.claude/agents/`, `~/.claude/agents/`, Plugin. |
| Der Basis-SHA gehört in jeden Auftrag | `isolation: worktree` zweigt **standardmäßig vom Standardbranch** ab, nicht vom `HEAD` der Sitzung. Das ist die dokumentierte Ursache von Vorfall 1. |
| Kein Prüfer mit Schreibrechten | Aus der Sache, nicht aus der Mechanik: ein Prüfer, der repariert, beurteilt anschließend seine eigene Reparatur. Die Mechanik liefert nur das Mittel (`tools:`) — und dass Plugin-Agenten `permissionMode` ignorieren, weshalb das Verbot zusätzlich im Prompt steht. |
| Keine verschachtelten Orchestrierer | Verschachtelung ist möglich (drei Ebenen), aber ein verschachtelter Leitstand hat kein Vorgangsbuch und keinen Zugang zum Auftraggeber: er kann weder nachfragen noch zusammenführen noch abnehmen. |
| `Explore` und `Plan` nicht für fortsetzbare Arbeit | Beide sind Einmalläufer, geben keine Agenten-ID zurück und überspringen CLAUDE.md und den Git-Status. |
| Vorsicht bei Sammelfreigaben während einer Welle | Rechteabfragen von Hintergrundagenten erscheinen in deiner Sitzung; eine Antwort, die über den einen Aufruf hinausgeht, gilt für die **ganze** Sitzung. |
| Die `SKILL.md` als Dienstanweisung, nicht als Schrittliste | Der Skill-Text bleibt als eine Nachricht im Kontext und wird in späteren Zügen **nicht neu gelesen**. |

## Beobachtungen am VoltAgent-Bestand

Ausgezählt an `VoltAgent/awesome-claude-code-subagents` (158 Rollen, Stand
August 2026). Nachprüfbar mit `grep -c` über die Kategorien:

| Befund | Folge im Skill |
| --- | --- |
| **Keine** Definition führt das `Agent`-Werkzeug | Kein Agent von dort kann Subagenten starten — die Orchestrierung bleibt beim Leitstand. |
| Die Rollen in `09-meta-orchestration` schreiben Markdown-Pläne und sagen das selbst | Nicht als Leitstand besetzen. |
| `code-reviewer` und `architect-reviewer` führen `Write` und `Edit` | Als Prüfer ungeeignet; `security-auditor`, `compliance-auditor` und `penetration-tester` sind lesend und dafür brauchbar. |
| 106 Rollen stehen auf `sonnet`, 25 auf `inherit`, 19 auf `haiku`, 8 ohne Feld | Das Modell der Rolle ist eine Voreinstellung, keine Entscheidung. Bei stiller Fehlerklasse beim Aufruf überschreiben. |
| Keine Rolle setzt `effort` oder `maxTurns` | Beides kommt aus Sitzung und Zuschnitt, nicht aus der Rolle. |
| Einige Rollen setzen MCP-Server voraus (`ui-ux-tester`, `visual-asset-generator`, `codebase-orchestrator`) | Vor dem Einsatz prüfen, sonst startet der Agent mit weniger, als sein Prompt annimmt. |

---

# Teil C: aus dem Test des Skills

Ein Testlauf gegen ein gebautes Repo (zwei Flächen, eine gemeinsame Sprachdatei
mit acht Importeuren, eine verfallene `>= 4`-Marke bei echtem Bestand 6, ein
Wächter der per Bauart fällt). Drei Aufgaben, jede einmal **mit** und einmal
**ohne** Skill, dieselbe Sitzung, dasselbe Modell.

| | mit Skill | ohne Skill |
| --- | --- | --- |
| erfüllte Prüfkriterien | 17/17 | 9/17 |

⚠️ **Ein Lauf je Zelle.** Die Streuung ist nicht gemessen; das sind
Einzelbeobachtungen, keine Mittelwerte.

## C1. Was der Skill nachweislich trägt

Zwei Merkmale kamen mit Skill in **3 von 3** Läufen vor und ohne Skill in
**0 von 3**:

- **Der Schnitt steht schriftlich** — Pakete und Wellen als Dokument, nicht im
  Kopf des Leitstands.
- **Der echte Exit-Code wird gefangen** statt der von `tail`. Ohne Skill kein
  einziges Mal — und das ist die Fehlerart, die einen roten Lauf als grün
  meldet.

## C2. Was der Test nicht zeigen konnte

- **Der Wächter, der per Bauart fällt**, wurde von beiden Seiten erkannt (3/3
  gegen 3/3). Der Testwächter sagte es in seinem eigenen Kommentar — das
  Kriterium war zu leicht und trennt nichts.
- **Beim Einzeldatei-Fall sagten beide Seiten das Verteilen korrekt ab.** Ein
  starkes Modell braucht dafür keinen Skill. Der Unterschied lag allein in der
  Form des Berichts.
- **Die Phasen 4 bis 7 sind ungetestet.** Alle drei Läufe haben geplant und
  gebaut; keiner musste eine Welle mit Rücklauf, Fehlschlag und Neuansatz
  fahren. Fehler-Playbook, frische Prüfung und Rückschleife sind der teuerste
  Teil des Skills und der am wenigsten belegte.

## C3. Die Kennung kam nicht an

**Was passierte:** Der Skill verlangt Abnahmekriterien mit Kennung (`AK-1`,
`AK-2`), damit Pakete, Prüfaufträge und Bericht aufeinander verweisen können.
Nur **einer von drei** Läufen tat das; die anderen erfanden `K1`…`K5`.

**Warum:** Die Kennung stand nur in `intake.md`, nicht in der `SKILL.md`. Wer
die Referenz nicht las, erfand ein eigenes Schema.

**Die Regel:** Was die Verweiskette des Vorgangs trägt, steht in der `SKILL.md`
selbst — mit der Begründung, wozu es dient. Eine Formvorschrift ohne Zweck wird
durch eine gleichwertig aussehende ersetzt.

## C4. Der Messaufbau war kaputt, nicht das Gemessene

**Was passierte:** Eine Messung der Auslösegenauigkeit ergab 0 von 10 bei den
Anfragen, die auslösen sollten. Der naheliegende Schluss — die Beschreibung ist
zu schwach — war falsch.

Eine **Kontrolle mit bekanntem Ergebnis** deckte es auf: Eine maximal plumpe
Beschreibung („ALWAYS INVOKE THIS SKILL FIRST …") kam auf denselben Wert. Wenn
die Obergrenze das Ergebnis ist, misst der Aufbau nicht das, was er messen soll.

Zwei Ursachen, beide banal:

1. **Parallele Sonden teilten sich ein Projektverzeichnis.** Jede legt eine
   Skill-Datei mit derselben Beschreibung an; bei sechs gleichzeitig sieht jede
   Sitzung alle sechs und ruft irgendeine auf, meist nicht die eigene. Das
   meldet „nicht ausgelöst".
2. **Die Sonden liefen in einem leeren Verzeichnis.** Dort fragt ein Modell nach
   Kontext, statt einen Skill zu laden — gemessen wurde die Leere.

Nach beiden Korrekturen erreichte die echte Beschreibung denselben Wert wie die
plumpe Kontrolle. Die Beschreibung war nie der Engpass.

**Die Regel:** Ein negatives Urteil ist erst ein Befund, wenn eine Kontrolle
zeigt, dass der Aufbau überhaupt ein positives liefern kann. Verdächtig ist
dabei die **Einheitlichkeit**: Ein einzelnes negatives Urteil ist plausibel,
zehn gleichförmige über verschiedene Flächen sind ein Aufbaufehler. Ausgeschrieben
in [`verification.md`](verification.md), Abschnitt „Wenn die Messung selbst
falsch sein kann".

**Nachtrag:** Der Fehlschluss ging als Befund an den Auftraggeber, bevor die
Kontrolle lief, und musste zurückgenommen werden. Eine Zahl, die einmal als
Befund im Raum steht, wird weiterverwendet — auch die falsche.

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
- **Fragen statt raten.** Vier Entscheidungen, die den Zuschnitt änderten,
  gingen mit Empfehlung an den Auftraggeber zurück. Eine wurde gegen die
  Empfehlung entschieden — das war sein Recht und kostete nichts, weil die Frage
  vorher kam und nicht hinterher.

## Was noch nicht belegt ist

Ehrlich benannt, damit es nicht als Erfahrung durchgeht:

- **Die Wellenbreite von drei bis fünf Paketen** ist eine Schätzung aus der
  Leseleistung eines Leitstands, keine Messung.
- **Der Deckel von 25 Zeilen** in der Rückmeldung ist gegriffen. Die Regel „es
  braucht überhaupt einen Deckel" folgt aus der Mechanik; die Zahl nicht.
- **Zwei Schleifen je Paket** ist eine Konvention gegen das Weiterprobieren,
  keine gemessene Grenze.
- **Die Aufteilung in vier Stufen** (messen / umstellen / stille Fehlerklasse /
  prüfen) folgt der Modellregel, ist aber nicht gegen eine feinere oder gröbere
  Einteilung gemessen.
- **Die Phasen 4 bis 7** sind bisher nur beschrieben, nicht durchlaufen — siehe
  C2. Ein Test, der einen Fehlschlag erzwingt, fehlt.
- **Die Auslösegenauigkeit der Beschreibung** ist weiterhin unbekannt. Der
  korrigierte Aufbau hat eine eigene Obergrenze (Sondenrepo ohne echten
  Projektkontext), unter der eine Aussage über die Beschreibung nicht möglich
  ist.
Wer diese drei Punkte misst, sollte die Zahlen hier ersetzen.
