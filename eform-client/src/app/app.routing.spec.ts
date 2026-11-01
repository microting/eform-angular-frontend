import { describe, it, expect } from 'vitest';
import { routes } from './app.routing';
import { IsAuthGuard, NotPluginOnlyGuard } from 'src/app/common/guards';

describe('app routes', () => {
  const children = routes.find((r) => r.path === '' && r.children)!.children!;

  it('checks plugin-only users before IsAuthGuard on /, so its loginRedirectUrl redirect cannot loop them', () => {
    // Guards resolve in array order: the first one to redirect wins.
    expect(children.find((r) => r.path === '')!.canActivate).toEqual([NotPluginOnlyGuard, IsAuthGuard]);
  });

  it('keeps /p anonymous and before the catch-all', () => {
    const p = routes.findIndex((r) => r.path === 'p');
    expect(p).toBeGreaterThan(-1);
    expect(routes[p].canActivate).toBeUndefined();
    expect(p).toBeLessThan(routes.findIndex((r) => r.path === '**'));
  });
});
