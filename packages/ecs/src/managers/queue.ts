export class Queue<T> {
  private head: Node<T> | undefined = void 0;
  private tail: Node<T> | undefined = void 0;

  public enqueue(data: T): void {
    const newNode = new Node(data);

    if (this.head === void 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      const node = this.tail as Node<T>;
      node.next = newNode;
      this.tail = newNode;
    }
  }

  public dequeue(): T | undefined {
    if (this.head === void 0) {
      return void 0;
    }

    const node = this.head;

    this.head = this.head.next;

    if (this.head === void 0) {
      this.tail = void 0;
    }

    return node.data;
  }

  public clear(): void {
    this.head = void 0;
    this.tail = void 0;
  }
}

class Node<T> {
  public next: Node<T> | undefined;

  public constructor(public data: T) {}
}
