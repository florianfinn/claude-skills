# Projektprofil

Einmal je Repo ausfüllen, dann zieht jeder Auftrag daraus. Lege die ausgefüllte
Fassung ins Projekt (`.claude/subagent-profile.md`), nicht hierher — diese Datei
ist die Vorlage. Anlegen und fortschreiben geht mit dem Befehl `orchestrate-profile`.

Der Aufwand ist einmalig und klein. Ohne Profil schreibst du unvollständige
Aufträge und merkst es erst an den Rückläufern — dann kostet es eine Welle.

## Die Vorlage

```markdown
# Subagenten-Profil: <Repo>

| Feld | Wert |
| --- | --- |
| Standardbranch | <master / main> |
| Arbeitsbranch-Schema | <z. B. claude/<thema>> |
| Konventionsdatei | <AGENTS.md / CONTRIBUTING.md / CLAUDE.md / …> |
| Prüfbefehle | <lint> / <test> / <build> — wörtlich, mit Quelle |
| Paketmanager | <pnpm 11, Node 22 — und was ausdrücklich NICHT benutzt wird> |
| Wächtertests | <Pfadmuster der Tests, die Bestand am Quelltext festhalten> |
| Deploy | <wer darf, von welchem Branch, mit welchem Befehl> |
| Abnahme | <wo und wie live geprüft wird> |
| Verfügbare Rollen | <die subagent_type-Namen, die hier wirklich installiert sind> |

## Konventionen, die wörtlich in jeden Auftrag gehören

<Zeichensatz, Sprache, Commit-Form, Body-Pflichten. Wörtlich, nicht als
Verweis. Höchstens fünf Regeln — die, die tatsächlich verletzt werden.>

## Stille Fallen

<Fehlerklassen, die in der Prüfumgebung unsichtbar bleiben, je mit der Bauart
dagegen. Wächst mit jedem Fund. Beginnt leer.>

## Wiederkehrende Flächen

<Die Schnittkanten, die in diesem Repo jedes Mal wieder auftauchen: welche
Verzeichnisse getrennte Flächen sind, welche Dateien gemeinsame Sprachdateien
sind und deshalb keinem Paket allein gehören können.>

## Was Agenten nicht tun

<z. B.: nicht deployen, nicht mergen, nicht pushen, keine Wächtermarke senken,
kein Fremdcode-Verzeichnis anfassen.>
```

## Wie du das Profil füllst

- **Konventionsdatei zuerst.** Alles, was dort unter Sprache, Commit und Stil
  steht, ist Kandidat für „wörtlich in jeden Auftrag". ⚠️ Nimm die **fünf**
  Regeln, die tatsächlich verletzt werden — nicht alle. Ein Auftrag, in dem
  jede Regel steht, macht die wichtigen unsichtbar.
- **Prüfbefehle nicht raten.** Aus `package.json`, `Makefile`, `pyproject.toml`
  oder der CI-Konfiguration lesen und die Quelle notieren. Ein erfundenes
  `npm test` kostet eine ganze Welle.
- **Wächtertests finden:** die Tests, die den Quelltext lesen statt Verhalten zu
  prüfen (`readFile` plus `assert` auf eine Zahl). Genau die tragen Marken, die
  lautlos verfallen.
  ```bash
  grep -rln "readFile\|readFileSync" <testverzeichnis>
  ```
- **Verfügbare Rollen einmal feststellen**, statt Namen zu raten:
  ```bash
  ls ~/.claude/plugins/*/*/agents/*.md 2>/dev/null | xargs -n1 basename | sed 's/\.md$//' | sort
  ```
  Ein `subagent_type`, den es nicht gibt, kostet einen Fehlversuch je Paket.
- **Stille Fallen sammeln, nicht erfinden.** Ein Eintrag entsteht, wenn ein
  Fehler durch die Prüfläufe gekommen ist. Vermutungen gehören nicht hinein —
  sie machen den Auftrag lang und die echten Warnungen unsichtbar. Die Liste
  beginnt leer und ist nach drei Vorgängen wertvoll.
- **Wiederkehrende Flächen eintragen, sobald du sie zweimal gesehen hast.** Das
  ist die Abkürzung für künftige Schnitte: Welche Datei eine gemeinsame
  Sprachdatei ist, musst du nur einmal messen.

## Ausgefülltes Beispiel

Aus einem Frontend-Umbau (React, Tailwind, Radix), gekürzt:

```markdown
| Standardbranch | master |
| Prüfbefehle | pnpm run lint / pnpm run test / pnpm run build (package.json:scripts) |
| Konventionsdatei | AGENTS.md |
| Wächtertests | web/tests/*.test.mjs (lesen Quelltext, tragen `>=`-Marken) |
| Deploy | nur der Betreiber, nur von master |
| Verfügbare Rollen | general-purpose, react-specialist, typescript-pro, test-automator, refactoring-specialist |

## Konventionen wörtlich
- Umlaute und ß werden richtig gesetzt — auch im Commit-Betreff. Kein `ae`,
  `oe`, `ue`, `ss` als Ersatz.
- Bezeichner, Dateinamen, Branch-Namen englisch; Kommentare, Doku,
  Commit-Texte, UI-Texte deutsch.
- Jede Aussage über Größe oder Bestand trägt die Zahl UND den Befehl.

## Stille Fallen
- `cn` ohne `tailwind-merge`: zwei gleichartige Utilities lösen sich nicht auf,
  es entscheidet die Reihenfolge im Bündel. In jsdom unsichtbar.
  Bauart dagegen: Datenattribut + `data-[…]:`-Präfix.
- Bestandsregel ohne `@layer` schlägt jede Utility — über die Schichtenordnung,
  nicht über Spezifität. Kein Spezifitätstrick hilft.
- Radix-Dismissal und eigener Escape-Stapel schließen beide: eine Ebene zu
  viel. Fällt nur im echten Browser auf.

## Wiederkehrende Flächen
- `web/src/styles/tokens.css` ist eine gemeinsame Sprachdatei (16 Importeure aus
  beiden Bereichen) — gehört nie einem Flächenpaket, immer der ersten Welle.
- `web/src/dialogs/**` und `web/src/settings/**` sind getrennte Flächen.

## Was Agenten nicht tun
Nicht deployen, nicht mergen, nicht pushen, keine Marke senken,
`modules/*/upstream/**` ist Fremdcode.
```
