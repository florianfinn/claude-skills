# Altlasten — bekannte Großdateien

*(Nur beim Nachrüsten anlegen, wenn Dateien über 500 Zeilen bestehen.
Beim Nachrüsten gilt die Grenze als **Ratchet**, nicht
als Vorwand für einen riskanten Komplettumbau.)*

Die hier geführten Dateien sind dokumentierte Altlasten. Für sie gilt:

1. **Sie wachsen nie wieder.** `werkzeuge/pruefe-altlasten.mjs` hält
   die gemessene Zeilenzahl als Obergrenze fest.
2. **Beim nächsten fachlichen Eingriff** wird geprüft, ob der berührte
   Teil zuerst in ein kleines Modul verschoben werden kann — der
   Eingriff bezahlt die Ablösung, Stück für Stück.
3. Fällt eine Datei unter 500 Zeilen, wird ihre Zeile hier gestrichen.

| Datei | Zeilen (gemessen am {{DATUM}}) | Zielbereich beim Herauslösen |
| --- | ---: | --- |
| `{{PFAD}}` | {{ZEILEN}} | {{WOHIN_DER_INHALT_GEHOERT}} |

Die Zeilenzahlen sind gemessen (`wc -l`), nicht geschätzt — wer eine
Zeile ergänzt, misst erst.
