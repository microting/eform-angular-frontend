import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { registerLocaleData } from '@angular/common';
import localeBg from '@angular/common/locales/bg';
import localeCz from '@angular/common/locales/cs';
import localeDa from '@angular/common/locales/da';
import localeDe from '@angular/common/locales/de';
import localeEl from '@angular/common/locales/el';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeEt from '@angular/common/locales/et';
import localeFi from '@angular/common/locales/fi';
import localeFr from '@angular/common/locales/fr';
import localeHr from '@angular/common/locales/hr';
import localeHu from '@angular/common/locales/hu';
import localeIs from '@angular/common/locales/is';
import localeIt from '@angular/common/locales/it';
import localeLt from '@angular/common/locales/lt';
import localeLv from '@angular/common/locales/lv';
import localeNl from '@angular/common/locales/nl';
import localeNo from '@angular/common/locales/no';
import localePl from '@angular/common/locales/pl';
import localePt from '@angular/common/locales/pt';
import localeRo from '@angular/common/locales/ro';
import localeSk from '@angular/common/locales/sk';
import localeSl from '@angular/common/locales/sl';
import localeSv from '@angular/common/locales/sv';
import localeTr from '@angular/common/locales/tr';
import localeUk from '@angular/common/locales/uk';

registerLocaleData(localeBg);
registerLocaleData(localeCz);
registerLocaleData(localeDa);
registerLocaleData(localeDe);
registerLocaleData(localeEl);
registerLocaleData(localeEn);
registerLocaleData(localeEs);
registerLocaleData(localeEt);
registerLocaleData(localeFi);
registerLocaleData(localeFr);
registerLocaleData(localeHr);
registerLocaleData(localeHu);
registerLocaleData(localeIs);
registerLocaleData(localeIt);
registerLocaleData(localeLt);
registerLocaleData(localeLv);
registerLocaleData(localeNl);
registerLocaleData(localeNo);
registerLocaleData(localePl);
registerLocaleData(localePt);
registerLocaleData(localeRo);
registerLocaleData(localeSk);
registerLocaleData(localeSl);
registerLocaleData(localeSv);
registerLocaleData(localeTr);
registerLocaleData(localeUk);


if (environment.enableSentry) {
  Sentry.init({
    dsn: 'https://38b1e86a3c4d2532158903ab783bfe5e@o4506241219428352.ingest.sentry.io/4506268847112192',
    environment: environment.production ? 'production' : 'development',
    // No `release`: the build has no reliable frontend version source, and the sourcemap
    // upload (`sentry-cli sourcemaps inject`) matches bundles by debug ID, not by release.
    integrations: [
      Sentry.browserTracingIntegration(),
      // Buffer mode (see the replay sample rates below): nothing is sent until an error
      // or a feedback report needs a replay attached. Default masking is kept.
      Sentry.replayIntegration(),
      // No floating widget (autoInject: false) - the form is opened from the profile menu
      // through SentryFeedbackService. Name/email are prefilled from Sentry.setUser()
      // (SDK default `useSentryUser`: name <- username, email <- email).
      Sentry.feedbackIntegration({
        autoInject: false,
        showBranding: false,
        colorScheme: 'system',
        enableScreenshot: true,
        showName: true,
        showEmail: true,
      }),
      Sentry.consoleLoggingIntegration({levels: ['warn', 'error']}),
    ],
    enableLogs: true,
    // Performance Monitoring
    tracesSampleRate: 0.2, // Capture 20% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0, // Never record a whole session on its own
    replaysOnErrorSampleRate: 1.0, // Always attach the buffered replay when an error occurs
  });
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .then((success) => console.log('Bootstrap success'))
  .catch((err) => console.debug(err));
