---
name: orchestrate-profile
description: Das Subagenten-Profil dieses Repos anlegen oder fortschreiben — Standardbranch, Prüfbefehle, Konventionen, Wächtertests, stille Fallen.
argument-hint: "[optional: eine neu entdeckte stille Falle]"
disable-model-invocation: true
---

# Projektprofil anlegen oder fortschreiben

Zielort: `.claude/subagent-profile.md`

Aktueller Stand:

!`test -f .claude/subagent-profile.md && echo "vorhanden — wird fortgeschrieben" || echo "nicht vorhanden — wird angelegt"`

Argument (falls gesetzt, ist es eine neue stille Falle): **$ARGUMENTS**

## Vorgehen

Lies die Vorlage und die Ausfüllhinweise in
[`references/project-profile.md`](../subagent-orchestration/references/project-profile.md)
des Skills `subagent-orchestration`.

### Neues Profil

Trag nur ein, was du **belegen** kannst. Erhebe die Felder in dieser
Reihenfolge:

1. **Standardbranch und Arbeitsbranch-Schema** — `git symbolic-ref refs/remotes/origin/HEAD`,
   `git branch -a`.
2. **Prüfbefehle**, wie sie wirklich heißen — aus `package.json`, `Makefile`,
   `pyproject.toml`, der CI-Konfiguration. ⚠️ Nicht raten: ein erfundenes
   `npm test` kostet später eine ganze Welle.
3. **Konventionsdatei** (`AGENTS.md`, `CONTRIBUTING.md`, `CLAUDE.md`) — und
   daraus die Regeln zu Sprache, Zeichensatz und Commit-Form, die **wörtlich**
   in jeden Auftrag gehören.
4. **Wächtertests** — Tests, die den Quelltext lesen statt Verhalten zu prüfen,
   mit ihren Schwellen:
   `grep -rln "readFile\|readFileSync" <testverzeichnis>`
5. **Deploy und Abnahme** — wer darf, von welchem Branch, wie live geprüft wird.
   Weißt du es nicht, frag; rate nicht.

⚠️ **Die stillen Fallen bleiben zunächst leer.** Sie werden gesammelt, nicht
erfunden: Ein Eintrag entsteht, wenn ein Fehler einmal durch die Prüfläufe
gekommen ist. Vermutungen machen den Auftrag lang und die echten Warnungen
unsichtbar.

Nutze für die Erhebung `orchestration-scout` statt selbst zu lesen — die Karte
ist genau seine Arbeit.

### Vorhandenes Profil fortschreiben

Ist ein Argument gesetzt, ist es eine neu beobachtete stille Falle. Trag sie
unter **Stille Fallen** ein, mit drei Angaben:

- **Wie sie aussieht** — die Fehlerklasse, nicht der einzelne Fall.
- **Warum sie still ist** — was sie in der Prüfumgebung unsichtbar macht.
- **Die Bauart dagegen** — was man stattdessen tut.

Ohne diese drei ist der Eintrag eine Erinnerung, keine Regel.

Ohne Argument: Profil gegen den heutigen Stand des Repos prüfen. Haben sich
Prüfbefehle, Branch-Schema oder Wächtermarken geändert, korrigiere sie und nenn
beide Werte.

Zum Schluss: den Pfad nennen und in fünf Zeilen sagen, was drinsteht und was
noch leer ist.
