/* [Aufgabe: Prüfwesen] Zählt die neun Formen, die `/klartext` beurteilt —
   und entscheidet keine einzige davon.

   Der Unterschied zwischen einem Beleg und einer Spekulation steht nicht im
   Satz. „Der Lauf endete nach 71 Sekunden mit `RangeError`" und „der Lauf
   endete sonst mit einem Fehler" tragen dieselbe Verbform; das eine ist
   passiert, das andere nicht. Ein Zähler kann das nicht wissen, und ein
   Zähler, der es trotzdem behauptet, richtet mehr Schaden an als er
   verhindert: er löscht genau die Sätze, an denen ein Prüfer den Umfang
   einer Arbeit misst.

   Deshalb liefert diese Datei **Fundstellen, keine Urteile**. Sie sagt, wo
   etwas steht und in welcher Form; ob es bleibt, entscheidet das Modell mit
   dem Kontext, den es hat, und am Ende der Mensch.

   Jede Prüfung meldet ihre Zahl, auch die Null. Eine Prüfung, die nur
   Treffer meldet, sieht mit gelöschtem Muster genauso aus wie mit sauberem
   Text.

   ── Aufruf ──────────────────────────────────────────────────────────

       node pruefe-text.mjs <datei> [<datei> …]
       git log --format=%b -20 | node pruefe-text.mjs -
       gh pr view 42 --json body -q .body | node pruefe-text.mjs -

   Rückgabe: immer 0. Diese Datei blockiert nichts — sie legt vor.
   Mit `--json` kommt die Auswertung als JSON statt als Text.

   ── Arbeitet zusammen mit ───────────────────────────────────────────

   `SKILL.md` (der Ablauf) und `referenzen/regeln.md` (was ein Fund
   bedeutet und wann er bleiben darf). */

import { readFileSync } from "node:fs";

const KONJUNKTIV =
  /\b(wäre|wären|hätte|hätten|bliebe|bliebe?n|fiele|fielen|käme|kämen|verlöre|hielte|müsste|müssten|ginge|liefe|stünde|schriebe|bekäme|enthielte|entstünde|könnte|könnten|würde|würden|dürfte|sollte)\b/gi;

/* Schlussformeln und Füllvokabeln. Deutsch und englisch, weil beide
   Register in denselben Texten auftauchen. */
const FUELLWOERTER = [
  /\bFazit\s*:/gi,
  /\bKurz gesagt\b/gi,
  /\bZusammenfassend\b/gi,
  /\bUnter dem Strich\b/gi,
  /\bes ist erwähnenswert\b/gi,
  /\bwichtig(er)? ist\s*:/gi,
  /\bletztlich\b/gi,
  /\bim Wesentlichen\b/gi,
  /\bvertiefen\b/gi,
  /\bfördern\b/gi,
  /\b(hebeln|nutzbar machen)\b/gi,
  /\bwirklich (echt|ehrlich|aufrichtig)\b/gi,
  /\bin der Tat\b/gi,
  /\bdelve\b/gi,
  /\bleverage\b/gi,
  /\bfoster\b/gi,
  /\bit'?s worth noting\b/gi,
  /\bin conclusion\b/gi,
  /\bnot just .{1,40}? but\b/gi,
];

/* Deutsche Wörter in ASCII-Umschreibung. Bewusst kurz gehalten: die lange
   Liste gehört ins Projekt, nicht ins Werkzeug. */
const UMSCHRIFT =
  /\b(fuer|ueber|koennen|koennte|muessen|muesste|waere|haette|gekuerzt|aendern|aenderung|loeschen|pruefen|pruefung|zurueck|natuerlich|urspruenglich|hinzufuegen|ausserhalb|groesse|schluessel|naechste|spaeter|erklaerung)\b/gi;

/* Mojibake: UTF-8, das unterwegs als Windows-1252 gelesen wurde. */
const MOJIBAKE = /[ÃÂ][-¿ -⁯ -ÿ]/g;

