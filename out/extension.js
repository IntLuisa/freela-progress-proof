"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const paths_1 = require("./utils/paths");
const files_1 = require("./utils/files");
const orcamentoWebview_1 = require("./webviews/orcamentoWebview");
const relatorioWebview_1 = require("./webviews/relatorioWebview");
function activate(context) {
    console.log('Freela Progress Proof ativo.');
    const disposable = vscode.commands.registerCommand('freela-tracker.menuPrincipal', async () => {
        const workspaceRoot = (0, paths_1.getWorkspaceRoot)();
        if (!workspaceRoot) {
            vscode.window.showErrorMessage('Abra a pasta do projeto do cliente antes de usar a extensão.');
            return;
        }
        const paths = (0, paths_1.getFreelaPaths)(workspaceRoot);
        (0, files_1.ensureDir)(paths.freelaDir);
        (0, files_1.ensureDir)(paths.relatoriosDir);
        const opcao = await vscode.window.showQuickPick([
            {
                label: '📋 Gerar / Editar Orçamento',
                action: 'orcamento',
                description: 'Criar orçamento em .md, .html e .pdf'
            },
            {
                label: '🚀 Relatório Diário',
                action: 'relatorio_diario',
                description: 'Registrar evolução do dia usando Git'
            },
            {
                label: '🗓️ Relatório de Fase',
                action: 'relatorio_fase',
                description: 'Registrar avanço de uma fase específica'
            },
            {
                label: '📊 Relatório Completo',
                action: 'relatorio_completo',
                description: 'Consolidar andamento geral do projeto'
            },
            {
                label: '📂 Abrir Pasta .freela',
                action: 'abrir_pasta',
                description: 'Abrir arquivos gerados da extensão'
            }
        ], {
            placeHolder: 'O que você deseja fazer?'
        });
        if (!opcao)
            return;
        if (opcao.action === 'orcamento') {
            (0, orcamentoWebview_1.abrirOrcamentoWebview)(context, paths);
            return;
        }
        if (opcao.action === 'relatorio_diario') {
            (0, relatorioWebview_1.abrirRelatorioWebview)(context, paths, 'diario');
            return;
        }
        if (opcao.action === 'relatorio_fase') {
            (0, relatorioWebview_1.abrirRelatorioWebview)(context, paths, 'fase');
            return;
        }
        if (opcao.action === 'relatorio_completo') {
            (0, relatorioWebview_1.abrirRelatorioWebview)(context, paths, 'completo');
            return;
        }
        if (opcao.action === 'abrir_pasta') {
            await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(paths.freelaDir), true);
            return;
        }
        vscode.window.showInformationMessage(`Ação ainda será implementada: ${opcao.label}`);
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map