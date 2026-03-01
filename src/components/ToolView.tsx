import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Check, ChevronDown, Type } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ToolViewProps {
  title: string;
  description: string;
  onGenerate: (formatted: boolean, uf?: string, city?: string, input?: string, mode?: string) => string | object;
  icon: React.ReactNode;
  hasFormatting?: boolean;
  hasLocation?: boolean;
  hasInput?: boolean;
  inputPlaceholder?: string;
  modes?: { id: string; label: string }[];
}

const STATES_DATA = [
  { uf: "SP", cities: ["São Paulo", "Campinas", "Santos", "SJC"] },
  { uf: "RJ", cities: ["Rio de Janeiro", "Niterói", "Búzios"] },
  { uf: "MG", cities: ["Belo Horizonte", "Uberlândia", "Ouro Preto"] },
  { uf: "PR", cities: ["Curitiba", "Londrina", "Maringá"] },
  { uf: "RS", cities: ["Porto Alegre", "Gramado", "Caxias do Sul"] },
  { uf: "BA", cities: ["Salvador", "Porto Seguro", "Ilhéus"] },
  { uf: "CE", cities: ["Fortaleza", "Jericoacoara", "Juazeiro do Norte"] },
  { uf: "DF", cities: ["Brasília"] },
];

export function ToolView({ 
  title, 
  description, 
  onGenerate, 
  icon, 
  hasFormatting = false, 
  hasLocation = false,
  hasInput = false,
  inputPlaceholder = "Digite aqui...",
  modes = []
}: ToolViewProps) {
  const [value, setValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formatted, setFormatted] = useState(true);
  const [activeMode, setActiveMode] = useState<string>(modes[0]?.id || "");
  
  // Localização
  const [selectedUf, setSelectedUf] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const availableCities = useMemo(() => {
    if (!selectedUf) return [];
    const state = STATES_DATA.find(s => s.uf === selectedUf);
    return state ? state.cities : [];
  }, [selectedUf]);

  const handleGenerate = useCallback(() => {
    setIsLoading(true);
    // Simula um delay para feedback visual de carregamento
    const timer = setTimeout(() => {
      const result = onGenerate(formatted, selectedUf || undefined, selectedCity || undefined, inputValue, activeMode);
      setValue(typeof result === "string" ? result : JSON.stringify(result, null, 2));
      setIsLoading(false);
      setCopied(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [onGenerate, formatted, selectedUf, selectedCity, inputValue, activeMode]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset cidade ao mudar UF
  useEffect(() => {
    setSelectedCity("");
  }, [selectedUf]);

  // Re-gerar automaticamente quando os filtros mudam e já existe um valor
  useEffect(() => {
    if (value && (hasFormatting || hasLocation || modes.length > 0)) {
       handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatted, selectedUf, selectedCity, activeMode]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full mx-auto"
    >
      <div className="glass p-8 md:p-10 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl relative overflow-hidden bg-slate-900/40 border border-white/5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 z-10">
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner flex-shrink-0">
                {icon}
              </div>
              <h2 className="text-2xl font-black tracking-tight">{title}</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">{description}</p>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
            {modes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 bg-black/40 p-1.5 rounded-xl border border-white/10">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={cn(
                      "flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap min-w-[80px]",
                      activeMode === mode.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}

            {hasFormatting && !modes.length && (
              <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setFormatted(true)}
                  className={cn(
                    "flex-1 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                    formatted ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  Formatado
                </button>
                <button
                  onClick={() => setFormatted(false)}
                  className={cn(
                    "flex-1 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                    !formatted ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  Puro
                </button>
              </div>
            )}

            {hasLocation && (
              <div className="flex flex-col gap-2 bg-black/40 p-3 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Filtros de Local</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full sm:w-32">
                    <select
                      value={selectedUf}
                      onChange={(e) => setSelectedUf(e.target.value)}
                      className="w-full appearance-none bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none transition-all pr-8 cursor-pointer text-white"
                    >
                      <option value="">Qualquer UF</option>
                      {STATES_DATA.map(s => (
                        <option key={s.uf} value={s.uf} className="bg-slate-900">{s.uf}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                  </div>
                  
                  <div className="relative w-full sm:w-44">
                    <select
                      value={selectedCity}
                      disabled={!selectedUf}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full appearance-none bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none transition-all pr-8 cursor-pointer disabled:opacity-30 text-white disabled:cursor-not-allowed"
                    >
                      <option value="">Qualquer Cidade</option>
                      {availableCities.map(c => (
                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {hasInput && (
          <div className="flex flex-col gap-2">
             <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Entrada de Texto</label>
             <textarea 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               placeholder={inputPlaceholder}
               className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 min-h-[100px] text-sm font-mono focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-white/90"
             />
          </div>
        )}

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-indigo-500/10 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative min-h-[140px] flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[1.5rem] p-6 border border-white/5 shadow-inner overflow-auto">
            <code className="text-base md:text-lg font-mono font-bold text-primary tracking-wider text-left whitespace-pre-wrap break-all w-full">
              {value || "// Resultado aparecerá aqui..."}
            </code>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleGenerate}
            disabled={isLoading || (hasInput && !inputValue)}
            className="flex-1 py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-black text-base uppercase tracking-tight flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 shadow-xl shadow-primary/30 group/btn"
          >
            <RefreshCw className={cn("w-5 h-5 transition-transform duration-500", isLoading ? "animate-spin" : "group-hover/btn:rotate-180")} />
            {isLoading ? "Processando..." : (hasInput ? "Processar Texto" : "Gerar Novo Dado")}
          </button>
          
          <button
            onClick={handleCopy}
            disabled={!value || value.startsWith("Erro:")}
            className="md:w-32 py-4 px-6 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all disabled:opacity-20 active:scale-95 text-white/70"
          >
            {copied ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                <Copy className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <div className="w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
        </div>
      </div>
    </motion.div>
  );
}
