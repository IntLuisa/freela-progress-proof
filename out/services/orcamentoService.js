"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carregarOrcamento = carregarOrcamento;
exports.salvarOrcamento = salvarOrcamento;
const defaultConfig_1 = require("../config/defaultConfig");
const files_1 = require("../utils/files");
const orcamentoMarkdown_1 = require("../templates/orcamentoMarkdown");
const orcamentoHtml_1 = require("../templates/orcamentoHtml");
const pdf_1 = require("../utils/pdf");
function carregarOrcamento(paths) {
    return (0, files_1.readJsonFile)(paths.configPath, defaultConfig_1.defaultConfig);
}
async function salvarOrcamento(paths, dados) {
    (0, files_1.writeTextFile)(paths.configPath, JSON.stringify(dados, null, 2));
    (0, files_1.writeTextFile)(paths.orcamentoMdPath, (0, orcamentoMarkdown_1.gerarOrcamentoMarkdown)(dados));
    (0, files_1.writeTextFile)(paths.orcamentoHtmlPath, (0, orcamentoHtml_1.gerarOrcamentoHtml)(dados));
    await (0, pdf_1.gerarPdfPorHtml)(paths.orcamentoHtmlPath, paths.orcamentoPdfPath);
    await (0, files_1.openFile)(paths.orcamentoMdPath);
}
//# sourceMappingURL=orcamentoService.js.map