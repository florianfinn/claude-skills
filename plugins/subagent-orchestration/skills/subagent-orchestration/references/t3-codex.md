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
  bekommen einen eigenen Stand für Mutationen. Arbeiter committen nur lokal,
  der Koordinator integriert und pusht nach der Projektfreigabe. ⚠️ Gemeinsame
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

Ein Hintergrundbefehl ist noch keine Fortsetzung des Gesamtauftrags. Vor Turn-Ende
mit offener Arbeit eine app-eigene Aufgabenbenachrichtigung oder den verfügbaren
PR-Watch einrichten und ID, nächsten Schritt sowie tatsächlichen Befehlsstatus
privat festhalten. Endet nur der Push, folgt die erlaubte PR-/Review-Aktion weiter.
Beim autorisierten Beobachten den App-Watch verwenden; bei Rückgabe an den
Auftraggeber den Watch nach App-Vorgabe aufheben. Das erteilt keine neue
Freigabe für Veröffentlichung, Merge oder Deploy.

Nach Unterbrechungen zuerst Taskstatus, Bericht, Worktree/Commits und tatsächliche
Exit-Codes prüfen. Bei unterbrochenem Push auch den Remote-Ref vergleichen, bevor
er wiederholt wird. Eine verlorene Antwort bedeutet weder Erfolg noch Fehlschlag;
mit gespeicherten Task-/Request-IDs weiterarbeiten und keine Doppelaufträge starten.
