import * as XLSX from "xlsx";
const wb = XLSX.readFile(process.argv[2]);
console.log("SHEETS:", wb.SheetNames.join(" | "));
for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const ref = ws["!ref"] || "(empty)";
  console.log(`\n===== SHEET "${name}"  range=${ref} =====`);
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: "" });
  rows.slice(0, 25).forEach((r, i) => {
    const cells = r.map((c) => String(c).slice(0, 18)).join(" | ");
    if (cells.trim()) console.log(String(i + 1).padStart(3), cells);
  });
  if (rows.length > 25) console.log(`... (${rows.length} rows total)`);
}
