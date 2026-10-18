import {Route, Routes} from '@angular/router';

/** An internal link's path: no query string or fragment, no leading/trailing slashes. */
export function linkPath(link: string | null | undefined): string {
  return (link ?? '').trim().split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
}

/**
 * Whether an internal link reaches a page rather than the not-found page.
 *
 * Follows the router's first-match order: a `**` route ends the search,
 * because nothing after it can match. Lazy-loaded children are not loaded
 * here, so a matched lazy route vouches for every segment under it — except
 * an empty-path lazy route (My eForms at ''), which would vouch for every
 * link; it only matches when no segment is left. `lazyChildren` supplies the
 * children of lazy routes that are known up front, keyed by route path (the
 * plugin routes under 'plugins', My eForms' sub-modules under '').
 */
export function linkMatchesRoute(
  link: string,
  routes: Routes,
  lazyChildren: Record<string, Routes> = {}
): boolean {
  const path = linkPath(link);
  return matchRoutes(routes, path ? path.split('/') : [], lazyChildren);
}

function matchRoutes(routes: Routes, segments: string[], lazyChildren: Record<string, Routes>): boolean {
  for (const route of routes) {
    if (route.path === '**') {
      return false;
    }
    if (matchRoute(route, segments, lazyChildren)) {
      return true;
    }
  }
  return false;
}

function matchRoute(route: Route, segments: string[], lazyChildren: Record<string, Routes>): boolean {
  if (route.outlet && route.outlet !== 'primary') {
    return false;
  }
  if (route.matcher) {
    // A custom matcher cannot be evaluated without the router; trust it.
    return true;
  }
  const own = route.path ? route.path.split('/') : [];
  if (own.length > segments.length || !own.every((part, i) => part.startsWith(':') || part === segments[i])) {
    return false;
  }
  const rest = segments.slice(own.length);
  if (route.children) {
    return matchRoutes(route.children, rest, lazyChildren);
  }
  if (route.loadChildren) {
    const known = lazyChildren[route.path ?? ''];
    if (known) {
      return matchRoutes(known, rest, lazyChildren);
    }
    return own.length > 0 || rest.length === 0;
  }
  return rest.length === 0;
}
