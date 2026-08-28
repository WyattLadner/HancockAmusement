const XLSX = require("xlsx");
const wb = XLSX.readFile(process.argv[2]);
console.log("SHEETS:", wb.SheetNames.join(" | "));
for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  console.log(`\n===== SHEET "${name}"  range=${ws["!ref"] || "(empty)"} =====`);
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: "" });
  rows.slice(0, 30).forEach((r, i) => {
    const cells = r.map((c) => String(c).slice(0, 20)).join(" | ");
    if (cells.trim()) console.log(String(i + 1).padStart(3), cells);
  });
  if (rows.length > 30) console.log(`... (${rows.length} rows total)`);
}
