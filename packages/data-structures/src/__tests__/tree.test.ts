import { createTree, getTree, MutableTree } from '../';

describe('Tree', () => {
  test('createTree(Target)', () => {
    const tree = createTree(1);

    expect(tree).toMatchObject({
      target: 1,
      parent: undefined,
      previousSibling: undefined,
      nextSibling: undefined,
      firstChild: undefined,
      lastChild: undefined,
      childrenLength: 0,
    });
  });

  describe('Named Tree', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    let namedTree: MutableTree<number>;

    test('createTree(Target, string)', () => {
      namedTree = createTree(1, 'tree-1');

      expect(namedTree).toMatchObject({
        target: 1,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });
    });

    test('getTree(string)', () => {
      expect(getTree('tree-1')).toEqual(namedTree);
      expect(error).not.toBeCalled();

      expect(getTree('random-tree')).toBeUndefined();
      expect(error).toHaveBeenLastCalledWith('Named tree (random-tree) not found');
    });
  });

  describe('Tree Operations', () => {
    const rootTree = createTree('root', 'root');
    const parent1 = createTree('parent-1');
    const child1 = createTree('child-1');
    const child2 = createTree('child-2');
    const child3 = createTree('child-3');

    test('.appendChild(Tree)', () => {
      rootTree.appendChild(child1);

      expect(rootTree).toMatchObject({
        target: rootTree.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: child1,
        lastChild: child1,
        childrenLength: 1,
      });

      expect(child1).toMatchObject({
        target: child1.target,
        parent: rootTree,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });
    });

    test('.insertBefore(Tree, Tree)', () => {
      parent1.appendChild(child2);
      rootTree.insertBefore(child2, child1);

      // Try to insertBefore using a tree without parent
      rootTree.insertBefore(child2, child3);

      expect(rootTree).toMatchObject({
        target: rootTree.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: child2,
        lastChild: child1,
        childrenLength: 2,
      });

      expect(parent1).toMatchObject({
        target: parent1.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child2).toMatchObject({
        target: child2.target,
        parent: rootTree,
        previousSibling: undefined,
        nextSibling: child1,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child1).toMatchObject({
        target: child1.target,
        parent: rootTree,
        previousSibling: child2,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child3).toMatchObject({
        target: child3.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });
    });

    test('.removeChild(Tree)', () => {
      rootTree.appendChild(child3);
      rootTree.removeChild(child2);

      // Try to remove again
      rootTree.removeChild(child2);

      expect(rootTree).toMatchObject({
        target: rootTree.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: child1,
        lastChild: child3,
        childrenLength: 2,
      });

      expect(parent1).toMatchObject({
        target: parent1.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child2).toMatchObject({
        target: child2.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child1).toMatchObject({
        target: child1.target,
        parent: rootTree,
        previousSibling: undefined,
        nextSibling: child3,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child3).toMatchObject({
        target: child3.target,
        parent: rootTree,
        previousSibling: child1,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });
    });

    test('.appendChild(Tree) when the child is coming from another parent', () => {
      // child3 comes from rootTree
      parent1.appendChild(child3);

      expect(rootTree).toMatchObject({
        target: rootTree.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: child1,
        lastChild: child1,
        childrenLength: 1,
      });

      expect(parent1).toMatchObject({
        target: parent1.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: child3,
        lastChild: child3,
        childrenLength: 1,
      });

      expect(child1).toMatchObject({
        target: child1.target,
        parent: rootTree,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child3).toMatchObject({
        target: child3.target,
        parent: parent1,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child2).toMatchObject({
        target: child2.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });
    });

    test('.destroy()', () => {
      // increase the tree
      rootTree.appendChild(parent1);

      // destroy all
      rootTree.destroy();

      expect(rootTree).toMatchObject({
        target: rootTree.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(parent1).toMatchObject({
        target: parent1.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child1).toMatchObject({
        target: child1.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child2).toMatchObject({
        target: child2.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });

      expect(child3).toMatchObject({
        target: child3.target,
        parent: undefined,
        previousSibling: undefined,
        nextSibling: undefined,
        firstChild: undefined,
        lastChild: undefined,
        childrenLength: 0,
      });
    });
  });
});
