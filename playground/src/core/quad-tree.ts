import { clampRect, intersectRect, isEmptyRect, rect, type Rect } from '@equal/data-structures';

export class QuadTree {
  private static readonly maxElements = 4;
  private static readonly maxDepth = 8;

  private bounds: Rect;
  private depth: number;
  private subdivided: boolean = false;

  private nodes: Rect[] = [];

  private topLeft: QuadTree | undefined;
  private topRight: QuadTree | undefined;
  private bottomLeft: QuadTree | undefined;
  private bottomRight: QuadTree | undefined;

  public constructor(bounds: Rect, depth: number = 0) {
    this.bounds = bounds;
    this.depth = depth;
  }

  public insert(node: Rect): boolean {
    if (!intersectRect(this.bounds, node)) {
      return false;
    }

    if (
      this.depth == QuadTree.maxDepth ||
      (!this.subdivided && this.nodes.length < QuadTree.maxElements)
    ) {
      const newNode = clampRect(
        node,
        rect(0, 0, this.bounds.x, this.bounds.y),
        rect(
          this.bounds.width,
          this.bounds.height,
          this.bounds.x + this.bounds.width,
          this.bounds.y + this.bounds.height,
        ),
      );

      if (isEmptyRect(newNode)) {
        return false;
      }

      this.nodes.push(newNode);

      return true;
    }

    if (!this.subdivided) {
      this.subdivide();
    }

    return [
      this.topLeft!.insert(node),
      this.topRight!.insert(node),
      this.bottomLeft!.insert(node),
      this.bottomRight!.insert(node),
    ].some((wasAdded) => wasAdded === true);
  }

  public subdivide(): void {
    const hw = this.bounds.width / 2;
    const hh = this.bounds.height / 2;

    this.topLeft = new QuadTree(
      rect(hw, hh, this.bounds.x - hw, this.bounds.y - hh),
      this.depth + 1,
    );
    this.topRight = new QuadTree(
      rect(hw, hh, this.bounds.x + hw, this.bounds.y - hh),
      this.depth + 1,
    );
    this.bottomLeft = new QuadTree(
      rect(hw, hh, this.bounds.x - hw, this.bounds.y + hh),
      this.depth + 1,
    );
    this.bottomRight = new QuadTree(
      rect(hw, hh, this.bounds.x + hw, this.bounds.y + hh),
      this.depth + 1,
    );

    while (this.nodes.length > 0) {
      const node = this.nodes.pop()!;

      this.topLeft.insert(node);

      this.topRight.insert(node);

      this.bottomLeft.insert(node);

      this.bottomRight.insert(node);
    }

    this.nodes = [];
    this.subdivided = true;
  }

  public query(area: Rect): Rect[] {
    const out: Rect[] = [];

    if (!intersectRect(this.bounds, area)) {
      return out;
    }

    if (!this.subdivided) {
      for (const node of this.nodes) {
        if (intersectRect(area, node)) {
          out.push(node);
        }
      }

      return out;
    }

    out.concat(
      this.topLeft!.query(area),
      this.topRight!.query(area),
      this.bottomLeft!.query(area),
      this.bottomRight!.query(area),
    );

    return out;
  }

  public clear(): void {
    this.nodes = [];

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
