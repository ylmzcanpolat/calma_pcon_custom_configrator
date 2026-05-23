/**
 * excel-export.js
 *
 * "Add to Request" — ExcelJS v4.4.0 ile fiyatsız konfigürasyon Excel'i üretir.
 *
 * Format, kardeş uygulamadaki Draft Order export'uyla birebir aynıdır:
 *   - Sütunlar: Line Num, SKU, Image, Description, Product Specs, QTY,
 *               Unit Price (boş), Discount (boş), VAT (boş), Total Price (boş)
 *   - G/H/I/J sütunları kasıtlı boş — dealer veya muhasebe dolduracak
 *   - Divider ve _ ön ekli property'ler E sütununa dahil edilmez
 */

const EXCELJS_CDN =
  "https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js";

/** ExcelJS global'ini CDN'den yükler; zaten varsa tekrar yüklemez. */
async function loadExcelJS() {
  if (window.ExcelJS) return window.ExcelJS;

  return new Promise((resolve, reject) => {
    // Script tag zaten enjekte edildiyse sadece global'i bekle
    if (document.querySelector('script[data-exceljs]')) {
      const poll = setInterval(() => {
        if (window.ExcelJS) {
          clearInterval(poll);
          resolve(window.ExcelJS);
        }
      }, 100);
      return;
    }

    const s = document.createElement("script");
    s.src = EXCELJS_CDN;
    s.setAttribute("data-exceljs", "1");
    s.onload = () => resolve(window.ExcelJS);
    s.onerror = () => reject(new Error("Failed to load ExcelJS from CDN"));
    document.head.appendChild(s);
  });
}

/**
 * Ürün görselini base64 olarak çeker.
 * CORS hatası veya fetch hatası durumunda null döner — hata fırlatılmaz.
 */
