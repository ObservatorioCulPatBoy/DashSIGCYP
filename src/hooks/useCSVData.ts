import { useEffect } from 'react';
import Papa from 'papaparse';
import { useDataStore } from '../store/useDataStore';
import { useFilterStore } from '../store/useFilterStore';

export const useCSVData = () => {
  const { setData, setAgrupacionesData, setLoading, setError } = useDataStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load Artistas
        const artistsResponse = await fetch('/data/artistas.csv');
        if (!artistsResponse.ok) throw new Error('No se pudo cargar artistas.csv');
        const artistsCsv = await artistsResponse.text();

        // Load Agrupaciones
        const agrupacionesResponse = await fetch('/data/agrupaciones.csv');
        if (!agrupacionesResponse.ok) throw new Error('No se pudo cargar agrupaciones.csv');
        const agrupacionesCsv = await agrupacionesResponse.text();

        const today = new Date();

        // Parse Artistas
        Papa.parse(artistsCsv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any) => {
              const estrato = parseInt(row['Estrato Social']) || 0;
              const longitud = parseFloat((row['Longitud'] || '0').replace(',', '.')) || 0;
              const latitud = parseFloat((row['Latitud'] || '0').replace(',', '.')) || 0;
              const añoRegistro = parseInt(row['Año registro']) || 0;
              const añoInicio = parseInt(row['Año de inicio de actividad']) || 0;

              let edad = 0;
              const fechaNac = row['Fecha de Nacimiento'];
              if (fechaNac) {
                if (fechaNac.includes('/')) {
                  const [day, month, year] = fechaNac.split('/').map(Number);
                  const birthDate = new Date(year, month - 1, day);
                  edad = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) edad--;
                } else {
                  const birthYear = parseInt(fechaNac);
                  if (birthYear > 0) edad = today.getFullYear() - birthYear;
                }
              }

              return {
                ...row,
                'Estrato Social': estrato,
                'Longitud': longitud,
                'Latitud': latitud,
                'Año registro': añoRegistro,
                'Año de inicio de actividades cultural': añoInicio,
                'Edad': edad
              };
            });
            setData(parsedData);
          }
        });

        // Parse Agrupaciones
        Papa.parse(agrupacionesCsv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any) => ({
              ...row,
              'Año': parseInt(row['Año']) || 0,
              'Años_trayectoria': parseFloat(row['Años_trayectoria']) || 0,
              'Mes': parseInt(row['Mes']) || 0,
              'Longitud': parseFloat(row['Longitud']) || 0,
              'Latitud': parseFloat(row['Latitud']) || 0,
            }));
            setAgrupacionesData(parsedData);
          }
        });

      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado');
      }
    };

    loadData();
  }, [setData, setAgrupacionesData, setLoading, setError]);
};
