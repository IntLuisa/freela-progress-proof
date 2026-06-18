import * as path from 'path';
import * as fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';

import { FreelaPaths, Fase } from '../types/freela';
import { carregarOrcamento } from './orcamentoService';
import { writeTextFile, openExternalFile } from '../utils/files';
import { gerarPdfPorHtml } from '../utils/pdf';
import { br, escapeHtml, hojeBR } from '../utils/format';

const execFileAsync = promisify(execFile);

type RelatorioDiarioDados = {
    clienteNome: string;
    prestadorNome: string;
    faseId: string;
    subfaseId: string;
    statusAndamento: string;
    resumoFeito: string;
    proximasTarefas: string;
    bloqueios: string;
};

type RelatorioFaseDados = {
    clienteNome: string;
    prestadorNome: string;
    faseId: string;
    entregaveisConcluidos: Array<{ id: string; nome: string }>;
    resumoFeito: string;
    pendencias: string;
    horaExtra: string;
    despesaExtra: string;
};

type RelatorioCompletoDados = {
    clienteNome: string;
    prestadorNome: string;
    statusGeral: string;
    resumoProjeto: string;
    entregaveisConcluidosTexto: string;
    horaExtra: string;
    observacoesFinais: string;
};

async function git(paths: FreelaPaths, args: string[]): Promise<string> {
    try {
        const { stdout } = await execFileAsync('git', args, {
            cwd: paths.projectPath
        });

        return stdout.trim();
    } catch {
        return '';
    }
}

function hojeSlug(): string {
    return new Date().toISOString().slice(0, 10);
}

function slug(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'relatorio';
}

function statusLabel(value: string): string {
    const labels: Record<string, string> = {
        nao_iniciado: 'Não iniciado',
        em_andamento: 'Em andamento',
        aguardando_cliente: 'Aguardando cliente',
        concluido: 'Concluído',
        pausado: 'Pausado'
    };

    return labels[value] ?? value ?? '-';
}

function htmlBase(title: string, body: string): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
body {
    font-family: Arial, Helvetica, sans-serif;
    color: #202124;
    font-size: 13px;
    line-height: 1.55;
}
.page { padding: 34px; }
h1 {
    text-align: center;
    text-transform: uppercase;
    border-bottom: 3px solid #111827;
    padding-bottom: 12px;
}
h2 {
    margin-top: 24px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
}
pre {
    background: #f4f4f4;
    padding: 12px;
    white-space: pre-wrap;
    border: 1px solid #ddd;
}
.meta {
    background: #f8f8f8;
    border: 1px solid #ddd;
    padding: 12px;
}
</style>
</head>
<body>
<div class="page">
<h1>${escapeHtml(title)}</h1>
${body}
</div>
</body>
</html>`;
}

function procurarFase(fases: Fase[], faseId: string): Fase | undefined {
    return fases.find(fase => fase.id === faseId);
}

function procurarSubfaseNome(fases: Fase[], faseId: string, subfaseId: string): string {
    const fase = procurarFase(fases, faseId);
    const subfase = fase?.subfases.find(s => s.id === subfaseId);
    return subfase?.nome ?? '';
}

async function salvarArquivosRelatorio(
    paths: FreelaPaths,
    nomeArquivo: string,
    markdown: string,
    html: string
): Promise<void> {
    const mdPath = path.join(paths.relatoriosDir, `${nomeArquivo}.md`);
    const htmlPath = path.join(paths.relatoriosDir, `${nomeArquivo}.html`);
    const pdfPath = path.join(paths.relatoriosDir, `${nomeArquivo}.pdf`);

    writeTextFile(mdPath, markdown);
    writeTextFile(htmlPath, html);

    await gerarPdfPorHtml(htmlPath, pdfPath);
    await openExternalFile(pdfPath);
}

export async function gerarRelatorioDiarioComDados(
    paths: FreelaPaths,
    dados: RelatorioDiarioDados
): Promise<void> {
    const config = carregarOrcamento(paths);

    const fase = procurarFase(config.fases, dados.faseId);
    const subfaseNome = procurarSubfaseNome(config.fases, dados.faseId, dados.subfaseId);

    const commits = await git(paths, [
        'log',
        '--since=24 hours ago',
        '--pretty=format:- %s (%h)'
    ]);

    const status = await git(paths, ['status', '--short']);
    const diff = await git(paths, ['diff', '--stat']);

    const nomeArquivo = `${hojeSlug()}-relatorio-diario`;

    const markdown = `# Relatório Diário - ${hojeBR()}

**Cliente:** ${dados.clienteNome || config.cliente.nome || '-'}  
**Prestador:** ${dados.prestadorNome || config.prestador.nome || '-'}  
**Fase:** ${fase?.nome || '-'}  
**Subfase:** ${subfaseNome || '-'}  
**Status:** ${statusLabel(dados.statusAndamento)}

