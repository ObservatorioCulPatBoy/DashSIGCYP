import React, { useEffect, useState } from 'react';
import { motion, animate } from 'motion/react';

interface KPICardProps {
  titulo: string;
  valor: number;
  valorTexto?: string;
  unidad?: string;
  color: string;
  descripcion?: string;
  key?: any;
}

export const KPICard = ({ titulo, valor, valorTexto, unidad, color }: KPICardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (valorTexto) return;
    const controls = animate(displayValue, valor, {
      duration: 0.8,
      onUpdate: (value) => setDisplayValue(value),
    });
    return () => controls.stop();
  }, [valor, valorTexto]);

  const formattedValue = valorTexto || (valor % 1 === 0 ? Math.round(displayValue) : displayValue.toFixed(1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4, 
        boxShadow: `0 0 20px -5px ${color}40`,
        borderColor: color
      }}
      className="bg-panel-bg rounded-2xl p-5 border border-border-light border-l-4 shadow-sm flex flex-col justify-between h-full transition-all duration-300"
      style={{ borderLeftColor: color }}
    >
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-text-dark">
            {formattedValue}
          </span>
          {unidad && (
            <span className="text-sm font-medium text-text-muted">
              {unidad}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-text-muted mt-1 uppercase tracking-wider">
          {titulo}
        </h3>
      </div>
    </motion.div>
  );
};
