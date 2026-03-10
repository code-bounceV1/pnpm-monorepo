import { Ionicons } from "@expo/vector-icons";
export type OfficeKind = "office" | "csv" | "xlsx" | "pdf" | 'docx';
export const KIND_META: Record<
    OfficeKind,
    { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }
> = {
    office: { icon: "document-outline", color: "#2B579A", label: "Office Document" },
    csv: { icon: "grid-outline", color: "#217346", label: "CSV File" },
    xlsx: { icon: "grid-outline", color: "#217346", label: "Spreadsheet" },
    pdf: { icon: "document-text-outline", color: "#E74C3C", label: "PDF File" },
    docx: { icon: "document-text-outline", color: "#2B579A", label: "DOCX File" },
};