/* Eine Zeile trägt einen Messweg, wenn ein Befehl, ein Exit-Code, ein
   Commit oder eine Testbilanz danebensteht. Absichtlich großzügig: ein
   falscher Freispruch kostet nichts, ein falscher Treffer kostet
   Vertrauen. */
const MESSWEG =
  /(`[^`]*`|code=\d|exit\s*\d|\d+\s*\/\s*\d+|\bpass\b|\bfail\b|gemessen|nachgezählt|Messweg|\$ |\bgit \w|\bgrep\b|\bwc -l\b|\bnode\b|\bpnpm\b|\bnpm\b|[0-9a-f]{7,40}\b)/i;

/* Zahlbehaftete Behauptungen. Datum, Version, Ausgabezeile und
   Aufzählungsnummer sind keine. */
const ZAHLAUSSAGE = /(?<![\w.\-/:])\d{1,3}(?:[.,]\d+)?\s*(%|Prozent|Zeilen|Dateien|Tests?|Fälle|Treffer|Stellen|Sekunden|Minuten|ms|kB|MB|mal|Mal|x)\b/;

function pruefeText(name, text) {
  const zeilen = text.split("\n");
  const funde = [];
  const zaehl = {};
  const merke = (art, nr, zeile, treffer) => {
    zaehl[art] = (zaehl[art] ?? 0) + 1;
    funde.push({ art, datei: name, zeile: nr, treffer, text: zeile.trim().slice(0, 120) });
  };

  /* Listen und ihre Tiefe. Interessant ist nicht die Zahl, sondern das
     Verhältnis zur Prosa und jede Verschachtelung. */
  let listenZeilen = 0;
  let prosaZeilen = 0;
  let verschachtelt = 0;

  zeilen.forEach((zeile, i) => {
    const nr = i + 1;

    const liste = zeile.match(/^(\s*)([-*+]|\d+\.)\s/);
    if (liste) {
      listenZeilen += 1;
      if (liste[1].length >= 2) {
        verschachtelt += 1;
        merke("verschachtelte-liste", nr, zeile, liste[0].trim());
      }
    } else if (zeile.trim() && !/^\s*(#|\||`|>|\s{4})/.test(zeile)) {
      prosaZeilen += 1;
    }

    /* In Code steht kein Prosafehler. Zeilen in Zaunblöcken und
       eingerückte Ausgaben bleiben außen vor. */
    if (/^\s*(```|~~~|\s{4}\S)/.test(zeile)) return;

    /* Was in Backticks steht, ist zitiert und nicht behauptet. Ein
       Regeltext, der `wäre/hätte` als Suchmuster nennt, hat sonst
       Treffer auf sich selbst — gemessen beim ersten Lauf gegen die
       AGENTS.md, die diesen Skill ausgelöst hat. */
    const prosa = zeile.replace(/`[^`]*`/g, (m) => " ".repeat(m.length));

    for (const t of prosa.match(KONJUNKTIV) ?? []) merke("konjunktiv", nr, zeile, t);

    if (/^\s*(Ohne|Andernfalls|Sonst)\b/.test(prosa) || /(\. |— )(Ohne|Andernfalls)\s/.test(prosa))
      merke("gegenteil-als-motiv", nr, zeile, "Ohne …");

    for (const t of prosa.match(/(,\s+nicht\s+\S+|\bstatt\b|\bsondern\b|\banstelle\b)/gi) ?? [])
      merke("kontrast", nr, zeile, t.trim());

    for (const muster of FUELLWOERTER)
      for (const t of prosa.match(muster) ?? []) merke("fuellwort", nr, zeile, t);

    for (const t of prosa.match(UMSCHRIFT) ?? []) merke("umschrift", nr, zeile, t);
    for (const t of zeile.match(MOJIBAKE) ?? []) merke("mojibake", nr, zeile, t);

    const zahl = prosa.match(ZAHLAUSSAGE);
    if (zahl && !MESSWEG.test(zeile)) merke("zahl-ohne-messweg", nr, zeile, zahl[0]);

    /* Nominalisierungsketten: drei -ung in einem Satz lesen sich als
       Verwaltungsdeutsch, eines ist normal. */
    const ungs = prosa.match(/\b\w{4,}ung(en)?\b/g) ?? [];
    if (ungs.length >= 3) merke("nominalkette", nr, zeile, ungs.join(", "));
  });

  const inhalt = zeilen.filter((z) => z.trim()).length;
  return {
    datei: name,
    zeilen: inhalt,
    listenAnteil: inhalt ? listenZeilen / inhalt : 0,
    listenZeilen,
    prosaZeilen,
    verschachtelt,
    zaehl,
    funde,
  };
}

