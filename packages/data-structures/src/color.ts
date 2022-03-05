export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function color(r: number, g: number, b: number, a: number = 255): Color {
  return { r, g, b, a };
}

export function isColorEqual(left: Color, right: Color): boolean {
  return left.r === right.r && left.g === right.g && left.b === right.b && left.a === right.a;
}

export function colorFromHEX(hex: string): Color {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    a: parseInt(hex.slice(7, 9) || 'FF', 16),
  };
}

export function colorToHEX(color: Color): string {
  return (
    '#' +
    numberToHEX(color.r) +
    numberToHEX(color.g) +
    numberToHEX(color.b) +
    numberToHEX(color.a)
  ).toUpperCase();
}

function numberToHEX(value: number): string {
  return value.toString(16).padStart(2, '0');
}
