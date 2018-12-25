import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {EformImportedModule} from 'src/app/common/modules/eform-imported/eform-imported.module';
import {PellModule} from 'src/app/common/modules/eform-imported/pell/pell.module';

import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  ElementAudioComponent,
  ElementCheckboxComponent,
  ElementCommentComponent,
  ElementContainerComponent,
  ElementInfoboxComponent,
  ElementMultiselectComponent,
  ElementTextComponent
} from './components/eform-report-elements';
import {EformReportRouting} from './eform-report.routing';
import {
  EformReportPageComponent,
  EformReportSwitchComponent,
  EformReportBlockComponent
} from './components';
import { EformReportHeaderComponent } from './components/eform-report-header/eform-report-header.component';
import { EformReportCropperComponent } from './components/eform-report-cropper/eform-report-cropper.component';

@NgModule({
  imports: [
    CommonModule,
    EformReportRouting,
    EformSharedModule,
    TranslateModule,
    PellModule,
    MDBBootstrapModule,
    NgSelectModule,
    EformImportedModule,
    FormsModule,
    DragulaModule,
    ImageCropperModule
  ],
  declarations: [
    EformReportPageComponent,
    EformReportSwitchComponent,
    EformReportBlockComponent,
    ElementAudioComponent,
    ElementCheckboxComponent,
    ElementCommentComponent,
    ElementContainerComponent,
    ElementInfoboxComponent,
    ElementMultiselectComponent,
    ElementTextComponent,
    EformReportHeaderComponent,
    EformReportCropperComponent]
})
export class EformReportModule {
}
