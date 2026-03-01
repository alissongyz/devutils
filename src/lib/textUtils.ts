/**
 * Utilitários para processamento de texto e tipos
 */

export function encodeBase64(text: string): string {
  try {
    return btoa(text);
  } catch (e) {
    return "Erro: Texto inválido para Base64";
  }
}

export function decodeBase64(text: string): string {
  try {
    return atob(text);
  } catch (e) {
    return "Erro: Base64 inválido";
  }
}

export function formatJSON(text: string): string {
  try {
    const obj = JSON.parse(text);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return "Erro: JSON inválido";
  }
}

export function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");
}

export function toSnakeCase(text: string): string {
  return text
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join("_") || "";
}

export function toPascalCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, "");
}

export function toKebabCase(text: string): string {
  return text
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join("-") || "";
}
