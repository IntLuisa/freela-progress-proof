import * as vscode from 'vscode';

import { getWorkspaceRoot, getFreelaPaths } from './utils/paths';
import { ensureDir } from './utils/files';
import { abrirOrcamentoWebview } from './webviews/orcamentoWebview';
import { abrirRelatorioWebview } from './webviews/relatorioWebview';

export function activate(context: vscode.ExtensionContext) {
    console.log('Freela Progress Proof ativo.');

    const disposable = vscode.commands.registerCommand(
        'freela-tracker.menuPrincipal',
        async () => {
            const workspaceRoot = getWorkspaceRoot();

            if (!workspaceRoot) {
                vscode.window.showErrorMessage(
                    'Abra a pasta do projeto do cliente antes de usar a extensão.'
                );
                return;
            }

            const paths = getFreelaPaths(workspaceRoot);

            ensureDir(paths.freelaDir);
            ensureDir(paths.relatoriosDir);

            const opcao = await vscode.window.showQuickPick(
                [
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
                ],
                {
                    placeHolder: 'O que você deseja fazer?'
                }
            );

            if (!opcao) return;

            if (opcao.action === 'orcamento') {
                abrirOrcamentoWebview(context, paths);
                return;
            }

            if (opcao.action === 'relatorio_diario') {
                abrirRelatorioWebview(context, paths, 'diario');
                return;
            }

            if (opcao.action === 'relatorio_fase') {
                abrirRelatorioWebview(context, paths, 'fase');
                return;
            }

            if (opcao.action === 'relatorio_completo') {
                abrirRelatorioWebview(context, paths, 'completo');
                return;
            }

            if (opcao.action === 'abrir_pasta') {
                await vscode.commands.executeCommand(
                    'vscode.openFolder',
                    vscode.Uri.file(paths.freelaDir),
                    true
                );
                return;
            }

            vscode.window.showInformationMessage(
                `Ação ainda será implementada: ${opcao.label}`
            );
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
