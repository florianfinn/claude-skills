# Projektprofil

Einmal je Repo ausfüllen, dann zieht jeder Auftrag daraus. Lege die ausgefüllte
Fassung ins Projekt (z. B. `.claude/subagent-profile.md`), nicht hierher — diese
Datei ist die Vorlage.

Der Aufwand ist einmalig und klein. Ohne Profil schreibst du unvollständige
Aufträge und merkst es erst an den Rückläufern.

## Die Vorlage

```markdown
# Subagenten-Profil: <Repo>

| Feld | Wert |
| --- | --- |
| Standardbranch | <master / main> |
| Arbeitsbranch-Schema | <z. B. claude/<thema>> |
| Konventionsdatei | <AGENTS.md / CONTRIBUTING.md / …> |
| Prüfbefehle | <lint> / <test> / <build> |
| Paketmanager | <pnpm 11, Node 22 — und was ausdrücklich NICHT benutzt wird> |
| Wächtertests | <Pfadmuster der Tests, die Bestand am Quelltext festhalten> |
| Deploy | <wer darf, von welchem Branch, mit welchem Befehl> |
| Abnahme | <wo und wie live geprüft wird> |

## Konventionen, die wörtlich in jeden Auftrag gehören

<Zeichensatz, Sprache, Commit-Form, Body-Pflichten. Wörtlich, nicht als Verweis.>

## Stille Fallen

<Fehlerklassen, die in der Testumgebung unsichtbar bleiben, je mit der Bauart
dagegen. Wächst mit jedem Fund.>

## Was Agenten nicht tun

<z. B.: nicht deployen, nicht mergen, keine Wächtermarke senken, kein
Fremdcode-Verzeichnis anfassen.>
```

## Wie du das Profil füllst

- **Konventionsdatei zuerst.** Alles, was dort unter Sprache, Commit und Stil
  steht, ist Kandidat für „wörtlich in jeden Auftrag".
- **Wächtertests finden:** die Tests, die den Quelltext lesen statt Verhalten zu
  prüfen (`readFile` plus `assert` auf eine Zahl). Genau die tragen Marken, die
  lautlos verfallen.
- **Stille Fallen sammeln, nicht erfinden.** Ein Eintrag entsteht, wenn ein
  Fehler durch die Prüfläufe gekommen ist. Vermutungen gehören nicht hinein —
  sie machen den Auftrag lang und die echten Warnungen unsichtbar.

## Ausgefülltes Beispiel

Aus einem Frontend-Umbau (React, Tailwind, Radix), gekürzt:

```markdown
| Standardbranch | master |
| Prüfbefehle | pnpm run lint / pnpm run test / pnpm run build |
| Konventionsdatei | AGENTS.md |
| Wächtertests | web/tests/*.test.mjs (lesen Quelltext, tragen `>=`-Marken) |
| Deploy | nur der Betreiber, nur von master |

## Konventionen wörtlich
- Umlaute und ß werden richtig gesetzt — auch im Commit-Betreff. Kein `ae`,
  `oe`, `ue`, `ss` als Ersatz.
- Bezeichner, Dateinamen, Branch-Namen englisch; Kommentare, Doku,
  Commit-Texte, UI-Texte deutsch.

## Stille Fallen
- `cn` ohne `tailwind-merge`: zwei gleichartige Utilities lösen sich nicht auf.
  In jsdom unsichtbar. Bauart dagegen: Datenattribut + `data-[…]:`-Präfix.
- Bestandsregel ohne `@layer` schlägt jede Utility — über die Schichtenordnung,
  nicht über Spezifität. Kein Spezifitätstrick hilft.
- Radix-Dismissal und eigener Escape-Stapel schließen beide: eine Ebene zu
  viel. Fällt nur im echten Browser auf.

## Was Agenten nicht tun
Nicht deployen, nicht mergen, keine Marke senken, `modules/*/upstream/**` ist
Fremdcode.
```
