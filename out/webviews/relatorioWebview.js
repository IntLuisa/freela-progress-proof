"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abrirRelatorioWebview = abrirRelatorioWebview;
const vscode = require("vscode");
const orcamentoService_1 = require("../services/orcamentoService");
const relatorioService_1 = require("../services/relatorioService");
const format_1 = require("../utils/format");
function abrirRelatorioWebview(context, paths, tipo) {
    const config = (0, orcamentoService_1.carregarOrcamento)(paths);
    const panel = vscode.window.createWebviewPanel(`freelaRelatorio${tipo}`, tipo === 'diario'
        ? 'Relatório Diário'
        : tipo === 'fase'
            ? 'Relatório de Fase'
            : 'Relatório Completo', vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
    panel.webview.html = getHtml(tipo, config);
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command !== 'salvar')
            return;
        if (tipo === 'diario') {
            await (0, relatorioService_1.gerarRelatorioDiarioComDados)(paths, message.data);
        }
        if (tipo === 'fase') {
            await (0, relatorioService_1.gerarRelatorioFaseComDados)(paths, message.data);
        }
        if (tipo === 'completo') {
            await (0, relatorioService_1.gerarRelatorioCompletoComDados)(paths, message.data);
        }
        vscode.window.showInformationMessage('Relatório gerado em .md, .html e .pdf.');
        panel.dispose();
    });
}
function getHtml(tipo, config) {
    const fasesOptions = config.fases.map((fase) => {
        return `<option value="${(0, format_1.escapeAttr)(fase.id)}">${(0, format_1.escapeHtml)(fase.nome)}</option>`;
    }).join('');
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
body {
    font-family: var(--vscode-font-family);
    color: var(--vscode-foreground);
    background: var(--vscode-editor-background);
    padding: 20px;
}
input, textarea, select {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 12px;
    padding: 8px;
    color: var(--vscode-input-foreground);
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
}
textarea { min-height: 90px; }
label { font-weight: bold; display: block; margin-bottom: 4px; }
button {
    padding: 10px 14px;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    font-weight: bold;
}
.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}
.card {
    border: 1px solid var(--vscode-panel-border);
    padding: 14px;
    margin-bottom: 14px;
    border-radius: 8px;
    background: rgba(127,127,127,.08);
}
.main {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    margin-top: 20px;
}
</style>
</head>
<body>
<h1>${tipo === 'diario' ? '🚀 Relatório Diário' : tipo === 'fase' ? '🗓️ Relatório de Fase' : '📊 Relatório Completo'}</h1>

<div class="card">
    <h2>Dados principais</h2>
    <div class="row">
        <div>
            <label>Cliente</label>
            <input id="clienteNome" value="${(0, format_1.escapeAttr)(config.cliente.nome)}">
        </div>
        <div>
            <label>Prestador</label>
            <input id="prestadorNome" value="${(0, format_1.escapeAttr)(config.prestador.nome)}">
        </div>
    </div>
</div>

${tipo === 'diario' ? `
<div class="card">
    <h2>Andamento do dia</h2>

    <label>Fase relacionada</label>
    <select id="faseId" onchange="carregarSubfases()">
        <option value="">Sem fase específica</option>
        ${fasesOptions}
    </select>

    <label>Subfase relacionada</label>
    <select id="subfaseId">
        <option value="">Sem subfase específica</option>
    </select>

    <label>Status de andamento</label>
    <select id="statusAndamento">
        <option value="nao_iniciado">Não iniciado</option>
        <option value="em_andamento">Em andamento</option>
        <option value="aguardando_cliente">Aguardando cliente</option>
        <option value="concluido">Concluído</option>
        <option value="pausado">Pausado</option>
    </select>

    <label>Resumo do que foi feito</label>
    <textarea id="resumoFeito"></textarea>

    <label>Próximas tarefas</label>
    <textarea id="proximasTarefas"></textarea>

    <label>Bloqueios</label>
    <textarea id="bloqueios"></textarea>
</div>
` : ''}

