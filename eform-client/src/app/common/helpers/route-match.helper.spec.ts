import {Routes} from '@angular/router';
import {linkMatchesRoute, linkPath} from './route-match.helper';

class PageComponent {}

const lazy = () => Promise.resolve(class {});

// The shape of app.routing.ts: a full layout at '' whose first child is the
// lazy My eForms module, a not-found catch-all, and plugin routes appended
// after it (PluginsModule is also imported eagerly, so its routes land there).
const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    children: [
      {path: '', loadChildren: lazy},
      {path: 'advanced', loadChildren: lazy},
      {path: 'plugins', loadChildren: lazy},
      {path: 'cases/:id', component: PageComponent},
    ],
  },
  {path: 'auth', loadChildren: lazy},
  {path: 'connection-string', component: PageComponent, children: [{path: '', component: PageComponent}]},
  {path: '**', component: PageComponent, children: [{path: '', component: PageComponent}]},
  {path: 'items-planning-pn', loadChildren: lazy},
];

const pluginRoutes: Routes = [{path: 'items-planning-pn', loadChildren: lazy}];
const eformsRoutes: Routes = [{path: ''}, {path: 'docx-report', loadChildren: lazy}];

const matches = (link: string) => linkMatchesRoute(link, routes, {'': eformsRoutes, plugins: pluginRoutes});

describe('linkPath', () => {
  it('drops slashes, query string and fragment', () => {
    expect(linkPath('/advanced/sites/?page=2#top')).toBe('advanced/sites');
    expect(linkPath('  /  ')).toBe('');
    expect(linkPath(null)).toBe('');
  });
});

describe('linkMatchesRoute', () => {
  it('matches the start page', () => {
    expect(matches('/')).toBe(true);
    expect(matches('')).toBe(true);
  });

  it('matches a lazy core module and the segments under it', () => {
    expect(matches('/advanced/sites')).toBe(true);
    expect(matches('advanced')).toBe(true);
  });

  it('matches an installed plugin under /plugins', () => {
    expect(matches('/plugins/items-planning-pn/plannings')).toBe(true);
  });

  it('rejects a plugin link without the /plugins prefix', () => {
    // A root-level plugin route exists, but after the catch-all: unreachable.
    expect(matches('/items-planning-pn/plannings')).toBe(false);
  });

  it('rejects a plugin that is not installed', () => {
    expect(matches('/plugins/removed-pn/overview')).toBe(false);
  });

  it('does not let the empty-path My eForms module vouch for unknown links', () => {
    expect(matches('/no-such-page')).toBe(false);
  });

  it('matches My eForms sub-modules supplied for the empty-path lazy route', () => {
    expect(matches('/docx-report/12')).toBe(true);
    expect(matches('/docx-report')).toBe(true);
    expect(matches('/xlsx-report/12')).toBe(false);
  });

  it('only matches the bare path under an empty-path lazy route without known children', () => {
    expect(linkMatchesRoute('/', routes)).toBe(true);
    expect(linkMatchesRoute('/docx-report/12', routes)).toBe(false);
  });

  it('matches route parameters but requires the whole path for component routes', () => {
    expect(matches('/cases/12')).toBe(true);
    expect(matches('/cases/12/extra')).toBe(false);
    expect(matches('/connection-string')).toBe(true);
  });

  it('compares segments case-sensitively, as the router does', () => {
    expect(matches('/Advanced/sites')).toBe(false);
  });
});
