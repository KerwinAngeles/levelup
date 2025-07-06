exports.calcularRango = (nivel) => {
  if (nivel >= 6) return 'S';
  if (nivel >= 5) return 'A';
  if (nivel >= 4) return 'B';
  if (nivel >= 3) return 'C';
  if (nivel >= 2) return 'D';
  return 'E';
};
