import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EformCasesModule } from 'src/app/common/modules/eform-cases/eform-cases.module';
import { EformImportedModule } from 'src/app/common/modules/eform-imported/eform-imported.module';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { CasesRoutingModule } from './cases.routing';
import { CaseEditComponent, CasesTableComponent } from './components';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {LightboxModule} from 'ng-gallery/lightbox';
import {GalleryModule} from 'ng-gallery';

@NgModule({
  imports: [
    TranslateModule,
    EformSharedModule,
    CasesRoutingModule,
    CommonModule,
    EformImportedModule,
    LightboxModule,
    GalleryModule,
    FormsModule,
    EformCasesModule,
    MatSortModule,
    MatInputModule,
    MtxGridModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
  ],
  declarations: [CasesTableComponent, CaseEditComponent],
})
export class CasesModule {}
