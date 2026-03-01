"use client";

import { cn } from "@/lib/utils";
import { 
  CreditCard, 
  Building2, 
  Fingerprint, 
  MapPin, 
  LayoutDashboard, 
  Menu, 
  X,
  Sparkles,
  Check,
  Binary,
  Code2,
  CaseSensitive,
  ShieldCheck,
  Lock,
  FileJson,
  Palette,
  Type,
  Ruler,
  Clock
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToolId = 
  | "dashboard" | "lib-docs"
  | "cpf" | "cnpj" | "uuid" | "address" | "pis" | "credit-card" | "validator"
  | "base64" | "json-format" | "case-converter"
  | "password" | "hash" | "jwt"
  | "colors" | "lorem" | "units" 
  | "timestamp";

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

export function Sidebar({ activeTool, onSelectTool }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const categories = [
    {
      label: "Favoritos",
      items: [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: "lib-docs", label: "Documentação Lib", icon: <Code2 className="w-5 h-5" /> },
      ]
    },
    {
      label: "Dados Brasil",
      items: [
        { id: "cpf", label: "Gerador de CPF", icon: <CreditCard className="w-5 h-5" /> },
        { id: "cnpj", label: "Gerador de CNPJ", icon: <Building2 className="w-5 h-5" /> },
        { id: "address", label: "Gerador de Endereço", icon: <MapPin className="w-5 h-5" /> },
        { id: "pis", label: "Gerador de PIS", icon: <Building2 className="w-5 h-5 opacity-70" /> },
        { id: "credit-card", label: "Cartão de Crédito", icon: <CreditCard className="w-5 h-5 opacity-70" /> },
        { id: "validator", label: "Validador", icon: <Check className="w-5 h-5" /> },
      ]
    },
    {
      label: "Texto & Codificação",
      items: [
        { id: "base64", label: "Base64", icon: <Binary className="w-5 h-5" /> },
        { id: "json-format", label: "JSON Formatter", icon: <Code2 className="w-5 h-5" /> },
        { id: "case-converter", label: "Case Converter", icon: <CaseSensitive className="w-5 h-5" /> },
        { id: "uuid", label: "Gerador de UUID", icon: <Fingerprint className="w-5 h-5" /> },
      ]
    },
    {
      label: "Segurança",
      items: [
        { id: "password", label: "Gerador de Senha", icon: <ShieldCheck className="w-5 h-5" /> },
        { id: "hash", label: "Hash Generator", icon: <Lock className="w-5 h-5" /> },
        { id: "jwt", label: "JWT Debugger", icon: <FileJson className="w-5 h-5" /> },
      ]
    },
    {
      label: "Design & Dev",
      items: [
        { id: "colors", label: "Conversor de Cores", icon: <Palette className="w-5 h-5" /> },
        { id: "lorem", label: "Lorem Ipsum", icon: <Type className="w-5 h-5" /> },
        { id: "units", label: "Unidades CSS", icon: <Ruler className="w-5 h-5" /> },
        { id: "timestamp", label: "Timestamp", icon: <Clock className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary rounded-lg text-white shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-card/80 backdrop-blur-xl border-r border-white/5 flex flex-col transition-all duration-300 shadow-2xl",
              !isOpen && "-translate-x-full"
            )}
          >
            <div className="p-6 flex items-center gap-3 border-bottom border-white/5">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
                DevUtils Pro
              </h1>
            </div>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              {categories.map((category) => (
                <div key={category.label} className="flex flex-col gap-2">
                  <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
                    {category.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectTool(item.id as ToolId)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                          activeTool === item.id 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <span className={cn(
                          "transition-transform duration-200",
                          activeTool === item.id ? "scale-110" : "group-hover:scale-110"
                        )}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
