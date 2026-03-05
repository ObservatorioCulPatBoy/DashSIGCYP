export const getColorByDensity = (count: number) => {
  if (count === 0) return '#E5E7EB';
  if (count <= 10) return '#A7C957';
  if (count <= 100) return '#639446';
  if (count <= 250) return '#296A3D';
  return '#070C4F';
};
