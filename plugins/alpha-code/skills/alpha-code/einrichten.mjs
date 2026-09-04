/* [Aufgabe: Prüfwesen] Richtet ein Projekt nach der Alpha-Code-Methode ein.

       node einrichten.mjs <zielordner> [--crlf|--lf]

   Kopiert die Vorlagen und Wächter dorthin, wo sie hingehören, und
   fasst dabei **nichts Bestehendes an**: Existiert eine Zieldatei
   schon, wird sie übersprungen und gemeldet — das Zusammenführen mit
   Bestand ist Handarbeit mit Verstand, keine Kopie.

   Ohne Flagge werden die Zeilenenden am Bestand erkannt (CHANGELOG.md
   oder README.md); bei leerem Ordner gilt CRLF — der Normalfall auf
   diesem PC. */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = fileURLToPath(new URL(".", import.meta.url));
const ziel = process.argv[2];
if (!ziel) { console.error("Aufruf: node einrichten.mjs <zielordner> [--crlf|--lf]"); process.exit(1); }
if (!existsSync(ziel)) { console.error(`Zielordner fehlt: ${ziel}`); process.exit(1); }

/* Zeilenenden: Flagge > Bestand > CRLF. */
let crlf = true;
if (process.argv.includes("--lf")) crlf = false;
else if (!process.argv.includes("--crlf")) {
  for (const probe of ["CHANGELOG.md", "README.md"]) {
    const p = join(ziel, probe);
    if (existsSync(p)) { crlf = readFileSync(p, "utf8").includes("\r\n"); break; }
  }
}
const ende = crlf ? "\r\n" : "\n";

const PLAN = [
  ["vorlagen/CLAUDE.md", "CLAUDE.md"],
  ["vorlagen/CHANGELOG.md", "CHANGELOG.md"],
  ["vorlagen/WORKCLAIM.md", "WORKCLAIM.md"],
  ["vorlagen/REGELN.md", "docs/REGELN.md"],
  ["vorlagen/FEHLERBUCH.md", "docs/FEHLERBUCH.md"],
  ["vorlagen/WEGWEISER.md", "docs/WEGWEISER.md"],
  ["vorlagen/PROJEKTPROFIL.md", ".claude/PROJEKTPROFIL.md"]
];
for (const w of readdirSync(join(HIER, "werkzeuge")))
  PLAN.push(["werkzeuge/" + w, "werkzeuge/" + w]);

const datum = new Date().toISOString().slice(0, 10);
let kopiert = 0, uebersprungen = 0;
for (const [von, nach] of PLAN) {
  const zielPfad = join(ziel, nach);
  if (existsSync(zielPfad)) { console.log(`  übersprungen (existiert): ${nach}`); uebersprungen++; continue; }
  mkdirSync(join(ziel, nach.split("/").slice(0, -1).join("/") || "."), { recursive: true });
  const text = readFileSync(join(HIER, von), "utf8")
    .replace(/\{\{DATUM\}\}/g, datum)
    .replace(/\r?\n/g, ende);
  writeFileSync(zielPfad, text);
  console.log(`  angelegt: ${nach}`);
  kopiert++;
}

/* Die Einstellung der Wächter — nur, wenn sie fehlt. */
const einstellung = join(ziel, "alpha-code.json");
if (!existsSync(einstellung)) {
  writeFileSync(einstellung, JSON.stringify({
    hauptzweig: "main",
    quellordner: ["."],
    endungen: [".js", ".mjs"],
    ausnahmen: ["node_modules", ".git", "vendor", "dist", "build", "daten", "docs"]
  }, null, 2).replace(/\n/g, ende) + ende);
  console.log("  angelegt: alpha-code.json");
  kopiert++;
} else { console.log("  übersprungen (existiert): alpha-code.json"); uebersprungen++; }

console.log(`\n${kopiert} Datei(en) angelegt, ${uebersprungen} übersprungen, ` +
  `Zeilenenden ${crlf ? "CRLF" : "LF"}.`);
console.log("Nächste Schritte stehen in SKILL.md: Platzhalter füllen, " +
  "Systemtabelle, Tags, dann die Kette.");
