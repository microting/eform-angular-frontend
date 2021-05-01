import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {GalleryModule} from '@ngx-gallery/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {PlanningCaseRoutingModule} from './planning-case-routing.module';
import {CasesModule} from 'src/app/modules';
import {EformImportedModule} from 'src/app/common/modules/eform-imported/eform-imported.module';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {PlanningCasePageComponent} from 'src/app/plugins/modules/items-planning-pn/components/planning-case/planning-case-page/planning-case-page.component';
import {PlanningCaseHeaderComponent} from 'src/app/plugins/modules/items-planning-pn/components/planning-case/planning-case-header/planning-case-header.component';

@NgModule({
  declarations: [
    PlanningCaseHeaderComponent,
    PlanningCasePageComponent
  ],
  imports: [
    TranslateModule,
    MDBBootstrapModule,
    EformSharedModule,
    PlanningCaseRoutingModule,
    CommonModule,
    NgSelectModule,
    EformImportedModule,
    GallerizeModule,
    LightboxModule,
    GalleryModule,
    FormsModule,
    FontAwesomeModule,
    CasesModule
  ]
})
export class PlanningCaseModule {
}
