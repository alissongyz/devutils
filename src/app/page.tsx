"use client";

import { useState } from "react";
import { Sidebar, ToolId } from "@/components/Sidebar";
import { ToolView } from "@/components/ToolView";
import { ToolCard } from "@/components/ToolCard";
import { generateCPF, generateCNPJ, generateUUID, generateAddress, generatePIS, generateCreditCard, validateDocument } from "@/lib/generators";
import { encodeBase64, decodeBase64, formatJSON, toCamelCase, toSnakeCase, toPascalCase, toKebabCase } from "@/lib/textUtils";
import { generatePassword, generateHash, debugJWT } from "@/lib/securityUtils";
import { hexToRgb, pxToRem, generateLoremIpsum } from "@/lib/designUtils";
import { unixToDate, getCurrentTimestamp } from "@/lib/timeUtils";

import { 
  CreditCard, Building2, Fingerprint, MapPin, Sparkles, Binary, 
  Code2, CaseSensitive, ShieldCheck, Lock, FileJson, Palette, 
  Type, Ruler, Clock, Check, Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>("dashboard");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    // --- DADOS BRASIL ---
    {
      id: "cpf",
      title: "Gerador de CPF",
      description: "Gera um CPF válido e formatado para testes de sistemas.",
      onGenerate: (formatted: boolean) => generateCPF(formatted),
      icon: <CreditCard className="w-6 h-6" />,
      hasFormatting: true
    },
    {
      id: "cnpj",
      title: "Gerador de CNPJ",
      description: "Gera um CNPJ válido (padrão 0001) para testes empresariais.",
      onGenerate: (formatted: boolean) => generateCNPJ(formatted),
      icon: <Building2 className="w-6 h-6" />,
      hasFormatting: true
    },
    {
      id: "address",
      title: "Gerador de Endereço",
      description: "Gera um endereço brasileiro aleatório e completo.",
      onGenerate: (_: boolean, uf?: string, city?: string) => generateAddress(uf, city),
      icon: <MapPin className="w-6 h-6" />,
      hasLocation: true
    },
    {
      id: "pis",
      title: "Gerador de PIS",
      description: "Gera um número de PIS/PASEP válido para testes de RH.",
      onGenerate: () => generatePIS(),
      icon: <Building2 className="w-6 h-6 opacity-70" />,
    },
    {
      id: "credit-card",
      title: "Cartão de Crédito",
      description: "Gera um número de cartão de crédito fictício para testes.",
      onGenerate: () => generateCreditCard(),
      icon: <CreditCard className="w-6 h-6 opacity-70" />,
    },
    {
      id: "validator",
      title: "Validador Docs",
      description: "Valida CPFs e CNPJs brasileiros em tempo real.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string) => validateDocument(input || ""),
      icon: <Check className="w-6 h-6" />,
      hasInput: true,
      inputPlaceholder: "Cole o CPF ou CNPJ aqui..."
    },

    // --- TEXTO & CODIFICAÇÃO ---
    {
      id: "base64",
      title: "Base64 Encoder",
      description: "Codifique ou decodifique textos em Base64.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string, mode?: string) => {
        if (!input) return "";
        return mode === "encode" ? encodeBase64(input) : decodeBase64(input);
      },
      icon: <Binary className="w-6 h-6" />,
      hasInput: true,
      modes: [{ id: "encode", label: "Codificar" }, { id: "decode", label: "Decodificar" }]
    },
    {
      id: "json-format",
      title: "JSON Formatter",
      description: "Formata e embeleza objetos JSON para melhor leitura.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string) => formatJSON(input || ""),
      icon: <Code2 className="w-6 h-6" />,
      hasInput: true,
      inputPlaceholder: '{"exemplo": true}'
    },
    {
      id: "case-converter",
      title: "Case Converter",
      description: "Transforma textos entre diversos padrões de escrita.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string, mode?: string) => {
        if (!input) return "";
        switch(mode) {
          case "camel": return toCamelCase(input);
          case "snake": return toSnakeCase(input);
          case "pascal": return toPascalCase(input);
          case "kebab": return toKebabCase(input);
          default: return input;
        }
      },
      icon: <CaseSensitive className="w-6 h-6" />,
      hasInput: true,
      modes: [
        { id: "camel", label: "camelCase" },
        { id: "snake", label: "snake_case" },
        { id: "pascal", label: "PascalCase" },
        { id: "kebab", label: "kebab-case" }
      ]
    },
    {
      id: "uuid",
      title: "Gerador de UUID",
      description: "Gera identificadores únicos universais (v4) aleatórios.",
      onGenerate: () => generateUUID(),
      icon: <Fingerprint className="w-6 h-6" />,
    },

    // --- SEGURANÇA ---
    {
      id: "password",
      title: "Gerador de Senha",
      description: "Gera senhas seguras com símbolos e números.",
      onGenerate: () => generatePassword(16),
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      id: "hash",
      title: "Hash Generator",
      description: "Gera hashes criptográficos SHA-256 de qualquer texto.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string) => generateHash(input || "", "SHA-256"),
      icon: <Lock className="w-6 h-6" />,
      hasInput: true
    },
    {
      id: "jwt",
      title: "JWT Debugger",
      description: "Decodifica o payload e o header de tokens JWT.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string) => debugJWT(input || ""),
      icon: <FileJson className="w-6 h-6" />,
      hasInput: true,
      inputPlaceholder: "eyJhbGciOiJIUzI1NiIsInR5..."
    },

    // --- DESIGN & DEV ---
    {
      id: "colors",
      title: "Conversor de Cores",
      description: "Converte cores HEX para o formato RGB.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string) => hexToRgb(input || ""),
      icon: <Palette className="w-6 h-6" />,
      hasInput: true,
      inputPlaceholder: "#6366f1"
    },
    {
      id: "lorem",
      title: "Lorem Ipsum",
      description: "Gera parágrafos de texto fictício para preenchimento.",
      onGenerate: () => generateLoremIpsum(3),
      icon: <Type className="w-6 h-6" />,
    },
    {
      id: "units",
      title: "Unidades CSS",
      description: "Converte valores de Pixel (px) para REM.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string) => pxToRem(Number(input) || 0),
      icon: <Ruler className="w-6 h-6" />,
      hasInput: true,
      inputPlaceholder: "16"
    },
    {
      id: "timestamp",
      title: "Unix Timestamp",
      description: "Converte timestamps para datas legíveis e vice-versa.",
      onGenerate: (_: boolean, __?: string, ___?: string, input?: string, mode?: string) => {
        if (mode === "now") return getCurrentTimestamp().toString();
        return unixToDate(Number(input) || 0);
      },
      icon: <Clock className="w-6 h-6" />,
      hasInput: true,
      inputPlaceholder: "1710000000",
      modes: [{ id: "convert", label: "Converter" }, { id: "now", label: "Agora" }]
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 scroll-smooth">
      <Sidebar 
        activeTool={activeTool} 
        onSelectTool={(id) => {
          if (id === "lib-docs") {
            setActiveTool("dashboard");
            setTimeout(() => {
              document.getElementById("lib-docs")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          } else {
            setActiveTool(id);
          }
        }} 
      />

      <main className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        <div className="flex-1 p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full relative">
          
          <div className="absolute top-0 right-0 -z-10 opacity-20 pointer-events-none">
             <div className="w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          </div>

          <AnimatePresence mode="wait">
            {activeTool === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-12"
              >
                {/* Structured Data para SEO */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "WebApplication",
                      "name": "DevUtils Pro",
                      "description": "Ferramentas utilitárias para desenvolvedores: Geradores de CPF, CNPJ, UUID e formatadores de texto.",
                      "url": "https://devutils-swart.vercel.app",
                      "applicationCategory": "DeveloperApplication",
                      "operatingSystem": "Web",
                      "author": {
                        "@type": "Person",
                        "name": "Alisson Arruda"
                      }
                    })
                  }}
                />
                <header className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-primary/80">DevUtils Pro</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                    Produtividade no <br />
                    <span className="text-primary bg-clip-text">seu fluxo de código.</span>
                  </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                  {tools.map((tool) => (
                    <div 
                      key={tool.id} 
                      onClick={() => setActiveTool(tool.id as ToolId)}
                      className="cursor-pointer"
                    >
                      <ToolCard 
                        title={tool.title}
                        description={tool.description}
                        onGenerate={() => tool.onGenerate(true)}
                        icon={tool.icon}
                      />
                    </div>
                  ))}
                </div>

                {/* Seção da Lib */}
                <motion.section 
                  id="lib-docs"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="mb-20 glass p-8 md:p-12 rounded-3xl border-primary/20 bg-primary/5 tracking-tight"
                >
                  <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                    <div className="flex-1 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                        NPM Package
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black">devutils-pro-core</h2>
                      <p className="text-lg text-muted-foreground max-w-xl">
                        Aproveite todo o poder destes utilitários diretamente no seu projeto. 
                        Gere CPFs, CNPJs, formate JSON e muito mais com uma única dependência.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className="bg-black/40 rounded-xl px-4 py-3 font-mono text-sm border border-white/10 flex items-center gap-3">
                          <span className="text-primary">$</span>
                          <span className="text-white">npm install devutils-pro-core</span>
                          <button 
                            onClick={() => handleCopy("npm install devutils-pro-core")}
                            className={`ml-2 p-1 rounded transition-all duration-300 ${copied ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10 text-muted-foreground'}`}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full lg:w-3/5 bg-[#0a0c14] rounded-2xl p-6 border border-white/5 font-mono text-[13px] shadow-2xl relative overflow-hidden group">
                      <div className="flex gap-2 mb-6">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                      </div>
                      
                      <div className="overflow-x-auto custom-scrollbar-horizontal pb-2">
                        <div className="space-y-6">
                          <div>
                            <p className="text-slate-500 mb-2">// 📂 Geradores Brasileiros</p>
                            <div className="pl-2 border-l border-primary/20">
                              <span className="text-primary-400">import</span> &#123; generateCPF, generateCNPJ &#125; <span className="text-primary-400">from</span> <span className="text-emerald-400">'devutils-pro-core'</span>;<br />
                              <span className="text-primary-400">const</span> cpf = <span className="text-amber-300">generateCPF</span>(); <span className="text-slate-500">// 000.000.000-00</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-slate-500 mb-2">// 🔤 Processamento de Texto</p>
                            <div className="pl-2 border-l border-primary/20">
                              <span className="text-primary-400">import</span> &#123; toCamelCase, toSnakeCase &#125; <span className="text-primary-400">from</span> <span className="text-emerald-400">'devutils-pro-core'</span>;<br />
                              <span className="text-amber-300">toCamelCase</span>(<span className="text-emerald-400">'dev utils pro'</span>); <span className="text-slate-500">// devUtilsPro</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-slate-500 mb-2">// 🔒 Segurança</p>
                            <div className="pl-2 border-l border-primary/20">
                              <span className="text-primary-400">import</span> &#123; generatePassword &#125; <span className="text-primary-400">from</span> <span className="text-emerald-400">'devutils-pro-core'</span>;<br />
                              <span className="text-amber-300">generatePassword</span>(<span className="text-sky-400">16</span>); <span className="text-slate-500">// r$4!pA...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative gradient light */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    </div>
                  </div>
                </motion.section>

                {/* Nova Seção: Referência Completa */}
                <section className="space-y-12 pb-20">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold tracking-tight">Referência Completa da API</h3>
                    <p className="text-muted-foreground">Tudo o que você precisa para turbinar seu desenvolvimento.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Geradores */}
                    <div className="glass p-8 rounded-3xl space-y-6 border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3 text-primary">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Binary className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold">Geradores & Validadores</h4>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-primary/30 transition-colors">
                          <code className="text-primary-400">generateCPF(formatted?: boolean)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Gera um CPF válido com ou sem pontuação.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-primary/30 transition-colors">
                          <code className="text-primary-400">generateCNPJ(formatted?: boolean)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Gera um CNPJ válido para testes empresariais.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-primary/30 transition-colors">
                          <code className="text-primary-400">validateDocument(doc: string)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Valida se um CPF ou CNPJ é matematicamente correto.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-primary/30 transition-colors">
                          <code className="text-primary-400">generateUUID()</code>
                          <p className="text-muted-foreground mt-1 text-xs">Gera um identificador único universal v4.</p>
                        </div>
                      </div>
                    </div>

                    {/* Texto */}
                    <div className="glass p-8 rounded-3xl space-y-6 border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3 text-amber-400">
                        <div className="p-2 bg-amber-400/10 rounded-lg">
                          <CaseSensitive className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold">Manipulação de Texto</h4>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-amber-400/30 transition-colors">
                          <code className="text-amber-300">toCamelCase | toSnakeCase | toPascalCase</code>
                          <p className="text-muted-foreground mt-1 text-xs">Converte strings entre diferentes convenções de nomenclatura.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-amber-400/30 transition-colors">
                          <code className="text-amber-300">formatJSON(json: string)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Formata e indenta strings JSON para legibilidade.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-amber-400/30 transition-colors">
                          <code className="text-amber-300">encodeBase64 | decodeBase64</code>
                          <p className="text-muted-foreground mt-1 text-xs">Codificação e decodificação segura de dados.</p>
                        </div>
                      </div>
                    </div>

                    {/* Segurança */}
                    <div className="glass p-8 rounded-3xl space-y-6 border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3 text-emerald-400">
                        <div className="p-2 bg-emerald-400/10 rounded-lg">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold">Segurança & Cripto</h4>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-emerald-400/30 transition-colors">
                          <code className="text-emerald-300">generatePassword(length: number)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Gera senhas fortes com caracteres especiais.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-emerald-400/30 transition-colors">
                          <code className="text-emerald-300">generateHash(text: string, algo: 'SHA-256')</code>
                          <p className="text-muted-foreground mt-1 text-xs">Gera hashes criptográficos seguros.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-emerald-400/30 transition-colors">
                          <code className="text-emerald-300">debugJWT(token: string)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Exibe o conteúdo decodificado de um token JWT.</p>
                        </div>
                      </div>
                    </div>

                    {/* Utils */}
                    <div className="glass p-8 rounded-3xl space-y-6 border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-3 text-sky-400">
                        <div className="p-2 bg-sky-400/10 rounded-lg">
                          <Clock className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-bold">Utilitários Gerais</h4>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-sky-400/30 transition-colors">
                          <code className="text-sky-300">pxToRem(pixels: number)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Converte unidades de pixels para rem (base 16).</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-sky-400/30 transition-colors">
                          <code className="text-sky-300">getCurrentTimestamp()</code>
                          <p className="text-muted-foreground mt-1 text-xs">Retorna o timestamp Unix atual em milissegundos.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-sky-400/30 transition-colors">
                          <code className="text-sky-300">hexToRgb(hex: string)</code>
                          <p className="text-muted-foreground mt-1 text-xs">Converte cores em formato hexadecimal para RGB.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center min-h-[70vh]"
              >
                {tools.filter(t => t.id === activeTool).map(tool => (
                  <ToolView 
                    key={tool.id}
                    title={tool.title}
                    description={tool.description}
                    onGenerate={tool.onGenerate as any}
                    icon={tool.icon}
                    hasFormatting={tool.hasFormatting}
                    hasLocation={tool.hasLocation}
                    hasInput={tool.hasInput}
                    inputPlaceholder={tool.inputPlaceholder}
                    modes={tool.modes}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="p-8 text-center text-sm text-muted-foreground border-t border-white/5 bg-black/20 mt-auto">
          <p>© 2026 DevUtils Pro • Com ❤️ por @alissonarruda</p>
        </footer>
      </main>
    </div>
  );
}
