/**
 * Utilitários de Tempo e Timestamp
 */

export function unixToDate(timestamp: number): string {
  try {
    // Detecta se é segundos ou milissegundos
    const date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
    return date.toLocaleString('pt-BR');
  } catch (e) {
    return "Erro: Timestamp inválido";
  }
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