${tipo === 'fase' ? `
<div class="card">
    <h2>Relatório da fase</h2>

    <label>Fase</label>
    <select id="faseId" onchange="carregarSubfasesChecklist()">
        ${fasesOptions}
    </select>

    <label>Entregáveis concluídos</label>
    <div id="subfasesChecklist"></div>

    <label>Resumo do que foi feito</label>
    <textarea id="resumoFeito"></textarea>

    <label>Pendências</label>
    <textarea id="pendencias"></textarea>

    <div class="row">
        <div>
            <label>Hora extra</label>
            <input id="horaExtra" placeholder="Ex: 3h">
        </div>
        <div>
            <label>Despesa extra</label>
            <input id="despesaExtra" placeholder="Ex: API R$ 50,00">
        </div>
    </div>
</div>
` : ''}

${tipo === 'completo' ? `
<div class="card">
    <h2>Resumo completo</h2>

    <label>Status geral</label>
    <select id="statusGeral">
        <option value="nao_iniciado">Não iniciado</option>
        <option value="em_andamento">Em andamento</option>
        <option value="aguardando_cliente">Aguardando cliente</option>
        <option value="concluido">Concluído</option>
        <option value="pausado">Pausado</option>
    </select>

    <label>Resumo geral do projeto</label>
    <textarea id="resumoProjeto">${(0, format_1.escapeHtml)(config.descricaoProjeto || '')}</textarea>

    <label>Entregáveis concluídos / observações</label>
    <textarea id="entregaveisConcluidosTexto"></textarea>

    <label>Hora extra</label>
    <input id="horaExtra" placeholder="Ex: 5h">

    <label>Observações finais</label>
    <textarea id="observacoesFinais"></textarea>
</div>
` : ''}

<button class="main" onclick="salvar()">Gerar relatório .MD + .HTML + .PDF</button>

<script>
const vscode = acquireVsCodeApi();
const tipo = ${JSON.stringify(tipo)};
const fases = ${JSON.stringify(config.fases)};

function campo(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function carregarSubfases() {
    const faseId = campo('faseId');
    const select = document.getElementById('subfaseId');
    if (!select) return;

    const fase = fases.find(f => f.id === faseId);
    select.innerHTML = '<option value="">Sem subfase específica</option>';

    if (!fase) return;

    fase.subfases.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.nome;
        select.appendChild(opt);
    });
}

function carregarSubfasesChecklist() {
    const faseId = campo('faseId');
    const container = document.getElementById('subfasesChecklist');
    if (!container) return;

    const fase = fases.find(f => f.id === faseId);
    container.innerHTML = '';

    if (!fase) return;

    fase.subfases.forEach(s => {
        const label = document.createElement('label');
        label.style.fontWeight = 'normal';
        label.innerHTML =
            '<input type="checkbox" class="subfaseConcluida" value="' +
            s.id +
            '" data-nome="' +
            String(s.nome).replace(/"/g, '&quot;') +
            '"> ' +
            s.nome;

        container.appendChild(label);
    });
}

function subfasesConcluidas() {
    return Array.from(document.querySelectorAll('.subfaseConcluida:checked')).map(el => ({
        id: el.value,
        nome: el.dataset.nome
    }));
}

function salvar() {
    let data = {
        clienteNome: campo('clienteNome'),
        prestadorNome: campo('prestadorNome')
    };

    if (tipo === 'diario') {
        data = {
            ...data,
            faseId: campo('faseId'),
            subfaseId: campo('subfaseId'),
            statusAndamento: campo('statusAndamento'),
            resumoFeito: campo('resumoFeito'),
            proximasTarefas: campo('proximasTarefas'),
            bloqueios: campo('bloqueios')
        };
    }

    if (tipo === 'fase') {
        data = {
            ...data,
            faseId: campo('faseId'),
            entregaveisConcluidos: subfasesConcluidas(),
            resumoFeito: campo('resumoFeito'),
            pendencias: campo('pendencias'),
            horaExtra: campo('horaExtra'),
            despesaExtra: campo('despesaExtra')
        };
    }

    if (tipo === 'completo') {
        data = {
            ...data,
            statusGeral: campo('statusGeral'),
            resumoProjeto: campo('resumoProjeto'),
            entregaveisConcluidosTexto: campo('entregaveisConcluidosTexto'),
            horaExtra: campo('horaExtra'),
            observacoesFinais: campo('observacoesFinais')
        };
    }

    vscode.postMessage({
        command: 'salvar',
        data
    });
}

carregarSubfases();
carregarSubfasesChecklist();
</script>
</body>
</html>`;
}
//# sourceMappingURL=relatorioWebview.js.map