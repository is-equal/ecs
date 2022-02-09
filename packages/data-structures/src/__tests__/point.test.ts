import { clampPoint, point } from '../';

describe('Point', () => {
  test('.point()', () => {
    expect(point(0, 0)).toStrictEqual(expect.objectContaining({ x: 0, y: 0 }));
    expect(point(10, -10)).toMatchObject({ x: 10, y: -10 });
  });

  test('.clampPoint(Point, min, max)', () => {
    const value = point(10, -10);
    const min = point(0, 0);
    const max = point(1, 1);

    expect(clampPoint(value, min, max)).toMatchObject({ x: 1, y: 0 });
  });
});