## Resumo do que foi feito

${dados.resumoFeito || '-'}

## Commits das últimas 24h

${commits || '- Nenhum commit encontrado.'}

## Arquivos alterados

\`\`\`
${status || 'Sem arquivos alterados.'}
\`\`\`

## Estatística das alterações

\`\`\`
${diff || 'Sem diff pendente.'}
\`\`\`

## Próximas tarefas

${dados.proximasTarefas || '-'}

## Bloqueios

${dados.bloqueios || '-'}
`;

    const html = htmlBase(`Relatório Diário - ${hojeBR()}`, `
<div class="meta">
<p><strong>Cliente:</strong> ${escapeHtml(dados.clienteNome || config.cliente.nome || '-')}</p>
<p><strong>Prestador:</strong> ${escapeHtml(dados.prestadorNome || config.prestador.nome || '-')}</p>
<p><strong>Fase:</strong> ${escapeHtml(fase?.nome || '-')}</p>
<p><strong>Subfase:</strong> ${escapeHtml(subfaseNome || '-')}</p>
<p><strong>Status:</strong> ${escapeHtml(statusLabel(dados.statusAndamento))}</p>
</div>

<h2>Resumo do que foi feito</h2>
<p>${br(dados.resumoFeito || '-')}</p>

<h2>Commits das últimas 24h</h2>
<pre>${escapeHtml(commits || 'Nenhum commit encontrado.')}</pre>

<h2>Arquivos alterados</h2>
<pre>${escapeHtml(status || 'Sem arquivos alterados.')}</pre>

<h2>Estatística das alterações</h2>
<pre>${escapeHtml(diff || 'Sem diff pendente.')}</pre>

<h2>Próximas tarefas</h2>
<p>${br(dados.proximasTarefas || '-')}</p>

<h2>Bloqueios</h2>
<p>${br(dados.bloqueios || '-')}</p>
`);

    await salvarArquivosRelatorio(paths, nomeArquivo, markdown, html);
}

export async function gerarRelatorioFaseComDados(
    paths: FreelaPaths,
    dados: RelatorioFaseDados
): Promise<void> {
    const config = carregarOrcamento(paths);
    const fase = procurarFase(config.fases, dados.faseId);

    const commits = await git(paths, ['log', '--pretty=format:- %s (%h)', '--', '.']);
    const status = await git(paths, ['status', '--short']);

    const previstos = fase?.subfases.map(s => `- ${s.nome}`).join('\\n') || '-';

    const concluidos = dados.entregaveisConcluidos.length
        ? dados.entregaveisConcluidos.map(s => `- ${s.nome}`).join('\\n')
        : '-';

    const nomeArquivo = `${hojeSlug()}-relatorio-fase-${slug(fase?.nome || 'fase')}`;

    const markdown = `# Relatório de Fase - ${fase?.nome || '-'}

**Data:** ${hojeBR()}  
**Cliente:** ${dados.clienteNome || config.cliente.nome || '-'}  
**Prestador:** ${dados.prestadorNome || config.prestador.nome || '-'}  

## Entregáveis previstos

${previstos}

## Entregáveis concluídos

${concluidos}

## Horas estimadas

${fase?.horasTotal || '-'}h

## Valor da fase

R$ ${fase?.valorTotal || '-'}

## Resumo do que foi feito

${dados.resumoFeito || '-'}

## Evidências do Git

### Commits

${commits || '- Nenhum commit encontrado.'}

### Arquivos alterados

\`\`\`
${status || 'Sem arquivos alterados.'}
\`\`\`

## Pendências

${dados.pendencias || '-'}

## Hora extra

${dados.horaExtra || '-'}

## Despesa extra

${dados.despesaExtra || '-'}
`;

    const html = htmlBase(`Relatório de Fase - ${fase?.nome || '-'}`, `
<div class="meta">
<p><strong>Data:</strong> ${hojeBR()}</p>
<p><strong>Cliente:</strong> ${escapeHtml(dados.clienteNome || config.cliente.nome || '-')}</p>
<p><strong>Prestador:</strong> ${escapeHtml(dados.prestadorNome || config.prestador.nome || '-')}</p>
</div>

<h2>Entregáveis previstos</h2>
<pre>${escapeHtml(previstos)}</pre>

<h2>Entregáveis concluídos</h2>
<pre>${escapeHtml(concluidos)}</pre>

<h2>Horas estimadas</h2>
<p>${escapeHtml(fase?.horasTotal || '-')}h</p>

<h2>Valor da fase</h2>
<p>R$ ${escapeHtml(fase?.valorTotal || '-')}</p>

<h2>Resumo do que foi feito</h2>
<p>${br(dados.resumoFeito || '-')}</p>

<h2>Evidências do Git</h2>
<h3>Commits</h3>
<pre>${escapeHtml(commits || 'Nenhum commit encontrado.')}</pre>
<h3>Arquivos alterados</h3>
<pre>${escapeHtml(status || 'Sem arquivos alterados.')}</pre>

<h2>Pendências</h2>
<p>${br(dados.pendencias || '-')}</p>

<h2>Hora extra</h2>
<p>${escapeHtml(dados.horaExtra || '-')}</p>

<h2>Despesa extra</h2>
<p>${escapeHtml(dados.despesaExtra || '-')}</p>
`);

    await salvarArquivosRelatorio(paths, nomeArquivo, markdown, html);
}

