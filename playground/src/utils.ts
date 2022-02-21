import type { ReadonlyTree } from '@equal/data-structures';

export function randomColor(): string {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function treeTraverse<T extends ReadonlyTree<unknown>>(
  tree: T,
  callback: (tree: T) => void,
): void {
  callback(tree);

  if (tree.nextSibling !== undefined) {
    treeTraverseNextSibling(tree.nextSibling as T, callback);
  }

  traverseTreeChildNextSibling(tree, callback);
}

export function treeTraverseNextSibling<T extends ReadonlyTree<unknown>>(
  tree: T,
  callback: (tree: T) => void,
): void {
  callback(tree);

  if (tree.nextSibling !== undefined) {
    treeTraverseNextSibling(tree.nextSibling as T, callback);
  }
}

export function traverseTreeChildNextSibling<T extends ReadonlyTree<unknown>>(
  tree: T,
  callback: (tree: T) => void,
): void {
  if (tree.firstChild !== undefined) {
    treeTraverse(tree.firstChild as T, callback);
  }

  if (tree.nextSibling !== undefined) {
    traverseTreeChildNextSibling(tree.nextSibling as T, callback);
  }
}
