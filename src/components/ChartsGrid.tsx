import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend, LabelList
} from 'recharts';
import { useChartData } from '../hooks/useChartData';
import { useFilterStore } from '../store/useFilterStore';
import { motion } from 'motion/react';

const COLORS = ["#296A3D", "#639446", "#A7C957", "#407BA7", "#004E89", "#070C4F", "#2D2828", "#B2971A"];

const ChartContainer = ({ title, children, className = "", isCompact }: { title: string, children: React.ReactNode, className?: string, isCompact?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-panel-bg p-6 rounded-xl border border-border-light shadow-sm ${className}`}
  >
    <h3 className="text-text-dark font-semibold mb-6 text-lg border-l-4 border-accent-primary pl-3">{title}</h3>
    <div className={`${isCompact ? 'h-[220px]' : 'h-[300px]'} w-full`}>
      {children}
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border-light p-3 rounded-lg shadow-xl">
        <p className="text-text-dark font-medium mb-1">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DonutChart = ({ data, colors = COLORS }: { data: any[], colors?: string[] }) => {
  const total = data?.reduce((a: number, b: any) => a + b.value, 0) || 0;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          strokeWidth={0}
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return percent > 0.05 ? (
              <text
                x={x} y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={13}
                fontWeight="bold"
              >
                {`${(percent * 100).toFixed(1)}%`}
              </text>
            ) : null;
          }}
        >
          {data?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <text x="50%" y="43%" textAnchor="middle" dominantBaseline="middle" fill="#F8FAFC" fontSize={22} fontWeight="bold">
          {total}
        </text>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontSize={11}>
          total
        </text>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle" 
          iconSize={10}
          formatter={(value) => <span style={{ color: '#94A3B8', fontSize: 13 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const ChartsGrid = ({ filteredData, isCompact }: { filteredData: any[], isCompact?: boolean }) => {
  const { entityType, profile } = useFilterStore();
  const chartData = useChartData(filteredData);

  const hasData = filteredData.length > 0;

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 bg-panel-bg rounded-xl border border-dashed border-border-light">
        <p className="text-text-muted">No hay datos suficientes para generar gráficas con los filtros actuales.</p>
      </div>
    );
  }

  if (entityType === 'Agrupaciones') {
    const { chart_sectores, chart_trayectoria, chart_provincias, chart_evolucion } = chartData as any;
    
    return (
      <div className={`grid gap-6 mt-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Sector Cultural */}
        <ChartContainer title="Agrupaciones por Sector Cultural" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_sectores} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#4E5154', fontSize: 12 }} 
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="value" fill="#296A3D" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="value" position="right" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Trayectoria */}
        <ChartContainer title="Distribución por Trayectoria" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_trayectoria}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4E5154', fontSize: 12 }} />
              <YAxis tick={{ fill: '#4E5154', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#004E89" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Provincias */}
        <ChartContainer title="Distribución por Provincia" isCompact={isCompact}>
          <DonutChart data={chart_provincias} />
        </ChartContainer>

        {/* Evolución */}
        <ChartContainer title="Evolución de Registro" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart_evolucion}>
              <defs>
                <linearGradient id="colorEvol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A7C957" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A7C957" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#4E5154', fontSize: 12 }} />
              <YAxis tick={{ fill: '#4E5154', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#A7C957" fillOpacity={1} fill="url(#colorEvol)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }

  // Artistas logic
  if (profile === 'artistico') {
    const { chart_areas, chart_formacion, chart_organizaciones, chart_evolucion_inicio } = chartData as any;

    return (
      <div className={`grid gap-6 mt-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* 1. Áreas de Desempeño */}
        <ChartContainer title="Áreas Culturales de Desempeño" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_areas} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#4E5154', fontSize: 12 }} 
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="value" fill="#296A3D" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="value" position="insideRight" style={{ fill: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 2. Top 10 Tipo de Formación */}
        <ChartContainer title="Top 10 Tipo de Formación Cultural" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_formacion} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#4E5154', fontSize: 12 }} 
                width={120}
                tickFormatter={(value) =>
                value.length > 20 ? `${value.substring(0, 20)}...` : value}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="value" fill="#407BA7" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="value" position="insideRight" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 3. Pertenencia a Organizaciones */}
         <ChartContainer title="Pertenencia a Organizaciones" isCompact={isCompact}>
          <div className="h-full w-full relative">
            <svg style={{ height: 0, width: 0, position: 'absolute' }}>
              <defs>
                <linearGradient id="gradSi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E7D45" stopOpacity={1} />
                  <stop offset="100%" stopColor="#296A3D" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="gradNo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#407BA7" stopOpacity={1} />
                  <stop offset="100%" stopColor="#407BA7" stopOpacity={1} />
                </linearGradient>
              </defs>
            </svg>
            <DonutChart 
              data={chart_organizaciones} 
              colors={["url(#gradSi)", "url(#gradNo)"]} 
            />
          </div>
        </ChartContainer>

        {/* 4. Evolución de Inicio de Actividades */}
        <ChartContainer title="Evolución de Inicio de Actividades" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart_evolucion_inicio}>
              <defs>
                <linearGradient id="colorInicio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#004E89" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#004E89" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#4E5154', fontSize: 12 }} />
              <YAxis tick={{ fill: '#4E5154', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#004E89" fillOpacity={1} fill="url(#colorInicio)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }

  if (profile === 'demografico') {
    const { chart_genero, chart_edad, chart_escolaridad, chart_poblacion } = chartData as any;

    return (
      <div className={`grid gap-6 mt-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* 1. Distribución por género */}
        <ChartContainer title="Distribución por Género" isCompact={isCompact}>
          <DonutChart data={chart_genero} />
        </ChartContainer>

        {/* 2. Rangos de edad */}
        <ChartContainer title="Rangos de Edad" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_edad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4E5154', fontSize: 12 }} />
              <YAxis tick={{ fill: '#4E5154', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#004E89" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 3. Nivel de escolaridad */}
        <ChartContainer title="Nivel de Escolaridad" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_escolaridad} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#4E5154', fontSize: 12 }} 
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="value" fill="#296A3D" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="value" position="right" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 4. Poblaciones especiales */}
        <ChartContainer title="Poblaciones Especiales" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_poblacion} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#4E5154', fontSize: 12 }} 
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="value" fill="#B2971A" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="value" position="right" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }

  if (profile === 'socioeconomico') {
    const { chart_estrato, chart_eps, chart_pension } = chartData as any;

    return (
      <div className={`grid gap-6 mt-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* 1. Distribución por estrato */}
        <ChartContainer title="Distribución por Estrato Social" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_estrato}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#4E5154', fontSize: 12 }} />
              <YAxis tick={{ fill: '#4E5154', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#004E89" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 2. Top 8 EPS */}
        <ChartContainer title="Top 8 EPS más Frecuentes" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_eps} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#4E5154', fontSize: 12 }} 
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="value" fill="#639446" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="value" position="insideRight" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* 3. Top 8 Pension */}
        <ChartContainer title="Top 8 Fondos de Pensión más Frecuentes" isCompact={isCompact}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart_pension} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#4E5154', fontSize: 12 }} 
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="value" fill="#B2971A" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="value" position="insideRight" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    );
  }

  const {
    chart1_areas,
    chart2_estrato,
    chart3_escolaridad,
    chart4_tiempo,
    chart5_formacion,
    chart6_poblacion
  } = chartData as any;

  return (
    <div className={`grid gap-6 mt-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
      {/* 1. Áreas de Desempeño */}
      <ChartContainer title="Áreas Culturales de Desempeño" isCompact={isCompact}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart1_areas} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#4E5154', fontSize: 12 }} 
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
            <Bar dataKey="value" fill="#296A3D" radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList dataKey="value" position="right" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 2. Estrato Social */}
      <ChartContainer title="Distribución por Estrato" isCompact={isCompact}>
        <DonutChart data={chart2_estrato} />
      </ChartContainer>

      {/* 3. Escolaridad x Sexo */}
      <ChartContainer title="Escolaridad por Sexo" isCompact={isCompact}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart3_escolaridad}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
            <XAxis dataKey="escolaridad" tick={{ fill: '#4E5154', fontSize: 10 }} />
            <YAxis tick={{ fill: '#4E5154', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" align="right" />
            <Bar dataKey="Femenino" fill="#A7C957" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="Femenino" position="top" style={{ fill: '#4E5154', fontSize: 9 }} />
            </Bar>
            <Bar dataKey="Masculino" fill="#004E89" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="Masculino" position="top" style={{ fill: '#4E5154', fontSize: 9 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 4. Formación Artística */}
      <ChartContainer title="Top 10 Tipo de Formación" isCompact={isCompact}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart5_formacion} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#4E5154', fontSize: 12 }} 
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
            <Bar dataKey="value" fill="#407BA7" radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList dataKey="value" position="right" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 5. Población */}
      <ChartContainer title="Población a la que pertenece" isCompact={isCompact}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart6_poblacion} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#4E5154', fontSize: 11 }} 
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
            <Bar dataKey="value" fill="#639446" radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList dataKey="value" position="right" style={{ fill: '#4E5154', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 6. Tiempo */}
      <ChartContainer title="Evolución de Registro" className={isCompact ? "" : "lg:col-span-2"} isCompact={isCompact}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart4_tiempo}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#296A3D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#296A3D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: '#4E5154', fontSize: 12 }} />
            <YAxis tick={{ fill: '#4E5154', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#296A3D" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
