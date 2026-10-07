# T3 Code / Codex

Diese Betriebsweise ergänzt die Claude-Code-Schritte oben. Werkzeuge und
Modell-IDs kommen aus dem aktuellen `orchestrator_capabilities`-Katalog;
Projektregeln und die Modellvorgabe des Auftraggebers bleiben verbindlich.

- **Anbieterübergreifend per `delegate_task` delegieren:** Codex für Umsetzung,
  Opus für komplexe Reviews, Sonnet für kleine, klar begrenzte Prüfungen. Jeden
  Review in einem eigenen delegierten Thread starten. ⚠️ **Das schützt den
  Koordinator-Thread vor dem Limitfehler, nicht das gemeinsame Claude-Budget**
  (Vorfall 29). Dafür keine zusätzlichen normalen Top-Level-Chats erzeugen.
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
- ⚠️ **Vor Claude-intensiven Schritten die Nutzung abfragen und Reserve für
  laufende Reviewer sowie Koordination einplanen** (Vorfall 29). Als
  Startschwellen: Pause ab `five_hour ≥ 80 %` oder `seven_day ≥ 90 %`;
  mit Reserve gegebenenfalls früher pausieren. Codex kann auf unabhängigen
  Flächen weiterarbeiten. Ohne belastbare Nutzungsabfrage keine neuen
  Claude-Aufträge starten; laufende Aufgaben nicht allein deshalb abbrechen.
- Das lokale Nutzungsskript liest den OAuth-Token aus der lokalen
  Credentials-Datei und fragt `api.anthropic.com/api/oauth/usage` ab. Es gibt
  **nur Prozentwerte** für `five_hour` und `seven_day` aus: keine Credentials,
  Header oder vollständigen Antworten, auch nicht in Fehlermeldungen.
  Resetzeiten werden intern für den Zeitplan verarbeitet. Das Skript bleibt
  privat; diese Beschreibung braucht weder einen echten Pfad noch Tokenwerte.
- ⚠️ **Token niemals als Kommandozeilenargument übergeben** (Vorfall 31).
  Nur innerhalb des abfragenden Prozesses verwenden oder über stdin bzw.
  einen Konfigurationskanal übergeben, etwa mit `curl -K -`. Ein Header wie
  `curl -H "Authorization: Bearer …"` legt den Token in Prozessargumenten
  offen; unterdrückte Ausgabe schützt davor nicht.
- ⚠️ **Den Wiederanlauf per T3-Heartbeat zur Resetzeit plus kleinem Puffer
  planen**, statt während der Pause routinemäßige Opus-Statusrunden zu starten
  (Vorfall 29). Alle noch sperrenden Fenster beachten, dann Nutzung erneut
  abfragen. Der Heartbeat-Zeitplan enthält nächsten Schritt und Resetzeit;
  nach Wiederanlauf wird er aufgehoben oder angepasst, damit nichts doppelt
  startet. Lange Pausen brauchen keine stündliche Modellantwort.
- Eine **private Zustandsdatei je Meilenstein** trägt freigegebene Grundlagen,
  Basis-/Head-SHAs, Owner, Merge-Reihenfolge, Task-IDs, vollständige Berichte,
  offene Befunde, nächsten zulässigen Schritt und Resetzeit. Status knapp
  abfragen, vollständige Ergebnisse einmal übernehmen. Betriebspfade und
  Credentials gehören weder ins Repo noch in öffentliche Review-Belege.
