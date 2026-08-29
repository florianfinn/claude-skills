---
name: orchestrate
description: Einen Auftrag als Orchestrierung starten — Zielbild aufnehmen, schneiden, an Subagenten vergeben, prüfen, zusammenführen, abnehmen.
argument-hint: "[Zielbild, Issue-Nummer, Etappe oder Beschreibung]"
disable-model-invocation: true
---

# Orchestrierung starten

Auftrag: **$ARGUMENTS**

Rufe zuerst den Skill `subagent-orchestration` auf — bei Installation als
Plugin heißt er `subagent-orchestration:subagent-orchestration`. Er enthält
die Dienstanweisung für den gesamten Vorgang. Arbeite dann nach ihr, beginnend bei
**Phase 0 (Aufnahme)**, mit dem obigen Auftrag als Eingangsanfrage.

Ist das Argument leer, frag in einem Satz nach dem Zielbild und warte darauf.

Bevor du irgendetwas verteilst, gilt der Vorbehalt aus Phase 0 unverändert:

- Prüfe, ob Verteilen sich überhaupt lohnt. Eine Datei, ein explorativer Auftrag
  oder ein unklarer Schnitt sind Gründe, es **nicht** zu tun — sag das dann in
  einem Satz mit Grund und mach die Aufgabe direkt.
- Nimm den Kontext über einen lesenden Agenten auf, nicht selbst.
- Schreib das Zielbild in Abnahmekriterien, jedes von außen prüfbar.
- Stell die offenen Fragen **jetzt**, gebündelt, mit deiner Empfehlung an
  erster Stelle.

Es wird nichts gebaut, bevor Zielbild und Antworten stehen.
