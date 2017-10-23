import {EFormRoutingModule} from './eform-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EFormTableComponent} from './components/eform-table/eform-table.component';
import {EFormComponent} from './components/eform.component';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    HelpersModule,
    Ng2Bs3ModalModule,
    EFormRoutingModule,
    TooltipModule.forRoot(),
    FormsModule,
    FileUploadModule
  ],
  declarations: [EFormTableComponent, EFormComponent]
})
export class EFormModule {
}
