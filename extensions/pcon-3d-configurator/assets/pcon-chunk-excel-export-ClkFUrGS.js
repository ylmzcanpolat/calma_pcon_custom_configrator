const j = "https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js";
async function A() {
  return window.ExcelJS ? window.ExcelJS : new Promise((t, n) => {
    if (document.querySelector("script[data-exceljs]")) {
      const r = setInterval(() => {
        window.ExcelJS && (clearInterval(r), t(window.ExcelJS));
      }, 100);
      return;
    }
    const e = document.createElement("script");
    e.src = j, e.setAttribute("data-exceljs", "1"), e.onload = () => t(window.ExcelJS), e.onerror = () => n(new Error("Failed to load ExcelJS from CDN")), document.head.appendChild(e);
  });
}
async function L(t) {
  if (!t) return null;
  try {
    const n = await fetch(t, { mode: "cors" });
    if (!n.ok) return null;
    const e = await n.blob();
    return new Promise((r) => {
      const i = new FileReader();
      i.onload = () => r(i.result), i.onerror = () => r(null), i.readAsDataURL(e);
    });
  } catch {
    return null;
  }
}
function N(t) {
  return !t || typeof t != "object" ? "" : Object.entries(t).filter(([n, e]) => !(!n || n.startsWith("_") || /divider/i.test(n) || e == null || String(e).trim() === "")).map(([n, e]) => `${n}: ${e}`).join(`
`);
}
const v = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" }
}, F = { bold: !0, size: 11 }, J = { bold: !0, size: 10 }, m = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" }
};
async function O({
  articleNumber: t = "",
  manufacturerId: n = "",
  productTitle: e = "",
  productImageUrl: r = "",
  quantity: i = 1,
  customerName: _ = "",
  configDividers: h = {}
}) {
  const g = await A(), d = new g.Workbook();
  d.creator = "Nurus Configurator", d.created = /* @__PURE__ */ new Date();
  const l = d.addWorksheet("Order");
  l.columns = [
    { key: "lineNum", width: 12 },
    // A
    { key: "sku", width: 20 },
    // B
    { key: "image", width: 18 },
    // C
    { key: "description", width: 36 },
    // D
    { key: "specs", width: 44 },
    // E
    { key: "qty", width: 10 },
    // F
    { key: "unitPrice", width: 14 },
    // G — kasıtlı boş
    { key: "discount", width: 12 },
    // H — kasıtlı boş
    { key: "vat", width: 10 },
    // I — kasıtlı boş
    { key: "totalPrice", width: 14 }
    // J — kasıtlı boş
  ];
  const b = [
    ["Customer Name:", ""],
    ["Date:", ""],
    ["Quote ID:", ""],
    [],
    []
  ];
  for (const o of b) {
    const s = l.addRow(o);
    o[0] && (s.getCell(1).font = J);
  }
  const y = [
    "Line Num",
    "SKU",
    "Image",
    "Description",
    "Product Specs",
    "QTY",
    "Unit Price",
    "Discount",
    "VAT",
    "Total Price"
  ], u = l.addRow(y);
  u.font = F, u.fill = v, u.alignment = { vertical: "middle", horizontal: "center" }, u.height = 20, u.eachCell((o) => {
    o.border = m;
  });
  const E = N(h), x = 85, c = l.addRow([
    1,
    // A: Line Num
    t || "",
    // B: SKU
    "",
    // C: Image (görsel ekleme aşağıda)
    e || t || "",
    // D: Description
    E,
    // E: Product Specs
    i,
    // F: QTY
    "",
    // G: Unit Price (boş)
    "",
    // H: Discount (boş)
    "",
    // I: VAT (boş)
    ""
    // J: Total Price (boş)
  ]);
  c.height = x;
  const C = c.getCell("E");
  C.alignment = { wrapText: !0, vertical: "top" }, c.getCell("A").alignment = { vertical: "middle", horizontal: "center" }, c.getCell("B").alignment = { vertical: "middle" }, c.getCell("D").alignment = { vertical: "middle", wrapText: !0 }, c.getCell("F").alignment = { vertical: "middle", horizontal: "center" }, c.eachCell({ includeEmpty: !0 }, (o) => {
    o.border = m;
  });
  const f = 7;
  if (r) {
    const o = await L(r);
    if (o) {
      const s = o.split(",")[1], S = (o.match(/data:([^;]+);/)?.[1] || "image/jpeg").includes("png") ? "png" : "jpeg", I = d.addImage({ base64: s, extension: S });
      l.addImage(I, {
        tl: { col: 2, row: f - 1 },
        br: { col: 3, row: f },
        editAs: "oneCell"
      });
    }
  }
  l.addRow([]);
  const R = [
    "Sub Total",
    "Discount",
    "Freight",
    "Tariff Cost",
    "Total"
  ];
  for (const o of R) {
    const s = l.addRow([
      "",
      "",
      "",
      "",
      o,
      // E: etiket
      "",
      // F
      "",
      // G: değer (kasıtlı boş)
      "",
      "",
      ""
    ]), w = s.getCell("E");
    w.font = { bold: !0 }, w.border = m, s.getCell("G").border = m;
  }
  const k = (e || t || "order").replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""), T = await d.xlsx.writeBuffer(), D = new Blob([T], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }), p = URL.createObjectURL(D), a = document.createElement("a");
  a.href = p, a.download = `order-${k}.xlsx`, document.body.appendChild(a), a.click(), setTimeout(() => {
    URL.revokeObjectURL(p), a.parentNode && a.parentNode.removeChild(a);
  }, 100);
}
export {
  O as exportToExcel
};
