export type Query = readonly QueryItem[];

export type QueryItem = QuerySimpleItem | QueryComplexItem;

export type QuerySimpleItem = Readonly<string>;

export type QueryComplexItem = Readonly<{
  operation: 'exclude';
  component: string;
}>;

export function exclude(component: string): QueryItem {
  return { operation: 'exclude', component };
}
