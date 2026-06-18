import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function gerarPdfPorHtml(
    htmlPath: string,
    pdfPath: string
): Promise<boolean> {
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
    } catch {
        return false;
    }
}
