import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import {environment} from 'src/environments/environment';

type FeedbackDialog = Awaited<ReturnType<NonNullable<ReturnType<typeof Sentry.getFeedback>>['createForm']>>;

/**
 * Opens the Sentry user-feedback form on demand. The feedback integration is registered
 * in main.ts with `autoInject: false`, so this service is the only way into the form.
 */
@Injectable({providedIn: 'root'})
export class SentryFeedbackService {
  private translateService = inject(TranslateService);
  /** True from the moment a form is requested until it is closed or its report is sent. */
  private isFormActive = false;

  /** Whether Sentry is initialised in this build at all. */
  readonly isEnabled: boolean = environment.enableSentry;

  /**
   * Opens the feedback form. Never throws: it does nothing when Sentry is disabled, the
   * feedback integration is missing, or a form is already open or being created.
   */
  async openForm(): Promise<void> {
    if (this.isFormActive) {
      return;
    }
    const feedback = this.isEnabled ? Sentry.getFeedback() : undefined;
    if (!feedback) {
      return;
    }
    this.isFormActive = true; // set before the await, so a second call in the same tick is ignored
    let dialog: FeedbackDialog | undefined;
    const remove = () => dialog?.removeFromDom();
    try {
      // A new dialog per opening: the form reads the Sentry user (name/email prefill) when
      // it is created, so a cached one would keep showing a previous user's details.
      dialog = await feedback.createForm({
        formTitle: this.translateService.instant('Report a bug'),
        onFormClose: () => {
          remove();
          this.isFormActive = false;
        },
        // The report is sent. Sentry keeps showing its success message inside this dialog
        // for a few seconds and only then calls onFormSubmitted, so the dialog stays in the
        // DOM until then - but a new form may be opened right away.
        onSubmitSuccess: () => this.isFormActive = false,
        onFormSubmitted: remove,
      });
      dialog.appendToDom();
      dialog.open();
    } catch (error) {
      Sentry.captureException(error);
      remove();
      this.isFormActive = false;
    }
  }
}
