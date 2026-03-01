"use client";

import { motion } from "framer-motion";
import { Copy, RefreshCw, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  onGenerate: () => string | object;
  icon?: React.ReactNode;
}

export function ToolCard({ title, description, onGenerate, icon }: ToolCardProps) {
  const [value, setValue] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      const result = onGenerate();
      setValue(typeof result === "string" ? result : JSON.stringify(result, null, 2));
      setIsLoading(false);
      setCopied(false);
    }, 300);
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass p-6 rounded-2xl flex flex-col gap-4 shadow-xl border-white/5 bg-white/5 dark:bg-slate-900/40 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <h3 className="font-bold text-xl tracking-tight">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="relative min-h-[48px] flex items-center justify-between bg-black/20 dark:bg-black/40 rounded-lg px-4 py-3 border border-white/5">
        <code className="text-primary font-mono text-sm break-all">
          {value || "Clique em Gerar..."}
        </code>
        {value && (
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-primary"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
      >
        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        {isLoading ? "Gerando..." : "Gerar Novo"}
      </button>
      
      {/* Decorative gradient */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
