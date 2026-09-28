import fs from "fs";
import path from "path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
  type PDFPage,
  type PDFFont,
  type RGB,
} from "pdf-lib";
import type { StoredCase } from "./caseStore";
import { getCaseDataDir } from "./caseStore";
import {
  buildDocumentPreview,
  getSignedDocuments,
  readSignatureFile,
  type CaseDocumentType,
  type SignedDocumentRecord,
} from "./caseDocuments";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 52;
const GUTTER = 20;
const LINE_H = 17;
const PARA_GAP = 14;
const STAMP_R = 54;
const FOOTER_RESERVE = 236;

function pdfPath(caseId: string, documentType: CaseDocumentType): string {
  return path.join(getCaseDataDir(), "signed-docs", caseId, `${documentType}.pdf`);
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawArcText(
  page: PDFPage,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  font: PDFFont,
  size: number,
  color: RGB,
  options: { invert?: boolean } = {}
) {
  const chars = [...text];
  const gap = size * 0.1;
  const widths = chars.map((c) => font.widthOfTextAtSize(c === " " ? " " : c, size));
  const total = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, chars.length - 1);
  let cursor = -total / 2;

  for (let i = 0; i < chars.length; i++) {
    const w = widths[i];
    const mid = cursor + w / 2;
    const theta = options.invert
      ? -Math.PI / 2 - mid / radius
      : Math.PI / 2 - mid / radius;
    const rotation = options.invert ? theta + Math.PI / 2 : theta - Math.PI / 2;
    const x = cx + Math.cos(theta) * radius;
    const y = cy + Math.sin(theta) * radius;
    page.drawText(chars[i], {
      x: x - (w / 2) * Math.cos(rotation),
      y: y - (w / 2) * Math.sin(rotation),
      size,
      font,
      color,
      rotate: degrees((rotation * 180) / Math.PI),
    });
    cursor += w + gap;
  }
}

function drawSawtooth(
  page: PDFPage,
  cx: number,
  cy: number,
  radius: number,
  color: RGB,
  teeth = 32
) {
  for (let i = 0; i < teeth; i++) {
    const a0 = (Math.PI * 2 * i) / teeth - Math.PI / 2;
    const a1 = (Math.PI * 2 * (i + 0.5)) / teeth - Math.PI / 2;
    const a2 = (Math.PI * 2 * (i + 1)) / teeth - Math.PI / 2;
    page.drawSvgPath(
      `M ${cx + Math.cos(a0) * (radius - 6)} ${cy + Math.sin(a0) * (radius - 6)} ` +
        `L ${cx + Math.cos(a1) * radius} ${cy + Math.sin(a1) * radius} ` +
        `L ${cx + Math.cos(a2) * (radius - 6)} ${cy + Math.sin(a2) * (radius - 6)} Z`,
      { color }
    );
  }
}

function drawCircularStamp(
  page: PDFPage,
  bold: PDFFont,
  cx: number,
  cy: number,
  fill: RGB,
  ring: RGB,
  accent: RGB,
  top: string,
  bottom: string,
  center: string
) {
  drawSawtooth(page, cx, cy, STAMP_R + 3, accent);
  page.drawCircle({ x: cx, y: cy, size: STAMP_R - 6, color: fill });
  page.drawCircle({
    x: cx,
    y: cy,
    size: STAMP_R - 11,
    borderColor: ring,
    borderWidth: 1.6,
  });
  page.drawCircle({
    x: cx,
    y: cy,
    size: STAMP_R - 24,
    borderColor: accent,
    borderWidth: 1,
  });
  drawArcText(page, top, cx, cy, STAMP_R - 16, bold, 6.4, ring);
  drawArcText(page, bottom, cx, cy, STAMP_R - 16, bold, 6, accent, { invert: true });
  const centerW = bold.widthOfTextAtSize(center, 10);
  page.drawText(center, {
    x: cx - centerW / 2,
    y: cy - 3.5,
    size: 10,
    font: bold,
    color: rgb(1, 1, 1),
  });
}

function paintLetterhead(page: PDFPage, navy: RGB, gold: RGB) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_W,
    height: PAGE_H,
    color: rgb(0.969, 0.953, 0.91),
  });
  page.drawRectangle({ x: 0, y: PAGE_H - 18, width: PAGE_W, height: 18, color: navy });
  page.drawRectangle({ x: 0, y: PAGE_H - 24, width: PAGE_W, height: 6, color: gold });
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 16, color: navy });
}

