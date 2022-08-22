import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformSharedModule} from '../../common/modules/eform-shared/eform-shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {AdvancedRoutingModule} from './advanced.routing';
import {
  EntitySearchComponent,
  EntitySearchRemoveComponent,
  EntitySelectComponent,
  EntitySelectCreateComponent,
  EntitySelectEditComponent,
  EntitySelectImportListComponent,
  EntitySelectRemoveComponent,
  SiteDeleteComponent,
  SiteEditComponent,
  SitesComponent,
  UnitsComponent,
  UnitCreateComponent,
  UnitMoveComponent,
  UnitsOtpCodeComponent,
  WorkerEditCreateComponent,
  WorkerDeleteComponent,
  WorkersComponent,
  FoldersComponent,
  FolderCreateComponent,
  FolderEditComponent,
  FolderDeleteComponent,
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EformImportedModule} from '../../common/modules/eform-imported/eform-imported.module';
import {advancedPersistProviders} from './components/advansed-persist-providers';
import {EformSharedTagsModule} from '../../common/modules/eform-shared-tags/eform-shared-tags.module';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

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
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MtxGridModule,
    MatDialogModule,
    MatInputModule,
    MtxSelectModule,
    MatSlideToggleModule,
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
    WorkerEditCreateComponent,
    WorkerDeleteComponent,
    EntitySearchRemoveComponent,
    EntitySelectRemoveComponent,
    EntitySelectCreateComponent,
    EntitySelectImportListComponent,
    EntitySelectEditComponent,
    FoldersComponent,
    FolderCreateComponent,
    FolderEditComponent,
    FolderDeleteComponent,
  ],
  providers: [...advancedPersistProviders],
})
export class AdvancedModule {
}
