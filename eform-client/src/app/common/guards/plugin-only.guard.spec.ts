import { describe, it, expect } from 'vitest';
import {
  isPluginOnlyRole,
  isPluginOnlyRoles,
  isPluginOnlyToken,
  PLUGIN_ONLY_FALLBACK_URL,
  pluginOnlyLandingUrl,
  rolesFromAccessToken,
} from './plugin-only.guard';

const ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/** An unsigned JWT with the given payload (the guard only reads the payload). */
function jwt(payload: object): string {
  const b64url = (s: string) =>
    btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64url('{"alg":"HS256","typ":"JWT"}')}.${b64url(JSON.stringify(payload))}.sig`;
}

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

describe('isPluginOnlyRoles', () => {
  it('needs at least one role and none that is admin or user', () => {
    expect(isPluginOnlyRoles([])).toBe(false);
    expect(isPluginOnlyRoles(['kanban'])).toBe(true);
    expect(isPluginOnlyRoles(['kanban', 'user'])).toBe(false);
    expect(isPluginOnlyRoles(['kanban', 'Admin'])).toBe(false);
  });
});

describe('rolesFromAccessToken', () => {
  it('reads one role (a string) or several (an array), under the claim name the host writes', () => {
    expect(rolesFromAccessToken(jwt({ [ROLE]: 'kanban' }))).toEqual(['kanban']);
    expect(rolesFromAccessToken(jwt({ [ROLE]: ['kanban', 'user'] }))).toEqual(['kanban', 'user']);
    expect(rolesFromAccessToken(jwt({ role: ['kanban'] }))).toEqual(['kanban']);
    expect(rolesFromAccessToken(jwt({ sub: '1' }))).toEqual([]);
  });
  it('is null when the token cannot be read', () => {
    expect(rolesFromAccessToken('')).toBeNull();
    expect(rolesFromAccessToken('not-a-jwt')).toBeNull();
    expect(rolesFromAccessToken('a.%%%.c')).toBeNull();
  });
});

describe('isPluginOnlyToken', () => {
  it('uses every role in the token, not only the stored first role', () => {
    // The host stores role = the FIRST role; a kanban + user account is not plugin-only.
    expect(isPluginOnlyToken({ role: 'kanban', accessToken: jwt({ [ROLE]: ['kanban', 'user'] }) })).toBe(false);
    expect(isPluginOnlyToken({ role: 'kanban', accessToken: jwt({ [ROLE]: 'kanban' }) })).toBe(true);
    expect(isPluginOnlyToken({ role: 'admin', accessToken: jwt({ [ROLE]: ['admin', 'kanban'] }) })).toBe(false);
  });
  it('falls back to the stored role when the token cannot be read', () => {
    expect(isPluginOnlyToken({ role: 'kanban', accessToken: '' })).toBe(true);
    expect(isPluginOnlyToken({ role: 'user', accessToken: 'garbage' })).toBe(false);
    expect(isPluginOnlyToken(null)).toBe(false);
  });
});

describe('pluginOnlyLandingUrl', () => {
  it('keeps a plugin or account redirect', () => {
    expect(pluginOnlyLandingUrl('plugins/kanban-pn')).toBe('/plugins/kanban-pn');
    expect(pluginOnlyLandingUrl('/plugins/kanban-pn/boards')).toBe('/plugins/kanban-pn/boards');
    expect(pluginOnlyLandingUrl('account-management/change-password')).toBe('/account-management/change-password');
  });
  it('replaces a missing or main-app redirect, which would loop', () => {
    expect(pluginOnlyLandingUrl(undefined)).toBe(PLUGIN_ONLY_FALLBACK_URL);
    expect(pluginOnlyLandingUrl('')).toBe(PLUGIN_ONLY_FALLBACK_URL);
    expect(pluginOnlyLandingUrl('advanced/sites')).toBe(PLUGIN_ONLY_FALLBACK_URL);
    expect(pluginOnlyLandingUrl('auth')).toBe(PLUGIN_ONLY_FALLBACK_URL);
    expect(pluginOnlyLandingUrl('pluginsX/evil')).toBe(PLUGIN_ONLY_FALLBACK_URL);
  });
});
