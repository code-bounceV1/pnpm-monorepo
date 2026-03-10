/**
 * media-utils.ts
 * Shared helpers for the MediaViewer system.
 */

// ─── Media Kind ───────────────────────────────────────────────────────────────

export type MediaKind =
    | "image"
    | "pdf"
    | "video"
    | "audio"
    | "html"
    | "office"   // doc, docx, ppt, pptx
    | "csv"      // csv  — Google Docs Viewer
    | "xlsx"     // xls, xlsx — Google Docs / Office Online
    | "text"     // txt, md, log
    | "external"; // fallback → expo-web-browser

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "heic", "heif"];
const VIDEO_EXTS = ["mp4", "mov", "avi", "mkv", "webm", "m4v", "3gp"];
const AUDIO_EXTS = ["mp3", "aac", "wav", "ogg", "flac", "m4a", "opus"];
const OFFICE_EXTS = ["doc", "docx", "ppt", "pptx"];

export function resolveMediaKind(contentType = "", docType = ""): MediaKind {
    const mime = contentType.toLowerCase();
    const ext = docType.toLowerCase();

    if (mime.startsWith("image/") || IMAGE_EXTS.includes(ext)) return "image";
    if (mime === "application/pdf" || ext === "pdf") return "pdf";
    if (mime.startsWith("video/") || VIDEO_EXTS.includes(ext)) return "video";
    if (mime.startsWith("audio/") || AUDIO_EXTS.includes(ext)) return "audio";
    if (mime.includes("html") || ext === "html" || ext === "htm") return "html";

    if (
        OFFICE_EXTS.includes(ext) ||
        [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ].includes(mime)
    )
        return "office";

    if (mime === "text/csv" || ext === "csv") return "csv";

    if (
        ext === "xlsx" ||
        ext === "xls" ||
        mime === "application/vnd.ms-excel" ||
        mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
        return "xlsx";

    if (mime.startsWith("text/") || ["txt", "md", "log", "json", "xml"].includes(ext))
        return "text";

    return "external";
}

export function getMediaUrl(item: {
    downloadLink?: string | null;
    downloadUrl?: string | null;
    sourceUrl?: string | null;
}): string {
    return item.downloadLink || item.downloadUrl || item.sourceUrl || "";
}

// ─── Viewer URL builders ──────────────────────────────────────────────────────

/** Microsoft Office Online viewer — works for doc, docx, ppt, pptx, xlsx */
export function officeOnlineUrl(rawUrl: string): string {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(rawUrl)}`;
}

/** Google Docs embedded viewer — works for pdf, csv, xls, doc, ppt etc. */
export function googleDocsViewerUrl(rawUrl: string): string {
    return `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(rawUrl)}`;
}
