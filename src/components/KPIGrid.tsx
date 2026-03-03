import React from 'react';
import { useKPIs } from '../hooks/useKPIs';
import { useFilteredData } from '../hooks/useFilteredData';
import { useFilterStore } from '../store/useFilterStore';
import { KPICard } from './KPICard';

export const KPIGrid = ({ isCompact }: { isCompact?: boolean }) => {
  const { filteredData } = useFilteredData();
  const kpis = useKPIs(filteredData);
  const entityType = useFilterStore((state) => state.entityType);

  const artistCards = [
    { titulo: "Total Artistas", valor: kpis.totalArtistas, valorTexto: undefined, unidad: "", color: "#296A3D" },
    { titulo: "Municipios", valor: kpis.municipios, valorTexto: undefined, unidad: "", color: "#004E89" },
    { titulo: "Mujeres / Hombres", valor: kpis.mujeresCount, valorTexto: `${kpis.mujeresCount} / ${kpis.hombresCount}`, unidad: "", color: "#A7C957" },
    { titulo: "% Discapacidad", valor: kpis.porcentajeDiscapacidad, valorTexto: undefined, unidad: "%", color: "#4E5154" },
    { titulo: "Cabeza Familia", valor: kpis.cabezaFamiliaCount, valorTexto: undefined, unidad: "artistas", color: "#B2971A" },
    { titulo: "Actividad Principal", valor: kpis.actividadPrincipalCount, valorTexto: undefined, unidad: "artistas", color: "#407BA7" },
    { titulo: "% Con EPS", valor: kpis.porcentajeEPS, valorTexto: undefined, unidad: "%", color: "#639446" },
    { titulo: "Promedio Edad", valor: kpis.promedioEdad, valorTexto: undefined, unidad: "años", color: "#070C4F" }
  ];

  const artisticProfileCards = [
    { titulo: "Total Artistas", valor: kpis.totalArtistas, valorTexto: undefined, unidad: "", color: "#296A3D" },
    { titulo: "Municipios", valor: kpis.municipios, valorTexto: undefined, unidad: "", color: "#004E89" },
    { titulo: "Áreas Artísticas", valor: kpis.areasArtisticas, valorTexto: undefined, unidad: "", color: "#A7C957" },
    { titulo: "Actividad Principal", valor: kpis.porcentajeActividadPrincipal, valorTexto: undefined, unidad: "%", color: "#407BA7" },
    { titulo: "Trayectoria Promedio", valor: kpis.promedioTrayectoriaArtistas, valorTexto: undefined, unidad: "años", color: "#B2971A" },
  ];

  const demographicProfileCards = [
    { titulo: "Edad promedio", valor: kpis.promedioEdad, valorTexto: undefined, unidad: "años", color: "#070C4F" },
    { titulo: "Mujeres", valor: kpis.porcentajeMujeres, valorTexto: undefined, unidad: "%", color: "#A7C957" },
    { titulo: "Cabezas de Familia", valor: kpis.porcentajeCabezaFamilia, valorTexto: undefined, unidad: "%", color: "#B2971A" },
    { titulo: "Con Discapacidad", valor: kpis.porcentajeDiscapacidad, valorTexto: undefined, unidad: "%", color: "#4E5154" },
  ];

  const socioeconomicProfileCards = [
    { titulo: "Total Artistas", valor: kpis.totalArtistas, valorTexto: undefined, unidad: "", color: "#296A3D" },
    { titulo: "Con EPS", valor: kpis.porcentajeEPS, valorTexto: undefined, unidad: "%", color: "#639446" },
    { titulo: "Con Pensión", valor: kpis.porcentajePension, valorTexto: undefined, unidad: "%", color: "#004E89" },
  ];

  const agrupacionCards = [
    { titulo: "Total Agrupaciones", valor: kpis.total, valorTexto: undefined, unidad: "", color: "#296A3D" },
    { titulo: "Municipios con presencia", valor: kpis.municipios, valorTexto: undefined, unidad: "", color: "#004E89" },
    { titulo: "Trayectoria promedio", valor: kpis.promedioTrayectoria, valorTexto: undefined, unidad: "años", color: "#A7C957" },
  ];

  const profile = useFilterStore((state) => state.profile);

  const cards = entityType === 'Artistas' 
    ? (profile === 'artistico' ? artisticProfileCards : profile === 'demografico' ? demographicProfileCards : profile === 'socioeconomico' ? socioeconomicProfileCards : artistCards) 
    : entityType === 'Agrupaciones' ? agrupacionCards : [];

  return (
    <div className={`grid gap-4 mb-6 ${isCompact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
      {cards.map((card, index) => (
        <KPICard 
          key={index} 
          titulo={card.titulo}
          valor={card.valor}
          valorTexto={card.valorTexto}
          unidad={card.unidad}
          color={card.color}
        />
      ))}
    </div>
  );
};
