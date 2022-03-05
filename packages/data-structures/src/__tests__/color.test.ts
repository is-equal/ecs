import { color, colorFromHEX, colorToHEX, isColorEqual } from '../color';

describe('Color', () => {
  test('creation', () => {
    expect(color(0, 0, 0, 0)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });

  test('comparison', () => {
    expect(isColorEqual(color(0, 0, 0), color(0, 0, 0))).toEqual(true);
    expect(isColorEqual(color(1, 0, 0), color(1, 0, 0))).toEqual(true);
    expect(isColorEqual(color(1, 2, 0), color(1, 2, 0))).toEqual(true);
    expect(isColorEqual(color(1, 2, 3), color(1, 2, 3))).toEqual(true);
    expect(isColorEqual(color(1, 2, 3, 4), color(1, 2, 3, 4))).toEqual(true);
  });

  test('conversion from hex', () => {
    expect(colorFromHEX('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255, a: 255 });
    expect(colorFromHEX('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 255 });
    expect(colorFromHEX('#00000000')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });

  test('conversion to hex', () => {
    expect(colorToHEX(color(255, 255, 255, 255))).toEqual('#FFFFFFFF');
    expect(colorToHEX(color(0, 0, 0, 255))).toEqual('#000000FF');
    expect(colorToHEX(color(0, 0, 0, 0))).toEqual('#00000000');
  });
});
