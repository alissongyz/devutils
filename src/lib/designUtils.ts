/**
 * Utilitários de Design e Conversão de Unidades
 */

export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 
    "Erro: HEX inválido";
}

export function pxToRem(px: number, base: number = 16): string {
  return `${px / base}rem`;
}

export function generateLoremIpsum(paragraphs: number = 1): string {
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ";
  return Array(paragraphs).fill(text).join("\n\n");
}
