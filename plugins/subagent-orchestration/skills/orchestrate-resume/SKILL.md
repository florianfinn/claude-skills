---
name: orchestrate-resume
description: Eine unterbrochene Orchestrierung aus ihrem Vorgangsbuch wieder aufnehmen — Stand gegen das Repo abgleichen und weiterarbeiten.
argument-hint: "[Name des Vorgangs, leer = alle anzeigen]"
disable-model-invocation: true
---

# Orchestrierung wieder aufnehmen

Vorhandene Vorgangsbücher:

!`ls -1t .claude/orchestration/*.md 2>/dev/null || echo "(keines gefunden)"`

Gesuchter Vorgang: **$ARGUMENTS**

## Vorgehen

1. **Vorgangsbuch lesen.** Ohne Argument: das zuletzt geänderte nehmen, oder bei
   mehreren zur Auswahl stellen. Ist keines da, sag das und schlag
   den Einstiegsbefehl `orchestrate` vor.

2. **Skill `subagent-orchestration` aufrufen** (als Plugin:
   `subagent-orchestration:subagent-orchestration`). Er trägt die
   Dienstanweisung für den weiteren Verlauf.

3. **Stand gegen das Repo abgleichen** — das ist der Kern dieses Befehls:

   ```bash
   git log --oneline -5 <integrationsbranch>
   git status --short
   git rev-parse HEAD
   ```

   ⚠️ **Weicht das Vorgangsbuch vom Repo ab, gilt das Repo.** Korrigiere zuerst
   das Buch. Ein falscher Basis-SHA darin erzeugt genau den Fehler, gegen den
   das Buch geschrieben wurde: Agenten, die auf einem Stand arbeiten, auf dem
   die Vorarbeit fehlt.

4. **Verwaiste Pakete finden.** Jedes Paket, das im Buch auf `läuft` steht,
   dessen Agent es aber nicht mehr gibt, ist ein **Abriss**. Nach Playbook
   behandeln ([`references/execution.md`](../subagent-orchestration/references/execution.md)):
   erst prüfen, was auf seinem Branch schon steht, dann fortsetzen oder mit dem
   vorhandenen Stand neu ansetzen — **nicht** bei null neu starten.

5. **Den Stand berichten, bevor du weiterarbeitest.** In fünf Zeilen: welche
   Kriterien erfüllt sind, welche Pakete fertig, welches läuft, welche
   Nebenfunde offen sind, was der nächste Schritt ist.

6. **Da weitermachen, wo `Stand` steht** — nach der Schleife aus dem Skill.

## Wenn das Vorgangsbuch fehlt

Dann gibt es keinen Stand, nur ein Repo. Sag das, und biete an, aus dem
vorhandenen Branch heraus ein Vorgangsbuch nachzuziehen (Phase 0 verkürzt: Ziel
aus den Commits ableiten, Kriterien mit dem Auftraggeber klären) — oder mit dem
Einstiegsbefehl `orchestrate` neu anzusetzen.
