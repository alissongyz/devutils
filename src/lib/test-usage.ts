import { 
  generateCPF, 
  generateCNPJ, 
  generateUUID, 
  toCamelCase, 
  toSnakeCase,
  generatePassword,
  formatJSON,
  pxToRem,
  getCurrentTimestamp
} from './index';

async function testLibrary() {
  console.log("🚀 Testando devutils-pro-core\n");

  console.log("📂 Geradores:");
  console.log("- CPF:", generateCPF());
  console.log("- CNPJ:", generateCNPJ());
  console.log("- UUID:", generateUUID());

  console.log("\n🔤 Texto:");
  console.log("- CamelCase:", toCamelCase("dev utils pro"));
  console.log("- SnakeCase:", toSnakeCase("dev utils pro"));

  console.log("\n🔒 Segurança:");
  console.log("- Senha:", generatePassword(12));

  console.log("\n🎨 Design:");
  console.log("- Pixels to REM (16px):", pxToRem(16));

  console.log("\n⏰ Tempo:");
  console.log("- Timestamp Atual:", getCurrentTimestamp());

  console.log("\n✅ Teste concluído com sucesso!");
}

testLibrary();