export async function gerarRelatorioCompletoComDados(
    paths: FreelaPaths,
    dados: RelatorioCompletoDados
): Promise<void> {
    const config = carregarOrcamento(paths);

    const relatorios = fs.existsSync(paths.relatoriosDir)
        ? fs.readdirSync(paths.relatoriosDir).filter(file => file.endsWith('.pdf')).sort()
        : [];

    const previstos = config.fases.map(fase => {
        const subs = fase.subfases.map(s => `  - ${s.nome}`).join('\\n');
        return `- ${fase.nome}\\n${subs}`;
    }).join('\\n') || '-';

    const concluidosPorStatus = config.fases.map(fase => {
        const subs = fase.subfases
            .filter(s => s.status === 'concluido')
            .map(s => `  - ${s.nome}`)
            .join('\\n');

        return subs ? `- ${fase.nome}\\n${subs}` : '';
    }).filter(Boolean).join('\\n') || '-';

    const concluidos = dados.entregaveisConcluidosTexto || concluidosPorStatus;

    const nomeArquivo = `${hojeSlug()}-relatorio-completo`;

    const markdown = `# Relatório Completo do Projeto

**Data:** ${hojeBR()}  
**Cliente:** ${dados.clienteNome || config.cliente.nome || '-'}  
**Prestador:** ${dados.prestadorNome || config.prestador.nome || '-'}  
**Status geral:** ${statusLabel(dados.statusGeral)}

## Resumo do projeto

${dados.resumoProjeto || config.descricaoProjeto || '-'}

## Entregáveis previstos

${previstos}

## Entregáveis concluídos

${concluidos}

## Horas previstas

${config.fases.reduce((acc, fase) => acc + (Number(fase.horasTotal) || 0), 0)}h

## Despesas extras

${config.despesasExtras.length
    ? config.despesasExtras.map(d => `- ${d.nome}: ${d.valor} — ${d.observacao}`).join('\\n')
    : '-'}

## Relatórios já gerados

${relatorios.length ? relatorios.map(r => `- ${r}`).join('\\n') : '-'}

## Hora extra

${dados.horaExtra || '-'}

## Observações finais

${dados.observacoesFinais || '-'}
`;

    const html = htmlBase('Relatório Completo do Projeto', `
<div class="meta">
<p><strong>Data:</strong> ${hojeBR()}</p>
<p><strong>Cliente:</strong> ${escapeHtml(dados.clienteNome || config.cliente.nome || '-')}</p>
<p><strong>Prestador:</strong> ${escapeHtml(dados.prestadorNome || config.prestador.nome || '-')}</p>
<p><strong>Status geral:</strong> ${escapeHtml(statusLabel(dados.statusGeral))}</p>
</div>

<h2>Resumo do projeto</h2>
<p>${br(dados.resumoProjeto || config.descricaoProjeto || '-')}</p>

<h2>Entregáveis previstos</h2>
<pre>${escapeHtml(previstos)}</pre>

<h2>Entregáveis concluídos</h2>
<pre>${escapeHtml(concluidos)}</pre>

<h2>Horas previstas</h2>
<p>${config.fases.reduce((acc, fase) => acc + (Number(fase.horasTotal) || 0), 0)}h</p>

<h2>Despesas extras</h2>
<pre>${escapeHtml(config.despesasExtras.length
    ? config.despesasExtras.map(d => `- ${d.nome}: ${d.valor} — ${d.observacao}`).join('\\n')
    : '-')}</pre>

<h2>Relatórios já gerados</h2>
<pre>${escapeHtml(relatorios.length ? relatorios.map(r => `- ${r}`).join('\\n') : '-')}</pre>

<h2>Hora extra</h2>
<p>${escapeHtml(dados.horaExtra || '-')}</p>

<h2>Observações finais</h2>
<p>${br(dados.observacoesFinais || '-')}</p>
`);

    await salvarArquivosRelatorio(paths, nomeArquivo, markdown, html);
}
