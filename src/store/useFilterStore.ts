import { create } from 'zustand';

interface FilterState {
  entityType: 'Artistas' | 'Agrupaciones' | 'Entidades';
  profile: 'artistico' | 'demografico' | 'socioeconomico';
  provincia: string[];
  municipio: string[];
  area: string[];
  poblacion: string[];
  setFiltro: (campo: string, valor: any) => void;
  limpiarFiltros: () => void;
}

const initialState = {
  entityType: 'Artistas' as const,
  profile: 'artistico' as const,
  provincia: [],
  municipio: [],
  area: [],
  poblacion: [],
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setFiltro: (campo, valor) => set((state) => ({ ...state, [campo]: valor })),
  limpiarFiltros: () => set((state) => ({
    ...initialState,
    entityType: state.entityType,
  })),
}));
