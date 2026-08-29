# subagent-orchestration

Du gibst ein Zielbild, ein Issue oder eine Etappe. Der Skill macht daraus einen
geführten Vorgang und liefert am Ende **ein fertiges, belegtes Ergebnis** für die
Eingangsanfrage — statt einer Sammlung von Teilergebnissen, die du selbst
zusammensetzt.

```bash
/plugin marketplace add florianfinn/claude-skills
/plugin install subagent-orchestration@flofi-skills
```

Danach greift der Skill von selbst, sobald Arbeit auf mehrere Agenten verteilt
werden soll. Oder du startest ausdrücklich mit
`/subagent-orchestration:orchestrate <Zielbild>`.

---

## Die Schleife

```
0 Aufnahme → 1 Schnitt → 2 Besetzung → 3 Auftrag → 4 Lauf
                                                     ↓
8 Bericht ← 7 Abnahme ← 6 Zusammenführung ← 5 Prüfung (frische Agenten)
```

**Phase 0** klärt, bevor gebaut wird: Kontext aufnehmen (über einen lesenden
Agenten, nicht selbst), das Zielbild in von außen prüfbare Kriterien übersetzen,
offene Fragen einmal gebündelt stellen.

**Phase 5** prüft mit Agenten, die nicht gebaut haben und nicht schreiben dürfen
— wer gebaut hat, findet die Fehler nicht, die aus seiner eigenen Annahme
folgen.

**Verfehlt das Ergebnis das Ziel**, geht es nach Fehlerklasse zurück: Baufehler
→ Phase 4, Schnittfehler → Phase 1, Zielbildfehler → Phase 0 und damit zu dir.
Höchstens zwei Schleifen je Paket, danach entscheidest du.

Der Zustand des Vorgangs liegt in einem **Vorgangsbuch**
(`.claude/orchestration/<vorgang>.md`), nicht im Gesprächsverlauf — der wird bei
langen Vorgängen verdichtet, und dann sind Basis-SHA, Modellwahl und
Schleifenzähler weg.

## Befehle

| Befehl | Wofür |
| --- | --- |
| `/subagent-orchestration:orchestrate <Zielbild\|Issue\|Etappe>` | Einen Vorgang starten. |
| `/subagent-orchestration:orchestrate-resume [Vorgang]` | Einen unterbrochenen Vorgang aus seinem Vorgangsbuch aufnehmen — auch in einer neuen Sitzung. |
| `/subagent-orchestration:orchestrate-profile [stille Falle]` | Das Profil dieses Repos anlegen oder fortschreiben. |

Tipp `/orch`, die Vervollständigung findet sie. Alle drei stehen auf
`disable-model-invocation: true` und belasten den Kontext nicht.

## Mitgelieferte Agenten

| Agent | Arbeitsart | Modell / Aufwand |
| --- | --- | --- |
| `orchestration-scout` | Karte aufnehmen, messen, zählen — Befunde ohne Urteil | haiku / low, lesend |
| `orchestration-mechanic` | Fläche umstellen, löschen mit Nachweis, nachziehen | sonnet / medium |
| `orchestration-builder` | Stille Fehlerklassen: Nebenläufigkeit, Zustand, Sicherheit, Migration | opus / high |
| `orchestration-verifier` | Gegen ein Kriterium prüfen, **ohne Schreibrechte** | opus / high, lesend |

Alle vier tragen die Disziplin im Systemprompt statt im Auftrag — Basis-SHA
herstellen, im Dateirahmen bleiben, nicht mergen oder pushen, keine Wächtermarke
senken, echten Exit-Code fangen, gedeckelt in Zahlen melden. Das halbiert jeden
Auftrag an sie.

## Mit `awesome-claude-code-subagents`

