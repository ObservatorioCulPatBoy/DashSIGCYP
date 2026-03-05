import React from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { X } from 'lucide-react';

export const FilterChips = () => {
  const filters = useFilterStore();
  
  const activeFilters = [];

  if (filters.provincia.length > 0) activeFilters.push({ label: `Provincia: ${filters.provincia.length}`, key: 'provincia', value: [] });
  if (filters.municipio.length > 0) activeFilters.push({ label: `Municipio: ${filters.municipio.length}`, key: 'municipio', value: [] });
  
  if (filters.entityType === 'Artistas') {
    if (filters.area.length > 0) activeFilters.push({ label: `Área: ${filters.area.length}`, key: 'area', value: [] });
    if (filters.poblacion.length > 0) activeFilters.push({ label: `Población: ${filters.poblacion.length}`, key: 'poblacion', value: [] });
  }

  const removeFilter = (filter: any) => {
    if (filter.special === 'estrato') {
      filters.setFiltro('estratoMin', 1);
      filters.setFiltro('estratoMax', 6);
    } else {
      filters.setFiltro(filter.key, filter.value);
    }
  };

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-panel-bg rounded-xl border border-border-light shadow-sm">
      <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center mr-2">Filtros Activos:</span>
      {activeFilters.map((filter, idx) => (
        <div 
          key={idx}
          className="flex items-center gap-1.5 bg-accent-orange/10 text-accent-orange border border-accent-orange/30 px-3 py-1 rounded-full text-xs font-semibold"
        >
          {filter.label}
          <button 
            onClick={() => removeFilter(filter)}
            className="hover:bg-accent-orange hover:text-white rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button 
        onClick={() => filters.limpiarFiltros()}
        className="text-xs font-bold text-text-muted hover:text-accent-orange transition-colors ml-auto"
      >
        Limpiar todo
      </button>
    </div>
  );
};
