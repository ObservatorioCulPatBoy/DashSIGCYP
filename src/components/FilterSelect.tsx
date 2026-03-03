import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FilterSelect = ({ label, options, selected, onChange, placeholder = "Seleccionar..." }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    // If already selected, deselect it (optional, but usually good for filters)
    if (selected.includes(option)) {
      onChange([]);
    } else {
      onChange([option]);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-[140px] flex-shrink-0">
      <div className="text-[10px] font-bold text-text-soft uppercase tracking-wider mb-0.5 ml-1">{label}</div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-app-bg border border-border-light rounded-lg px-3 py-1.5 text-left text-xs flex justify-between items-center hover:border-accent-primary/50 transition-all shadow-sm"
      >
        <span className="truncate font-medium text-text-dark">
          {selected.length > 0 ? selected[0] : placeholder}
        </span>
        <ChevronRight className={`w-3 h-3 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[3000]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute left-0 top-full z-[3001] w-full min-w-[180px] mt-1 bg-panel-bg border border-border-light rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar py-1"
            >
              {options.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-text-muted italic">Sin opciones</div>
              ) : (
                options.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="w-full px-3 py-1.5 text-left text-[11px] hover:bg-app-bg flex items-center justify-between transition-colors group"
                  >
                    <span className={`transition-colors truncate mr-2 ${selected.includes(option) ? 'text-accent-primary font-bold' : 'text-text-dark group-hover:text-accent-primary'}`}>
                      {option}
                    </span>
                    {selected.includes(option) && <Check className="w-3 h-3 text-accent-primary flex-shrink-0" />}
                  </button>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
