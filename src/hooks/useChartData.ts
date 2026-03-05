import { useMemo } from 'react';
import { useFilterStore } from '../store/useFilterStore';

export const useChartData = (filteredData: any[]) => {
  const { entityType, profile } = useFilterStore();

  return useMemo(() => {
    if (entityType === 'Agrupaciones') {
      // 1. Sector Cultural (Horizontal Bars)
      const sectorCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const sector = d['Sector_cultural'];
        if (sector) sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      });
      const chart_sectores = Object.entries(sectorCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // 2. Trayectoria (Buckets)
      const trayectorias: { [key: string]: number } = {
        '0-5 años': 0, '6-10 años': 0, '11-20 años': 0, '20+ años': 0
      };
      filteredData.forEach(d => {
        const t = Number(d['Años_trayectoria']) || 0;
        if (t <= 5) trayectorias['0-5 años']++;
        else if (t <= 10) trayectorias['6-10 años']++;
        else if (t <= 20) trayectorias['11-20 años']++;
        else trayectorias['20+ años']++;
      });
      const chart_trayectoria = Object.entries(trayectorias).map(([name, value]) => ({ name, value }));

      // 3. Provincia (Pie)
      const provinciaCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const prov = d['Provincia'];
        if (prov) provinciaCounts[prov] = (provinciaCounts[prov] || 0) + 1;
      });
      const chart_provincias = Object.entries(provinciaCounts).map(([name, value]) => ({ name, value }));

      // 4. Evolución por Año (Line)
      const yearCounts: { [key: number]: number } = {};
      filteredData.forEach(d => {
        const year = d['Año'];
        if (year && year > 1900) {
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
      });
      const chart_evolucion = Object.entries(yearCounts)
        .map(([year, value]) => ({ year: parseInt(year), value }))
        .sort((a, b) => a.year - b.year);

      return {
        chart_sectores,
        chart_trayectoria,
        chart_provincias,
        chart_evolucion
      };
    }

    // Artistas logic
    if (profile === 'artistico') {
      // 1. Áreas Culturales de Desempeño
      const areaCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const area = d['Area en la que se desempeña'];
        if (area) areaCounts[area] = (areaCounts[area] || 0) + 1;
      });
      const chart_areas = Object.entries(areaCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // 2. Top 10 Tipo de Formación
      const formacionCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const form = d['Tipo de Formación artística'];
        if (form) formacionCounts[form] = (formacionCounts[form] || 0) + 1;
      });
      const chart_formacion = Object.entries(formacionCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // 3. Pertenencia a Organizaciones
      const orgCounts: { [key: string]: number } = { 'Sí': 0, 'No': 0 };
      filteredData.forEach(d => {
        const org = d['Hace parte de alguna organización']?.toString().toLowerCase();
        if (org === 'sí' || org === 'si') orgCounts['Sí']++;
        else orgCounts['No']++;
      });
      const chart_organizaciones = Object.entries(orgCounts).map(([name, value]) => ({ name, value }));

      // 4. Evolución de Inicio de Actividades
      const yearCounts: { [key: number]: number } = {};
      filteredData.forEach(d => {
        const year = d['Año de inicio de actividades cultural'];
        if (year && year > 1900) {
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
      });
      const chart_evolucion_inicio = Object.entries(yearCounts)
        .map(([year, value]) => ({ year: parseInt(year), value }))
        .sort((a, b) => a.year - b.year);

      return {
        chart_areas,
        chart_formacion,
        chart_organizaciones,
        chart_evolucion_inicio
      };
    }

    if (profile === 'demografico') {
      // 1. Distribución por género (Donut)
      const genderCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const gender = d['Tipo de sexo'] || 'No registra';
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      });
      const chart_genero = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

      // 2. Rangos de edad (Vertical Bars)
      const ageRanges = {
        '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0
      };
      const currentYear = new Date().getFullYear();
      filteredData.forEach(d => {
        let edad = Number(d['Edad']);
        if (d['Fecha de Nacimiento']) {
          const birthDate = new Date(d['Fecha de Nacimiento']);
          if (!isNaN(birthDate.getTime())) {
            edad = currentYear - birthDate.getFullYear();
          }
        }
        if (edad >= 18 && edad <= 25) ageRanges['18-25']++;
        else if (edad >= 26 && edad <= 35) ageRanges['26-35']++;
        else if (edad >= 36 && edad <= 45) ageRanges['36-45']++;
        else if (edad >= 46 && edad <= 55) ageRanges['46-55']++;
        else if (edad > 55) ageRanges['55+']++;
      });
      const chart_edad = Object.entries(ageRanges).map(([name, value]) => ({ name, value }));

      // 3. Nivel de escolaridad (Horizontal Bars - Ordered)
      const escolaridadOrder = [
        'Ninguno', 'Primaria', 'Secundaria', 'Bachillerato', 'Técnico', 
        'Tecnólogo', 'Profesional', 'Especialización', 'Maestría', 'Doctorado'
      ];
      const escolaridadCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const esc = d['Grado de Escolaridad'];
        if (esc) escolaridadCounts[esc] = (escolaridadCounts[esc] || 0) + 1;
      });
      const chart_escolaridad = Object.entries(escolaridadCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => {
          const idxA = escolaridadOrder.findIndex(o => a.name.includes(o));
          const idxB = escolaridadOrder.findIndex(o => b.name.includes(o));
          return idxA - idxB;
        });

      // 4. Poblaciones especiales (Horizontal Bars)
      const poblacionCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const pob = d['Población a la que pertenece'];
        if (pob) poblacionCounts[pob] = (poblacionCounts[pob] || 0) + 1;
      });
      const chart_poblacion = Object.entries(poblacionCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      return {
        chart_genero,
        chart_edad,
        chart_escolaridad,
        chart_poblacion
      };
    }

    if (profile === 'socioeconomico') {
      // 1. Distribución por estrato (Vertical Bars)
      const estratoCounts: { [key: string]: number } = {
        'Estrato 1': 0, 'Estrato 2': 0, 'Estrato 3': 0,
        'Estrato 4': 0, 'Estrato 5': 0, 'Estrato 6': 0
      };
      filteredData.forEach(d => {
        const estrato = d['Estrato Social'];
        if (estrato >= 1 && estrato <= 6) {
          estratoCounts[`Estrato ${estrato}`]++;
        }
      });
      const chart_estrato = Object.entries(estratoCounts).map(([name, value]) => ({ name, value }));

      // 2. Top 8 EPS (Horizontal Bars)
      const epsCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const eps = d['Eps'];
        if (eps && eps !== 'No afiliado') {
          epsCounts[eps] = (epsCounts[eps] || 0) + 1;
        }
      });
      const chart_eps = Object.entries(epsCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      // 3. Top 8 Pension (Horizontal Bars)
      const pensionCounts: { [key: string]: number } = {};
      filteredData.forEach(d => {
        const pen = d['Empresa de pensión'];
        if (pen && pen !== 'Sin pensión') {
          pensionCounts[pen] = (pensionCounts[pen] || 0) + 1;
        }
      });
      const chart_pension = Object.entries(pensionCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      return {
        chart_estrato,
        chart_eps,
        chart_pension
      };
    }

    // Default/Other logic (original Artistas logic)
    const areaCounts: { [key: string]: number } = {};
    filteredData.forEach(d => {
      const area = d['Area en la que se desempeña'];
      if (area) areaCounts[area] = (areaCounts[area] || 0) + 1;
    });
    const chart1_areas = Object.entries(areaCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const estratoCounts: { [key: string]: number } = {
      'Estrato 1': 0, 'Estrato 2': 0, 'Estrato 3': 0,
      'Estrato 4': 0, 'Estrato 5': 0, 'Estrato 6': 0
    };
    filteredData.forEach(d => {
      const estrato = d['Estrato Social'];
      if (estrato >= 1 && estrato <= 6) {
        estratoCounts[`Estrato ${estrato}`]++;
      }
    });
    const chart2_estrato = Object.entries(estratoCounts).map(([name, value]) => ({ name, value }));

    const escolaridadMap: { [key: string]: any } = {};
    filteredData.forEach(d => {
      const esc = d['Grado de Escolaridad'] || 'No registra';
      const sexo = d['Tipo de sexo'] || 'Otro';
      if (!escolaridadMap[esc]) {
        escolaridadMap[esc] = { escolaridad: esc, Masculino: 0, Femenino: 0, Otro: 0 };
      }
      if (sexo === 'Masculino' || sexo === 'Femenino') {
        escolaridadMap[esc][sexo]++;
      } else {
        escolaridadMap[esc].Otro++;
      }
    });
    const chart3_escolaridad = Object.values(escolaridadMap);

    const yearCounts: { [key: number]: number } = {};
    filteredData.forEach(d => {
      const year = d['Año de inicio de actividades cultural'];
      if (year && year > 1900) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });
    const chart4_tiempo = Object.entries(yearCounts)
      .map(([year, value]) => ({ year: parseInt(year), value }))
      .sort((a, b) => a.year - b.year);

    const formacionCounts: { [key: string]: number } = {};
    filteredData.forEach(d => {
      const form = d['Tipo de Formación artística'];
      if (form) formacionCounts[form] = (formacionCounts[form] || 0) + 1;
    });
    const chart5_formacion = Object.entries(formacionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const poblacionCounts: { [key: string]: number } = {};
    filteredData.forEach(d => {
      const pob = d['Población a la que pertenece'];
      if (pob) poblacionCounts[pob] = (poblacionCounts[pob] || 0) + 1;
    });
    const chart6_poblacion = Object.entries(poblacionCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return {
      chart1_areas,
      chart2_estrato,
      chart3_escolaridad,
      chart4_tiempo,
      chart5_formacion,
      chart6_poblacion
    };
  }, [filteredData, entityType, profile]);
};
