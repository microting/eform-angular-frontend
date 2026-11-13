import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Appearance = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

@Injectable({providedIn: 'root'})
export class ThemeModeService {
  private readonly appearanceSubject = new ReplaySubject<Appearance>(1);
  private mode: ThemeMode = 'system';
  private fallbackDark = false;
  private mql: MediaQueryList | null = null;
  private readonly onChange = (e: MediaQueryListEvent) => {
    if (this.mode === 'system') {
      this.appearanceSubject.next(e.matches ? 'dark' : 'light');
    }
  };

  /** What to paint. Emits nothing until the first setMode, so no guessed value can flash the wrong theme. */
  readonly appearance$: Observable<Appearance> = this.appearanceSubject.pipe(distinctUntilChanged());

  /**
   * Sets the preference. 'system' registers a single OS listener (idempotent);
   * a fixed mode removes it. fallbackDark is used for 'system' when matchMedia is absent.
   */
  setMode(mode: ThemeMode, fallbackDark: boolean = this.fallbackDark): void {
    this.mode = mode === 'light' || mode === 'dark' ? mode : 'system';
    this.fallbackDark = fallbackDark;
    if (this.mode === 'system') {
      this.listen();
    } else {
      this.unlisten();
    }
    this.appearanceSubject.next(this.resolve(this.mode, this.fallbackDark));
  }

  /** Pure: no subscription. Unknown modes are treated as 'system'. */
  resolve(mode: ThemeMode, fallbackDark: boolean): Appearance {
    if (mode === 'light') {
      return 'light';
    }
    if (mode === 'dark') {
      return 'dark';
    }
    const mql = this.query();
    if (mql) {
      return mql.matches ? 'dark' : 'light';
    }
    return fallbackDark ? 'dark' : 'light';
  }

  private query(): MediaQueryList | null {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(DARK_QUERY)
      : null;
  }

  private listen(): void {
    if (this.mql) {
      return;
    }
    const mql = this.query();
    if (!mql) {
      return;
    }
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', this.onChange);
    } else if (typeof (mql as any).addListener === 'function') {
      (mql as any).addListener(this.onChange);
    } else {
      return;
    }
    this.mql = mql;
  }

  private unlisten(): void {
    const mql = this.mql;
    if (!mql) {
      return;
    }
    if (typeof mql.removeEventListener === 'function') {
      mql.removeEventListener('change', this.onChange);
    } else if (typeof (mql as any).removeListener === 'function') {
      (mql as any).removeListener(this.onChange);
    }
    this.mql = null;
  }
}
