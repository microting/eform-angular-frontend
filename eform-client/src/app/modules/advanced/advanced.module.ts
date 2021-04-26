import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdvancedRoutingModule } from './advanced.routing';
import {
  EntitySearchComponent,
  EntitySearchCreateComponent,
  EntitySearchEditComponent,
  EntitySearchEditNameComponent,
  EntitySearchImportListComponent,
  EntitySearchRemoveComponent,
  EntitySelectComponent,
  EntitySelectCreateComponent,
  EntitySelectEditComponent,
  EntitySelectEditNameComponent,
  EntitySelectImportListComponent,
  EntitySelectRemoveComponent,
  SiteDeleteComponent,
  SiteEditComponent,
  SitesComponent,
  UnitsComponent,
  UnitCreateComponent,
  UnitMoveComponent,
  UnitsOtpCodeComponent,
  WorkerCreateComponent,
  WorkerDeleteComponent,
  WorkerEditComponent,
  WorkersComponent,
  FoldersComponent,
  FolderCreateComponent,
  SiteTagsComponent,
  FolderEditComponent,
  FolderDeleteComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EformImportedModule } from 'src/app/common/modules/eform-imported/eform-imported.module';
import { advancedPersistProviders } from './components/advansed-persist-providers';

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
    FontAwesomeModule,
    MDBBootstrapModule,
    EformImportedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    EntitySearchComponent,
    EntitySelectComponent,
    SitesComponent,
    SiteEditComponent,
    SiteDeleteComponent,
    UnitsComponent,
    UnitCreateComponent,
    UnitMoveComponent,
    UnitsOtpCodeComponent,
    WorkersComponent,
    WorkerEditComponent,
    WorkerDeleteComponent,
    WorkerCreateComponent,
    EntitySearchCreateComponent,
    EntitySearchRemoveComponent,
    EntitySearchImportListComponent,
    EntitySearchEditNameComponent,
    EntitySearchEditComponent,
    EntitySelectRemoveComponent,
    EntitySelectCreateComponent,
    EntitySelectEditNameComponent,
    EntitySelectImportListComponent,
    EntitySelectEditComponent,
    FoldersComponent,
    FolderCreateComponent,
    FolderEditComponent,
    FolderDeleteComponent,
    SiteTagsComponent,
  ],
  providers: [...advancedPersistProviders],
})
export class AdvancedModule {}
