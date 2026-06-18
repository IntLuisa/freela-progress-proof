export type Dificuldade = 'facil' | 'media' | 'dificil' | 'pesquisa';

export type StatusAndamento =
    | 'nao_iniciado'
    | 'em_andamento'
    | 'aguardando_cliente'
    | 'concluido'
    | 'pausado';

export type FormaDesconto = 'nenhum' | 'percentual' | 'valor_fixo';

export type FormaPagamento =
    | 'pix'
    | 'boleto'
    | 'cartao_credito'
    | 'transferencia'
    | 'personalizado';

export type Prestador = {
    nome: string;
    documento: string;
    email: string;
    telefone: string;
};

export type Cliente = {
    nome: string;
    documento: string;
    email: string;
    telefone: string;
};

export type Subfase = {
    id: string;
    nome: string;
    horas: string;
    valor: string;
    status: StatusAndamento;
};

export type Fase = {
    id: string;
    nome: string;
    dificuldade: Dificuldade;
    status: StatusAndamento;
    subfases: Subfase[];
    horasTotal: string;
    valorTotal: string;
};

export type DespesaExtra = {
    id: string;
    nome: string;
    valor: string;
    observacao: string;
};

export type CondicoesFinanceiras = {
    formaPagamento: FormaPagamento;
    regraPagamentoPersonalizada: string;
    parcelamento: string;
    descontoTipo: FormaDesconto;
    descontoValor: string;
    percentualCodigoFonte: string;
    observacoesFinanceiras: string;
};

export type OrcamentoConfig = {
    prestador: Prestador;
    cliente: Cliente;

    projetoNome: string;
    descricaoProjeto: string;
    escopoProjeto: string;
    premissasCliente: string;

    metodologiaTrabalho: string;

    revisaoProjeto: string;
    suporteAposEntrega: string;
    garantiasObservacoes: string;

    valorHoraPadrao: string;
    condicoesFinanceiras: CondicoesFinanceiras;

    fases: Fase[];
    despesasExtras: DespesaExtra[];
};

export type FreelaPaths = {
    projectPath: string;
    freelaDir: string;
    relatoriosDir: string;
    configPath: string;
    orcamentoMdPath: string;
    orcamentoHtmlPath: string;
    orcamentoPdfPath: string;
};

export type RelatorioDiario = {
    data: string;
    clienteNome: string;
    prestadorNome: string;
    faseId: string;
    subfaseId: string;
    statusAndamento: StatusAndamento;
    resumoFeito: string;
    proximasTarefas: string;
    bloqueios: string;
    commitsUltimas24h: string;
    arquivosAlterados: string;
};

export type RelatorioFase = {
    data: string;
    clienteNome: string;
    prestadorNome: string;
    faseId: string;
    nomeFase: string;
    entregaveisPrevistos: string[];
    entregaveisConcluidos: string[];
    horasEstimadas: string;
    valorFase: string;
    evidenciasGit: string;
    pendencias: string;
    resumoFeito: string;
    horaExtra: string;
    despesaExtra: string;
};

export type RelatorioCompleto = {
    data: string;
    clienteNome: string;
    prestadorNome: string;
    resumoProjeto: string;
    entregaveisPrevistos: string;
    entregaveisConcluidos: string;
    valores: string;
    horasPrevistas: string;
    despesasExtras: string;
    relatoriosGerados: string[];
    statusGeral: StatusAndamento;
    horaExtra: string;
};
