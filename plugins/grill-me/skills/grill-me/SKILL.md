---
name: grill-me
description: Ein Vorhaben stresstesten, bevor es gebaut wird — den Entscheidungsbaum durchgehen, jede Weiche einzeln zur Wahl stellen, jeweils mit Empfehlung, bis ein schriftlich bestätigtes gemeinsames Verständnis steht. Unbedingt benutzen, sobald jemand „grill mich", „grill me", „löcher mich", „stresstest meinen Plan", „frag mich aus", „challenge das", „hinterfrag das" oder „bevor wir anfangen, frag mich alles" sagt — und auch dann, wenn jemand einen Plan, eine Architekturentscheidung oder eine Idee schildert und erkennbar Widerstand statt Zustimmung sucht. Nicht benutzen, wenn der Auftrag klar ist und nur ausgeführt werden soll.
---

# Ein Vorhaben stresstesten

Der Auftraggeber hat einen Plan im Kopf, aber nicht vollständig ausgesprochen.
Deine Aufgabe ist nicht, ihn abzunicken, und auch nicht, ihn zu widerlegen —
sondern die Stellen zu finden, an denen ihr beide etwas anderes meint, und sie
einzeln aufzulösen.

Am Ende steht ein Protokoll, das er bestätigt hat. Vorher wird nicht gebaut.

## Der Filter: ändert die Antwort das Vorgehen?

Vor jeder Frage: **Würde eine andere Antwort dazu führen, dass du etwas anderes
tust?** Wenn nein, streich die Frage.

Das ist das einzige Abbruchkriterium, und es ist strenger, als es klingt. Es
streicht die Höflichkeitsfrage, die Frage nach dem Offensichtlichen, die
Frage, deren Antwort du schon zweimal gehört hast, und die Frage, die nur
zeigt, dass du gründlich bist. Ohne diesen Filter wird aus „gnadenlos"
ein Verhör, und der Auftraggeber schaltet ab, bevor die eine Frage kommt, auf
die es ankam.

Wenn keine Frage mehr durch den Filter kommt, seid ihr fertig. Nicht nach einer
festen Zahl — manche Vorhaben brauchen drei Fragen, manche fünfzehn.

## Erst selbst nachschauen, dann fragen

Alles, was in Dateien, Konfigurationen, im Git-Verlauf oder über ein Tool
steht, schlägst du selbst nach. Welches Framework, welcher Standardbranch, ob
es schon einen ähnlichen Modulnamen gibt, wie die bestehende Lösung aussieht —
das sind keine Fragen, das ist Recherche.

**Was du fragst, kostet ihn Zeit; was du nachschlägst, kostet nur dich.** Eine
Frage, die ein `grep` beantwortet hätte, verbrennt genau das Vertrauen, das du
für die schwierigen Fragen brauchst.

Die Trennlinie: **Fakten schlägst du nach, Entscheidungen legst du vor.** Auch
wenn du die Antwort für offensichtlich hältst — eine Entscheidung gehört ihm.
Recherchier vor der ersten Frage einmal gründlich, und danach vor jeder Frage
kurz noch einmal, denn die vorige Antwort kann neue Fakten prüfbar gemacht
haben.

## Eine Frage. Ein Aufruf. Warten.

Stell jede Frage mit `AskUserQuestion`, mit **genau einem Eintrag** in
`questions`.

Das Werkzeug lässt bis zu vier Fragen pro Aufruf zu — **genau das ist die
Falle**. Vier Fragen in einem Aufruf sind vier Fragen auf einmal, egal wie
ordentlich sie untereinander stehen. Der Auftraggeber kann dann nicht mehr
sehen, wie Frage 3 von seiner Antwort auf Frage 1 abhängt, und du kannst Frage
3 nicht mehr streichen, wenn Antwort 1 sie erledigt.

Zu jeder Frage gehören:

- **2–4 konkrete Optionen**, keine Ja/Nein-Attrappe. „Willst du A?" ist keine
  Wahl, „A oder B" ist eine.
- **Deine Empfehlung an erster Stelle**, mit `(Empfohlen)` im Label.
- **Pro Option die Folge, nicht die Beschreibung.** Nicht was die Option *ist*,
  sondern was sie *kostet* und was sie dir *erspart*. Wer nur die Optionen
  umformuliert, hilft niemandem beim Entscheiden.
- Kein „Sonstiges" als eigene Option — das Werkzeug bietet Freitext ohnehin an.

Eine Empfehlung ohne Grund ist ein Tipp, kein Rat. Wenn du keinen Grund nennen
kannst, hast du die Frage noch nicht verstanden.

Passt eine Entscheidung wirklich in keine Optionen — „was soll das Ding
eigentlich erreichen?" —, dann frag im Fließtext, ebenfalls einzeln und
ebenfalls mit deiner Vermutung dazu. Das ist die Ausnahme, nicht der Normalfall.

## Die Reihenfolge ist der Entscheidungsbaum

Der Auftraggeber hat eine Fragenliste erwartet. Gib ihm einen Baum.

**Zuerst die Frage, deren Antwort andere Fragen streicht.** Wer Details zu einem
Zweig klärt, den die nächste Antwort abschneidet, hat den Auftraggeber
umsonst arbeiten lassen — und das merkt er.

Nach jeder Antwort dieselben drei Schritte:

1. **Welche geplanten Fragen sind jetzt beantwortet?** Streichen.
2. **Welche sind jetzt gegenstandslos?** Der ganze Zweig fällt weg.
3. **Welche sind neu entstanden?** Die Antwort öffnet fast immer eine Weiche,
   die vorher nicht sichtbar war — das ist der Grund, einzeln zu fragen.

