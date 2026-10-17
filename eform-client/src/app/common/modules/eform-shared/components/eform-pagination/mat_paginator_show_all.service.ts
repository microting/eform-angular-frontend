import {Injectable, NgZone, OnDestroy, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

/**
 * Decorates every mat-paginator in the DOM with a translated "Vis alle"
 * button. Works across module boundaries (including @ng-matero/extensions
 * mtx-grid's internal paginator), unlike a directive whose selector only
 * attaches inside the module that declares it.
 *
 * IMPORTANT: the MutationObserver is registered OUTSIDE Angular's zone.
 * Subtree mutation events on document.body fire on every DOM change app-wide
 * (router navigations, dialog open/close, form input, etc.). Inside the zone
 * each event would re-schedule Angular change detection and keep NgZone
 * perpetually unstable — which causes Playwright's auto-wait on Angular
 * stability to hang on tests that involve heavy DOM mutations.
 *
 * The user's click handler IS wrapped back into the zone so the page-size
 * change propagates through Angular's change detection like a normal event.
 */
@Injectable({providedIn: 'root'})
export class MatPaginatorShowAllService implements OnDestroy {
  private translate = inject(TranslateService);
  private zone = inject(NgZone);
  private observer: MutationObserver | null = null;
  private langSub: Subscription | null = null;
  private label = 'Show all';
  private pendingFrame: number | null = null;

  start(): void {
    if (typeof document === 'undefined' || this.observer) return;

    this.translate.get('PAGINATOR.SHOW_ALL').subscribe((t) => {
      this.label = t;
      this.refreshAllLabels();
    });
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.translate.get('PAGINATOR.SHOW_ALL').subscribe((t) => {
        this.label = t;
        this.refreshAllLabels();
      });
    });

    this.zone.runOutsideAngular(() => {
      this.observer = new MutationObserver(() => this.scheduleScan());
      this.observer.observe(document.body, {childList: true, subtree: true});
      this.scheduleScan();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.langSub?.unsubscribe();
    if (this.pendingFrame !== null) {
      cancelAnimationFrame(this.pendingFrame);
      this.pendingFrame = null;
    }
  }

  private scheduleScan(): void {
    if (this.pendingFrame !== null) return;
    // Coalesce mutation bursts into one scan per frame.
    this.pendingFrame = requestAnimationFrame(() => {
      this.pendingFrame = null;
      this.scanAll();
    });
  }

  private scanAll(): void {
    document.querySelectorAll<HTMLElement>('mat-paginator').forEach((p) => this.decorate(p));
  }

  private refreshAllLabels(): void {
    document
      .querySelectorAll<HTMLButtonElement>('.mat-mdc-paginator-show-all')
      .forEach((b) => (b.textContent = this.label));
  }

  private decorate(paginator: HTMLElement): void {
    const actions = paginator.querySelector('.mat-mdc-paginator-range-actions');
    if (!actions) return;
    if (actions.querySelector('.mat-mdc-paginator-show-all')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mat-mdc-paginator-show-all';
    btn.textContent = this.label;
    // Re-enter the zone for the user action so Material's page-size change
    // routes through Angular change detection like a normal click would.
    btn.addEventListener('click', () => this.zone.run(() => this.showAll(paginator)));
    actions.appendChild(btn);
  }

  private showAll(paginator: HTMLElement): void {
    // Pick the largest page-size option from the mat-select inside the paginator
    // and click the matching option in the dropdown panel. This routes the
    // change through Material's own state and emits page events normally.
    const trigger = paginator.querySelector<HTMLElement>(
      '.mat-mdc-paginator-page-size-select .mat-mdc-select-trigger',
    );
    if (!trigger) return;
    trigger.click();

    setTimeout(() => {
      const options = document.querySelectorAll<HTMLElement>(
        '.mat-mdc-select-panel .mat-mdc-option',
      );
      if (!options.length) return;
      let best: HTMLElement | null = null;
      let bestVal = -Infinity;
      options.forEach((opt) => {
        const v = parseInt(opt.textContent?.trim() ?? '', 10);
        if (!isNaN(v) && v > bestVal) {
          bestVal = v;
          best = opt;
        }
      });
      best?.click();
    }, 50);
  }
}
