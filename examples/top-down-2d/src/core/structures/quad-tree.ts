import { intersectRect, isEmptyRect, rect, type Rect } from '@equal/data-structures';

export type ReadonlyQuadTree = Omit<QuadTree, 'insert' | 'clear' | 'setBounds'>;

export class QuadTree {
  private static readonly maxElements = 4;
  private static readonly maxDepth = 8;

  private subdivided: boolean = false;

  private nodes: Rect[] = [];

  private topLeft: QuadTree | undefined;
  private topRight: QuadTree | undefined;
  private bottomLeft: QuadTree | undefined;
  private bottomRight: QuadTree | undefined;

  public readonly depth: number;
  public readonly bounds: Rect;

  public constructor(bounds: Rect, depth: number = 0) {
    this.bounds = bounds;
    this.depth = depth;
  }

  public getNodes(): ReadonlyArray<Readonly<Rect>> {
    return this.nodes;
  }

  public isSubdivided(): boolean {
    return this.subdivided;
  }

  public getTopLeft(): ReadonlyQuadTree | undefined {
    return this.topLeft;
  }

  public getTopRight(): ReadonlyQuadTree | undefined {
    return this.topRight;
  }

  public getBottomRight(): ReadonlyQuadTree | undefined {
    return this.bottomRight;
  }

  public getBottomLeft(): ReadonlyQuadTree | undefined {
    return this.bottomLeft;
  }

  public insert(node: Rect): boolean {
    if (!intersectRect(this.bounds, node)) {
      return false;
    }

    if (isEmptyRect(node)) {
      return false;
    }

    if (
      this.depth === QuadTree.maxDepth ||
      (!this.subdivided && this.nodes.length < QuadTree.maxElements)
    ) {
      this.nodes.push(node);

      return true;
    }

    if (!this.subdivided) {
      this.subdivide();
    }

    return (
      this.topLeft!.insert(node) ||
      this.topRight!.insert(node) ||
      this.bottomLeft!.insert(node) ||
      this.bottomRight!.insert(node)
    );
  }

  private subdivide(): void {
    const hw = this.bounds.width / 2;
    const hh = this.bounds.height / 2;

    this.topLeft = new QuadTree(rect(hw, hh, this.bounds.x, this.bounds.y), this.depth + 1);
    this.topRight = new QuadTree(rect(hw, hh, this.bounds.x + hw, this.bounds.y), this.depth + 1);
    this.bottomLeft = new QuadTree(rect(hw, hh, this.bounds.x, this.bounds.y + hh), this.depth + 1);
    this.bottomRight = new QuadTree(
      rect(hw, hh, this.bounds.x + hw, this.bounds.y + hh),
      this.depth + 1,
    );

    while (this.nodes.length > 0) {
      const node = this.nodes.pop()!;

      void (
        this.topLeft.insert(node) ||
        this.topRight.insert(node) ||
        this.bottomLeft.insert(node) ||
        this.bottomRight.insert(node)
      );
    }

    this.nodes = [];
    this.subdivided = true;
  }

  public query(area: Rect): boolean {
    if (!intersectRect(this.bounds, area)) {
      return false;
    }

    if (this.subdivided) {
      return (
        this.topLeft!.query(area) ||
        this.topRight!.query(area) ||
        this.bottomLeft!.query(area) ||
        this.bottomRight!.query(area)
      );
    }

    for (const node of this.nodes) {
      if (intersectRect(area, node)) {
        return true;
      }
    }

    return false;
  }

  public clear(): void {
    this.nodes = [];
    this.subdivided = false;

    this.topLeft?.clear();
    this.topLeft = undefined;

    this.topRight?.clear();
    this.topRight = undefined;

    this.bottomLeft?.clear();
    this.bottomLeft = undefined;

    this.bottomRight?.clear();
    this.bottomRight = undefined;
  }
}
