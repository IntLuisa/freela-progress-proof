import { OrcamentoConfig } from '../types/freela';
import { formatCurrencyBR, mdValue, moedaParaNumero, hojeBR } from '../utils/format';

export function gerarOrcamentoMarkdown(dados: OrcamentoConfig): string {
    let totalHoras = 0;
    let totalFases = 0;

    const fasesMd = dados.fases.map((fase, index) => {
        const horasFase = fase.subfases.reduce((acc, s) => acc + moedaParaNumero(s.horas), 0);
        const valorFase = fase.subfases.reduce((acc, s) => acc + moedaParaNumero(s.valor), 0);

        totalHoras += horasFase;
        totalFases += valorFase;

        const subfases = fase.subfases.map((s, i) => {
            return `| ${i + 1} | ${mdValue(s.nome)} | ${mdValue(s.horas)}h | ${mdValue(s.valor)} |`;
        }).join('\n');

        return `### ${index + 1}. ${mdValue(fase.nome)}

| # | Subfase / Entregável | Horas | Valor |
|---:|---|---:|---:|
${subfases || '| - | - | - | - |'}

**Horas da fase:** ${horasFase}h  
**Valor da fase:** ${formatCurrencyBR(valorFase)}
`;
    }).join('\n');

    const totalDespesas = dados.despesasExtras.reduce(
        (acc, d) => acc + moedaParaNumero(d.valor),
        0
    );

    const desconto = moedaParaNumero(dados.condicoesFinanceiras.descontoValor);
    const totalGeral = totalFases + totalDespesas - desconto;

    return `# Proposta Comercial - ${mdValue(dados.projetoNome)}

**Data de emissão:** ${hojeBR()}

---

## 1. Dados do Prestador

**Nome:** ${mdValue(dados.prestador.nome)}  
**CPF/CNPJ:** ${mdValue(dados.prestador.documento)}  
**E-mail:** ${mdValue(dados.prestador.email)}  
**Telefone:** ${mdValue(dados.prestador.telefone)}

## 2. Dados do Cliente

**Nome:** ${mdValue(dados.cliente.nome)}  
**CPF/CNPJ:** ${mdValue(dados.cliente.documento)}  
**E-mail:** ${mdValue(dados.cliente.email)}  
**Telefone:** ${mdValue(dados.cliente.telefone)}

---

## 3. Descrição do Projeto

${mdValue(dados.descricaoProjeto)}

## 4. Escopo do Projeto

${mdValue(dados.escopoProjeto)}

## 5. Premissas

${mdValue(dados.premissasCliente)}

---

## 6. Metodologia de Trabalho

${mdValue(dados.metodologiaTrabalho)}

## 7. Fases, Subfases, Horas e Valores

${fasesMd}

---

## 8. Revisão de Projeto

${mdValue(dados.revisaoProjeto)}

## 9. Suporte Após Entrega

${mdValue(dados.suporteAposEntrega)}

## 10. Garantias e Observações

${mdValue(dados.garantiasObservacoes)}

---

## 11. Despesas Extras

${dados.despesasExtras.length
    ? dados.despesasExtras.map(d => `- **${mdValue(d.nome)}:** ${mdValue(d.valor)} — ${mdValue(d.observacao)}`).join('\n')
    : '- Nenhuma despesa extra cadastrada.'}

---

## 12. Condições Financeiras

**Forma de pagamento:** ${mdValue(dados.condicoesFinanceiras.formaPagamento)}  
**Regra personalizada:** ${mdValue(dados.condicoesFinanceiras.regraPagamentoPersonalizada)}  
**Parcelamento:** ${mdValue(dados.condicoesFinanceiras.parcelamento)}  
**Desconto:** ${mdValue(dados.condicoesFinanceiras.descontoValor)}  
**Código-fonte:** ${mdValue(dados.condicoesFinanceiras.percentualCodigoFonte)}  
**Observações financeiras:** ${mdValue(dados.condicoesFinanceiras.observacoesFinanceiras)}

---

## 13. Resumo Financeiro

**Horas previstas:** ${totalHoras}h  
**Subtotal das fases:** ${formatCurrencyBR(totalFases)}  
**Despesas extras:** ${formatCurrencyBR(totalDespesas)}  
**Desconto:** ${formatCurrencyBR(desconto)}  
**Total estimado:** ${formatCurrencyBR(totalGeral)}

---

## 14. Assinaturas

_________________________________________  
**${mdValue(dados.prestador.nome)}**  
Prestador de Serviço  
CPF/CNPJ: ${mdValue(dados.prestador.documento)}


_________________________________________  
**${mdValue(dados.cliente.nome)}**  
Cliente / Contratante  
CPF/CNPJ: ${mdValue(dados.cliente.documento)}
`;
}