function drawInfoBox(
  page: PDFPage,
  yTop: number,
  height: number,
  border: RGB,
  fill: RGB,
  label: string,
  value: string,
  labelColor: RGB,
  valueColor: RGB,
  font: PDFFont,
  bold: PDFFont,
  valueSize: number
): number {
  const bottom = yTop - height;
  page.drawRectangle({
    x: MARGIN,
    y: bottom,
    width: PAGE_W - MARGIN * 2,
    height,
    color: fill,
    borderColor: border,
    borderWidth: 1.2,
  });
  page.drawText(label, {
    x: MARGIN + 14,
    y: bottom + height - 18,
    size: 8,
    font: bold,
    color: labelColor,
  });
  const valueLines = wrapText(value, bold, valueSize, PAGE_W - MARGIN * 2 - 32);
  let valueY = bottom + height - 38;
  for (const line of valueLines.slice(0, 2)) {
    page.drawText(line, {
      x: MARGIN + 14,
      y: valueY,
      size: valueSize,
      font: bold,
      color: valueColor,
    });
    valueY -= valueSize + 4;
  }
  return bottom - GUTTER;
}

export async function buildSignedPdfBuffer(
  row: StoredCase,
  record: SignedDocumentRecord
): Promise<Buffer> {
  const caseId = String(row.caseId || row.id);
  const clientName = record.signerName || String(row.operatorAlias || row.name || "Client");
  const preview = buildDocumentPreview({
    documentType: record.documentType,
    caseId,
    clientName,
    recoveredAmount: Number(record.recoveredAmount || row.recoveredAmount || 0),
    currency: String(record.recoveredAmountCurrency || row.recoveredAmountCurrency || "USD"),
  });

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const navy = rgb(0.118, 0.227, 0.373);
  const gold = rgb(0.788, 0.635, 0.153);
  const ink = rgb(0.08, 0.09, 0.11);
  const muted = rgb(0.34, 0.34, 0.36);
  const green = rgb(0.08, 0.33, 0.18);
  const bodyWidth = PAGE_W - MARGIN * 2;
  const issued = new Date(record.signedAt).toLocaleString();

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  paintLetterhead(page, navy, gold);
  let y = PAGE_H - 48;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    paintLetterhead(page, navy, gold);
    y = PAGE_H - 48;
  };

  const ensureSpace = (need: number) => {
    if (y - need < FOOTER_RESERVE) newPage();
  };

  page.drawText("CRYPTO RECOVERY ASSETS AGENCY", {
    x: MARGIN,
    y,
    size: 9,
    font: bold,
    color: navy,
  });
  page.drawText("OFFICIAL INSTRUMENT", {
    x: PAGE_W - MARGIN - bold.widthOfTextAtSize("OFFICIAL INSTRUMENT", 8),
    y,
    size: 8,
    font: bold,
    color: muted,
  });

  y -= 26;
  page.drawText(preview.title.toUpperCase(), {
    x: MARGIN,
    y,
    size: 17,
    font: bold,
    color: ink,
  });

  y -= 22;
  page.drawText(`Reference  ${preview.reference}`, {
    x: MARGIN,
    y,
    size: 9,
    font,
    color: muted,
  });
  page.drawText(`Case  ${caseId.slice(0, 12).toUpperCase()}`, {
    x: 318,
    y,
    size: 9,
    font,
    color: muted,
  });
  const issuedLabel = `Issued  ${issued}`;
  page.drawText(issuedLabel, {
    x: PAGE_W - MARGIN - font.widthOfTextAtSize(issuedLabel, 8),
    y: y - 14,
    size: 8,
    font,
    color: muted,
  });

  y -= 28;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 0.8,
    color: rgb(0.78, 0.72, 0.58),
  });

  y -= GUTTER + 4;
  y = drawInfoBox(
    page,
    y,
    56,
    navy,
    rgb(1, 1, 1),
    "CLIENT NAME",
    clientName,
    navy,
    ink,
    font,
    bold,
    14
  );

  if (preview.amountLine) {
    y = drawInfoBox(
      page,
      y,
      60,
      green,
      rgb(0.94, 0.97, 0.94),
      "RECOVERED AMOUNT",
      preview.amountLine,
      green,
      green,
      font,
      bold,
      18
    );
  }

  y -= 6;
  for (const paragraph of preview.paragraphs) {
    const lines = wrapText(paragraph, font, 11, bodyWidth);
    ensureSpace(lines.length * LINE_H + PARA_GAP);
    for (const line of lines) {
      page.drawText(line, { x: MARGIN, y, size: 11, font, color: ink });
      y -= LINE_H;
    }
    y -= PARA_GAP;
  }

  if (y < FOOTER_RESERVE + 16) newPage();

  const lastPage = pdf.getPages()[pdf.getPageCount() - 1];
  const signatureTop = FOOTER_RESERVE - 8;
  lastPage.drawLine({
    start: { x: MARGIN, y: signatureTop + 18 },
    end: { x: PAGE_W - MARGIN, y: signatureTop + 18 },
    thickness: 0.7,
    color: rgb(0.78, 0.72, 0.58),
  });

  lastPage.drawText("CLIENT SIGNATURE", {
    x: MARGIN,
    y: signatureTop,
    size: 8,
    font: bold,
    color: navy,
  });

  let sigBottom = signatureTop - 18;
  const sig = readSignatureFile(caseId, record.signatureFilename);
  if (sig) {
    try {
      const image = sig.mimeType.includes("png")
        ? await pdf.embedPng(sig.buffer)
        : await pdf.embedJpg(sig.buffer);
      const sigW = 200;
      const rawH = (image.height / Math.max(image.width, 1)) * sigW;
      const sigH = Math.min(Math.max(rawH, 32), 52);
      lastPage.drawRectangle({
        x: MARGIN,
        y: signatureTop - 14 - sigH - 8,
        width: sigW + 20,
        height: sigH + 14,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.72, 0.68, 0.6),
        borderWidth: 0.8,
      });
      lastPage.drawImage(image, {
        x: MARGIN + 10,
        y: signatureTop - 14 - sigH,
        width: sigW,
        height: sigH,
      });
      sigBottom = signatureTop - 14 - sigH - 16;
    } catch {
      sigBottom = signatureTop - 36;
    }
  }

  lastPage.drawText(clientName, {
    x: MARGIN,
    y: sigBottom,
    size: 11,
    font: bold,
    color: ink,
  });
  lastPage.drawText(`Signed ${issued}  ·  Acknowledged: Yes`, {
    x: MARGIN,
    y: sigBottom - 14,
    size: 8,
    font,
    color: muted,
  });

  const stampCy = 118;
  const stampGap = 22;
  const rightCx = PAGE_W - MARGIN - STAMP_R - 4;
  const leftCx = rightCx - STAMP_R * 2 - stampGap;
  drawCircularStamp(
    lastPage,
    bold,
    leftCx,
    stampCy,
    navy,
    rgb(0.91, 0.83, 0.55),
    gold,
    "CRYPTO RECOVERY ASSETS",
    "AGENCY  ·  OFFICIAL SEAL",
    "SEAL"
  );
  drawCircularStamp(
    lastPage,
    bold,
    rightCx,
    stampCy,
    rgb(0.08, 0.33, 0.18),
    rgb(0.73, 0.97, 0.81),
    rgb(0.53, 0.94, 0.67),
    "OFFICIAL RECORD",
    "AUTHENTICATED  ·  AUDIT",
    "VALID"
  );

  lastPage.drawText(
    "This executed copy is retained for audit. Do not alter after signature.",
    {
      x: MARGIN,
      y: 5,
      size: 7.5,
      font,
      color: rgb(0.85, 0.88, 0.92),
    }
  );

  return Buffer.from(await pdf.save());
}

export async function persistSignedPdf(
  row: StoredCase,
  record: SignedDocumentRecord
): Promise<string> {
  const caseId = String(row.caseId || row.id);
  const file = pdfPath(caseId, record.documentType);
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const buffer = await buildSignedPdfBuffer(row, record);
  fs.writeFileSync(file, buffer);
  return file;
}

export async function getOrCreateSignedPdf(
  row: StoredCase,
  documentType: CaseDocumentType
): Promise<Buffer | null> {
  const record = getSignedDocuments(row)[documentType];
  if (!record) return null;
  const caseId = String(row.caseId || row.id);
  const file = pdfPath(caseId, documentType);
  const buffer = await buildSignedPdfBuffer(row, record);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
  return buffer;
}

export function signedPdfFilename(
  caseId: string,
  documentType: CaseDocumentType
): string {
  return `${caseId.slice(0, 10)}-${documentType}.pdf`;
}
