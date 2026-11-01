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
import { spawnSync } from "node:child_process";

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

/* Hat das Projekt ein GitHub-Repository, gehört der Fahrplan dazu —
   Vorgänge sind dann keine Kür, sondern Regel 16. Die **Vorlage** wird
   angelegt und der Schalter gesetzt; **Vorgänge selbst legt dieses
   Skript nie an**. Das wirkt nach außen, erzeugt Benachrichtigungen und
   gehört hinter ein ausdrückliches Ja (Regel 3). */
const fernstelle = spawnSync("git", ["-C", ziel, "remote", "get-url", "origin"],
  { encoding: "utf8" });
const treffer = fernstelle.status === 0
  ? (fernstelle.stdout || "").match(/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?\s*$/)
  : null;
const REPO = treffer ? `${treffer[1]}/${treffer[2]}` : null;
if (REPO) PLAN.push(["vorlagen/ROADMAP.md", "docs/ROADMAP.md"]);
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
    ausnahmen: ["node_modules", ".git", "vendor", "dist", "build", "daten", "docs"],
    zeilengrenze: 1000,
    /* Nur gesetzt, wenn ein GitHub-Repository gefunden wurde. Der Block
       schaltet `pruefe-vorgaenge.mjs` scharf: Er meldet von da an jede
       Phase ohne Vorgang. Angelegt wird nichts — das tut `vorgaenge.mjs`
       auf ausdrückliches Ja (Regel 3). */
    ...(REPO ? { vorgaenge: { art: "github", repo: REPO, sammel_label: "track", roadmap: "docs/ROADMAP.md" } } : {})
    /* Für die Sprachtrennung zusätzlich einen `sprache`-Block setzen
       und `vorlagen/WORTLISTE.md` nach `docs/` kopieren — siehe
       docs/REGELN.md, Regel 15. Ohne den Block läuft die Prüfung
       nicht, und das ist Absicht: Die Wahl trifft das Projekt. */
  }, null, 2).replace(/\n/g, ende) + ende);
  console.log("  angelegt: alpha-code.json");
  kopiert++;
} else {
  /* ⚠️ Beim Nachrüsten ist die Einstellung schon da — und genau dann
     würde ein reines Überspringen den `vorgaenge`-Block **nie**
     eintragen: Der ganze Modus B liefe für Vorgänge ins Leere. Also
     werden **fehlende Schlüssel ergänzt**, und nur die. Ein
     bestehender Wert wird nie angefasst — auch keine strengere
     Zeilengrenze, die ein Projekt bewusst gesetzt hat. */
  const alt = JSON.parse(readFileSync(einstellung, "utf8"));
  const fehlt = [];
  if (REPO && !alt.vorgaenge) {
    alt.vorgaenge = { art: "github", repo: REPO, sammel_label: "track", roadmap: "docs/ROADMAP.md" };
    fehlt.push("vorgaenge");
  }
  if (alt.zeilengrenze === undefined) { alt.zeilengrenze = 1000; fehlt.push("zeilengrenze"); }
  if (fehlt.length) {
    writeFileSync(einstellung, JSON.stringify(alt, null, 2).replace(/\n/g, ende) + ende);
    console.log("  ergänzt in alpha-code.json: " + fehlt.join(", "));
  } else {
    console.log("  übersprungen (existiert): alpha-code.json");
  }
  uebersprungen++;
}

console.log(`\n${kopiert} Datei(en) angelegt, ${uebersprungen} übersprungen, ` +
  `Zeilenenden ${crlf ? "CRLF" : "LF"}.`);
console.log("Nächste Schritte stehen in SKILL.md: Platzhalter füllen, " +
  "Systemtabelle, Tags, dann die Kette.");
if (REPO) {
  console.log("\nVorgänge: Repository " + REPO + " erkannt — docs/ROADMAP.md und der");
  console.log("  `vorgaenge`-Block sind angelegt. Fahrplan füllen, dann:");
  console.log("    node werkzeuge/vorgaenge.mjs roadmap              zeigt, was fehlt");
  console.log("    node werkzeuge/vorgaenge.mjs roadmap --wirklich   legt an (braucht ein Ja)");
} else {
  console.log("\nKein GitHub-Repository gefunden — ohne Vorgangs-Tracker gilt Regel 13");
  console.log("  mit einer benannten Standdatei, nie verstreut.");
}
console.log("\nBei Bedarf zusätzlich: vorlagen/ALTLASTEN.md (Nachrüsten), " +
  "vorlagen/PROJEKTGRENZE.md\n  (Nachbarprojekt), vorlagen/WORTLISTE.md " +
  "(Sprachtrennung — dann auch `sprache` setzen).");
