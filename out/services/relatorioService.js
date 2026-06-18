"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarRelatorioDiarioComDados = gerarRelatorioDiarioComDados;
exports.gerarRelatorioFaseComDados = gerarRelatorioFaseComDados;
exports.gerarRelatorioCompletoComDados = gerarRelatorioCompletoComDados;
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
const util_1 = require("util");
const orcamentoService_1 = require("./orcamentoService");
const files_1 = require("../utils/files");
const pdf_1 = require("../utils/pdf");
const format_1 = require("../utils/format");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
async function git(paths, args) {
    try {
        const { stdout } = await execFileAsync('git', args, {
            cwd: paths.projectPath
        });
        return stdout.trim();
    }
    catch {
        return '';
    }
}
function hojeSlug() {
    return new Date().toISOString().slice(0, 10);
}
function slug(value) {
    return value
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'relatorio';
}
function statusLabel(value) {
    const labels = {
        nao_iniciado: 'Não iniciado',
        em_andamento: 'Em andamento',
        aguardando_cliente: 'Aguardando cliente',
        concluido: 'Concluído',
        pausado: 'Pausado'
    };
    return labels[value] ?? value ?? '-';
}
function htmlBase(title, body) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${(0, format_1.escapeHtml)(title)}</title>
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
<h1>${(0, format_1.escapeHtml)(title)}</h1>
${body}
</div>
</body>
</html>`;
}
function procurarFase(fases, faseId) {
    return fases.find(fase => fase.id === faseId);
}
function procurarSubfaseNome(fases, faseId, subfaseId) {
    const fase = procurarFase(fases, faseId);
    const subfase = fase?.subfases.find(s => s.id === subfaseId);
    return subfase?.nome ?? '';
}
async function salvarArquivosRelatorio(paths, nomeArquivo, markdown, html) {
    const mdPath = path.join(paths.relatoriosDir, `${nomeArquivo}.md`);
    const htmlPath = path.join(paths.relatoriosDir, `${nomeArquivo}.html`);
    const pdfPath = path.join(paths.relatoriosDir, `${nomeArquivo}.pdf`);
    (0, files_1.writeTextFile)(mdPath, markdown);
    (0, files_1.writeTextFile)(htmlPath, html);
    await (0, pdf_1.gerarPdfPorHtml)(htmlPath, pdfPath);
    await (0, files_1.openExternalFile)(pdfPath);
}
async function gerarRelatorioDiarioComDados(paths, dados) {
    const config = (0, orcamentoService_1.carregarOrcamento)(paths);
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
    const markdown = `# Relatório Diário - ${(0, format_1.hojeBR)()}

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
    const html = htmlBase(`Relatório Diário - ${(0, format_1.hojeBR)()}`, `
<div class="meta">
<p><strong>Cliente:</strong> ${(0, format_1.escapeHtml)(dados.clienteNome || config.cliente.nome || '-')}</p>
<p><strong>Prestador:</strong> ${(0, format_1.escapeHtml)(dados.prestadorNome || config.prestador.nome || '-')}</p>
<p><strong>Fase:</strong> ${(0, format_1.escapeHtml)(fase?.nome || '-')}</p>
<p><strong>Subfase:</strong> ${(0, format_1.escapeHtml)(subfaseNome || '-')}</p>
<p><strong>Status:</strong> ${(0, format_1.escapeHtml)(statusLabel(dados.statusAndamento))}</p>
</div>

<h2>Resumo do que foi feito</h2>
<p>${(0, format_1.br)(dados.resumoFeito || '-')}</p>

<h2>Commits das últimas 24h</h2>
<pre>${(0, format_1.escapeHtml)(commits || 'Nenhum commit encontrado.')}</pre>

<h2>Arquivos alterados</h2>
<pre>${(0, format_1.escapeHtml)(status || 'Sem arquivos alterados.')}</pre>

<h2>Estatística das alterações</h2>
<pre>${(0, format_1.escapeHtml)(diff || 'Sem diff pendente.')}</pre>

<h2>Próximas tarefas</h2>
<p>${(0, format_1.br)(dados.proximasTarefas || '-')}</p>

<h2>Bloqueios</h2>
<p>${(0, format_1.br)(dados.bloqueios || '-')}</p>
`);
    await salvarArquivosRelatorio(paths, nomeArquivo, markdown, html);
}
async function gerarRelatorioFaseComDados(paths, dados) {
    const config = (0, orcamentoService_1.carregarOrcamento)(paths);
    const fase = procurarFase(config.fases, dados.faseId);
    const commits = await git(paths, ['log', '--pretty=format:- %s (%h)', '--', '.']);
    const status = await git(paths, ['status', '--short']);
    const previstos = fase?.subfases.map(s => `- ${s.nome}`).join('\\n') || '-';
    const concluidos = dados.entregaveisConcluidos.length
        ? dados.entregaveisConcluidos.map(s => `- ${s.nome}`).join('\\n')
        : '-';
    const nomeArquivo = `${hojeSlug()}-relatorio-fase-${slug(fase?.nome || 'fase')}`;
    const markdown = `# Relatório de Fase - ${fase?.nome || '-'}

**Data:** ${(0, format_1.hojeBR)()}  
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
<p><strong>Data:</strong> ${(0, format_1.hojeBR)()}</p>
<p><strong>Cliente:</strong> ${(0, format_1.escapeHtml)(dados.clienteNome || config.cliente.nome || '-')}</p>
<p><strong>Prestador:</strong> ${(0, format_1.escapeHtml)(dados.prestadorNome || config.prestador.nome || '-')}</p>
</div>

<h2>Entregáveis previstos</h2>
<pre>${(0, format_1.escapeHtml)(previstos)}</pre>

<h2>Entregáveis concluídos</h2>
<pre>${(0, format_1.escapeHtml)(concluidos)}</pre>

<h2>Horas estimadas</h2>
<p>${(0, format_1.escapeHtml)(fase?.horasTotal || '-')}h</p>

<h2>Valor da fase</h2>
<p>R$ ${(0, format_1.escapeHtml)(fase?.valorTotal || '-')}</p>

<h2>Resumo do que foi feito</h2>
<p>${(0, format_1.br)(dados.resumoFeito || '-')}</p>

<h2>Evidências do Git</h2>
<h3>Commits</h3>
<pre>${(0, format_1.escapeHtml)(commits || 'Nenhum commit encontrado.')}</pre>
<h3>Arquivos alterados</h3>
<pre>${(0, format_1.escapeHtml)(status || 'Sem arquivos alterados.')}</pre>

<h2>Pendências</h2>
<p>${(0, format_1.br)(dados.pendencias || '-')}</p>

<h2>Hora extra</h2>
<p>${(0, format_1.escapeHtml)(dados.horaExtra || '-')}</p>

<h2>Despesa extra</h2>
<p>${(0, format_1.escapeHtml)(dados.despesaExtra || '-')}</p>
`);
    await salvarArquivosRelatorio(paths, nomeArquivo, markdown, html);
}
async function gerarRelatorioCompletoComDados(paths, dados) {
    const config = (0, orcamentoService_1.carregarOrcamento)(paths);
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

**Data:** ${(0, format_1.hojeBR)()}  
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
<p><strong>Data:</strong> ${(0, format_1.hojeBR)()}</p>
<p><strong>Cliente:</strong> ${(0, format_1.escapeHtml)(dados.clienteNome || config.cliente.nome || '-')}</p>
<p><strong>Prestador:</strong> ${(0, format_1.escapeHtml)(dados.prestadorNome || config.prestador.nome || '-')}</p>
<p><strong>Status geral:</strong> ${(0, format_1.escapeHtml)(statusLabel(dados.statusGeral))}</p>
</div>

<h2>Resumo do projeto</h2>
<p>${(0, format_1.br)(dados.resumoProjeto || config.descricaoProjeto || '-')}</p>

<h2>Entregáveis previstos</h2>
<pre>${(0, format_1.escapeHtml)(previstos)}</pre>

<h2>Entregáveis concluídos</h2>
<pre>${(0, format_1.escapeHtml)(concluidos)}</pre>

<h2>Horas previstas</h2>
<p>${config.fases.reduce((acc, fase) => acc + (Number(fase.horasTotal) || 0), 0)}h</p>

<h2>Despesas extras</h2>
<pre>${(0, format_1.escapeHtml)(config.despesasExtras.length
        ? config.despesasExtras.map(d => `- ${d.nome}: ${d.valor} — ${d.observacao}`).join('\\n')
        : '-')}</pre>

<h2>Relatórios já gerados</h2>
<pre>${(0, format_1.escapeHtml)(relatorios.length ? relatorios.map(r => `- ${r}`).join('\\n') : '-')}</pre>

<h2>Hora extra</h2>
<p>${(0, format_1.escapeHtml)(dados.horaExtra || '-')}</p>

<h2>Observações finais</h2>
<p>${(0, format_1.br)(dados.observacoesFinais || '-')}</p>
`);
    await salvarArquivosRelatorio(paths, nomeArquivo, markdown, html);
}
//# sourceMappingURL=relatorioService.js.map