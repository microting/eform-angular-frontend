import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {MatMenuTrigger} from '@angular/material/menu';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Store} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';
import {FooterComponent} from './footer.component';
import {selectAuthIsAdmin} from 'src/app/state';
import {SentryFeedbackService} from 'src/app/common/services';

describe('FooterComponent - "Report a bug" menu item', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let overlayElement: HTMLElement;
  let sentryFeedbackService: {isEnabled: boolean; openForm: jest.Mock};

  const setup = (isAdmin: boolean, sentryEnabled: boolean) => {
    sentryFeedbackService = {isEnabled: sentryEnabled, openForm: jest.fn().mockResolvedValue(undefined)};
    const store = {
      select: jest.fn((selector: unknown) => of(selector === selectAuthIsAdmin ? isAdmin : [])),
    };

    TestBed.configureTestingModule({
      imports: [FooterComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {provide: Store, useValue: store},
        {provide: SentryFeedbackService, useValue: sentryFeedbackService},
      ],
    });

    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    // mat-menu renders its items lazily, into the overlay, once the menu is opened
    fixture.debugElement.query(By.directive(MatMenuTrigger)).injector.get(MatMenuTrigger).openMenu();
    fixture.detectChanges();
    overlayElement = TestBed.inject(OverlayContainer).getContainerElement();
    expect(overlayElement.querySelector('.menu-header')).not.toBeNull(); // the menu did open
  };

  const reportBugItem = () => overlayElement.querySelector<HTMLElement>('#report-bug-btn');

  afterEach(() => TestBed.inject(OverlayContainer).ngOnDestroy());

  it('is shown to an admin when Sentry is enabled', () => {
    setup(true, true);

    expect(reportBugItem()).not.toBeNull();
    expect(reportBugItem()!.textContent).toContain('Report a bug');
  });

  it('is hidden from a non-admin', () => {
    setup(false, true);

    expect(reportBugItem()).toBeNull();
  });

  it('is hidden when Sentry is disabled, even for an admin', () => {
    setup(true, false);

    expect(reportBugItem()).toBeNull();
  });

  it('is a plain button (no link to open in a new tab) that opens the feedback form', () => {
    setup(true, true);

    expect(reportBugItem()!.tagName).toBe('BUTTON');
    expect(reportBugItem()!.getAttribute('type')).toBe('button');

    reportBugItem()!.click();

    expect(sentryFeedbackService.openForm).toHaveBeenCalledTimes(1);
  });
});
