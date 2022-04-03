import { intersectRect, isEmptyRect, rect, type Rect } from '@equal/data-structures';

export type ReadonlyQuadTree = Omit<QuadTree, 'insert' | 'clear' | 'setBounds'>;

type QuadTreeNode<T> = Rect & { data?: T };

export class QuadTree<Data = unknown> {
  private static readonly maxElements = 4;
  private static readonly maxDepth = 8;

  private subdivided: boolean = false;

  private nodes: Array<QuadTreeNode<Data>> = [];

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

  public insert(node: QuadTreeNode<Data>): boolean {
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

    if (
      this.topLeft === undefined ||
      this.topRight === undefined ||
      this.bottomLeft === undefined ||
      this.bottomRight === undefined
    ) {
      throw new Error('invalid QuadTree');
    }

    return (
      this.topLeft.insert(node) ||
      this.topRight.insert(node) ||
      this.bottomLeft.insert(node) ||
      this.bottomRight.insert(node)
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
      const node = this.nodes.pop();

      if (node === undefined) {
        throw new Error('invalid QuadTree');
      }

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

  public queryBoolean(area: Rect): boolean {
    if (!intersectRect(this.bounds, area)) {
      return false;
    }

    if (this.subdivided) {
      if (
        this.topLeft === undefined ||
        this.topRight === undefined ||
        this.bottomLeft === undefined ||
        this.bottomRight === undefined
      ) {
        throw new Error('invalid QuadTree');
      }

      return (
        this.topLeft.queryBoolean(area) ||
        this.topRight.queryBoolean(area) ||
        this.bottomLeft.queryBoolean(area) ||
        this.bottomRight.queryBoolean(area)
      );
    }

    for (const node of this.nodes) {
      if (intersectRect(area, node)) {
        return true;
      }
    }

    return false;
  }

  public query(area: Rect): Data | undefined {
    if (!intersectRect(this.bounds, area)) {
      return;
    }

    if (this.subdivided) {
      if (
        this.topLeft === undefined ||
        this.topRight === undefined ||
        this.bottomLeft === undefined ||
        this.bottomRight === undefined
      ) {
        throw new Error('invalid QuadTree');
      }

      return (this.topLeft.query(area) ||
        this.topRight.query(area) ||
        this.bottomLeft.query(area) ||
        this.bottomRight.query(area)) as Data;
    }

    for (const node of this.nodes) {
      if (intersectRect(area, node)) {
        return node.data;
      }
    }
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
