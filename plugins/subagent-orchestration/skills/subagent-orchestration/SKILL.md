---
name: subagent-orchestration
description: Arbeit auf mehrere Subagenten aufteilen und wieder zusammenführen. Benutzen, sobald jemand „in Subagenten aufteilen", „mach das parallel", „mehrere Agenten", „verteil das", „split into subagents", „fan out" oder „run in parallel" sagt — oder eine Aufgabe mehrere getrennte Flächen (Dateien, Module, Dienste) gleichzeitig berührt.
---

# Arbeit auf Subagenten verteilen

Zuschnitt, Rolle des Organisators und die Prüfungen zwischen „der Agent meldet
fertig" und „es ist abgenommen". Jede Warnung (⚠️) ist gemessen; der Vorfall
dahinter steht unter seiner Nummer in
[`references/field-notes.md`](references/field-notes.md).

## Erst prüfen, ob überhaupt verteilt wird

Verteile nur, wenn **beides** zutrifft:

1. Der Auftraggeber hat es verlangt — oder die Aufgabe berührt mehrere Flächen,
   die einander nicht anfassen.
2. Es lohnt sich gegen die Kosten: jeder Agent beginnt ohne deinen Verlauf, und
   du liest am Ende jeden Diff. Die Schwelle hängt von der Arbeit ab:
   - **Bauarbeit** (Diffs, die du prüfen musst): ab **drei** Agenten, die
     gleichzeitig laufen. Bei zweien liest du zwei Diffs und sparst kaum Zeit.
   - **Bau plus unabhängige Prüfung**: schon **zwei** — ein Agent baut, einer
     prüft ohne dessen Kontext. Das kaufst du dir nicht mit Zeit, sondern mit
     einem zweiten Blick, den du selbst nicht hast. ⚠️ Gemessen: in einem Paket
     mit grüner Kette und Abnahme per Rückgabecode 0 fand der Prüfer **fünf
     falsche Zahlen**, die zwei Bauagenten und der Leitstand übersehen hatten —
     eine davon sah richtig aus, weil die neue Zeilenzahl zufällig der alten
     Vorkommenzahl glich (Vorfall 21–23).
   - **Scouts** (nur lesen, Zahlen zurück): schon **einer**, sobald die Suche
     deinen Kontext mehr füllen würde als seine Rückmeldung.

Für eine Datei und für alles, wo der Schnitt noch nicht feststeht, ist der
Alleingang schneller. **Ein unklarer Schnitt ist kein Grund zu verteilen,
sondern der Grund, es nicht zu tun.**

## Deine Rolle

Du schneidest, rüstest aus, prüfst, führst zusammen. Gebaut wird von den Agenten.
**Was du selbst baust, prüft niemand.** Behalte nur, was kein Agent übernehmen
kann: Konfliktauflösung, Schnitt in Änderungssätze, Abnahme, Fragen an den
Auftraggeber.

⚠️ **Das gilt auch für Korrekturen** (Vorfall 35). Ein Leitstand, der selbst
baut, füllt den eigenen Kontext mit Bauarbeit und hat niemanden, der sein
Ergebnis unabhängig prüft. Gemessen: drei bis vier Review-Runden je PR, solange
der Leitstand baute; eine Runde im Median, seit ein Bauagent baut.

## 0. Projektprofil

Dieser Skill wird zentral und projektübergreifend gepflegt. Verbindliche
Projektregeln, Modell-/Kostenvorgaben und ausdrückliche Aufträge gehen seinen
allgemeinen Heuristiken vor. Übertrage lokale Ausnahmen nicht auf andere Projekte
oder spätere Aufträge.

Suche zuerst `.claude/subagent-profile.md`. Fehlt es, leite es aus `CLAUDE.md`
oder `AGENTS.md` ab und schreibe nur nach, was dort fehlt — meist Wächtertests
und stille Fallen. Vorlage:
[`references/project-profile.md`](references/project-profile.md). Ohne Profil
schreibst du unvollständige Aufträge und merkst es erst an den Rückläufern.

## Vor dem Start: Entscheidungen und Abschlussgrenze

