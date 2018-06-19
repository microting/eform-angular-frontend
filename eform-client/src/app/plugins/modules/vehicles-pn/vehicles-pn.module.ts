import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';

import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {
  VehiclesPnPaginationComponent,
  VehiclesPnAddUpdateComponent,
  VehiclesPnPageComponent,
  VehiclesPnSpinnerComponent,
  VehiclesPnDatepickerComponent
} from './components';
import {VehiclesPnRoutingModule} from './vehicles-pn.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VehiclesPnRoutingModule,
    TooltipModule,
    HelpersModule,
    FormsModule,
    TranslateModule,
    Ng2Bs3ModalModule
  ],
  declarations: [
    VehiclesPnPageComponent,
    VehiclesPnAddUpdateComponent,
    VehiclesPnPaginationComponent,
    VehiclesPnSpinnerComponent,
    VehiclesPnDatepickerComponent
  ]
})
export class VehiclesPnModule {
}