Der [VoltAgent-Bestand](https://github.com/VoltAgent/awesome-claude-code-subagents)
dient als **Rollenkatalog** für die Bauarbeit; die Zuordnung nach Arbeitsklasse
steht in [`references/casting.md`](skills/subagent-orchestration/references/casting.md).
Drei am Bestand nachgezählte Einschränkungen:

- **Keine** der 158 Rollen führt das `Agent`-Werkzeug — keine kann Subagenten
  starten. Auch die „Orchestrierer" nicht; die schreiben Markdown-Pläne.
- `code-reviewer` und `architect-reviewer` haben `Write` und `Edit` und taugen
  deshalb nicht als Prüfer.
- 106 Rollen stehen auf `sonnet`. Die Modellstufe der Rolle ist eine
  Voreinstellung, keine Entscheidung.

## Gemessen

Ein Testlauf gegen ein gebautes Repo mit den Fallen aus den Feldnotizen: drei
Aufgaben, jede einmal mit und einmal ohne Skill.

| | mit Skill | ohne Skill |
| --- | --- | --- |
| erfüllte Prüfkriterien | **17/17** | 9/17 |

Unterscheidend, jeweils 3/3 gegen 0/3: der Schnitt steht schriftlich, und der
echte Exit-Code wird gefangen statt der von `tail`.

**Was der Test nicht zeigen konnte, steht genauso dabei** — die Phasen 4 bis 7
sind ungetestet, beim Einzeldatei-Fall sagten beide Seiten korrekt ab, und es
gibt nur einen Lauf je Zelle. Aufbau, Zahlen und Fehlschlüsse in
[`references/field-notes.md`](skills/subagent-orchestration/references/field-notes.md),
Teil C.

## Wo was steht

Die [`SKILL.md`](skills/subagent-orchestration/SKILL.md) ist die
Dienstanweisung und wird bei jedem Auslösen vollständig geladen. Alles
Ausführliche liegt in `references/` und kostet nichts, bis es gelesen wird:

| Datei | Wofür |
| --- | --- |
| [`mechanics.md`](skills/subagent-orchestration/references/mechanics.md) | Wie Subagenten in Claude Code wirklich laufen — mit Quelle und Datum |
| [`intake.md`](skills/subagent-orchestration/references/intake.md) | Phase 0: Kontext, Zielbild in Kriterien, Fragenkatalog |
| [`cut.md`](skills/subagent-orchestration/references/cut.md) | Phase 1: Flächen, gemessene Abhängigkeiten, Wellen |
| [`casting.md`](skills/subagent-orchestration/references/casting.md) | Phase 2: Rolle, Modell, Aufwand, eigene Rollen schreiben |
| [`agent-brief.md`](skills/subagent-orchestration/references/agent-brief.md) | Phase 3: die Auftragsvorlage |
| [`execution.md`](skills/subagent-orchestration/references/execution.md) | Phase 4: führen, überwachen, Fehler-Playbook |
| [`verification.md`](skills/subagent-orchestration/references/verification.md) | Phasen 5–7: frisch prüfen, zusammenführen, abnehmen |
| [`ledger.md`](skills/subagent-orchestration/references/ledger.md) | Das Vorgangsbuch |
| [`project-profile.md`](skills/subagent-orchestration/references/project-profile.md) | Das Profil je Repo |
| [`field-notes.md`](skills/subagent-orchestration/references/field-notes.md) | Herkunft jeder Regel: Vorfall, Mechanik oder Messung |

## Der Kern in fünf Sätzen

1. **Eine Datei gehört genau einem Paket.** Zwei Agenten in derselben Datei
   erzeugen Konflikte, die du hinterher von Hand auflöst.
2. **Das Modell folgt der Fehlerklasse, nicht der Textmenge.** Stark, wo ein
   Fehler grün durchkommt; mittel, wo ein Test ihn fängt; schwach, wo am Ende
   eine Zahl steht.
3. **Wer gebaut hat, prüft nicht** — und ein Prüfer bekommt keine Schreibrechte.
4. **Der Rückmeldevertrag ist die Kontextbremse.** Ohne Deckel in Zeilen kostet
   Verteilen mehr, als es spart.
5. **Was du selbst baust, prüft niemand.** Behalte nur, was kein Agent übernehmen
   kann: Schnitt, Konfliktauflösung, Abnahme, und die Fragen an den Auftraggeber.

## Wann du **nicht** verteilst

Eine Datei, eine explorative Suche, oder ein Schnitt, der noch nicht feststeht.
Der Skill sagt in dem Fall ab und macht die Aufgabe direkt — **ein unklarer
Schnitt ist kein Grund zu verteilen, sondern der Grund, es nicht zu tun.**

---

Teil von [flofi-skills](https://github.com/florianfinn/claude-skills). MIT.
