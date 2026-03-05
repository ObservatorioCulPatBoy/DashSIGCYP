import React, { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import { useFilterStore } from '../store/useFilterStore';
import { FilterSelect } from './FilterSelect';
import { RefreshCcw } from 'lucide-react';

export const Header = () => {
  const { rawData, agrupacionesData } = useDataStore();
  const filters = useFilterStore();
  
  const options = useMemo(() => {
    const currentData = filters.entityType === 'Agrupaciones' ? agrupacionesData : rawData;
    
    const provinces = [...new Set(currentData.map(d => d.Provincia))].sort();
    
    let areas: string[] = [];
    let populations: string[] = [];
    
    if (filters.entityType === 'Agrupaciones') {
      areas = [...new Set(agrupacionesData.map(d => (d as any).Sector_cultural))].sort();
      populations = [];
    } else {
      areas = [...new Set(rawData.map(d => d['Area en la que se desempeña']))].sort();
      populations = [...new Set(rawData.map(d => d['Población a la que pertenece']))].sort();
    }
    
    const filteredByProv = filters.provincia.length > 0 
      ? currentData.filter(d => filters.provincia.includes(d.Provincia))
      : currentData;
    const municipalities = [...new Set(filteredByProv.map(d => d.Municipio))].sort();

    return { provinces, municipalities, areas, populations };
  }, [rawData, agrupacionesData, filters.entityType, filters.provincia]);

  const lastUpdate = new Date().toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-auto min-h-[80px] py-4 lg:h-20 bg-panel-bg border-b border-border-light flex flex-col lg:flex-row items-center px-6 sticky top-0 z-[2000] w-full shadow-sm gap-4">
      {/* Logo Section */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <img 
          src="/data/Logo.png" 
          alt="Boyacá Logo" 
          className="h-16 w-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Title Section - Hidden on mobile */}
      <div className="hidden md:flex flex-1 border-l border-border-light pl-8 h-10 flex-col justify-center">
        <h1 className="text-lg font-bold text-text-dark tracking-tight leading-none uppercase">Sistema de Información Cultural</h1>
        <h3 className="text-sm text-text-soft tracking-tight leading-none">Registro de Artistas y Gestores Culturales</h3>
      </div>
      


      {/* Filters Section - Fixed clipping by removing overflow-x-auto and using flex-wrap on small screens */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto overflow-visible pb-2 lg:pb-0">
          <FilterSelect 
            label="Provincia" 
            options={options.provinces} 
            selected={filters.provincia}
            onChange={(val: string[]) => filters.setFiltro('provincia', val)}
          />
          <FilterSelect 
            label="Municipio" 
            options={options.municipalities} 
            selected={filters.municipio}
            onChange={(val: string[]) => filters.setFiltro('municipio', val)}
          />
          <FilterSelect 
            label="Área Cultural" 
            options={options.areas} 
            selected={filters.area}
            onChange={(val: string[]) => filters.setFiltro('area', val)}
          />
          {filters.entityType !== 'Agrupaciones' && (
            <FilterSelect 
              label="Población" 
              options={options.populations} 
              selected={filters.poblacion}
              onChange={(val: string[]) => filters.setFiltro('poblacion', val)}
            />
          )}
          <button
            onClick={() => filters.limpiarFiltros()}
            className="ml-2 p-2 text-text-muted hover:text-accent-orange transition-colors"
            title="Limpiar Filtros"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
    </header>
  );
};
