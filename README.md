# Dashboard Cultural Colombia 🎭

Sistema de Información Cultural para el análisis de Artistas y Gestores Culturales.

## Características
- Visualización de datos mediante KPIs dinámicos.
- Mapa interactivo de densidad por municipio.
- Análisis estadístico con gráficas de barras, torta y líneas.
- Sistema de filtrado avanzado (Provincia, Municipio, Área, Sexo, Estrato, etc.).
- Diseño profesional con modo oscuro y optimización de rendimiento.

## Instalación

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```

## Desarrollo

Para correr el proyecto en modo desarrollo:
```bash
npm run dev
```

## Actualización de Datos

Para actualizar la información del dashboard:
1. Reemplazar el archivo en `/public/data/artistas.csv`.
2. Asegurarse de mantener el encabezado y formato de columnas original.
3. El sistema cargará automáticamente los nuevos datos al iniciar.

## Despliegue (Production)

Para generar la versión de producción:
```bash
npm run build
```
Esto generará una carpeta `dist/` que puede ser subida a cualquier servicio de hosting estático como Netlify, Vercel o GitHub Pages.

### Despliegue en Vercel 🚀

1.  **Instalar Vercel CLI** (opcional): `npm i -g vercel`
2.  **Configurar Variables de Entorno**: En el panel de Vercel, asegúrate de añadir `GEMINI_API_KEY` si usas las funciones de IA.
3.  **Configuración de Rutas**: Ya se ha incluido un archivo `vercel.json` para manejar el enrutamiento de la SPA (Single Page Application).
4.  **Comando de Build**: `npm run build`
5.  **Directorio de Salida**: `dist`

## Tecnologías
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Iconos)
- Recharts (Gráficas)
- Leaflet (Mapas)
- Zustand (Estado global)
- PapaParse (CSV Parsing)
- Motion (Animaciones)