const ARTEN = [
  ["konjunktiv", "Konjunktiv (wäre/hätte/könnte/würde …)", "Jeden einzeln prüfen: eingetreten oder gedacht?"],
  ["gegenteil-als-motiv", "Satz öffnet mit „Ohne …\"", "Motiv aus dem Gegenteil — was wurde gemacht?"],
  ["kontrast", "Kontrast (X, nicht Y / statt / sondern)", "Stand Y offen? Sonst grenzt er gegen nichts ab."],
  ["fuellwort", "Schlussformel oder Füllvokabel", "Ersatzlos streichen."],
  ["zahl-ohne-messweg", "Zahl ohne Messweg", "Befehl oder Lauf danebenstellen — oder Zahl streichen."],
  ["nominalkette", "Drei -ung in einer Zeile", "Ein Verb statt der Nominalisierung."],
  ["verschachtelte-liste", "Verschachtelte Liste", "Auf eine Ebene ziehen oder als Prosa schreiben."],
  ["umschrift", "Umlaut in ASCII-Umschreibung", "Richtig setzen."],
  ["mojibake", "Doppelt kodierter Umlaut", "Text ist über eine Kommandozeile gelaufen — neu schreiben."],
];

function melde(ergebnisse) {
  const gesamt = {};
  for (const e of ergebnisse)
    for (const [art, n] of Object.entries(e.zaehl)) gesamt[art] = (gesamt[art] ?? 0) + n;

  const zeilen = ergebnisse.reduce((s, e) => s + e.zeilen, 0);
  const listen = ergebnisse.reduce((s, e) => s + e.listenZeilen, 0);
  const nest = ergebnisse.reduce((s, e) => s + e.verschachtelt, 0);

  console.log(`\nklartext — ${ergebnisse.length} Text(e), ${zeilen} Zeilen mit Inhalt`);
  console.log(`Listen: ${listen} Zeilen (${zeilen ? Math.round((listen / zeilen) * 100) : 0} %), davon ${nest} verschachtelt\n`);

  for (const [art, titel, hinweis] of ARTEN) {
    const n = gesamt[art] ?? 0;
    console.log(`  ${String(n).padStart(4)}  ${titel}`);
    if (n) console.log(`        → ${hinweis}`);
  }

  const funde = ergebnisse.flatMap((e) => e.funde);
  if (funde.length) {
    console.log(`\nFundstellen (${funde.length}):\n`);
    for (const f of funde)
      console.log(`  ${f.datei}:${f.zeile}  [${f.art}] „${f.treffer}"\n      ${f.text}`);
  }

  console.log(
    `\nKeine dieser Zeilen ist damit verurteilt. Ein Konjunktiv über einen`,
  );
  console.log(`eingetretenen Fall ist ein Beleg; eine Verneinung mit Zahl ist Pflicht.`);
  console.log(`Die Entscheidung steht in referenzen/regeln.md.\n`);
}

const args = process.argv.slice(2);
const alsJson = args.includes("--json");
const pfade = args.filter((a) => a !== "--json");

if (!pfade.length) {
  console.log("Aufruf: node pruefe-text.mjs <datei> [<datei> …]   oder   … | node pruefe-text.mjs -");
  process.exit(0);
}

const ergebnisse = pfade.map((p) =>
  pruefeText(p === "-" ? "<stdin>" : p, readFileSync(p === "-" ? 0 : p, "utf8")),
);

if (alsJson) console.log(JSON.stringify(ergebnisse, null, 2));
else melde(ergebnisse);
