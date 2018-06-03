import { PreloadingStrategy, Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';

export class PreloadResolverConfig implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data.preload ? load() : Observable.of(null);
  }
}
