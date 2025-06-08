export type Conversion = 'centavos' | 'reais';

export function convertMoney(value: number, operation: Conversion): number {
  if (operation === 'centavos') {
    return Math.round(value * 100);
  } else if (operation === 'reais') {
    const reais = value / 100;
    return parseFloat(reais.toFixed(2));
  }
  throw new Error('Invalid conversion money type');
}