Kläre vor der betroffenen Etappe offene Produkt-, Umfangs- und
Schnittstellenfragen. Lies zuerst vorhandene Entscheidungen; routinemäßige
Umsetzungsfragen löst du innerhalb des freigegebenen Plans selbst. Echte offene
Entscheidungen legst du dem Auftraggeber früh und gebündelt mit Empfehlung vor,
bevor ein Agent auf einer ungeklärten Annahme aufbaut.

Halte den vereinbarten Plan stabil. Wesentliche Abweichungen, zusätzliche
Funktionen oder fremde Voraussetzungen werden mit Beleg und Auswirkung sichtbar
gemacht und vor der betroffenen Arbeit entschieden. Unabhängige freigegebene
Arbeit kann weiterlaufen.

Nach der Klärung arbeitest du autonom bis zum vereinbarten Abschlusskriterium,
bei einem entsprechenden Entwicklungsauftrag bis zum Abschluss-PR. Ein
Agentenbericht oder eine bestandene Einzelprüfung beendet den Gesamtauftrag
nicht. Übergaben halten den nächsten zulässigen Schritt und echte Blockaden
fest. Das erweitert keine Freigabe für Push, Merge, Veröffentlichung oder Deploy;
maßgeblich bleiben Auftrag und Projektregeln.

## 1. Schneiden

Der Schnitt steht **schriftlich, bevor der erste Agent läuft**.

- **Eine Datei gehört genau einem Agenten.** Zwei Agenten in derselben Datei
  erzeugen Konflikte, die du von Hand auflöst — dann liest du beide Arbeiten
  statt eine zu prüfen (Vorfall 8).
- Schneide entlang der **Fläche** (Datei, Modul, Dienst), nicht entlang der
  Tätigkeit. „Alle Dialoge" ist ein Schnitt. „Alle Tests nachziehen" fasst jede
  Fläche an.
- Abhängiges läuft **nacheinander**, Unabhängiges parallel. Schreibe Ketten und
  Gabeln auf, bevor du startest.
- ⚠️ **Gemeinsame Grundlagen werden vor abhängigen Arbeitern geprüft und
  gemergt** (Vorfall 27): Entscheidungen, Werkzeugfixes, Vertrag samt Version,
  Hash, Routen, Exporten und Fixtures. Lege **Basis-SHA, Vertrags-Owner und
  Merge-Reihenfolge** schriftlich fest. Nur die Versionsnummer einem Owner zu
  geben genügt nicht. Steht der Vertrag erst durch die Umsetzung fest, müssen
  die betroffenen Pakete vor ihrem abschließenden Review auf demselben
  integrierten Stand stehen. Freie Plätze ändern die Reihenfolge nicht.
- **Ein Agent verantwortet eine klar begrenzte Lieferung.** Zusammengehörige
  lokale Checkpoints bleiben bei diesem Owner; getrennte Lieferungen brauchen
  einen begründeten fachlichen oder vertraglichen Schnitt.
- **Schneide nach einer zusammenhängenden, abnehmbaren Lieferung mit einem
  verantwortlichen Owner.** Dateizahlen sind ein Hinweis auf Kontext- und
  Zugbudget, keine PR-Grenze. Die früher gemessenen 5 Scout-Suchpunkte,
  6 Prüfkriterien und 8–10 Umbau-Dateien (Vorfall 11) sind Startheuristiken.
  Plane bei größerer Arbeit lokale Checkpoints und fortsetzbare Berichte;
  zusätzliche Scouts, PRs oder Reviews brauchen einen sachlichen Grund.
  Gemeinsame Grundlagen und vorgeschriebene Risikoprüfungen bleiben erhalten.
- ⚠️ **Die vorgegebene Reihenfolge ist eine Vermutung, bis du sie gemessen
  hast.** Prüfe vorher, wer wen importiert (`grep -rl`). Eine vermeintliche
  Flächendatei kann eine gemeinsame Datei mit Dutzenden Importeuren sein
  (Vorfall 7).

## 2. Agententyp und Modell wählen

**Erst der Typ, dann das Modell.**

- **Scout** (suchen, zählen, Bestand kartieren): ein **nur lesender** Agent — in
  Claude Code der Typ `Explore`. Kein Worktree, kein Commit, Kurzvorlage aus
  [`references/agent-brief.md`](references/agent-brief.md).
