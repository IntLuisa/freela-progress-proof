"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceRoot = getWorkspaceRoot;
exports.getFreelaPaths = getFreelaPaths;
const path = require("path");
const vscode = require("vscode");
function getWorkspaceRoot() {
    const folders = vscode.workspace.workspaceFolders;
    return folders?.[0]?.uri.fsPath ?? null;
}
function getFreelaPaths(projectPath) {
    const freelaDir = path.join(projectPath, '.freela');
    const relatoriosDir = path.join(freelaDir, 'relatorios');
    return {
        projectPath,
        freelaDir,
        relatoriosDir,
        configPath: path.join(freelaDir, 'config.json'),
        orcamentoMdPath: path.join(freelaDir, 'orcamento.md'),
        orcamentoHtmlPath: path.join(freelaDir, 'orcamento.html'),
        orcamentoPdfPath: path.join(freelaDir, 'orcamento.pdf')
    };
}
//# sourceMappingURL=paths.js.map