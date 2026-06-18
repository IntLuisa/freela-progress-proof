"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moedaParaNumero = moedaParaNumero;
exports.formatCurrencyBR = formatCurrencyBR;
exports.escapeHtml = escapeHtml;
exports.escapeAttr = escapeAttr;
exports.br = br;
exports.mdValue = mdValue;
exports.hojeBR = hojeBR;
function moedaParaNumero(valor) {
    const normalizado = String(valor || '')
        .replace(/\./g, '')
        .replace(',', '.')
        .replace(/[^\d.]/g, '');
    return Number(normalizado) || 0;
}
function formatCurrencyBR(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function escapeAttr(value) {
    return escapeHtml(value).replace(/\n/g, '&#10;');
}
function br(value) {
    return escapeHtml(value).replace(/\n/g, '<br>');
}
function mdValue(value) {
    return String(value ?? '').trim() || '-';
}
function hojeBR() {
    return new Date().toLocaleDateString('pt-BR');
}
//# sourceMappingURL=format.js.map