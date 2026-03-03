import { useMemo } from 'react';

export const useMapData = (filteredData: any[]) => {
  return useMemo(() => {
    const municipioCounts: { [key: string]: number } = {};
    const provinciaCounts: { [key: string]: number } = {};
    let maxMunicipioCount = 0;
    let maxProvinciaCount = 0;

    filteredData.forEach((item) => {
      const municipio = item.Municipio;
      const provincia = item.Provincia;

      if (municipio) {
        municipioCounts[municipio] = (municipioCounts[municipio] || 0) + 1;
        if (municipioCounts[municipio] > maxMunicipioCount) {
          maxMunicipioCount = municipioCounts[municipio];
        }
      }

      if (provincia) {
        provinciaCounts[provincia] = (provinciaCounts[provincia] || 0) + 1;
        if (provinciaCounts[provincia] > maxProvinciaCount) {
          maxProvinciaCount = provinciaCounts[provincia];
        }
      }
    });

    return { municipioCounts, provinciaCounts, maxMunicipioCount, maxProvinciaCount };
  }, [filteredData]);
};
