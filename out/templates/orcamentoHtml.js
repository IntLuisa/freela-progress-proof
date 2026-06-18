"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarOrcamentoHtml = gerarOrcamentoHtml;
const format_1 = require("../utils/format");
function gerarOrcamentoHtml(dados) {
    let totalHoras = 0;
    let totalFases = 0;
    const fasesHtml = dados.fases.map((fase, index) => {
        const horasFase = fase.subfases.reduce((acc, s) => acc + (0, format_1.moedaParaNumero)(s.horas), 0);
        const valorFase = fase.subfases.reduce((acc, s) => acc + (0, format_1.moedaParaNumero)(s.valor), 0);
        totalHoras += horasFase;
        totalFases += valorFase;
        const subfases = fase.subfases.map((s, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${(0, format_1.escapeHtml)(s.nome)}</td>
                <td class="right">${(0, format_1.escapeHtml)(s.horas)}h</td>
                <td class="right">${(0, format_1.escapeHtml)(s.valor)}</td>
            </tr>
        `).join('');
        return `
            <h3>${index + 1}. ${(0, format_1.escapeHtml)(fase.nome)}</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Subfase / Entregável</th>
                        <th>Horas</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>${subfases}</tbody>
            </table>
            <p class="fase-total">
                <strong>Horas da fase:</strong> ${horasFase}h<br>
                <strong>Valor da fase:</strong> ${(0, format_1.formatCurrencyBR)(valorFase)}
            </p>
        `;
    }).join('');
    const totalDespesas = dados.despesasExtras.reduce((acc, d) => acc + (0, format_1.moedaParaNumero)(d.valor), 0);
    const desconto = (0, format_1.moedaParaNumero)(dados.condicoesFinanceiras.descontoValor);
    const totalGeral = totalFases + totalDespesas - desconto;
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Proposta Comercial</title>
<style>
body {
    font-family: Arial, Helvetica, sans-serif;
    color: #202124;
    font-size: 13px;
    line-height: 1.55;
}
.page {
    padding: 34px;
}
h1 {
    text-align: center;
    text-transform: uppercase;
    border-bottom: 3px solid #111827;
    padding-bottom: 12px;
}
h2 {
    margin-top: 26px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
}
h3 {
    margin-top: 20px;
}
.grid {
    display: table;
    width: 100%;
}
.col {
    display: table-cell;
    width: 50%;
    vertical-align: top;
    padding-right: 15px;
}
.box {
    background: #f8f8f8;
    border: 1px solid #ddd;
    padding: 12px;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}
th, td {
    border: 1px solid #ccc;
    padding: 8px;
}
th {
    background: #f1f1f1;
}
.right {
    text-align: right;
}
.fase-total, .total {
    text-align: right;
}
.total {
    font-size: 16px;
    font-weight: bold;
}
.signatures {
    display: table;
    width: 100%;
    margin-top: 70px;
}
.signature {
    display: table-cell;
    width: 48%;
    border-top: 1px solid #111;
    padding-top: 8px;
    text-align: center;
}
.spacer {
    display: table-cell;
    width: 4%;
}
</style>
</head>
<body>
<div class="page">
    <h1>Proposta Comercial</h1>
    <p><strong>Projeto:</strong> ${(0, format_1.escapeHtml)(dados.projetoNome)}</p>
    <p><strong>Data de emissão:</strong> ${(0, format_1.hojeBR)()}</p>

    <div class="grid">
        <div class="col">
            <div class="box">
                <strong>Prestador</strong><br>
                ${(0, format_1.escapeHtml)(dados.prestador.nome)}<br>
                CPF/CNPJ: ${(0, format_1.escapeHtml)(dados.prestador.documento)}<br>
                E-mail: ${(0, format_1.escapeHtml)(dados.prestador.email)}<br>
                Telefone: ${(0, format_1.escapeHtml)(dados.prestador.telefone)}
            </div>
        </div>
        <div class="col">
            <div class="box">
                <strong>Cliente</strong><br>
                ${(0, format_1.escapeHtml)(dados.cliente.nome)}<br>
                CPF/CNPJ: ${(0, format_1.escapeHtml)(dados.cliente.documento)}<br>
                E-mail: ${(0, format_1.escapeHtml)(dados.cliente.email)}<br>
                Telefone: ${(0, format_1.escapeHtml)(dados.cliente.telefone)}
            </div>
        </div>
    </div>

    <h2>Descrição do Projeto</h2>
    <p>${(0, format_1.br)(dados.descricaoProjeto)}</p>

    <h2>Escopo do Projeto</h2>
    <p>${(0, format_1.br)(dados.escopoProjeto)}</p>

    <h2>Premissas</h2>
    <p>${(0, format_1.br)(dados.premissasCliente)}</p>

    <h2>Metodologia de Trabalho</h2>
    <p>${(0, format_1.br)(dados.metodologiaTrabalho)}</p>

    <h2>Fases, Subfases, Horas e Valores</h2>
    ${fasesHtml}

    <h2>Revisão de Projeto</h2>
    <p>${(0, format_1.br)(dados.revisaoProjeto)}</p>

    <h2>Suporte Após Entrega</h2>
    <p>${(0, format_1.br)(dados.suporteAposEntrega)}</p>

    <h2>Garantias e Observações</h2>
    <p>${(0, format_1.br)(dados.garantiasObservacoes)}</p>

    <h2>Despesas Extras</h2>
    <table>
        <thead>
            <tr>
                <th>Despesa</th>
                <th>Observação</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody>
            ${dados.despesasExtras.length
        ? dados.despesasExtras.map(d => `
                    <tr>
                        <td>${(0, format_1.escapeHtml)(d.nome)}</td>
                        <td>${(0, format_1.escapeHtml)(d.observacao)}</td>
                        <td class="right">${(0, format_1.escapeHtml)(d.valor)}</td>
                    </tr>
                `).join('')
        : '<tr><td colspan="3">Nenhuma despesa extra cadastrada.</td></tr>'}
        </tbody>
    </table>

    <h2>Condições Financeiras</h2>
    <p><strong>Forma de pagamento:</strong> ${(0, format_1.escapeHtml)(dados.condicoesFinanceiras.formaPagamento)}</p>
    <p><strong>Regra personalizada:</strong> ${(0, format_1.br)(dados.condicoesFinanceiras.regraPagamentoPersonalizada)}</p>
    <p><strong>Parcelamento:</strong> ${(0, format_1.br)(dados.condicoesFinanceiras.parcelamento)}</p>
    <p><strong>Desconto:</strong> ${(0, format_1.escapeHtml)(dados.condicoesFinanceiras.descontoValor)}</p>
    <p><strong>Código-fonte:</strong> ${(0, format_1.escapeHtml)(dados.condicoesFinanceiras.percentualCodigoFonte)}</p>
    <p><strong>Observações financeiras:</strong> ${(0, format_1.br)(dados.condicoesFinanceiras.observacoesFinanceiras)}</p>

    <h2>Resumo Financeiro</h2>
    <p class="total">
        Horas previstas: ${totalHoras}h<br>
        Subtotal das fases: ${(0, format_1.formatCurrencyBR)(totalFases)}<br>
        Despesas extras: ${(0, format_1.formatCurrencyBR)(totalDespesas)}<br>
        Desconto: ${(0, format_1.formatCurrencyBR)(desconto)}<br>
        Total estimado: ${(0, format_1.formatCurrencyBR)(totalGeral)}
    </p>

    <div class="signatures">
        <div class="signature">
            <strong>${(0, format_1.escapeHtml)(dados.prestador.nome)}</strong><br>
            Prestador de Serviço<br>
            CPF/CNPJ: ${(0, format_1.escapeHtml)(dados.prestador.documento)}
        </div>
        <div class="spacer"></div>
        <div class="signature">
            <strong>${(0, format_1.escapeHtml)(dados.cliente.nome)}</strong><br>
            Cliente / Contratante<br>
            CPF/CNPJ: ${(0, format_1.escapeHtml)(dados.cliente.documento)}
        </div>
    </div>
</div>
</body>
</html>`;
}
//# sourceMappingURL=orcamentoHtml.js.map