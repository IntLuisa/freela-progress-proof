"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.writeTextFile = writeTextFile;
exports.readJsonFile = readJsonFile;
exports.openFile = openFile;
exports.openExternalFile = openExternalFile;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function writeTextFile(filePath, content) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
}
function readJsonFile(filePath, fallback) {
    if (!fs.existsSync(filePath)) {
        return fallback;
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    catch {
        return fallback;
    }
}
async function openFile(filePath) {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    await vscode.window.showTextDocument(doc, { preview: false });
}
async function openExternalFile(filePath) {
    await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePath));
}
//# sourceMappingURL=files.js.map