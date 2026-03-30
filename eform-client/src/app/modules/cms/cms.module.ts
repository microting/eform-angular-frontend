import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CmsContainerComponent} from './components/cms-container/cms-container.component';
import {CmsSettingsComponent} from './components/cms-settings/cms-settings.component';
import {CmsPagesListComponent} from './components/cms-pages-list/cms-pages-list.component';
import {CmsPageEditComponent} from './components/cms-page-edit/cms-page-edit.component';
import {CmsMenusListComponent} from './components/cms-menus-list/cms-menus-list.component';
import {CmsMenuEditComponent} from './components/cms-menu-edit/cms-menu-edit.component';
import {CmsMenuItemDialogComponent} from './components/cms-menu-edit/cms-menu-item-dialog.component';
import {CmsService} from 'src/app/common/services/cms';

const routes: Routes = [
  {path: '', component: CmsContainerComponent},
  {path: 'pages/new', component: CmsPageEditComponent},
  {path: 'pages/:id', component: CmsPageEditComponent},
  {path: 'menus/:id', component: CmsMenuEditComponent},
];

@NgModule({
  declarations: [
    CmsContainerComponent,
    CmsSettingsComponent,
    CmsPagesListComponent,
    CmsPageEditComponent,
    CmsMenusListComponent,
    CmsMenuEditComponent,
    CmsMenuItemDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    EditorModule,
    DragDropModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  providers: [
    CmsService,
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
  ],
})
export class CmsModule {}
