import {
  clampRect,
  containsPoint,
  containsRect,
  isEmptyRect,
  overlapsRect,
  rect,
  point,
  unionRect,
  Rect,
} from '../';

describe('Rect', () => {
  let r1: Rect;
  let r2: Rect;
  let r3: Rect;
  let r4: Rect;

  test('rect(number, number, number, number)', () => {
    r1 = rect();
    r2 = rect(1280, 720, 0, 0);
    r3 = rect(32, 32, 128, 128);
    r4 = rect(-32, -32, -128, -128);

    expect(r1).toMatchObject({ x: 0, y: 0, width: 0, height: 0 });
    expect(r2).toMatchObject({ x: 0, y: 0, width: 1280, height: 720 });
    expect(r3).toMatchObject({ x: 128, y: 128, width: 32, height: 32 });
    expect(r4).toMatchObject({ x: -128, y: -128, width: -32, height: -32 });
  });

  describe('Rect Operations', () => {
    test('isEmptyRect(Rect)', () => {
      expect(isEmptyRect(r1)).toEqual(true);
      expect(isEmptyRect(r2)).toEqual(false);
      expect(isEmptyRect(r3)).toEqual(false);
      expect(isEmptyRect(r4)).toEqual(true);
    });

    test('containsPoint(Rect, Point)', () => {
      const p1 = point(128, 128);

      expect(containsPoint(r1, p1)).toEqual(false);
      expect(containsPoint(r2, p1)).toEqual(true);
      expect(containsPoint(r3, p1)).toEqual(true);
      expect(containsPoint(r4, p1)).toEqual(false);
    });

    test('containsRect(Rect, Rect)', () => {
      expect(containsRect(r1, r1)).toEqual(false);
      expect(containsRect(r1, r3)).toEqual(false);
      expect(containsRect(r1, r3)).toEqual(false);
      expect(containsRect(r1, r4)).toEqual(false);

      expect(containsRect(r2, r1)).toEqual(false);
      expect(containsRect(r2, r2)).toEqual(false);
      expect(containsRect(r2, r3)).toEqual(true);
      expect(containsRect(r2, r4)).toEqual(false);

      expect(containsRect(r3, r1)).toEqual(false);
      expect(containsRect(r3, r2)).toEqual(false);
      expect(containsRect(r3, r3)).toEqual(false);
      expect(containsRect(r3, r4)).toEqual(false);

      expect(containsRect(r4, r1)).toEqual(false);
      expect(containsRect(r4, r2)).toEqual(false);
      expect(containsRect(r4, r3)).toEqual(false);
      expect(containsRect(r4, r4)).toEqual(false);
    });

    test('overlapsRect(Rect, Rect)', () => {
      expect(overlapsRect(r1, r1)).toEqual(false);
      expect(overlapsRect(r1, r3)).toEqual(false);
      expect(overlapsRect(r1, r3)).toEqual(false);
      expect(overlapsRect(r1, r4)).toEqual(false);

      expect(overlapsRect(r2, r1)).toEqual(false);
      expect(overlapsRect(r2, r2)).toEqual(true);
      expect(overlapsRect(r2, r3)).toEqual(true);
      expect(overlapsRect(r2, r4)).toEqual(false);

      expect(overlapsRect(r3, r1)).toEqual(false);
      expect(overlapsRect(r3, r2)).toEqual(true);
      expect(overlapsRect(r3, r3)).toEqual(true);
      expect(overlapsRect(r3, r4)).toEqual(false);

      expect(overlapsRect(r4, r1)).toEqual(false);
      expect(overlapsRect(r4, r3)).toEqual(false);
      expect(overlapsRect(r4, r3)).toEqual(false);
      expect(overlapsRect(r4, r4)).toEqual(false);
    });

    test('clampRect(Rect, Rect, Rect)', () => {
      const min = rect(1, 1, 8, 8);
      const max = rect(8, 8, 16, 16);

      expect(clampRect(r1, min, max)).toMatchObject(rect(1, 1, 8, 8));
      expect(clampRect(r2, min, max)).toMatchObject(rect(8, 8, 8, 8));
      expect(clampRect(r3, min, max)).toMatchObject(rect(8, 8, 16, 16));
      expect(clampRect(r4, min, max)).toMatchObject(rect(1, 1, 8, 8));
    });

    test('unionRect(Rect, Rect)', () => {
      expect(unionRect(r1, r2)).toMatchObject(rect(1280, 720, 0, 0));
      expect(unionRect(r2, r1)).toMatchObject(rect(1280, 720, 0, 0));
      expect(unionRect(r3, r2)).toMatchObject(rect(1280, 720, 0, 0));
    });
  });
});
