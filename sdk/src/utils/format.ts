export const formatUnits = (value: bigint, decimals: number) => {
  let display = value.toString();

  const negative = display.startsWith('-');
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, '0');

  const integer = display.slice(0, display.length - decimals);
  let fraction = display.slice(display.length - decimals);

  fraction = fraction.replace(/(0+)$/, '');
  return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
};

export const formatBigInt = (value: string, decimals: number = 9) => {
  const formatted = formatUnits(BigInt(value), decimals);
  return Number(formatted);
};
