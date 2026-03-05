import { create } from 'zustand';

interface Artist {
  'Fecha de Nacimiento': string;
  'Tipo de sexo': string;
  'Estrato Social': number;
  'Cabeza de Familia': string;
  'Posee alguna discapacidad': string;
  'Población a la que pertenece': string;
  'Grado de Escolaridad': string;
  'Tipo de Formación artística': string;
  'Sub area': string;
  'Es su principal actividad': string;
  'Año de inicio de actividades cultural': number;
  'Area en la que se desempeña': string;
  'id_artista': string;
  'Año registro': number;
  'Municipio': string;
  'Longitud': number;
  'Latitud': number;
  'Provincia': string;
  'Hace parte de alguna organización': string;
  'Empresa de pensión': string;
  'Eps': string;
  'regimen': string;
  'Edad': number;
}

interface Agrupacion {
  'Sector_cultural': string;
  'Año': number;
  'Años_trayectoria': number;
  'Mes': number;
  'Municipio': string;
  'Longitud': number;
  'Latitud': number;
  'Provincia': string;
  'id_agrupacion': string;
  'estado_validacion': string;
}

interface DataState {
  rawData: Artist[];
  agrupacionesData: Agrupacion[];
  isLoading: boolean;
  error: string | null;
  setData: (data: Artist[]) => void;
  setAgrupacionesData: (data: Agrupacion[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDataStore = create<DataState>((set) => ({
  rawData: [],
  agrupacionesData: [],
  isLoading: true,
  error: null,
  setData: (data) => set({ rawData: data, isLoading: false, error: null }),
  setAgrupacionesData: (data) => set({ agrupacionesData: data, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
