import type { jsPDF } from "jspdf";
import type { FieldRecordPayload } from "@shared/digitalFieldRecords";
import type { FieldRecordTemplate } from "@shared/fieldRecordTemplates";

type ExportInput = {
  template: FieldRecordTemplate;
  title: string;
  payload: FieldRecordPayload;
  exportedAt: Date;
};

const pageMargin = 38;

function fileName(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "field-record";
}

function valueOrDash(value: string | undefined) {
  return value?.trim() || "—";
}

function split(doc: jsPDF, value: string, width: number) {
  return doc.splitTextToSize(valueOrDash(value), width) as string[];
}

export async function createFieldRecordPdf(input: ExportInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - pageMargin * 2;
  let y = pageMargin;

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - pageMargin) return;
    doc.addPage();
    y = pageMargin;
  };

  const drawRule = () => {
    doc.setDrawColor(59, 99, 72);
    doc.setLineWidth(1.25);
    doc.line(pageMargin, y, pageWidth - pageMargin, y);
    y += 18;
  };

  const heading = (title: string) => {
    ensureSpace(32);
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(39, 67, 47);
    doc.text(title, pageMargin, y);
    y += 20;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(91, 125, 94);
  doc.text("CROP ADVISOR TRAINING INSTITUTE · DIGITAL FIELD RECORD", pageMargin, y);
  y += 24;
  doc.setFont("times", "bold");
  doc.setFontSize(23);
  doc.setTextColor(38, 58, 45);
  doc.text(input.template.title, pageMargin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(85, 105, 87);
  const purposeLines = split(doc, input.template.purpose, contentWidth);
  doc.text(purposeLines, pageMargin, y);
  y += purposeLines.length * 11 + 12;
  drawRule();

  heading("Record details");
  const detailEntries = [["Record title", input.title], ...input.template.setupFields.map(field => [field, input.payload.setup[field] ?? ""])];
  const detailColumnWidth = (contentWidth - 18) / 2;
  for (let index = 0; index < detailEntries.length; index += 2) {
    const row = detailEntries.slice(index, index + 2);
    const rowLines = row.map(([, value]) => split(doc, value, detailColumnWidth - 8));
    const height = Math.max(...rowLines.map(lines => lines.length)) * 10 + 28;
    ensureSpace(height);
    row.forEach(([label], column) => {
      const x = pageMargin + column * (detailColumnWidth + 18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(95, 126, 97);
      doc.text(label.toUpperCase(), x, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(53, 73, 55);
      doc.text(rowLines[column], x, y + 13);
      doc.setDrawColor(198, 212, 197);
      doc.line(x, y + height - 5, x + detailColumnWidth, y + height - 5);
    });
    y += height;
  }
  y += 12;

  heading("Observation and action log");
  const columnWidth = contentWidth / input.template.recordColumns.length;
  const drawTableHeader = () => {
    ensureSpace(36);
    doc.setFillColor(232, 240, 227);
    doc.rect(pageMargin, y, contentWidth, 30, "F");
    input.template.recordColumns.forEach((column, index) => {
      const x = pageMargin + index * columnWidth;
      doc.setDrawColor(196, 211, 194);
      doc.rect(x, y, columnWidth, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      doc.setTextColor(65, 100, 68);
      doc.text(split(doc, column.toUpperCase(), columnWidth - 8), x + 4, y + 9);
    });
    y += 30;
  };
  drawTableHeader();
  const exportEntries = input.payload.entries.length ? input.payload.entries : [Object.fromEntries(input.template.recordColumns.map(column => [column, ""]))];
  exportEntries.forEach(entry => {
    const cells = input.template.recordColumns.map(column => split(doc, entry[column] ?? "", columnWidth - 8));
    const rowHeight = Math.max(42, Math.max(...cells.map(lines => lines.length)) * 9 + 14);
    if (y + rowHeight > pageHeight - pageMargin) {
      doc.addPage();
      y = pageMargin;
      drawTableHeader();
    }
    cells.forEach((lines, index) => {
      const x = pageMargin + index * columnWidth;
      doc.setDrawColor(212, 224, 210);
      doc.rect(x, y, columnWidth, rowHeight);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(58, 77, 60);
      doc.text(lines, x + 4, y + 11);
    });
    y += rowHeight;
  });
  y += 16;

  heading("Decision review");
  input.template.reviewPrompts.forEach((prompt, index) => {
    const response = input.payload.review[index] ?? "";
    const promptLines = split(doc, prompt, contentWidth);
    const responseLines = split(doc, response, contentWidth);
    const height = promptLines.length * 10 + responseLines.length * 11 + 25;
    ensureSpace(height);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(57, 87, 61);
    doc.text(promptLines, pageMargin, y);
    y += promptLines.length * 10 + 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(58, 77, 60);
    doc.text(responseLines, pageMargin, y);
    y += responseLines.length * 11 + 12;
  });

  ensureSpace(55);
  doc.setFillColor(255, 249, 238);
  doc.roundedRect(pageMargin, y, contentWidth, 44, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(139, 99, 43);
  doc.text("SAFETY AND STEWARDSHIP", pageMargin + 10, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(95, 75, 42);
  doc.text(split(doc, input.template.safetyNote, contentWidth - 20), pageMargin + 10, y + 25);

  doc.setProperties({ title: input.title, subject: input.template.title, author: "Crop Advisor Training Institute" });
  return doc;
}

export async function downloadFieldRecordPdf(input: ExportInput) {
  const doc = await createFieldRecordPdf(input);
  doc.save(`${fileName(input.title)}.pdf`);
}
