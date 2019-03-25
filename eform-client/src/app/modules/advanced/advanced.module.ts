import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {AdvancedRoutingModule} from './advanced.routing';
import {
  EntitySearchComponent,
  EntitySearchCreateComponent, EntitySearchEditComponent,
  EntitySearchEditNameComponent,
  EntitySearchImportListComponent,
  EntitySearchRemoveComponent,
  EntitySelectComponent,
  EntitySelectCreateComponent, EntitySelectEditComponent,
  EntitySelectEditNameComponent,
  EntitySelectImportListComponent,
  EntitySelectRemoveComponent,
  SiteDeleteComponent,
  SiteEditComponent,
  SitesComponent,
  UnitsComponent,
  UnitsOtpCodeComponent,
  WorkerCreateComponent,
  WorkerDeleteComponent,
  WorkerEditComponent,
  WorkersComponent
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  imports: [
    AdvancedRoutingModule,
    CommonModule,
    MDBBootstrapModule,
    TranslateModule,
    EformSharedModule,
    NgSelectModule,
    FormsModule,
    DragulaModule,
    FontAwesomeModule
  ],
  declarations: [
    EntitySearchComponent,
    EntitySelectComponent,
    SitesComponent,
    SiteEditComponent,
    UnitsComponent,
    WorkersComponent,
    WorkerEditComponent,
    SiteDeleteComponent,
    UnitsOtpCodeComponent,
    WorkerDeleteComponent,
    WorkerCreateComponent,
    EntitySearchCreateComponent,
    EntitySearchRemoveComponent,
    EntitySelectRemoveComponent,
    EntitySearchImportListComponent,
    EntitySearchEditNameComponent,
    EntitySearchEditComponent,
    EntitySelectCreateComponent,
    EntitySelectEditNameComponent,
    EntitySelectImportListComponent,
    EntitySelectEditComponent
  ]
})
export class AdvancedModule {
}
