/**
 * Utilitários de Geração Segura
 */
const getCrypto = () => {
  if (typeof crypto !== 'undefined') return crypto;
  return require('crypto').webcrypto;
};

const secureRnd = (max: number): number => {
  const array = new Uint32Array(1);
  getCrypto().getRandomValues(array);
  return array[0] % (max + 1);
};

/**
 * Gera um CPF válido formatado ou apenas números
 */
export function generateCPF(formatted = true): string {
  const mod = (base: number, div: number) => Math.round(base - Math.floor(base / div) * div);

  const n = Array.from({ length: 9 }, () => secureRnd(9));

  let d1 = n.reduce((acc, curr, idx) => acc + curr * (10 - idx), 0);
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;

  let d2 = d1 * 2 + n.reduce((acc, curr, idx) => acc + curr * (11 - idx), 0);
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;

  const cpf = `${n.join("")}${d1}${d2}`;
  return formatted ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf;
}

/**
 * Gera um CNPJ válido formatado ou apenas números
 */
export function generateCNPJ(formatted = true): string {
  const mod = (base: number, div: number) => Math.round(base - Math.floor(base / div) * div);
  const n = Array.from({ length: 12 }, () => secureRnd(9));
  // Padrão 0001 para os últimos 4 dígitos antes dos verificadores (opcional, mas comum)
  n[8] = 0; n[9] = 0; n[10] = 0; n[11] = 1;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d1 = n.reduce((acc, curr, idx) => acc + curr * weights1[idx], 0);
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let d2 = d1 * 2 + n.reduce((acc, curr, idx) => acc + curr * weights2[idx], 0);
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;

  const cnpj = `${n.join("")}${d1}${d2}`;
  return formatted ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : cnpj;
}

/**
 * Gera um UUID v4
 */
export function generateUUID(): string {
  return getCrypto().randomUUID();
}

/**
 * Gera um endereço aleatório (mock simples) com suporte a filtros
 */
export function generateAddress(uf?: string, city?: string) {
  const data = [
    { uf: "SP", cities: ["São Paulo", "Campinas", "Santos", "SJC"] },
    { uf: "RJ", cities: ["Rio de Janeiro", "Niterói", "Búzios"] },
    { uf: "MG", cities: ["Belo Horizonte", "Uberlândia", "Ouro Preto"] },
    { uf: "PR", cities: ["Curitiba", "Londrina", "Maringá"] },
    { uf: "RS", cities: ["Porto Alegre", "Gramado", "Caxias do Sul"] },
    { uf: "BA", cities: ["Salvador", "Porto Seguro", "Ilhéus"] },
    { uf: "CE", cities: ["Fortaleza", "Jericoacoara", "Juazeiro do Norte"] },
    { uf: "DF", cities: ["Brasília"] },
  ];

  const streets = ["Av. Paulista", "Rua Augusta", "Rua das Flores", "Av. Brasil", "Alameda Santos", "Rua XV de Novembro", "Rua da Praia", "Av. Sete de Setembro"];
  
  const selectedState = uf ? data.find(d => d.uf === uf) : data[secureRnd(data.length - 1)];
  const stateData = selectedState || data[0];
  
  const selectedCity = city && stateData.cities.includes(city) 
    ? city 
    : stateData.cities[secureRnd(stateData.cities.length - 1)];

  return {
    cep: `${10000 + secureRnd(89999)}-${100 + secureRnd(899)}`,
    logradouro: streets[secureRnd(streets.length - 1)],
    numero: secureRnd(2000).toString(),
    bairro: "Centro",
    cidade: selectedCity,
    uf: stateData.uf,
  };
}

export function generatePIS(): string {
  const n = Array.from({ length: 10 }, () => secureRnd(9));
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += n[i] * weights[i];
  
  let verifier = 11 - (sum % 11);
  if (verifier >= 10) verifier = 0;
  
  return n.join("") + verifier;
}

export function generateCreditCard(): string {
  const brands = ["4", "5", "3"]; // Visa, Master, Amex
  const brand = brands[secureRnd(brands.length - 1)];
  const n = Array.from({ length: 12 }, () => secureRnd(9));
  return brand + n.join("") + secureRnd(9);
}

export function validateDocument(doc: string): string {
  if (!doc || doc.length > 100) return "Erro: Input inválido ou muito longo";
  const clean = doc.replace(/\D/g, "");
  if (clean.length === 11) return "CPF válido (simulado)";
  if (clean.length === 14) return "CNPJ válido (simulado)";
  return "Documento inválido ou desconhecido";
}
