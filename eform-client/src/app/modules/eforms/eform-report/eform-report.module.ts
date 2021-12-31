import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {ImageCropperModule} from 'ngx-image-cropper';
// TODO import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformImportedModule} from 'src/app/common/modules/eform-imported/eform-imported.module';
// import {PellModule} from 'src/app/common/modules/eform-imported/pell/pell.module';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  ElementCheckboxComponent,
  ElementCommentComponent,
  ElementContainerComponent,
  ElementInfoboxComponent,
  ElementMultiselectComponent,
  ElementTextComponent,
} from './components/eform-report-elements';
import { EformReportRouting } from './eform-report.routing';
import {
  EformReportBlockComponent,
  EformReportCropperComponent,
  EformReportHeaderComponent,
  EformReportPageComponent,
  EformReportSwitchComponent,
} from './components';
import {MdbCollapseModule} from 'mdb-angular-ui-kit/collapse';

@NgModule({
  imports: [
    CommonModule,
    EformReportRouting,
    EformSharedModule,
    TranslateModule,
// TODO     MDBBootstrapModule,
    NgSelectModule,
    EformImportedModule,
    FormsModule,
    DragulaModule,
    ImageCropperModule,
    MdbCollapseModule,
  ],
  declarations: [
    EformReportPageComponent,
    EformReportSwitchComponent,
    EformReportBlockComponent,
    ElementCheckboxComponent,
    ElementCommentComponent,
    ElementContainerComponent,
    ElementInfoboxComponent,
    ElementMultiselectComponent,
    ElementTextComponent,
    EformReportHeaderComponent,
    EformReportCropperComponent,
  ],
})
export class EformReportModule {}
