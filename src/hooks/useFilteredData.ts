import { useMemo } from 'react';
import { useDataStore } from '../store/useDataStore';
import { useFilterStore } from '../store/useFilterStore';

export const useFilteredData = () => {
  const { rawData, agrupacionesData } = useDataStore();
  const filters = useFilterStore();

  const filteredData = useMemo(() => {
    if (filters.entityType === 'Artistas') {
      return rawData.filter((item) => {
        if (filters.provincia.length > 0 && !filters.provincia.includes(item.Provincia)) return false;
        if (filters.municipio.length > 0 && !filters.municipio.includes(item.Municipio)) return false;
        if (filters.area.length > 0 && !filters.area.includes(item['Area en la que se desempeña'])) return false;
        if (filters.poblacion.length > 0 && !filters.poblacion.includes(item['Población a la que pertenece'])) return false;
        return true;
      });
    } else if (filters.entityType === 'Agrupaciones') {
      return agrupacionesData.filter((item) => {
        if (filters.provincia.length > 0 && !filters.provincia.includes(item.Provincia)) return false;
        if (filters.municipio.length > 0 && !filters.municipio.includes(item.Municipio)) return false;
        if (filters.area.length > 0 && !filters.area.includes(item.Sector_cultural)) return false;
        // Agrupaciones don't have population data in the current CSV, 
        // but we'll keep the logic consistent in case it's added later
        // or to ensure that if a population is selected, it correctly returns empty if no match
        return true;
      });
    }
    return [];
  }, [rawData, agrupacionesData, filters]);

  return {
    filteredData,
    totalFiltrado: filteredData.length
  };
};
