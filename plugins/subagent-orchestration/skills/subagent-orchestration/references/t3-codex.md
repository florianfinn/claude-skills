# T3 Code / Codex

Diese Betriebsweise ergänzt die Claude-Code-Schritte oben. Werkzeuge und
Modell-IDs kommen aus dem aktuellen `orchestrator_capabilities`-Katalog;
Projektregeln und die Modellvorgabe des Auftraggebers bleiben verbindlich.

- **Anbieterübergreifend per `delegate_task` delegieren:** Codex für Umsetzung,
  Opus für komplexe Reviews, Sonnet für kleine, klar begrenzte Prüfungen. Jeden
  Review in einem eigenen delegierten Thread starten. Dafür keine zusätzlichen
  normalen Top-Level-Chats erzeugen.
- Jeden Folgereview als neuen `delegate_task`-Auftrag mit vollständigem
  ursprünglichem Prüfauftrag, Vorbericht, Antworten und offenen Einwänden
  starten (Vorfall 30). Die `childThreadId` ist dessen Ablage, kein Ziel zum
  Fortsetzen einer Review-Runde. `taskId` je Runde behalten; eine eigene
  `clientRequestId` je Runde bleibt bei Wiederholungen derselben Runde gleich.
- **Ein Worktree je schreibendem Arbeiter**, mit geprüfter Basis-SHA; Prüfer
  bekommen einen eigenen Stand für Mutationen. Bauagenten committen nur lokal.
  Integration und die Freigabe zum Push bleiben beim Koordinator; ein
  gesonderter Hilfsauftrag darf ausschließlich einen bereits freigegebenen
  Push ausführen. ⚠️ Gemeinsame
  Vertragsgrundlagen bleiben beim benannten Owner (Vorfälle 9, 27). Reviewer
  zählen zur Kapazitätsgrenze oder werden ausdrücklich gesondert budgetiert.
- **Keine verpflichtende Claude-Nutzungsabfrage oder feste Prozentgrenze.**
  Nach Vorgabe des Auftraggebers wird die Nutzung als Fair Use behandelt.
  Fehlende OAuth-Nutzungsdaten blockieren daher keine Delegation. Modellkosten,
  sinnvolle Parallelität und ausdrückliche Projektvorgaben bleiben maßgeblich.
  Tatsächliche Anbieterfehler oder Drosselung anhand ihrer Rückmeldung behandeln;
  keine spekulativen Resetzeiten oder periodischen Statusagenten einplanen.
- ⚠️ **Token niemals als Kommandozeilenargument übergeben** (Vorfall 31).
  Nur innerhalb des abfragenden Prozesses verwenden oder über stdin bzw.
  einen Konfigurationskanal übergeben, etwa mit `curl -K -`. Ein Header wie
  `curl -H "Authorization: Bearer …"` legt den Token in Prozessargumenten
  offen; unterdrückte Ausgabe schützt davor nicht.
- Eine **private Zustandsdatei je Meilenstein** trägt freigegebene Grundlagen,
  Basis-/Head-SHAs, Owner, Merge-Reihenfolge, Task-IDs, vollständige Berichte,
  offene Befunde und den nächsten zulässigen Schritt. Status knapp
  abfragen, vollständige Ergebnisse einmal übernehmen. Betriebspfade und
  Credentials gehören weder ins Repo noch in öffentliche Review-Belege.

## Umgebung und Fortsetzung absichern

Vor dem Start prüfen: tatsächlich eingebundenes Worktree, vollständige Basis-SHA,
verfügbare native Toolchain, notwendige Umgebungsinitialisierung und Ressourcen.
Die vorbereitete Umgebung muss für den Kindauftrag erreichbar sein; ein
angeforderter Pfad im Text ersetzt keine korrekte Werkzeug-/Worktree-Bindung.
Schwere Prüfläufe bei knappen gemeinsamen Ressourcen serialisieren.

Ein Hintergrundbefehl ist noch keine Fortsetzung des Gesamtauftrags. Vor Zugende
muss jede offene Arbeit eine app-eigene Aufgabenbenachrichtigung oder einen
PR-Watch haben, der das Zugende überlebt (Vorfall 34). Wartebedingungen dürfen
nur Prüfungen enthalten, die einen Endzustand erreichen. ID, nächsten Schritt
und tatsächlichen Befehlsstatus privat festhalten. Endet nur der Push, folgt die erlaubte PR-/Review-Aktion weiter.
Beim autorisierten Beobachten den App-Watch verwenden; bei Rückgabe an den
Auftraggeber den Watch nach App-Vorgabe aufheben. Das erteilt keine neue
Freigabe für Veröffentlichung, Merge oder Deploy.

Nach Unterbrechungen zuerst Taskstatus, Bericht, Worktree/Commits und tatsächliche
Exit-Codes prüfen. Bei unterbrochenem Push auch den Remote-Ref vergleichen, bevor
er wiederholt wird. Eine verlorene Antwort bedeutet weder Erfolg noch Fehlschlag;
mit gespeicherten Task-/Request-IDs weiterarbeiten und keine Doppelaufträge starten.

## Warten und Wecken

Ein offener Zug des Leitstands nimmt neue Nachrichten nur als Nachsteuern an;
ein beendeter Zug startet bei jeder Nachricht oder Abschlussmeldung einen neuen
(Vorfall 34).

- Nach `delegate_task(mode:"async")` kein `t3_thread_wait` und kein
  `task_status` in Schleife. Beende den Zug mit eingerichtetem Weckmechanismus.
  Ein abhängiger Folgeauftrag startet nach der Abschlussmeldung auf dem
  geprüften Stand seines Vorgängers.
- ⚠️ **In den ausgewerteten Claude-Anbietersitzungen brachen drei
  Hintergrundbefehle (gestartet mit `run_in_background` bzw. `&`) beim
  Sitzungsende ohne Meldung ab** (Vorfall 34). Verlasse dich nur auf einen
  Weckmechanismus, der nachweislich über das Sitzungsende hinaus wirkt.
  Lange Prüfläufe, Image-Builds und Sandbox-Läufe gehen als delegierter
  Hilfsauftrag hinaus. Für einen langen Push (etwa mit Pre-Push-Hook) darf der
  Leitstand nach erteilter Projektfreigabe einen gesonderten Hilfsauftrag mit
  genauem Commit und Ziel-Ref erteilen; dieser Auftrag integriert nichts und
  erweitert keine Freigabe. CI und Merge über `watch_pull_request` beobachten.
- Der PR-Watch weckt bei „required checks pass“. Bleibt ein Pflichtstatus
  dauerhaft offen (etwa ein Review-Status, den erst der Leitstand setzt),
  kommt diese Meldung nie. Solche Status aus jeder Wartebedingung ausnehmen
  und den Weckweg dann über einen Hilfsauftrag sichern.
- Lange Züge laufen voll; eine Abschlussmeldung kann dann nicht mehr zugestellt
  werden. Zustandsdatei pflegen, früh kompaktieren oder in einem neuen Thread
  mit Zustandsdatei fortsetzen.
