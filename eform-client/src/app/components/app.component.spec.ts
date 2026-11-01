import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent, staysOpenWhenSignedOut } from './app.component';
import { AuthService, TitleService, UserSettingsService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';
import { AuthSyncStorageService, selectAuthIsAuth } from 'src/app/state';
import { MatPaginatorShowAllService } from 'src/app/common/modules/eform-shared/components/eform-pagination/mat_paginator_show_all.service';

describe('staysOpenWhenSignedOut', () => {
  it('keeps anonymous plugin pages and password restoration open', () => {
    expect(staysOpenWhenSignedOut('/p/kanban/signup')).toBe(true);
    expect(staysOpenWhenSignedOut('/p/kanban/invite/abc?x=1')).toBe(true);
    expect(staysOpenWhenSignedOut('/p')).toBe(true);
    expect(staysOpenWhenSignedOut('/auth/restore-password')).toBe(true);
    expect(staysOpenWhenSignedOut('/auth/restore-password-confirmation?code=1')).toBe(true);
  });
  it('signs out anywhere else', () => {
    expect(staysOpenWhenSignedOut('/')).toBe(false);
    expect(staysOpenWhenSignedOut('/plugins/kanban-pn')).toBe(false);
    expect(staysOpenWhenSignedOut('/pages')).toBe(false);
    expect(staysOpenWhenSignedOut('/advanced?next=/p/x')).toBe(false);
  });
});

describe('AppComponent startup auth check', () => {
  let logout: ReturnType<typeof vi.fn>;
  let routerUrl: string;

  beforeEach(() => {
    vi.useFakeTimers();
    logout = vi.fn();
    routerUrl = '/';
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { get url() { return routerUrl; } } },
        { provide: Store, useValue: { select: (s: unknown) => of(s === selectAuthIsAuth ? false : 'eform'), dispatch: vi.fn() } },
        { provide: UserSettingsService, useValue: {} },
        { provide: AuthStateService, useValue: { logout } },
        { provide: AuthService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: Title, useValue: { setTitle: vi.fn() } },
        { provide: TitleService, useValue: { title: of('') } },
        { provide: AuthSyncStorageService, useValue: { init: vi.fn() } },
        { provide: MatPaginatorShowAllService, useValue: { start: vi.fn() } },
      ],
    });
    TestBed.overrideComponent(AppComponent, { set: { template: '', imports: [] } });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const startSignedOutAt = (url: string) => {
    routerUrl = url;
    TestBed.createComponent(AppComponent).componentInstance.ngOnInit();
    vi.advanceTimersByTime(1000);
  };

  it('leaves a signed-out visitor on an anonymous plugin page under /p', () => {
    startSignedOutAt('/p/kanban/signup');
    expect(logout).not.toHaveBeenCalled();
  });

  it('still signs out a signed-out visitor of a main-app page', () => {
    startSignedOutAt('/advanced/sites');
    expect(logout).toHaveBeenCalled();
  });
});
