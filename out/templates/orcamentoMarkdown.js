"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarOrcamentoMarkdown = gerarOrcamentoMarkdown;
const format_1 = require("../utils/format");
function gerarOrcamentoMarkdown(dados) {
    let totalHoras = 0;
    let totalFases = 0;
    const fasesMd = dados.fases.map((fase, index) => {
        const horasFase = fase.subfases.reduce((acc, s) => acc + (0, format_1.moedaParaNumero)(s.horas), 0);
        const valorFase = fase.subfases.reduce((acc, s) => acc + (0, format_1.moedaParaNumero)(s.valor), 0);
        totalHoras += horasFase;
        totalFases += valorFase;
        const subfases = fase.subfases.map((s, i) => {
            return `| ${i + 1} | ${(0, format_1.mdValue)(s.nome)} | ${(0, format_1.mdValue)(s.horas)}h | ${(0, format_1.mdValue)(s.valor)} |`;
        }).join('\n');
        return `### ${index + 1}. ${(0, format_1.mdValue)(fase.nome)}

| # | Subfase / Entregável | Horas | Valor |
|---:|---|---:|---:|
${subfases || '| - | - | - | - |'}

**Horas da fase:** ${horasFase}h  
**Valor da fase:** ${(0, format_1.formatCurrencyBR)(valorFase)}
`;
    }).join('\n');
    const totalDespesas = dados.despesasExtras.reduce((acc, d) => acc + (0, format_1.moedaParaNumero)(d.valor), 0);
    const desconto = (0, format_1.moedaParaNumero)(dados.condicoesFinanceiras.descontoValor);
    const totalGeral = totalFases + totalDespesas - desconto;
    return `# Proposta Comercial - ${(0, format_1.mdValue)(dados.projetoNome)}

**Data de emissão:** ${(0, format_1.hojeBR)()}

---

## 1. Dados do Prestador

**Nome:** ${(0, format_1.mdValue)(dados.prestador.nome)}  
**CPF/CNPJ:** ${(0, format_1.mdValue)(dados.prestador.documento)}  
**E-mail:** ${(0, format_1.mdValue)(dados.prestador.email)}  
**Telefone:** ${(0, format_1.mdValue)(dados.prestador.telefone)}

## 2. Dados do Cliente

**Nome:** ${(0, format_1.mdValue)(dados.cliente.nome)}  
**CPF/CNPJ:** ${(0, format_1.mdValue)(dados.cliente.documento)}  
**E-mail:** ${(0, format_1.mdValue)(dados.cliente.email)}  
**Telefone:** ${(0, format_1.mdValue)(dados.cliente.telefone)}

---

## 3. Descrição do Projeto

${(0, format_1.mdValue)(dados.descricaoProjeto)}

## 4. Escopo do Projeto

${(0, format_1.mdValue)(dados.escopoProjeto)}

## 5. Premissas

${(0, format_1.mdValue)(dados.premissasCliente)}

---

## 6. Metodologia de Trabalho

${(0, format_1.mdValue)(dados.metodologiaTrabalho)}

## 7. Fases, Subfases, Horas e Valores

${fasesMd}

---

## 8. Revisão de Projeto

${(0, format_1.mdValue)(dados.revisaoProjeto)}

## 9. Suporte Após Entrega

${(0, format_1.mdValue)(dados.suporteAposEntrega)}

## 10. Garantias e Observações

${(0, format_1.mdValue)(dados.garantiasObservacoes)}

---

## 11. Despesas Extras

${dados.despesasExtras.length
        ? dados.despesasExtras.map(d => `- **${(0, format_1.mdValue)(d.nome)}:** ${(0, format_1.mdValue)(d.valor)} — ${(0, format_1.mdValue)(d.observacao)}`).join('\n')
        : '- Nenhuma despesa extra cadastrada.'}

---

## 12. Condições Financeiras

**Forma de pagamento:** ${(0, format_1.mdValue)(dados.condicoesFinanceiras.formaPagamento)}  
**Regra personalizada:** ${(0, format_1.mdValue)(dados.condicoesFinanceiras.regraPagamentoPersonalizada)}  
**Parcelamento:** ${(0, format_1.mdValue)(dados.condicoesFinanceiras.parcelamento)}  
**Desconto:** ${(0, format_1.mdValue)(dados.condicoesFinanceiras.descontoValor)}  
**Código-fonte:** ${(0, format_1.mdValue)(dados.condicoesFinanceiras.percentualCodigoFonte)}  
**Observações financeiras:** ${(0, format_1.mdValue)(dados.condicoesFinanceiras.observacoesFinanceiras)}

---

## 13. Resumo Financeiro

**Horas previstas:** ${totalHoras}h  
**Subtotal das fases:** ${(0, format_1.formatCurrencyBR)(totalFases)}  
**Despesas extras:** ${(0, format_1.formatCurrencyBR)(totalDespesas)}  
**Desconto:** ${(0, format_1.formatCurrencyBR)(desconto)}  
**Total estimado:** ${(0, format_1.formatCurrencyBR)(totalGeral)}

---

## 14. Assinaturas

_________________________________________  
**${(0, format_1.mdValue)(dados.prestador.nome)}**  
Prestador de Serviço  
CPF/CNPJ: ${(0, format_1.mdValue)(dados.prestador.documento)}


_________________________________________  
**${(0, format_1.mdValue)(dados.cliente.nome)}**  
Cliente / Contratante  
CPF/CNPJ: ${(0, format_1.mdValue)(dados.cliente.documento)}
`;
}
//# sourceMappingURL=orcamentoMarkdown.js.map