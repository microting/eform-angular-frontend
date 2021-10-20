import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EformSharedModule } from '../../common/modules/eform-shared/eform-shared.module';
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
  FolderEditComponent,
  FolderDeleteComponent,
  SiteTagsComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EformImportedModule } from '../../common/modules/eform-imported/eform-imported.module';
import { advancedPersistProviders } from './components/advansed-persist-providers';
import { EformSharedTagsModule } from '../../common/modules/eform-shared-tags/eform-shared-tags.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

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
        EformSharedTagsModule,
        MatTooltipModule,
        MatCardModule,
        MatButtonModule,
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
