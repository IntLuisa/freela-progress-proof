"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    prestador: {
        nome: '',
        documento: '',
        email: '',
        telefone: ''
    },
    cliente: {
        nome: '',
        documento: '',
        email: '',
        telefone: ''
    },
    projetoNome: '',
    descricaoProjeto: '',
    escopoProjeto: '',
    premissasCliente: '',
    metodologiaTrabalho: 'O projeto será dividido em fases, com entregas progressivas para validação do cliente ao longo do desenvolvimento.',
    revisaoProjeto: 'Inclui uma rodada de revisão após a entrega, limitada aos itens previstos no escopo aprovado.',
    suporteAposEntrega: 'Suporte pós-entrega por 30 dias para correções relacionadas ao escopo contratado.',
    garantiasObservacoes: 'A garantia cobre correções de funcionamento relacionadas aos itens contratados. Alterações de escopo serão orçadas separadamente.',
    valorHoraPadrao: '75,00',
    condicoesFinanceiras: {
        formaPagamento: 'pix',
        regraPagamentoPersonalizada: '',
        parcelamento: '50% na aprovação e 50% na entrega final.',
        descontoTipo: 'nenhum',
        descontoValor: '',
        percentualCodigoFonte: '',
        observacoesFinanceiras: ''
    },
    fases: [],
    despesasExtras: []
};
//# sourceMappingURL=defaultConfig.js.map