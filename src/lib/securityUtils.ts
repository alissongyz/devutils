/**
 * Utilitários de Segurança e Criptografia
 */

const getCrypto = () => {
  if (typeof crypto !== 'undefined') return crypto;
  // Node.js fallback
  return require('crypto').webcrypto;
};

export function generatePassword(length: number = 16, includeSymbols: boolean = true, includeNumbers: boolean = true): string {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  
  let chars = letters;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;
  
  const array = new Uint32Array(length);
  getCrypto().getRandomValues(array);
  
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(array[i] % chars.length);
  }
  return password;
}

export async function generateHash(text: string, algorithm: "SHA-256" | "SHA-1" | "MD5"): Promise<string> {
  if (algorithm === "MD5") {
    return "MD5 não é suportado nativamente pelo Web Crypto API (use SHA-256)";
  }
  
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function debugJWT(token: string): string | object {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return "Erro: Token JWT inválido (deve ter 3 partes)";
    
    const decode = (str: string) => {
      if (typeof atob !== 'undefined') return atob(str);
      return Buffer.from(str, 'base64').toString('binary');
    };

    const header = JSON.parse(decode(parts[0]));
    const payload = JSON.parse(decode(parts[1]));
    
    return {
      header,
      payload,
      signature: "Assinatura ocultada por segurança"
    };
  } catch (e) {
    return "Erro: Falha ao decodificar JWT";
  }
}
