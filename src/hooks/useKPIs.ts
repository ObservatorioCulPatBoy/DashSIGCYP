import { useMemo } from 'react';
import { useFilterStore } from '../store/useFilterStore';

export const useKPIs = (filteredData: any[]) => {
  const { entityType, profile } = useFilterStore();

  return useMemo(() => {
    const total = filteredData.length;
    
    if (total === 0) {
      return {
        total: 0,
        municipios: 0,
        promedioTrayectoria: 0,
        // Artistas specific
        totalArtistas: 0,
        mujeresCount: 0,
        hombresCount: 0,
        porcentajeDiscapacidad: 0,
        cabezaFamiliaCount: 0,
        actividadPrincipalCount: 0,
        porcentajeEPS: 0,
        promedioEdad: 0,
        // Artistic Profile
        areasArtisticas: 0,
        porcentajeActividadPrincipal: 0,
        promedioTrayectoriaArtistas: 0,
      };
    }

    const municipios = new Set(filteredData.map(d => d['Municipio'])).size;

    if (entityType === 'Agrupaciones') {
      const sumaTrayectoria = filteredData.reduce((acc, d) => acc + (Number(d['Años_trayectoria']) || 0), 0);
      const promedioTrayectoria = sumaTrayectoria / total;

      return {
        total,
        municipios,
        promedioTrayectoria: parseFloat(promedioTrayectoria.toFixed(1)),
      };
    }

    // Artistas logic
    if (profile === 'artistico') {
      const areasArtisticas = new Set(filteredData.map(d => d['Area en la que se desempeña'])).size;
      const actividadPrincipal = filteredData.filter(d => d['Es su principal actividad']?.toString().toLowerCase() === 'sí' || d['Es su principal actividad']?.toString().toLowerCase() === 'si').length;
      const currentYear = new Date().getFullYear();
      const sumaTrayectoria = filteredData.reduce((acc, d) => {
        const startYear = Number(d['Año de inicio de actividades cultural']);
        if (startYear && startYear > 1900 && startYear <= currentYear) {
          return acc + (currentYear - startYear);
        }
        return acc;
      }, 0);
      const countTrayectoria = filteredData.filter(d => {
        const startYear = Number(d['Año de inicio de actividades cultural']);
        return startYear && startYear > 1900 && startYear <= currentYear;
      }).length;
      const promedioTrayectoria = countTrayectoria > 0 ? sumaTrayectoria / countTrayectoria : 0;

      return {
        total,
        totalArtistas: total,
        municipios,
        areasArtisticas,
        porcentajeActividadPrincipal: parseFloat(((actividadPrincipal / total) * 100).toFixed(1)),
        promedioTrayectoriaArtistas: parseFloat(promedioTrayectoria.toFixed(1)),
      };
    }

    if (profile === 'demografico') {
      const currentYear = new Date().getFullYear();
      const sumaEdades = filteredData.reduce((acc, d) => {
        let edad = Number(d['Edad']);
        if (d['Fecha de Nacimiento']) {
          const birthDate = new Date(d['Fecha de Nacimiento']);
          if (!isNaN(birthDate.getTime())) {
            edad = currentYear - birthDate.getFullYear();
          }
        }
        return acc + (edad || 0);
      }, 0);
      const promedioEdad = sumaEdades / total;

      const mujeres = filteredData.filter(d => d['Tipo de sexo'] === 'Femenino').length;
      const cabezaFamilia = filteredData.filter(d => d['Cabeza de Familia']?.toString().toLowerCase() === 'sí' || d['Cabeza de Familia']?.toString().toLowerCase() === 'si').length;
      const discapacidad = filteredData.filter(d => d['Posee alguna discapacidad']?.toString().toLowerCase() === 'sí' || d['Posee alguna discapacidad']?.toString().toLowerCase() === 'si').length;

      return {
        total,
        totalArtistas: total,
        promedioEdad: parseFloat(promedioEdad.toFixed(1)),
        porcentajeMujeres: parseFloat(((mujeres / total) * 100).toFixed(1)),
        porcentajeCabezaFamilia: parseFloat(((cabezaFamilia / total) * 100).toFixed(1)),
        porcentajeDiscapacidad: parseFloat(((discapacidad / total) * 100).toFixed(1)),
      };
    }

    if (profile === 'socioeconomico') {
      const conEPS = filteredData.filter(d => d['Eps'] && d['Eps'].toString().toLowerCase() !== 'no afiliado').length;
      const conPension = filteredData.filter(d => d['Empresa de pensión'] && d['Empresa de pensión'].toString().toLowerCase() !== 'sin pensión').length;

      return {
        total,
        totalArtistas: total,
        porcentajeEPS: parseFloat(((conEPS / total) * 100).toFixed(1)),
        porcentajePension: parseFloat(((conPension / total) * 100).toFixed(1)),
      };
    }

    // Default/Other logic (original Artistas logic)
    const mujeres = filteredData.filter(d => d['Tipo de sexo'] === 'Femenino').length;
    const hombres = filteredData.filter(d => d['Tipo de sexo'] === 'Masculino').length;
    const discapacidad = filteredData.filter(d => d['Posee alguna discapacidad']?.toString().toLowerCase() === 'sí' || d['Posee alguna discapacidad']?.toString().toLowerCase() === 'si').length;
    const cabezaFamilia = filteredData.filter(d => d['Cabeza de Familia']?.toString().toLowerCase() === 'sí' || d['Cabeza de Familia']?.toString().toLowerCase() === 'si').length;
    const actividadPrincipal = filteredData.filter(d => d['Es su principal actividad']?.toString().toLowerCase() === 'sí' || d['Es su principal actividad']?.toString().toLowerCase() === 'si').length;
    const conEPS = filteredData.filter(d => d['Eps'] && d['Eps'].trim() !== '').length;
    const sumaEdades = filteredData.reduce((acc, d) => acc + (Number(d['Edad']) || 0), 0);
    const promedioEdad = sumaEdades / total;

    return {
      total,
      totalArtistas: total,
      municipios: municipios,
      mujeresCount: mujeres,
      hombresCount: hombres,
      porcentajeDiscapacidad: parseFloat(((discapacidad / total) * 100).toFixed(1)),
      cabezaFamiliaCount: cabezaFamilia,
      actividadPrincipalCount: actividadPrincipal,
      porcentajeEPS: parseFloat(((conEPS / total) * 100).toFixed(1)),
      promedioEdad: parseFloat(promedioEdad.toFixed(1)),
    };
  }, [filteredData, entityType, profile]);
};
