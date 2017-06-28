import {EFormRoutingModule} from './eform-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EFormTableComponent} from './components/eform-table/eform-table.component';
import {EFormComponent} from './components/eform.component';
import {EFormService} from 'app/services/eform/eform.service';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {SitesService} from '../../services/sites.service';

@NgModule({
  imports: [
    CommonModule,
    HelpersModule,
    Ng2Bs3ModalModule,
    EFormRoutingModule,
    TooltipModule.forRoot(),
    FormsModule,
  ],
  declarations: [EFormTableComponent, EFormComponent
  ],
  providers: [EFormService, SitesService]
})
export class EFormModule {
}
