export const calculateShipping = (subtotal, city, itemCount) => {
  if (subtotal >= 500) return { cost: 0, label: 'Envio gratis' };

  const baseRates = {
    'Tegucigalpa': 50,
    'San Pedro Sula': 80,
    'La Ceiba': 120,
    'default': 150
  };

  const base = baseRates[city] || baseRates['default'];
  const extra = itemCount > 5 ? (itemCount - 5) * 10 : 0;
  const cost = base + extra;

  return { cost, label: `Envio a ${city}` };
};