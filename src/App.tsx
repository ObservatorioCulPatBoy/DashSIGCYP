import { useCSVData } from './hooks/useCSVData';
import { useDataStore } from './store/useDataStore';
import { useFilterStore } from './store/useFilterStore';
import { useFilteredData } from './hooks/useFilteredData';
import { Header } from './components/Header';
import { FilterChips } from './components/FilterChips';
import { ProfileSelector } from './components/ProfileSelector';
import { KPIGrid } from './components/KPIGrid';
import { MapView } from './components/MapView';
import { ChartsGrid } from './components/ChartsGrid';
import { AlertCircle, Search, RefreshCcw } from 'lucide-react';

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3 h-[450px] bg-panel-bg rounded-3xl border border-border-light" />
      <div className="w-full lg:w-1/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-panel-bg rounded-2xl border border-border-light" />
        ))}
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-80 bg-panel-bg rounded-2xl border border-border-light" />
      ))}
    </div>
  </div>
);

export default function App() {
  useCSVData();

  const { isLoading, error } = useDataStore();
  const { totalFiltrado, filteredData } = useFilteredData();
  const { limpiarFiltros } = useFilterStore();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-app-bg text-text-dark p-6">
        <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
        <h1 className="text-2xl font-bold mb-2">Error al cargar datos</h1>
        <p className="text-text-muted text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-app-bg text-text-dark flex overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-app-bg">
          <div className="p-6 h-full">
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="flex flex-col h-full space-y-6">
                <FilterChips />
                <ProfileSelector />
                
                {totalFiltrado > 0 ? (
                  <div className="flex flex-col gap-8">
                    {/* Top Row: Map and KPIs */}
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Map */}
                      <div className="w-full lg:w-2/3 h-[450px] bg-panel-bg rounded-3xl border border-border-light shadow-sm overflow-hidden">
                        <MapView />
                      </div>

                      {/* Right: KPIs */}
                      <div className="w-full lg:w-1/3">
                        <h3 className="text-xs font-bold text-text-soft uppercase tracking-widest mb-4 ml-1">Indicadores Clave</h3>
                        <KPIGrid isCompact />
                      </div>
                    </div>

                    {/* Bottom Row: Charts */}
                    <section className="w-full">
                      <h3 className="text-xs font-bold text-text-soft uppercase tracking-widest mb-4 ml-1">Análisis de Datos</h3>
                      <ChartsGrid filteredData={filteredData} />
                    </section>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-panel-bg rounded-3xl border border-border-light shadow-sm">
                    <div className="w-20 h-20 bg-app-bg rounded-full flex items-center justify-center mb-4">
                      <Search className="w-10 h-10 text-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold text-text-dark mb-2">Sin resultados</h3>
                    <p className="text-text-muted mb-6">Intenta con otros filtros para encontrar resultados.</p>
                    <button
                      onClick={() => limpiarFiltros()}
                      className="flex items-center gap-2 bg-accent-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-accent-orange/80 transition-all shadow-lg shadow-accent-orange/20"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
