export type TypeId = number;

export function addTypeId(left: TypeId, right: TypeId): TypeId {
  return left | right;
}

export function removeTypeId(left: TypeId, right: TypeId): TypeId {
  return left & ~right;
}

export function hasTypeId(left: TypeId, right: TypeId): boolean {
  return (left & right) === right;
}