- **Bauagent** (ändert Dateien, committet): eigenes Worktree, volle
  Auftragsvorlage. Ist [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
  installiert, nimm dessen spezialisierten Typ für die Fläche (z. B.
  `backend-developer`, `security-auditor`); sonst den generischen Agenten.
- **Prüfer** (fährt die Prüfkette auf einem fertigen Stand, zählt gemeldete
  Zahlen gegen, belegt mit Mutationen, dass die Tests greifen): eigenes
  Worktree auf dem zu prüfenden Stand, aber keine Commits. Kurzvorlage für
  Prüfaufträge aus derselben Datei. Er bekommt das Ergebnis, nicht den Verlauf
  des Bauagenten — das ist der zweite Blick, den du selbst nicht hast.

Das Modell folgt der **Fehlerklasse**, nicht der Textmenge:

| Arbeit | Modell | Warum |
| --- | --- | --- |
| Neue Bauart, Nebenläufigkeit, Zustand, Sicherheit | stark (Opus oder höher) | Fehler bleiben **still**: Tests grün, Verhalten falsch. |
| Fläche umstellen, Bestand löschen mit Nachweis, Logik debuggen | mittel (Sonnet) | Ein Test fängt den Fehler, aber der Agent muss den Code erst verstehen. |
| Suchen, zählen, Marken nachziehen, Doku im vorgegebenen Ton | leicht (Haiku) | Feste Regel anwenden, kein Urteil. Ein Fehler fällt sofort auf. |

⚠️ **Der Prüfer kommt von einem anderen Anbieter als der Bauagent und arbeitet
auf hoher Denkstufe** (Vorfall 35). Eine Prüfung auf mittlerer Stufe brauchte
vier Runden; niedrige Stufe nur für Doku- und Textprüfungen. Bauagenten für
Zustand, Lebenszyklus und Verträge laufen ebenfalls auf hoher Stufe — eine
höhere Stufe kostet weniger als eine weitere Review-Runde. Die mittlere Stufe
reicht für kleine, klar begrenzte Pakete.

⚠️ **Das Zugbudget ist die vierte Stellschraube**, neben Typ, Modell und
Zuschnitt (Vorfälle 11, 19). Die Zahl der Züge folgt der Länge der
vorgeschriebenen Kette, nicht der Schwierigkeit der Aufgabe: Stand prüfen,
Abhängigkeiten installieren, bauen, gegenprüfen, drei Prüfläufe, committen,
melden. Kennt dein Werkzeug ein Budget je Rolle, hebe es für Bau- und
Umbauaufträge an, statt den Auftrag zu kürzen — in Claude Code überschreibt eine
gleichnamige Rollendatei in `.claude/agents/` die des Plugins: Original
kopieren, nur das Budget ändern, damit die Disziplin im Rollenprompt erhalten
bleibt. Das Verzeichnis muss beim Sitzungsstart schon existieren.

⚠️ **Ein Scout-Auftrag ohne festgelegten Suchraum liefert falsche Negative, die
wie Fakten aussehen** (Vorfall 10). Nenne den Suchraum vollständig — auch
`docker/`, `ci/`, `scripts/` — und verlange zu jeder Bestandsaussage den
Rohbefehl samt Ausgabe.

## 3. Auftrag schreiben

Vorlage: [`references/agent-brief.md`](references/agent-brief.md). Ein Auftrag
ist **selbsttragend**: der Agent hat weder deinen Verlauf noch den Vorgang
gelesen. Was fehlt, leitet er her — plausibel, nicht unbedingt richtig.
Prüfe vor dem Start, ob der Auftrag ohne deinen Gesprächsverlauf ausführbar ist:
Ziel und Abnahme, freigegebene Entscheidungen, Grenzen, Voraussetzungen,
Zuständigkeiten, bekannte Fallen und Prüfweg müssen enthalten sein. Verweise
müssen für den Agenten erreichbar sein; ein Verweis auf den Elternchat ersetzt
keinen Kontext. Ungeklärte Voraussetzungen werden nicht als Fakten delegiert.
Stelle den aktuellen Kontext voran: Ziel, Entscheidungen, exakte SHAs,
Zuständigkeiten und Abnahme. Verlinke vollständige relevante Vorberichte einmal
über geprüfte, für den Agenten erreichbare Pfade; kopiere keine rekursiven
Auftragshistorien. Ein Berichtindex nennt Stand und offene Befundkennungen.
Werkzeuglimits rechtfertigen weder fehlenden kritischen Kontext noch abgeschnittene
Einwände; lagere vollständige Unterlagen erreichbar aus und prüfe den Zugang.
In jeden Bauauftrag gehören:

1. ⚠️ **Ein eigenes Worktree auf dem Basis-Commit als SHA.** Bietet das
   Agent-Werkzeug Worktree-Isolation je Aufruf (in Claude Code
   `isolation: "worktree"`), nimm sie. Sonst legst **du** es an
   (`git worktree add <pfad> <sha>`) und nennst den Pfad wörtlich. Der Agent
   prüft die SHA mit `git rev-parse HEAD` und **stoppt bei Abweichung** — kein
   `reset --hard`, das trifft im Hauptcheckout fremden Stand (Vorfälle 1, 9).
   Ein frisches Worktree ist noch nicht lauffähig: Abhängigkeiten je Worktree
   neu installieren, statt `node_modules` zu kopieren. Zum Aufräumen unter
   Windows das Verzeichnis löschen und `git worktree prune` — `git worktree
   remove` scheitert an „Filename too long" (Vorfall 16).
2. ⚠️ **Konventionen wörtlich**, nicht als Verweis. Agenten lesen die
   Konventionsdatei und halten sie trotzdem nicht ein (Vorfall 2).
3. ⚠️ **Die stillen Fallen der Fläche namentlich** — jede Fehlerklasse, die die
   Tests nicht fangen. Was ein Test fängt, muss nicht hinein; was grün
   durchkommt, unbedingt (Vorfall 4).
4. **Auftrag und Nicht-Auftrag.** Welche Dateien er anfasst, welche anderen
   Agenten gehören. Wer „im Vorbeigehen" aufräumt, kostet dich den Schnitt.
   Umgekehrt gilt: ein roter Wächter, dessen Ursache in **seinen** Dateien
   liegt, ist sein Auftrag — auch wenn der Wächter selbst fremdes Gebiet ist
   (Vorfall 17).
5. ⚠️ **Eine Rückmeldedatei, die fortlaufend wächst** — Pfad wörtlich im
   Auftrag, fortgeschrieben nach jedem Baustein, nicht erst am Ende
   (Vorfall 11). Bauaufträge tragen zusätzlich die Pflicht zum
   **Zwischencommit** je Baustein und die **Lesedisziplin** (`grep -n` statt
   ganzer Datei). Beides kostet wenige Züge und rettet den Stand beim Abriss.
6. **Die Bausteine nach Wert sortiert**, nicht nach Bequemlichkeit. Ein Abbruch
   soll das Wichtigste fertig vorfinden und nicht das Vorbereitende
   (Vorfall 20).
7. ⚠️ **Prüfmatrix und Rot-Belege gehören schon in den Erstauftrag**
   (Vorfälle 24–26): anwendbare Kombinationen aus Modus, Eigentum, Zielzustand,
   Aktion, Fehlerstufe und Transport; dazu Längengrenzen, Wiederanlauf,
   Persistenz und Wachstum, soweit betroffen. Ausschlüsse begründen.
   Verlange Mutationen, die den behaupteten Schutz entfernen und den Test rot
   machen, samt Befehl und echtem Exit-Code. Warte-, Stream- und Retrytests
   bekommen kurze, fallbezogene Timeouts; der Transporttest erreicht den
   tatsächlichen Transport. Eine Testzahl belegt keine Abdeckung.

Dazu: Rückmeldung in **Zahlen**, dass er nur **eigene Pfade** stagt (nie
`git add -A`, Vorfall 9), und was er nicht tut (mergen, deployen,
Wächtermarken senken).

⚠️ **Was du entscheiden kannst, entscheidest du und schreibst das Ergebnis in
den Auftrag** (Vorfall 19). Jede Nachschlagearbeit, die im Auftrag stehen
könnte, bezahlt der Agent aus seinem Zugbudget — ein Paket verbrannte 62 Züge im
Wörterbuch des Projekts und änderte dabei keine einzige Datei. Umgekehrt: ein
Vorgang, dessen Messungen vollständig im Auftrag standen, hatte in fünf Läufen
**keinen einzigen Abriss** (Vorfall 21–23).

⚠️ **Prüfe jeden Messweg daraufhin, ob der Agent ihn überhaupt gehen kann**
(Vorfall 22). Du hast Zugriffe, die er nicht hat: ein Nachbarrepo, das Netz,
Anmeldedaten, Werkzeuge. Ein Auftrag, der `git` auf ein zweites Repo
vorschreibt, ist in einem isolierten Worktree nicht ausführbar — und der Agent
merkt es erst mittendrin. Nenne den Weg, den **er** gehen kann, und woran der
Stand der fremden Quelle zu belegen ist. Dass die Zahlen im Auftrag Vorgabe
sind, die Gegenprobe am Ende aber trotzdem Pflicht, gehört ausdrücklich hinein.

⚠️ **Prüfe vor dem Schneiden, ob der Änderungssatz eine Datei berührt, die ein
ANDERER Mechanismus als unveränderlich führt** (Vorfall 23) — Migrationen,
Archivstücke, Prüfsummen, Sperrdateien. Zwei Wächter können einzeln richtig und
zusammen unerfüllbar sein, und das sieht man nicht, indem man die Tests liest:
die zweite Regel steht oft gar nicht im Testverzeichnis. Der naheliegende
Ausweg des Bauagenten wäre in einem gemessenen Fall ein Ausfall im Betrieb
gewesen, den keine Prüfkette gefangen hätte.

⚠️ **Abnahmekriterien mit wörtlichem Grep prüfst du am Kriterium selbst**,
bevor es in den Auftrag geht (Vorfall 18): ein Wort trifft auch Prosa,
Kommentare und Image-Namen. Ein falsch gefasstes Kriterium meldet der Agent als
Befund; nachverhandelt wird es nicht.

## 4. Starten und führen

- Unabhängige Agenten startest du **in einem Aufruf**, im Hintergrund. Ketten
  Glied für Glied, jedes auf der SHA des Vorgängers.
- In Claude Code: Nachsteuern per `SendMessage`, **nicht** per neuem Agenten —
  der fängt kalt an und leitet denselben Kontext noch einmal her. ⚠️ **Die erste
  Zeile jeder Nachricht an einen laufenden Agenten lautet „committe sofort"**, vor jeder
  inhaltlichen Anweisung (Vorfall 20). Wer eine Korrektur bekommt, fängt sonst
  an zu arbeiten, statt zu sichern.
- ⚠️ **Der Abriss am Zuglimit ist der Regelfall, nicht die Ausnahme**: rund
  jeder zweite Lauf endete so, und die Benachrichtigung trägt dann nur den
  letzten Gedanken, keine Zahlen (Vorfall 11). Der Standardweg danach:
  Zwischenstand **vom Leitstand** committen (Betreff „Zwischenstand", Body:
  „vom Leitstand unverändert committet"), dann einen frischen Agenten mit einem
  Stand-Absatz im Auftrag ansetzen — Rückmeldedatei und Zwischencommits sagen
  dir, was hineingehört.
- ⚠️ **Im Claude-Code-Lauf aus Vorfall 12 waren nach einem Sitzungslimit (`429`)
  alle laufenden Agenten tot und `SendMessage` blieb bis Sitzungsende weg**.
  In diesem Fall ist Nachsteuern keine Option mehr; es bleibt der Standardweg
  oben. Für T3 siehe den Abschnitt
  „T3 Code / Codex“.
- ⚠️ **Warten blockiert den Leitstand** (Vorfall 34). Nach dem Start im
  Hintergrund endet dein Zug; die Abschlussmeldung weckt dich. Keine
  Warteschleifen (`sleep`/`until`, Statusabfragen in Schleife, blockierendes
  Warten auf Agenten) und keine langen Builds, Tests oder Pushes im Vordergrund
  des Leitstands. Solange dein Zug läuft, erreicht dich der Auftraggeber nur
  per Nachsteuern, Meldungen stauen sich, der Kontext wächst, und jede
  Wiederaufnahme nach mehr als rund fünf Minuten liest den ganzen Kontext
  ungecacht neu. Lange Läufe gehören in einen eigenen Hilfsauftrag.
- ⚠️ **Vor jedem Zugende hat jede offene Arbeit einen Weckmechanismus**, der
  das Zugende überlebt (Vorfall 34): ein laufender Agent mit Abschlussmeldung
  oder eine App-Überwachung. Wartebedingungen stützen sich nur auf Prüfungen,
  die einen Endzustand erreichen. Ein Zug endet nie mit einer Ankündigung
  („Als Nächstes …“): ausführen oder das erwartete Ereignis nennen. Ein Zug,
  ein Arbeitspaket.
- Lautet der Auftrag „arbeite selbständig“, fragst du nur bei Zuschnitt,
  Kosten, Sicherheit und Veröffentlichung nach. Alles andere entscheidest du
  und begründest es im Bericht (Vorfall 34).
- **Die Wellenbreite begrenzt auch dein Kontingent.** Drei gleichzeitige Läufe
  auf dem starken Modell plus einer auf dem mittleren haben das Sitzungslimit
  gerissen.
- Ein Fehler in deiner Ausstattung geht korrigiert an **alle** laufenden
  Agenten, nicht nur an den, der nachfragt.
- Entscheidungen, die den Zuschnitt ändern, gehören dem Auftraggeber. Frag mit
  Empfehlung an erster Stelle; entscheidet er anders, wende einmal ein und
  führe aus.

## 5. Prüfen

Lies den **Diff**, nicht nur den Bericht.

Staffle die Prüfungen: früh Import-/Abhängigkeitsgraph, Fixtures, Metadaten und
Projektwächter, während der Umsetzung fokussierte Verhaltenstests, am integrierten
Abschluss die vorgeschriebene vollständige Kette. Wiederhole erfolgreiche volle
Läufe nur bei Änderungen, Fehlern oder verbleibenden konkreten Unsicherheiten.
Bekannte Flakes mit Erstfehler und Wiederholung dokumentieren und zur Behebung
verfolgen; ein späterer grüner Lauf löscht den Erstfehler nicht. Verbindliche
Hooks werden nicht umgangen; Evidenzwiederverwendung braucht eine ausdrückliche
Projektregel.

- ⚠️ **`<befehl> 2>&1 | tail -25; echo $?` meldet den Exit-Code von `tail`**
  (Vorfall 3). Richtig: `<befehl> > lauf.txt 2>&1; echo "code=$?"; tail -25 lauf.txt`.
- ⚠️ **Ein Mutationsbeleg zählt nur, wenn der Zieltest nachweislich lief und an
  einer Assertion scheitert** (Vorfall 33). Testname und Testanzahl stehen im
  Lauf; OOM, Deadlock, Timeout und ein Filter ohne Treffer sind keine Rot-Belege.
  Prüfungen, die blockieren können, laufen mit eigener Frist und melden das als
  Assertion.
- **Zähl jede gemeldete Zahl nach** (`grep -c`, `wc -l`), bevor sie in einen
  Commit- oder Änderungstext kommt.
- ⚠️ **Bestands- und Totcode-Aussagen ohne Rohbefehl und Ausgabe gelten als
  ungeprüft** (Vorfall 10).
- ⚠️ **`>= N`-Marken in Wächtertests verfallen lautlos** (Vorfall 4). Nachzählen
  statt übernehmen.
- Prüfbefehle laufen auf dem **zusammengeführten** Stand. Was einzeln grün ist,
  kann zusammen rot sein.
- ⚠️ **Auch der Leitstand bearbeitet gleichzeitige Änderungssätze in getrennten
  Worktrees** und wechselt während einer laufenden Prüfkette nicht den Branch
  (Vorfall 33).
- ⚠️ **Prüfläufe laufen im Worktree, nie aus einer Kopie** (Vorfall 14). Tests,
  die `git ls-files` oder `core.hooksPath` lesen, werden außerhalb des
  Arbeitsbaums falsch rot. Eine Mutationsprobe ändert genau eine Datei im
  Worktree und stellt sie danach mit `git show HEAD:<pfad>` zurück.
- **Nachträge machen betroffene Prüfevidenz ungültig.** Prüfe die berührten
  Verhaltenspfade und Wächter erneut und fahre die vorgeschriebene volle Kette
  auf dem abschließenden Paketstand. Bündle verwandte Korrekturen vor diesem
  Lauf; ein Einzeltest ersetzt die integrierte Abschlussprüfung nicht
  (Vorfall 13).
- ⚠️ **Die erste Korrektur deckt die Fehlerklasse ab**, nicht nur die
  Fundstelle (Vorfall 24). Bei fehlendem Audit, ungefangenem Fehler, falschem
  Timeout oder unbegrenztem Wachstum werden alle vergleichbaren Pfade geprüft.
  Der Fixbericht nennt Klasse, verwandte Stellen und Rot-Belege. Bilde die
  Wirkungskette bereits beim ersten Fix ab: Produzent → Transport/DTO →
  tatsächlicher Consumer, einschließlich initialem Fehler, Teilzustand, Latenz,
  Identitätswechsel und Wiederanlauf, soweit betroffen. Asynchrone Tests warten
  über Barrieren auf die relevante Wirkung, bevor sie Zähler prüfen. Ein
  Compilerfehler, Timeout oder eine äquivalente Mutation ist kein Rot-Beleg für
  den behaupteten Schutz. Scheitert die
  erste Korrektur an derselben Klasse, folgt sofort ein **Ursachenplan**, bevor
  weitergebaut wird; eine Zwei-Runden-Grenze ist die äußerste Grenze.
- ⚠️ **Korrekturen erzeugen neue Befunde** (Vorfall 35): mindestens vier von
  23 blockierenden Befunden in zwei Meilensteinen, bei beiden Bauagenten. Die
  Korrekturprüfung sucht deshalb ausdrücklich Regressionen derselben
  Fehlerklasse im ganzen Fix-Diff. Dafür reicht das mittlere Modell auf hoher
  Stufe; bei großen Fixmengen oder neuen Blockern prüft wieder das starke.
- ⚠️ **Jeder Schritt-PR mit Laufzeit-, Vertrags- oder Lebenszyklusrisiko
  bekommt vor dem Merge ein eigenes Review** (Vorfall 35). Zwei ausgelassene
  Einzelreviews verschoben zwei Blocker ins Abschlussreview und drei Fehler in
  die Abnahme.
- ⚠️ **Ein Folgereview erhält den vollständigen Vorbericht und den Diff seit
  dessen geprüftem Stand** (Vorfall 30). Nenne beide Head-SHAs, Befundkennungen,
  Antworten, Entscheidungen und offene Einwände. Ein dauerhafter, für den
  Prüfer lesbarer Verweis spart Wiederholung; er ersetzt keine fehlenden Teile
  durch eine Kurzfassung. Der Prüfer liest den Vorbericht vollständig.

Nach jedem Review ordnet der Koordinator die Befunde einmal zu: Blocker,
ausgewählte verwandte Korrekturen und begründet vertagte Verbesserungen mit
Nachverfolgung. Ein Korrekturpaket behebt zusammengehörige Ursachen; nach PASS
lösen akzeptierte nichtblockierende Befunde keine weitere Schleife aus.
Neue Produktfragen werden sofort sichtbar gemeldet, nicht nur im privaten
Zwischenbericht abgelegt.

## 6. Zusammenführen und in Änderungssätze schneiden

Ein Integrationsbranch, `git cherry-pick` in Abhängigkeitsreihenfolge.

⚠️ **Spekulative Integration auf ungeprüften Basen bleibt begrenzt**
(Vorfall 28). Während einer Anbieterpause bevorzugt unabhängige Tests,
Fixtures, Layout und Adapter gegen stabile Schnittstellen vorbereiten. Einen
vollständigen Vorgriff nur mit festgelegter Schnittstelle und begründetem
Zeitgewinn beginnen; Risiko und verworfene Altstände festhalten. Bekannte
Basis-Konflikte werden vor dem nächsten Review aufgelöst. Veröffentlichte
Historie wird nicht rebased oder force-gepusht.

⚠️ **Betreffs und PR-Titel nie inline** (Vorfall 15). Zweimal landete ein
doppelt kodierter Betreff auf dem Standardbranch (`â€” A4 des RÃ¼ckbaus`) —
einmal aus einem `--title` in derselben Bash-Zeile wie ein `perl -pi`, einmal
aus einem `printf`. Der Squash-Merge übernimmt den PR-Titel ungeprüft. Also:
Text in eine UTF-8-Datei, Übergabe per `-F` / `--body-file`. Den tatsächlich
vorgesehenen Squash-Betreff samt Body vor dem Merge gegen die
Projektregeln prüfen: insbesondere erforderliche Issue-Referenz im Betreff,
Identitäten und Veröffentlichungseignung. Nach dem Commit den tatsächlichen
Betreff prüfen, bei Kodierungsverdacht auch mit `git log --format=%s -1 | od -c`.

⚠️ **Der Schnitt folgt den Wächtern, nicht der Ästhetik** (Vorfall 5). Ein Test
mit `assert gefunden > 0` fällt **per Bauart**, sobald der Übergang zu Ende ist;
seine Löschung kann dann nicht in einen eigenen Änderungssatz. Prüfe vor dem
Schnitt, welcher Wächter bei welcher Kombination kippt.

⚠️ **Ein fehlgeschlagener Push wird gelesen, bevor er wiederholt wird**
(Vorfall 21). Ein Haken, der vor dem Push die Prüfkette fährt, scheitert
deterministisch — und sein Fehltext sieht aus wie ein Netzwerkfehler. Vier
Anläufe mit Backoff gingen so verloren, während der Haken in jener Umgebung für
**keinen** Commit grün werden konnte. Wiederholen ist nur bei einem belegten
Netzwerkfehler richtig. Ein reproduzierbar fehlerhafter Haken wird in einer
tauglichen Umgebung behoben oder nach ausdrücklicher Projektregel behandelt;
kein eigenmächtiges Abschalten. Echte Exit-Codes und verbleibende Grenzen
werden dokumentiert.

## 7. Abnehmen

- Abgenommen wird auf dem **zusammengeführten** Stand.
- ⚠️ **Vor dem abschließenden Review läuft ein Smoke-Test des Kandidatenpakets
  gegen echte Abhängigkeiten**, und Fixtures für fremde Antworten werden gegen
  den echten Erzeuger abgeglichen (Vorfall 33). Reviews und synthetische Tests
  prüfen sonst gegen dieselbe falsche Annahme.
- **Berichtsaussagen über Abnahmeschritte zitieren die Schrittliste des
  Prüfskripts**, nicht das Gedächtnis (Vorfall 33).
- ⚠️ **Prüfe den Fall, der ohne den Fix falsch wäre**, nicht den, der ohnehin
  gewinnt (Vorfall 6). Bei sortierten Größen den kleinsten Wert, nicht den
  größten.
- Was du nicht prüfen konntest, **benenne als ungeprüft**.

## 8. Bericht

Je Agent: Typ, tatsächlich belegtes Modell, Auftrag, Ergebnis und offene Punkte.
Unterscheide Produktverhalten, Prüfbelege und Grenzen; PR- oder Testzahlen allein
belegen keinen Nutzen. Zeit-, Token- und Kostenangaben nur aus tatsächlichen
Messungen ableiten, keine eingesparten Stunden oder Modellkosten erfinden.
Echte offene Entscheidungen mit Empfehlung vorlegen; bekannte vertagte Befunde
mit ihrer Disposition berichten.

## T3 Code / Codex

Bei T3-Delegation und Fortsetzung nach Hintergrundarbeit oder Unterbrechungen
lies [`references/t3-codex.md`](references/t3-codex.md).
Nutze den aktuellen Werkzeugkatalog, eigene delegierte Review-Runden und geprüfte Worktrees.
Arbeiter committen lokal; Integration und Push bleiben beim Koordinator nach Projektfreigabe.
Beachte Modellkosten und tatsächliche Anbieterfehler; eine Claude-Nutzungsabfrage
ist keine Startbedingung. Schütze Tokens auch in Prozessargumenten (Vorfall 31).
