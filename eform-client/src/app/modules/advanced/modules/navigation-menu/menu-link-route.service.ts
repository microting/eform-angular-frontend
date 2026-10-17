import {Injectable, inject} from '@angular/core';
import {Router, Routes} from '@angular/router';
import {linkMatchesRoute, linkPath} from 'src/app/common/helpers';
import {
  NavigationMenuItemModel,
  NavigationMenuTemplateItemModel,
  NavigationMenuTemplateModel,
} from 'src/app/common/models';
import {routes as pluginRoutes} from 'src/app/plugins/plugins.routing';
import {eformsChildRoutePaths} from 'src/app/modules/eforms/eforms-route-paths';

// My eForms (the app's lazy '' route) as the route walk needs it: the page
// itself plus its lazy sub-modules, each vouching for the paths under it.
// The loaders are never called — linkMatchesRoute only reads the shape.
const eformsRoutes: Routes = [
  {path: ''},
  ...Object.values(eformsChildRoutePaths).map((path) => ({path, loadChildren: () => Promise.resolve([])})),
];

/**
 * Checks menu links against the app's routes, so the menu editor can warn
 * about an internal link that would land on the not-found page (#8103).
 */
@Injectable({providedIn: 'root'})
export class MenuLinkRouteService {
  private router = inject(Router);

  /**
   * True for an internal link that matches no route. A link equal to a menu
   * template's default link is always accepted: templates come from the
   * installed plugins, so they are valid even where the route walk cannot see
   * past a lazy module.
   */
  hasNoRoute(
    item: Pick<NavigationMenuItemModel, 'link' | 'isInternalLink'>,
    templates: NavigationMenuTemplateModel[]
  ): boolean {
    if (!item.isInternalLink || !linkPath(item.link)) {
      return false;
    }
    const path = linkPath(item.link);
    if ((templates ?? []).some((t) => t.items.some((x) => linkPath(x.link) === path))) {
      return false;
    }
    return !linkMatchesRoute(item.link, this.router.config, {'': eformsRoutes, plugins: pluginRoutes});
  }

  /**
   * The plugin template item a menu item was created from, for "restore
   * default link". The first template is the core "Main application" one
   * (MenuService.GetNavigationMenu builds it first); its items are skipped
   * because a core item dragged in but not yet saved carries the template's
   * id (1) rather than its own.
   */
  pluginTemplateItem(
    item: Pick<NavigationMenuItemModel, 'relatedTemplateItemId'>,
    templates: NavigationMenuTemplateModel[]
  ): NavigationMenuTemplateItemModel | null {
    if (item.relatedTemplateItemId == null) {
      return null;
    }
    for (const template of (templates ?? []).slice(1)) {
      const templateItem = template.items.find((x) => x.id === item.relatedTemplateItemId);
      if (templateItem) {
        return templateItem;
      }
    }
    return null;
  }
}
