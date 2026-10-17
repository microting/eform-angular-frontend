import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import {SentryFeedbackService} from './sentry-feedback.service';

// Sentry is off in the default (dev) environment; switch it on so the service does its work.
jest.mock('src/environments/environment', () => ({
  environment: {production: false, enableSentry: true},
}));
jest.mock('@sentry/angular', () => ({getFeedback: jest.fn(), captureException: jest.fn()}));

describe('SentryFeedbackService', () => {
  let service: SentryFeedbackService;
  let dialog: {appendToDom: jest.Mock; open: jest.Mock; removeFromDom: jest.Mock};
  let createForm: jest.Mock;
  const getFeedback = Sentry.getFeedback as jest.Mock;

  beforeEach(() => {
    dialog = {appendToDom: jest.fn(), open: jest.fn(), removeFromDom: jest.fn()};
    createForm = jest.fn().mockResolvedValue(dialog);
    getFeedback.mockReset().mockReturnValue({createForm});

    TestBed.configureTestingModule({
      providers: [
        SentryFeedbackService,
        {provide: TranslateService, useValue: {instant: (key: string) => `translated:${key}`}},
      ],
    });
    service = TestBed.inject(SentryFeedbackService);
  });

  it('creates the form, appends it to the DOM and opens it', async () => {
    await service.openForm();

    expect(createForm).toHaveBeenCalledTimes(1);
    expect(createForm.mock.calls[0][0].formTitle).toBe('translated:Report a bug');
    expect(dialog.appendToDom).toHaveBeenCalledTimes(1);
    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.appendToDom.mock.invocationCallOrder[0])
      .toBeLessThan(dialog.open.mock.invocationCallOrder[0]);
  });

  it('does nothing when the feedback integration is unavailable', async () => {
    getFeedback.mockReturnValue(undefined);

    await expect(service.openForm()).resolves.toBeUndefined();

    expect(createForm).not.toHaveBeenCalled();
  });

  it('does not throw when the form fails to load, and can be tried again', async () => {
    const failure = new Error('missing modal integration');
    createForm.mockRejectedValueOnce(failure);

    await expect(service.openForm()).resolves.toBeUndefined();

    expect(dialog.open).not.toHaveBeenCalled();
    expect(Sentry.captureException).toHaveBeenCalledWith(failure);

    await service.openForm();
    expect(dialog.open).toHaveBeenCalledTimes(1);
  });

  it('does not stack a second form on top of an open one', async () => {
    await service.openForm();
    await service.openForm();

    expect(createForm).toHaveBeenCalledTimes(1);
  });

  it('creates only one form for two calls in the same tick', async () => {
    await Promise.all([service.openForm(), service.openForm()]);

    expect(createForm).toHaveBeenCalledTimes(1);
    expect(dialog.open).toHaveBeenCalledTimes(1);
  });

  it('removes the form when it is closed and builds a fresh one next time', async () => {
    await service.openForm();

    createForm.mock.calls[0][0].onFormClose();
    expect(dialog.removeFromDom).toHaveBeenCalledTimes(1);

    await service.openForm();
    expect(createForm).toHaveBeenCalledTimes(2);
  });

  it('allows a new form as soon as a report is sent, and removes the old one once Sentry is done with it', async () => {
    await service.openForm();
    const options = createForm.mock.calls[0][0];

    options.onSubmitSuccess();
    // the success message is still showing inside the dialog
    expect(dialog.removeFromDom).not.toHaveBeenCalled();

    await service.openForm();
    expect(createForm).toHaveBeenCalledTimes(2);

    options.onFormSubmitted();
    expect(dialog.removeFromDom).toHaveBeenCalledTimes(1);

    // the late clean-up of the first form must not free the guard of the second
    await service.openForm();
    expect(createForm).toHaveBeenCalledTimes(2);
  });
});
