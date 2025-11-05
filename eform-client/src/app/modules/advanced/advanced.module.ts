import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {EformSharedModule} from '../../common/modules/eform-shared/eform-shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {AdvancedRoutingModule} from './advanced.routing';
import {
  EntitySearchComponent,
  EntitySearchRemoveComponent,
  EntitySelectComponent,
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
  FolderEditCreateComponent,
  FolderDeleteComponent,
} from './components';
import {EformImportedModule} from '../../common/modules/eform-imported/eform-imported.module';
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
import {MatChipsModule} from '@angular/material/chips';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@NgModule({
  imports: [
    AdvancedRoutingModule,
    CommonModule,
    TranslateModule,
    EformSharedModule,
    NgSelectModule,
    FormsModule,
    DragulaModule,
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
    MatChipsModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
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
    FoldersComponent,
    FolderEditCreateComponent,
    FolderDeleteComponent,
  ],
})
export class AdvancedModule {
}