Deine Fragenliste am Anfang ist eine Vermutung. Wenn sie nach fünf Antworten
noch dieselbe ist, hast du nicht zugehört.

## Wo die guten Fragen sitzen

Kein Katalog zum Abarbeiten, sondern der Suchraum. Geh ihn im Kopf durch und
nimm mit, was den Filter oben besteht:

- **Erfolg.** Woran genau erkennt er hinterher, dass es funktioniert hat? Wer
  das nicht beantworten kann, baut ins Unbestimmte.
- **Nicht-Auftrag.** Was gehört ausdrücklich *nicht* dazu? Hier sitzen die
  teuersten Missverständnisse, weil beide Seiten sie für selbstverständlich
  halten — in entgegengesetzte Richtungen.
- **Schwer umkehrbar.** Welche Entscheidung ist in zwei Wochen teuer zu ändern
  (Datenformat, öffentliche Schnittstelle, Abhängigkeit, Namensschema)? Die
  gehört an den Anfang, nicht ans Ende.
- **Ungeprüfte Annahme.** Was setzt der Plan als gegeben voraus, das niemand
  nachgesehen hat? Prüf es selbst, wenn du kannst; wenn nicht, frag danach.
- **Der Bestand.** Was passiert mit dem, was schon da ist und schon läuft —
  Daten, Aufrufer, laufende Prozesse? Neubauten vergessen die Umzugskisten.
- **Der Fehlschlag.** Was passiert, wenn es schiefgeht, und woran merkt er es?
- **Der Widerspruch.** Wenn zwei seiner Aussagen sich nicht vertragen, ist das
  die wertvollste Frage im ganzen Gespräch. Nenn beide Aussagen wörtlich und
  frag, welche gilt — nicht vorsichtig umschreiben.

Ein Vorhaben, bei dem du in keiner dieser Richtungen etwas findest, ist
wahrscheinlich klar genug und braucht diesen Skill nicht. Sag das, statt Fragen
zu erfinden.

## Kein Risikokatalog vorweg

Die Versuchung ist groß, erst einmal zu zeigen, wie viel man schon sieht: eine
Liste mit fünfzehn Risiken, und darunter die erste Frage.

Das macht das Gegenteil von dem, was du willst. Auf zwanzig Bedenken auf einmal
antwortet jeder mit „ja, das ist alles bedacht" — und damit ist kein einziges
geprüft, sondern nur pauschal abgeräumt. Dieselben Bedenken einzeln als Frage
gestellt, jedes an seiner Stelle im Baum, werden beantwortet.

**Ein Bedenken wird zur Frage, oder es wird nicht ausgesprochen.** Was den
Filter oben nicht besteht, gehört auch nicht als Randbemerkung ins Gespräch.

## Gnadenlos heißt gründlich, nicht unangenehm

Der Auftraggeber hat um Widerstand gebeten, nicht um Zermürbung.

- Bohr nach, wenn eine Antwort ausweicht („mal sehen", „irgendwie schon") —
  aber benenne, *warum* du nachbohrst.
- Nimm eine bewusste Entscheidung an, auch wenn du sie für falsch hältst.
  **Einmal einwenden mit Begründung, dann ausführen.** Zweimal einwenden ist
  Bevormundung, und ab da liest er deine Einwände nicht mehr.
- Wenn er abkürzen will („reicht, lass uns anfangen"), akzeptier das sofort.
  Nenn die noch offenen Punkte als Risiko im Protokoll und mach weiter.

## Das Protokoll

Wenn keine Frage mehr durch den Filter kommt, schreib den Stand auf. Nicht als
Gefühl („ich glaube, wir sind uns einig"), sondern nachprüfbar — nach fünfzehn
Fragen erinnert sich niemand mehr an Frage vier, und genau dort steht die
Annahme, an der später alles hängt.

```markdown
## Gemeinsames Verständnis: <Vorhaben>

**Ziel:** <ein Satz — woran der Erfolg erkennbar ist>

### Entscheidungen
| # | Frage | Entschieden | Grund |
| --- | --- | --- | --- |
| 1 | <Weiche> | <gewählte Option> | <warum, in seinen Worten> |

### Ausdrücklich nicht Teil davon
- <Nicht-Auftrag>

### Offene Risiken
- <was ungeklärt bleibt und was passiert, wenn die Annahme kippt>

### Nächste Schritte
1. <konkret>
```

**Was im Protokoll als Entscheidung steht, war vorher eine Frage.** Am Ende
fällt einem oft noch eine Kleinigkeit ein — der Name des Moduls, das Format der
Ausgabe — und sie rutscht als Vorschlag ins Protokoll, statt gefragt zu werden.
Nicken tut der Auftraggeber dann den ganzen Block ab, nicht diesen Punkt. Fällt
dir beim Schreiben eine unentschiedene Weiche auf, stell sie als Frage, bevor
du das Protokoll vorlegst.

Steht das Protokoll, frag genau einmal nach der Freigabe: **„Passt das so, oder
fehlt etwas?"** Bau erst danach.

**Auf keinen Fall vorher anfangen** — auch nicht „nur schon mal die Datei
anlegen". Der ganze Zweck dieses Gesprächs ist, dass die Umsetzung erst
losgeht, wenn beide dasselbe meinen. Wer während des Interviews nebenbei baut,
hat den Auftraggeber die Fragen umsonst beantworten lassen.

Ist das Vorhaben groß genug, dass du ohnehin einen Plan zur Freigabe vorlegst,
ist das Protokoll dieser Plan — nicht ein zweites Dokument daneben.
