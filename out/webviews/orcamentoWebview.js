"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abrirOrcamentoWebview = abrirOrcamentoWebview;
const vscode = require("vscode");
const orcamentoService_1 = require("../services/orcamentoService");
const format_1 = require("../utils/format");
function abrirOrcamentoWebview(context, paths) {
    const dados = (0, orcamentoService_1.carregarOrcamento)(paths);
    const panel = vscode.window.createWebviewPanel('freelaOrcamento', 'Orçamento Freelancer', vscode.ViewColumn.One, { enableScripts: true, retainContextWhenHidden: true });
    panel.webview.html = getHtml(dados);
    panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command !== 'salvar')
            return;
        await (0, orcamentoService_1.salvarOrcamento)(paths, message.data);
        vscode.window.showInformationMessage('Orçamento salvo em .freela/config.json, .md e .html.');
        panel.dispose();
    });
}
function getHtml(d) {
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
textarea { min-height: 70px; }
label { font-weight: bold; display: block; margin-bottom: 4px; }
button {
    padding: 9px 13px;
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
.subfase {
    border-left: 3px solid var(--vscode-button-background);
    padding-left: 10px;
    margin-bottom: 10px;
}
.danger { background: #b91c1c; color: white; }
.success { background: #15803d; color: white; }
.main { width: 100%; padding: 14px; font-size: 16px; margin-top: 20px; }
</style>
</head>
<body>
<h1>📋 Orçamento Freelancer</h1>

<h2>1. Dados do Prestador</h2>
<div class="row">
    <div><label>Nome</label><input id="prestadorNome" value="${(0, format_1.escapeAttr)(d.prestador.nome)}"></div>
    <div><label>CPF/CNPJ</label><input id="prestadorDocumento" value="${(0, format_1.escapeAttr)(d.prestador.documento)}"></div>
</div>
<div class="row">
    <div><label>E-mail</label><input id="prestadorEmail" value="${(0, format_1.escapeAttr)(d.prestador.email)}"></div>
    <div><label>Telefone</label><input id="prestadorTelefone" value="${(0, format_1.escapeAttr)(d.prestador.telefone)}"></div>
</div>

<h2>2. Dados do Cliente</h2>
<div class="row">
    <div><label>Nome</label><input id="clienteNome" value="${(0, format_1.escapeAttr)(d.cliente.nome)}"></div>
    <div><label>CPF/CNPJ</label><input id="clienteDocumento" value="${(0, format_1.escapeAttr)(d.cliente.documento)}"></div>
</div>
<div class="row">
    <div><label>E-mail</label><input id="clienteEmail" value="${(0, format_1.escapeAttr)(d.cliente.email)}"></div>
    <div><label>Telefone</label><input id="clienteTelefone" value="${(0, format_1.escapeAttr)(d.cliente.telefone)}"></div>
</div>

<h2>3. Projeto</h2>
<label>Nome do projeto</label>
<input id="projetoNome" value="${(0, format_1.escapeAttr)(d.projetoNome)}">

<label>Descrição do projeto</label>
<textarea id="descricaoProjeto">${(0, format_1.escapeHtml)(d.descricaoProjeto)}</textarea>

<label>Escopo do projeto</label>
<textarea id="escopoProjeto">${(0, format_1.escapeHtml)(d.escopoProjeto)}</textarea>

<label>Premissas / itens que o cliente vai disponibilizar</label>
<textarea id="premissasCliente">${(0, format_1.escapeHtml)(d.premissasCliente)}</textarea>

<h2>4. Metodologia de Trabalho</h2>
<textarea id="metodologiaTrabalho">${(0, format_1.escapeHtml)(d.metodologiaTrabalho)}</textarea>

<h2>5. Fases e Subfases</h2>
<div id="fases"></div>
<button onclick="adicionarFase()">+ Adicionar fase</button>

<h2>6. Revisão, suporte e garantias</h2>
<label>Revisão de projeto</label>
<textarea id="revisaoProjeto">${(0, format_1.escapeHtml)(d.revisaoProjeto)}</textarea>

<label>Suporte após entrega</label>
<textarea id="suporteAposEntrega">${(0, format_1.escapeHtml)(d.suporteAposEntrega)}</textarea>

<label>Garantias e observações</label>
<textarea id="garantiasObservacoes">${(0, format_1.escapeHtml)(d.garantiasObservacoes)}</textarea>

<h2>7. Financeiro</h2>
<label>Valor/hora padrão</label>
<input id="valorHoraPadrao" value="${(0, format_1.escapeAttr)(d.valorHoraPadrao)}">

<div class="row">
    <div>
        <label>Forma de pagamento</label>
        <select id="formaPagamento">
            <option value="pix">Pix</option>
            <option value="boleto">Boleto bancário</option>
            <option value="cartao_credito">Cartão de crédito</option>
            <option value="transferencia">Transferência</option>
            <option value="personalizado">Personalizado</option>
        </select>
    </div>
    <div>
        <label>Desconto</label>
        <input id="descontoValor" value="${(0, format_1.escapeAttr)(d.condicoesFinanceiras.descontoValor)}" placeholder="Ex: 10% ou 300,00">
    </div>
</div>

<label>Parcelamento</label>
<textarea id="parcelamento">${(0, format_1.escapeHtml)(d.condicoesFinanceiras.parcelamento)}</textarea>

<label>Regra personalizada de pagamento</label>
<textarea id="regraPagamentoPersonalizada">${(0, format_1.escapeHtml)(d.condicoesFinanceiras.regraPagamentoPersonalizada)}</textarea>

<label>Regra sobre envio do código-fonte</label>
<input id="percentualCodigoFonte" value="${(0, format_1.escapeAttr)(d.condicoesFinanceiras.percentualCodigoFonte)}" placeholder="Ex: código-fonte enviado após 100% do pagamento">

<label>Observações financeiras</label>
<textarea id="observacoesFinanceiras">${(0, format_1.escapeHtml)(d.condicoesFinanceiras.observacoesFinanceiras)}</textarea>

<h2>8. Despesas Extras</h2>
<div id="despesas"></div>
<button onclick="adicionarDespesa()">+ Adicionar despesa</button>

<button class="main success" onclick="salvar()">Salvar e gerar documentos</button>

<script>
const vscode = acquireVsCodeApi();

const dadosIniciais = ${JSON.stringify(d)};

function id() {
    return Date.now().toString() + Math.random().toString(36).slice(2);
}

function campo(id) {
    return document.getElementById(id).value.trim();
}

function adicionarFase(fase = null) {
    const container = document.getElementById('fases');
    const faseId = fase?.id || id();

    const div = document.createElement('div');
    div.className = 'card fase';
    div.dataset.id = faseId;

    div.innerHTML = \`
        <button class="danger" onclick="this.closest('.fase').remove()">Remover fase</button>

        <label>Nome da fase</label>
        <input class="faseNome" value="\${fase?.nome || ''}">

        <label>Dificuldade</label>
        <select class="faseDificuldade">
            <option value="facil">Fácil / rotina / IA ajuda</option>
            <option value="media">Média / padrão</option>
            <option value="dificil">Difícil / exige atenção</option>
            <option value="pesquisa">Pesquisa / nunca fiz antes</option>
        </select>

        <label>Status</label>
        <select class="faseStatus">
            <option value="nao_iniciado">Não iniciado</option>
            <option value="em_andamento">Em andamento</option>
            <option value="aguardando_cliente">Aguardando cliente</option>
            <option value="concluido">Concluído</option>
            <option value="pausado">Pausado</option>
        </select>

        <h3>Subfases</h3>
        <div class="subfases"></div>
        <button onclick="adicionarSubfase(this.closest('.fase'))">+ Adicionar subfase</button>
    \`;

    container.appendChild(div);

    div.querySelector('.faseDificuldade').value = fase?.dificuldade || 'media';
    div.querySelector('.faseStatus').value = fase?.status || 'nao_iniciado';

    if (fase?.subfases?.length) {
        fase.subfases.forEach(s => adicionarSubfase(div, s));
    } else {
        adicionarSubfase(div);
    }
}

function adicionarSubfase(faseEl, subfase = null) {
    const container = faseEl.querySelector('.subfases');

    const div = document.createElement('div');
    div.className = 'subfase';
    div.dataset.id = subfase?.id || id();

    div.innerHTML = \`
        <button class="danger" onclick="this.closest('.subfase').remove()">Remover subfase</button>
        <label>Nome da subfase</label>
        <input class="subfaseNome" value="\${subfase?.nome || ''}" placeholder="Ex: Login, validação, recuperação de senha">

        <div class="row">
            <div>
                <label>Horas da subfase</label>
                <input class="subfaseHoras" value="\${subfase?.horas || ''}" placeholder="Ex: 8">
            </div>
            <div>
                <label>Valor da subfase</label>
                <input class="subfaseValor" value="\${subfase?.valor || ''}" placeholder="Ex: 600,00">
            </div>
        </div>

        <label>Status</label>
        <select class="subfaseStatus">
            <option value="nao_iniciado">Não iniciado</option>
            <option value="em_andamento">Em andamento</option>
            <option value="aguardando_cliente">Aguardando cliente</option>
            <option value="concluido">Concluído</option>
            <option value="pausado">Pausado</option>
        </select>
    \`;

    container.appendChild(div);
    div.querySelector('.subfaseStatus').value = subfase?.status || 'nao_iniciado';
}

function adicionarDespesa(despesa = null) {
    const container = document.getElementById('despesas');

    const div = document.createElement('div');
    div.className = 'card despesa';
    div.dataset.id = despesa?.id || id();

    div.innerHTML = \`
        <button class="danger" onclick="this.closest('.despesa').remove()">Remover despesa</button>
        <div class="row">
            <div>
                <label>Nome da despesa</label>
                <input class="despesaNome" value="\${despesa?.nome || ''}">
            </div>
            <div>
                <label>Valor</label>
                <input class="despesaValor" value="\${despesa?.valor || ''}">
            </div>
        </div>
        <label>Observação</label>
        <input class="despesaObservacao" value="\${despesa?.observacao || ''}">
    \`;

    container.appendChild(div);
}

function coletarFases() {
    return Array.from(document.querySelectorAll('.fase')).map(fase => {
        const subfases = Array.from(fase.querySelectorAll('.subfase')).map(sub => ({
            id: sub.dataset.id,
            nome: sub.querySelector('.subfaseNome').value.trim(),
            horas: sub.querySelector('.subfaseHoras').value.trim(),
            valor: sub.querySelector('.subfaseValor').value.trim(),
            status: sub.querySelector('.subfaseStatus').value
        })).filter(s => s.nome || s.horas || s.valor);

        const horasTotal = subfases.reduce((acc, s) => acc + (Number(String(s.horas).replace(',', '.')) || 0), 0);
        const valorTotal = subfases.reduce((acc, s) => {
            const n = Number(String(s.valor).replace(/\\./g, '').replace(',', '.').replace(/[^\\d.]/g, '')) || 0;
            return acc + n;
        }, 0);

        return {
            id: fase.dataset.id,
            nome: fase.querySelector('.faseNome').value.trim(),
            dificuldade: fase.querySelector('.faseDificuldade').value,
            status: fase.querySelector('.faseStatus').value,
            subfases,
            horasTotal: String(horasTotal),
            valorTotal: valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        };
    }).filter(f => f.nome || f.subfases.length);
}

function coletarDespesas() {
    return Array.from(document.querySelectorAll('.despesa')).map(d => ({
        id: d.dataset.id,
        nome: d.querySelector('.despesaNome').value.trim(),
        valor: d.querySelector('.despesaValor').value.trim(),
        observacao: d.querySelector('.despesaObservacao').value.trim()
    })).filter(d => d.nome || d.valor || d.observacao);
}

function salvar() {
    const data = {
        prestador: {
            nome: campo('prestadorNome'),
            documento: campo('prestadorDocumento'),
            email: campo('prestadorEmail'),
            telefone: campo('prestadorTelefone')
        },
        cliente: {
            nome: campo('clienteNome'),
            documento: campo('clienteDocumento'),
            email: campo('clienteEmail'),
            telefone: campo('clienteTelefone')
        },
        projetoNome: campo('projetoNome'),
        descricaoProjeto: campo('descricaoProjeto'),
        escopoProjeto: campo('escopoProjeto'),
        premissasCliente: campo('premissasCliente'),
        metodologiaTrabalho: campo('metodologiaTrabalho'),
        revisaoProjeto: campo('revisaoProjeto'),
        suporteAposEntrega: campo('suporteAposEntrega'),
        garantiasObservacoes: campo('garantiasObservacoes'),
        valorHoraPadrao: campo('valorHoraPadrao'),
        condicoesFinanceiras: {
            formaPagamento: campo('formaPagamento'),
            regraPagamentoPersonalizada: campo('regraPagamentoPersonalizada'),
            parcelamento: campo('parcelamento'),
            descontoTipo: 'valor_fixo',
            descontoValor: campo('descontoValor'),
            percentualCodigoFonte: campo('percentualCodigoFonte'),
            observacoesFinanceiras: campo('observacoesFinanceiras')
        },
        fases: coletarFases(),
        despesasExtras: coletarDespesas()
    };

    vscode.postMessage({
        command: 'salvar',
        data
    });
}

document.getElementById('formaPagamento').value = dadosIniciais.condicoesFinanceiras.formaPagamento || 'pix';

if (dadosIniciais.fases.length) {
    dadosIniciais.fases.forEach(f => adicionarFase(f));
} else {
    adicionarFase();
}

if (dadosIniciais.despesasExtras.length) {
    dadosIniciais.despesasExtras.forEach(d => adicionarDespesa(d));
}
</script>
</body>
</html>`;
}
//# sourceMappingURL=orcamentoWebview.js.map