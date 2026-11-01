import { describe, it, expect } from 'vitest';
import { isPluginOnlyRole } from './plugin-only.guard';

describe('isPluginOnlyRole', () => {
  it('is false for admin, user and no role', () => {
    expect(isPluginOnlyRole('admin')).toBe(false);
    expect(isPluginOnlyRole('User')).toBe(false);
    expect(isPluginOnlyRole('')).toBe(false);
    expect(isPluginOnlyRole(undefined)).toBe(false);
  });
  it('is true for any other role', () => {
    expect(isPluginOnlyRole('kanban')).toBe(true);
  });
});
