import { exclude } from '../types';

describe('Query', () => {
  test('exclude(ComponentType)', () => {
    expect(exclude('Position')).toMatchObject({ component: 'Position', operation: 'exclude' });
  });
});
