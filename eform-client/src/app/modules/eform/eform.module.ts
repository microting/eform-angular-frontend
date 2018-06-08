import {TranslateModule} from '@ngx-translate/core';
import {EFormRoutingModule} from './eform-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EFormTableComponent} from './components/eform-page/eform-table.component';
import {EFormComponent} from './components/eform.component';
import {HelpersModule} from 'app/modules/helpers/helpers.module';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';
import {FormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {AdvancedModule} from 'app/modules/advanced/advanced.module';

@NgModule({
  imports: [
    CommonModule,
    HelpersModule,
    Ng2Bs3ModalModule,
    EFormRoutingModule,
    TooltipModule,
    TranslateModule.forChild(),
    FormsModule,
    FileUploadModule,
    MultiselectDropdownModule
  ],
  declarations: [EFormTableComponent, EFormComponent]
})
export class EFormModule {
}
