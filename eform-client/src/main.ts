import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule, registerIconsFactory } from './app/app.module';
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
import { providers } from './app/app.declarations';
import { IconService } from './app/components/icons';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { appMenuReducer, appSettingsReducer, authReducer, casesReducer, deviceUsersReducer, eformReducer, emailRecipientsReducer, entitySearchReducer, entitySelectReducer, pluginsReducer, securityReducer, usersReducer, AppMenuEffects } from './app/state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment as environment_1 } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app/app.routing';
import { TranslateModule } from '@ngx-translate/core';
import { translateConfig } from './app/common/helpers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedPnModule } from './app/plugins/modules/shared/shared-pn.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { PluginsModule } from './app/plugins/plugins.module';
import { EformSharedModule } from './app/common/modules/eform-shared/eform-shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EformMatDateFnsDateModule } from './app/common/modules/eform-date-adapter/eform-mat-datefns-date-adapter.module';
import { AppComponent } from './app/components/app.component';

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
    integrations: [Sentry.browserTracingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(NgxMaterialTimepickerModule, NgxMaskDirective, NgxMaskPipe, 
        // Libs
        BrowserModule, HttpClientModule, StoreModule.forRoot({
            appMenus: appMenuReducer,
            appSettings: appSettingsReducer,
            auth: authReducer,
            cases: casesReducer,
            deviceUsers: deviceUsersReducer,
            eforms: eformReducer,
            emailRecipients: emailRecipientsReducer,
            entitySearch: entitySearchReducer,
            entitySelect: entitySelectReducer,
            plugins: pluginsReducer,
            security: securityReducer,
            users: usersReducer,
        }), StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }), EffectsModule.forRoot(AppMenuEffects), AppRoutingModule, TranslateModule.forRoot(translateConfig), BrowserAnimationsModule, ToastrModule.forRoot({
            autoDismiss: true,
            timeOut: 3000,
            preventDuplicates: true,
            positionClass: 'toast-bottom-right',
        }), 
        // TODO fix ngx-mask
        // NgxMaskModule.forRoot(),
        GalleryModule, LightboxModule, NgxChartsModule, SharedPnModule, MatSidenavModule, MatButtonModule, MatTreeModule, MatIconModule, MatToolbarModule, MatMenuModule, MatExpansionModule, MtxSelectModule, FormsModule, MatFormFieldModule, MatCardModule, MatInputModule, 
        // Modules
        PluginsModule, EformSharedModule, MatProgressSpinnerModule, 
        // EformDateFnsDateModule,
        EformMatDateFnsDateModule),
        providers,
        {
            provide: APP_INITIALIZER,
            useFactory: registerIconsFactory,
            deps: [IconService],
            multi: true
        },
    ]
})
  // eslint-disable-next-line no-console
  .then((success) => console.log('Bootstrap success'))
  .catch((err) => console.debug(err));