async function fetchImageAsBase64(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // "data:image/jpeg;base64,..."
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * configDividers nesnesinden Excel E sütunu metnini üretir.
 *
 * Hariç tutma kuralları (kardeş uygulamayla aynı):
 *   - Anahtarı _ ile başlayan property'ler → gizli/sistem alanı, dahil etme
 *   - Anahtarı /divider/i regex'iyle eşleşen → bölüm başlığı, dahil etme
 *   - Değeri boş olan property'ler → dahil etme
 *
 * Her geçerli property "Key: Value" formatında, wrapText ile hücreye yazılır.
 */
function buildProductSpecs(configDividers) {
  if (!configDividers || typeof configDividers !== "object") return "";

  return Object.entries(configDividers)
    .filter(([key, value]) => {
      if (!key || key.startsWith("_")) return false;
      if (/divider/i.test(key)) return false;
      if (value == null || String(value).trim() === "") return false;
      return true;
    })
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

/**
 * Stil yardımcıları
 */
const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" },
};

const HEADER_FONT = { bold: true, size: 11 };

const META_LABEL_FONT = { bold: true, size: 10 };

const BORDER_THIN = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

/**
 * Ana export fonksiyonu.
 *
 * @param {object} opts
 * @param {string}   opts.articleNumber    - pCon makale numarası (SKU)
 * @param {string}   [opts.manufacturerId] - Üretici kodu
 * @param {string}   [opts.productTitle]   - Shopify ürün adı
 * @param {string}   [opts.productImageUrl]- Ürün görseli URL
 * @param {number}   [opts.quantity]       - Adet (default: 1)
 * @param {string}   [opts.customerName]   - Oturum açmış müşteri adı
 * @param {object}   [opts.configDividers] - Konfigürasyon property çiftleri
 */
export async function exportToExcel({
  articleNumber = "",
  manufacturerId = "",
  productTitle = "",
  productImageUrl = "",
  quantity = 1,
  customerName = "",
  configDividers = {},
}) {
  const ExcelJS = await loadExcelJS();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nurus Configurator";
  workbook.created = new Date();

  const ws = workbook.addWorksheet("Order");

  // ── Sütun genişlikleri (kardeş uygulamayla aynı) ───────────────────────
  ws.columns = [
    { key: "lineNum",      width: 12 },  // A
    { key: "sku",          width: 20 },  // B
    { key: "image",        width: 18 },  // C
    { key: "description",  width: 36 },  // D
    { key: "specs",        width: 44 },  // E
    { key: "qty",          width: 10 },  // F
    { key: "unitPrice",    width: 14 },  // G — kasıtlı boş
    { key: "discount",     width: 12 },  // H — kasıtlı boş
    { key: "vat",          width: 10 },  // I — kasıtlı boş
    { key: "totalPrice",   width: 14 },  // J — kasıtlı boş
  ];

  // ── Blok 1: Başlık meta bilgileri (Satır 1–5) ──────────────────────────
  const metaRows = [
    ["Customer Name:", ""],
    ["Date:", ""],
    ["Quote ID:", ""],
    [],
    [],
  ];

  for (const rowData of metaRows) {
    const row = ws.addRow(rowData);
    if (rowData[0]) {
      row.getCell(1).font = META_LABEL_FONT;
    }
  }

  // ── Blok 2: Tablo başlığı (Satır 6) ────────────────────────────────────
  const colHeaders = [
    "Line Num",
    "SKU",
    "Image",
    "Description",
    "Product Specs",
    "QTY",
    "Unit Price",
    "Discount",
    "VAT",
    "Total Price",
  ];

  const headerRow = ws.addRow(colHeaders);
  headerRow.font = HEADER_FONT;
  headerRow.fill = HEADER_FILL;
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 20;

  // Başlık satırına border ekle
  headerRow.eachCell((cell) => {
    cell.border = BORDER_THIN;
  });

  // ── Blok 3: Ürün satırı (Satır 7) ──────────────────────────────────────
  const specsText = buildProductSpecs(configDividers);
  const IMAGE_ROW_HEIGHT = 85; // px cinsinden yaklaşık yükseklik

  const productRow = ws.addRow([
    1,                                  // A: Line Num
    articleNumber || "",                // B: SKU
    "",                                 // C: Image (görsel ekleme aşağıda)
    productTitle || articleNumber || "", // D: Description
    specsText,                          // E: Product Specs
    quantity,                           // F: QTY
    "",                                 // G: Unit Price (boş)
    "",                                 // H: Discount (boş)
    "",                                 // I: VAT (boş)
    "",                                 // J: Total Price (boş)
  ]);

  productRow.height = IMAGE_ROW_HEIGHT;

  // E sütunu: wrapText + dikey hizalama
  const specsCell = productRow.getCell("E");
  specsCell.alignment = { wrapText: true, vertical: "top" };

  // Diğer hücre hizalamaları
  productRow.getCell("A").alignment = { vertical: "middle", horizontal: "center" };
  productRow.getCell("B").alignment = { vertical: "middle" };
  productRow.getCell("D").alignment = { vertical: "middle", wrapText: true };
  productRow.getCell("F").alignment = { vertical: "middle", horizontal: "center" };

  // Ürün satırına border
  productRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = BORDER_THIN;
  });

  // Görsel ekleme — CORS hatası sessizce atlanır
  const productRowIdx = 7; // 1-tabanlı satır numarası
  if (productImageUrl) {
    const imgData = await fetchImageAsBase64(productImageUrl);
    if (imgData) {
      const base64 = imgData.split(",")[1];
      const mimeType = imgData.match(/data:([^;]+);/)?.[1] || "image/jpeg";
      // ExcelJS webp desteklemez — png extension'ıyla kaydet
      const extension = mimeType.includes("png") ? "png" : "jpeg";

      const imageId = workbook.addImage({ base64, extension });

      // tl.col 0-tabanlı (C = col index 2), tl.row 1-tabanlı (satır 7 → row 6)
      ws.addImage(imageId, {
        tl: { col: 2, row: productRowIdx - 1 },
        br: { col: 3, row: productRowIdx },
        editAs: "oneCell",
      });
    }
  }

  // ── Blok 4: Özet bloğu ─────────────────────────────────────────────────
  ws.addRow([]); // boş ayırıcı satır

  const summaryItems = [
    "Sub Total",
    "Discount",
    "Freight",
    "Tariff Cost",
    "Total",
  ];

  for (const label of summaryItems) {
    const row = ws.addRow([
      "", "", "", "",
      label,  // E: etiket
      "",     // F
      "",     // G: değer (kasıtlı boş)
      "", "", "",
    ]);
    const labelCell = row.getCell("E");
    labelCell.font = { bold: true };
    labelCell.border = BORDER_THIN;
    row.getCell("G").border = BORDER_THIN;
  }

  // ── Dosyayı indir ───────────────────────────────────────────────────────
  const safeName = (productTitle || articleNumber || "order")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `order-${safeName}.xlsx`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    if (a.parentNode) a.parentNode.removeChild(a);
  }, 100);
}
