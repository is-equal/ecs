import { size, clampSize, isEmptySize } from '../';

describe('Size', () => {
  test('size(number, number)', () => {
    expect(size(0, 0)).toStrictEqual(expect.objectContaining({ w: 0, h: 0 }));
    expect(size(10, -10)).toMatchObject({ w: 10, h: -10 });
  });

  describe('Size Operations', () => {
    test('clampPoint(Size, min, max)', () => {
      const value = size(10, -10);
      const min = size(0, 0);
      const max = size(1, 1);

      expect(clampSize(value, min, max)).toMatchObject({ w: 1, h: 0 });
    });

    test('isEmptySize(Size)', () => {
      expect(isEmptySize(size(0, 0))).toEqual(true);
      expect(isEmptySize(size(32, 32))).toEqual(false);
    });
  });
});
