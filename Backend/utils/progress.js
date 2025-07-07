exports.calcularRango = (nivel) => {
  if (nivel >= 50) return 'S';
  if (nivel >= 30) return 'A';
  if (nivel >= 15) return 'B';
  if (nivel >= 10) return 'C';
  if (nivel >= 5) return 'D';
  return 'E';
};
