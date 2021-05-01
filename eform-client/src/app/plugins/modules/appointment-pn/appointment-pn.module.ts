import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedPnModule } from '../shared/shared-pn.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EformSharedModule } from '../../../common/modules/eform-shared/eform-shared.module';
import {AppointmentPnLayoutComponent} from './layouts';

import {AppointmentPnCalendarService, AppointmentPnSettingsService} from './services';

import {
  AppointmentCalendarComponent,
  AppointmentDeleteComponent,
  AppointmentEditComponent,
  AppointmentSettingsComponent,
  AppointmentViewComponent
} from './components';
import {AppointmentPnRoutingModule} from './appointment-pn.routing.module';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import localeDa from '@angular/common/locales/da';
import {AppointmentPrefillFieldComponent} from './components/appointments/appointment-prefill-field/appointment-prefill-field.component';
import {CasesModule} from '../../../modules';
import {OwlDateTimeModule} from 'ng-pick-datetime-ex';

registerLocaleData(localeDa);

@NgModule({
    imports: [
        CommonModule,
        SharedPnModule,
        MDBBootstrapModule,
        AppointmentPnRoutingModule,
        TranslateModule,
        FormsModule,
        NgSelectModule,
        EformSharedModule,
        FontAwesomeModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        CasesModule,
        OwlDateTimeModule
    ],
  declarations: [
    AppointmentPnLayoutComponent,
    AppointmentSettingsComponent,
    AppointmentCalendarComponent,
    AppointmentEditComponent,
    AppointmentViewComponent,
    AppointmentDeleteComponent,
    AppointmentPrefillFieldComponent
  ],
  providers: [AppointmentPnSettingsService, AppointmentPnCalendarService]
})

export class AppointmentPnModule { }
