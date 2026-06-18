"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarPdfPorHtml = gerarPdfPorHtml;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
async function gerarPdfPorHtml(htmlPath, pdfPath) {
    try {
        await execFileAsync('wkhtmltopdf', [
            '--encoding', 'utf-8',
            '--enable-local-file-access',
            '--page-size', 'A4',
            '--margin-top', '15mm',
            '--margin-bottom', '15mm',
            '--margin-left', '14mm',
            '--margin-right', '14mm',
            htmlPath,
            pdfPath
        ]);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=pdf.js.map