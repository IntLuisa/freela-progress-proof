import * as path from 'path';
import * as vscode from 'vscode';
import { FreelaPaths } from '../types/freela';

export function getWorkspaceRoot(): string | null {
    const folders = vscode.workspace.workspaceFolders;
    return folders?.[0]?.uri.fsPath ?? null;
}

export function getFreelaPaths(projectPath: string): FreelaPaths {
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
