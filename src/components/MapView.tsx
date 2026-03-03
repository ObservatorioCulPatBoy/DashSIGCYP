import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import * as topojson from 'topojson-client';
import { useFilteredData } from '../hooks/useFilteredData';
import { useMapData } from '../hooks/useMapData';
import { useFilterStore } from '../store/useFilterStore';
import { getColorByDensity } from '../utils/mapColors';
import { Maximize, Info } from 'lucide-react';

const Legend = () => {
  const steps = [
    { label: 'Sin datos', color: '#E5E7EB' },
    { label: '1 - 10', color: '#A7C957' },
    { label: '11 - 100', color: '#639446' },
    { label: '101 - 250', color: '#296A3D' },
    { label: 'más de 250', color: '#070C4F' },
  ];

  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-xl border border-border-light shadow-lg">
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Densidad</p>
      <div className="flex flex-col gap-1.5">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: step.color }} />
            <span className="text-[10px] text-text-dark font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MapView = () => {
  const { filteredData } = useFilteredData();
  const { municipioCounts, maxMunicipioCount } = useMapData(filteredData);
  const filters = useFilterStore();
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('/data/municipios.geojson');
        const data = await response.json();
        
        if (data.type === 'Topology') {
          // Convert TopoJSON to GeoJSON
          const objectName = Object.keys(data.objects)[0];
          const geojson = topojson.feature(data, data.objects[objectName] as any);
          setGeoData(geojson);
        } else if (data.type === 'FeatureCollection' || data.features) {
          setGeoData(data);
        } else {
          setGeoData(null);
        }
      } catch (error) {
        console.error('Error loading map data:', error);
        setGeoData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGeoJSON();
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    const name = feature.properties.MPIO_CNMBR || feature.properties.municipio || feature.properties.name;
    const normalizedName = name?.toUpperCase();
    
    // Find count by matching normalized names
    const dataKey = Object.keys(municipioCounts).find(k => k.toUpperCase() === normalizedName);
    const count = dataKey ? municipioCounts[dataKey] : 0;
    
    const isSelected = filters.municipio.includes(dataKey || '');

    const label = filters.entityType === 'Artistas' ? 'artistas' : 'agrupaciones';

    layer.bindTooltip(
      `<div class="bg-white text-slate-900 p-2 rounded-lg border border-accent-primary shadow-xl pointer-events-none">
        <p class="font-bold text-xs">${name}</p>
        <p class="text-[10px] text-accent-primary">${count} ${label}</p>
      </div>`,
      { sticky: true, direction: 'top', opacity: 1, className: 'custom-map-tooltip' }
    );

    layer.on({
      click: () => {
        if (dataKey) {
          if (isSelected) {
            filters.setFiltro('municipio', filters.municipio.filter(m => m !== dataKey));
          } else {
            filters.setFiltro('municipio', [...filters.municipio, dataKey]);
          }
        }
      },
      mouseover: (e: any) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.9,
          weight: isSelected ? 4 : 2,
        });
      },
      mouseout: (e: any) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.7,
          weight: isSelected ? 3 : 1,
        });
      },
    });
  };

  const geoJsonStyle = (feature: any) => {
    const name = feature.properties.MPIO_CNMBR || feature.properties.municipio || feature.properties.name;
    const normalizedName = name?.toUpperCase();
    
    const dataKey = Object.keys(municipioCounts).find(k => k.toUpperCase() === normalizedName);
    const count = dataKey ? municipioCounts[dataKey] : 0;
    
    const isSelected = filters.municipio.includes(dataKey || '');

    return {
      fillColor: getColorByDensity(count),
      fillOpacity: 0.7,
      color: isSelected ? '#296A3D' : '#94A3B8',
      weight: isSelected ? 3 : 1,
    };
  };

  return (
    <div className="relative w-full h-full bg-panel-bg rounded-3xl overflow-hidden border border-border-light shadow-sm">
      <MapContainer
        center={[5.6, -73.1]} // Adjusted center for Boyacá municipalities
        zoom={9}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {geoData && (
          <GeoJSON
            key={JSON.stringify(filters.municipio)} // Force re-render on filter change to update styles
            data={geoData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Overlay for empty GeoJSON */}
      {!isLoading && !geoData && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-app-bg/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-panel-bg p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center max-w-xs text-center">
            <Info className="w-10 h-10 text-accent-blue mb-3" />
            <p className="text-sm font-medium text-text-light">Sube tu archivo municipios.geojson para ver los polígonos coloreados por densidad.</p>
          </div>
        </div>
      )}

      {/* Ver todo button */}
      <button
        onClick={() => filters.setFiltro('municipio', [])}
        className="absolute top-6 right-6 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-border-light shadow-lg flex items-center gap-2 text-xs font-bold text-text-dark hover:bg-accent-primary hover:text-white transition-all"
      >
        <Maximize className="w-4 h-4" />
        Ver todo
      </button>

      <Legend />

      <style>{`
        .custom-map-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-container {
          background: #F5F2ED !important;
        }
      `}</style>
    </div>
  );
};
