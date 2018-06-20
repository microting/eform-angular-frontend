import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';

import {VehiclesPnService} from './services';
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
  ],
  providers: [VehiclesPnService]
})
export class VehiclesPnModule {
}
