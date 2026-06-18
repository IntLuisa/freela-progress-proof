import { OrcamentoConfig } from '../types/freela';
import { defaultConfig } from '../config/defaultConfig';
import { FreelaPaths } from '../types/freela';
import { readJsonFile, writeTextFile, openFile } from '../utils/files';
import { gerarOrcamentoMarkdown } from '../templates/orcamentoMarkdown';
import { gerarOrcamentoHtml } from '../templates/orcamentoHtml';
import { gerarPdfPorHtml } from '../utils/pdf';

export function carregarOrcamento(paths: FreelaPaths): OrcamentoConfig {
    return readJsonFile<OrcamentoConfig>(paths.configPath, defaultConfig);
}

export async function salvarOrcamento(
    paths: FreelaPaths,
    dados: OrcamentoConfig
): Promise<void> {
    writeTextFile(paths.configPath, JSON.stringify(dados, null, 2));

    writeTextFile(paths.orcamentoMdPath, gerarOrcamentoMarkdown(dados));
    writeTextFile(paths.orcamentoHtmlPath, gerarOrcamentoHtml(dados));

    await gerarPdfPorHtml(
        paths.orcamentoHtmlPath,
        paths.orcamentoPdfPath
    );

    await openFile(paths.orcamentoMdPath);
}