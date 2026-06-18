export function moedaParaNumero(valor: string): number {
    const normalizado = String(valor || '')
        .replace(/\./g, '')
        .replace(',', '.')
        .replace(/[^\d.]/g, '');

    return Number(normalizado) || 0;
}

export function formatCurrencyBR(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function escapeAttr(value: unknown): string {
    return escapeHtml(value).replace(/\n/g, '&#10;');
}

export function br(value: unknown): string {
    return escapeHtml(value).replace(/\n/g, '<br>');
}

export function mdValue(value: unknown): string {
    return String(value ?? '').trim() || '-';
}

export function hojeBR(): string {
    return new Date().toLocaleDateString('pt-BR');
}
