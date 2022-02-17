interface ITree<T = unknown> {
  readonly target: T;
  parent: ITree<T> | undefined;
  previousSibling: ITree<T> | undefined;
  nextSibling: ITree<T> | undefined;
  firstChild: ITree<T> | undefined;
  lastChild: ITree<T> | undefined;
  /**
   * @internal
   */
  set childrenLength(value: number);
  get childrenLength(): number;
}

export type ReadonlyTree<T> = Readonly<ITree<T>>;

export interface MutableTree<T> extends ITree<T> {
  appendChild(child: MutableTree<T>): void;
  removeChild(child: MutableTree<T>): void;
  insertBefore(child: MutableTree<T>, beforeChild: MutableTree<T>): void;
  /**
   * Destroy the tree and all subtrees
   */
  destroy(): void;
}

interface TreeState {
  trees: Map<string, MutableTree<unknown>>;
}

const state: TreeState = {
  trees: new Map(),
};

export function createTree<T>(target: T, name?: string): MutableTree<T> {
  const tree: MutableTree<T> = {
    target,
    parent: undefined,
    previousSibling: undefined,
    nextSibling: undefined,
    firstChild: undefined,
    lastChild: undefined,
    childrenLength: 0,
    appendChild(child: MutableTree<T>): void {
      if (child.parent !== undefined) {
        (child.parent as MutableTree<T>).removeChild(child);
      }

      child.parent = this;

      if (this.lastChild !== undefined) {
        const lastChild = this.lastChild;

        child.previousSibling = lastChild;
        lastChild.nextSibling = child;
      }

      if (this.childrenLength === 0) {
        this.firstChild = child;
        this.lastChild = child;
      } else {
        this.lastChild = child;
      }

      this.childrenLength += 1;
    },
    removeChild(child: MutableTree<T>): void {
      if (this.childrenLength === 0 || child.parent !== this) {
        return;
      }

      if (this.firstChild === child) {
        this.firstChild = child.nextSibling;
      }

      if (this.lastChild === child) {
        this.lastChild = child.previousSibling;
      }

      const { previousSibling, nextSibling } = child;

      if (previousSibling !== undefined) {
        previousSibling.nextSibling = nextSibling;
      }

      if (nextSibling !== undefined) {
        nextSibling.previousSibling = previousSibling;
      }

      this.childrenLength -= 1;

      child.parent = undefined;
      child.previousSibling = undefined;
      child.nextSibling = undefined;
    },
    insertBefore(child: MutableTree<T>, beforeChild: MutableTree<T>): void {
      if (beforeChild.parent === undefined) {
        return;
      }

      if (child.parent !== undefined) {
        (child.parent as MutableTree<T>).removeChild(child);
      }

      child.parent = beforeChild.parent;
      child.previousSibling = beforeChild.previousSibling;
      child.nextSibling = beforeChild;

      beforeChild.previousSibling = child;

      if (beforeChild.parent.firstChild === beforeChild) {
        beforeChild.parent.firstChild = child;
        beforeChild.parent.childrenLength += 1;
      }
    },
    destroy(): void {
      if (name !== undefined) {
        state.trees.delete(name);
      }

      let next: MutableTree<T> | undefined;
      while ((next = this.firstChild as MutableTree<T>)) {
        next.destroy();

        next = next.nextSibling as MutableTree<T> | undefined;
      }

      if (this.parent !== undefined) {
        (this.parent as MutableTree<T>).removeChild(this);
      }
    },
  };

  if (name !== undefined) {
    state.trees.set(name, tree);
  }

  return tree;
}

export function getTree<T>(name: string): MutableTree<T> | undefined {
  if (!state.trees.has(name)) {
    console.error(`Named tree (${name}) not found`);
    return;
  }

  return state.trees.get(name) as MutableTree<T>;
}
