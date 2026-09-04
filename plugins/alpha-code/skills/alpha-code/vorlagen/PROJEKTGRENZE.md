# Projektgrenze zu {{NACHBARPROJEKT}}

Status: {{beschlossen/vorgeschlagen}} · Stand: {{DATUM}}

*(Nur anlegen, wenn dieses Projekt einen Nachbarn hat — ein zweites
Repository, eine gemeinsame Datenbank, einen gemeinsamen Rechner.
Eine Grenze, die nur im Kopf existiert,
wird beim dritten Feature überschritten.)*

## Dieses Projekt besitzt

- {{BEREICH}}
- {{BEREICH}}

## {{NACHBARPROJEKT}} besitzt

- {{BEREICH}}
- {{BEREICH}}

## Erlaubte Verbindung

Nur über einen **versionierten, lesenden Vertrag** oder eine fertige
Anzeige-URL — nie über kopierten Quelltext oder geteilte Tokens:

```text
{{NACHBARPROJEKT}}
  └─ veröffentlicht {{VERTRAG_ODER_URL}}
       └─ dieses Projekt liest sie und rechnet nichts davon nach
```

## Verboten

- kopierte Quelltexte des Nachbarn (sie veralten still)
- direkte Schreibzugriffe auf die Daten des Nachbarn
- gemeinsame Tokens oder Zugangsdaten
- Logik des Nachbarn hier nachbauen „weil es schneller geht"

## ⚠️ Geteilte Ressourcen

*(Der teuerste Fall: eine Ressource, die beiden gehört. Beispiel vom
02.09.2026: Firestore hat je Datenbank genau **eine** Regeldatei — ein
Deploy der Regeln von Projekt A schaltete fast Projekt B ab. Wer hier
eine geteilte Ressource einträgt, baut den Wächter dazu.)*

| Ressource | geteilt mit | Regel | Wächter |
| --- | --- | --- | --- |
| {{z. B. Firestore-Regeln}} | {{NACHBARPROJEKT}} | {{nur über die Sammeldatei deployen}} | {{pruefe-….mjs}} |
