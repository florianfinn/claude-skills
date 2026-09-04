## Was sich ändert

<!-- Je Datei ein Punkt: was neu ist, was raus ist. Beschreibung deutsch,
     Bezeichner und Dateinamen englisch und unverändert. -->

## Warum

<!-- Der Vorfall, der die Regel erzwungen hat — nicht die Absicht. Was in
     diesem Repo steht, ist einmal schiefgegangen: ein Vorschlag ohne Vorfall
     gehört in ein Issue, nicht in einen Skill. -->

- Beleg in `references/field-notes.md`: <Vorfallnummer, oder „neu als N ergänzt">
- Issue: <`Closes #N` für erledigt, `Refs #N` für teilweise — eine Zeile je Issue>

## Prüfung

<!-- Was du gefahren hast, mit dem echten Exit-Code. Fang ihn direkt:
     `<befehl> > lauf.txt 2>&1; echo "code=$?"; tail -25 lauf.txt` -->

- [ ] Beide JSON-Dateien parsen (`plugins/<name>/.claude-plugin/plugin.json`,
      `.claude-plugin/marketplace.json`)
- [ ] Alle Markdown-Dateien sind gültiges UTF-8; Umlaute stehen richtig — kein
      `ae`/`oe`/`ue` als Ersatz, keine Doppelkodierung (`RÃ¼ck`, `â€”`) — auch
      im Commit-Betreff und im PR-Titel
- [ ] `SKILL.md` bleibt unter 500 Zeilen; Umfangreiches liegt in `references/`
      und ist von dort verlinkt
- [ ] Version in `plugin.json` angehoben
- [ ] README und `marketplace.json` nachgezogen, wenn sich Beschreibung,
      Beilagen oder Auslöser geändert haben

## Was bewusst nicht drin ist

<!-- Was aus dem Issue nicht umgesetzt wurde und warum. Was du nicht prüfen
     konntest, benenne als ungeprüft — nicht als erledigt. -->
