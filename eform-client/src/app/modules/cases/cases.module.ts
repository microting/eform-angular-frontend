import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeModule,
  // OwlMomentDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { GalleryModule } from '@ngx-gallery/core';
import { GallerizeModule } from '@ngx-gallery/gallerize';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { TranslateModule } from '@ngx-translate/core';
import { MY_MOMENT_FORMATS } from 'src/app/common/helpers';
import { EformCasesModule } from 'src/app/common/modules/eform-cases/eform-cases.module';
import { EformImportedModule } from 'src/app/common/modules/eform-imported/eform-imported.module';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { CasesRoutingModule } from './cases.routing';
import { CaseEditComponent, CasesTableComponent } from './components';
import { casesPersistProvider } from './components/store';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';

@NgModule({
  imports: [
    TranslateModule,
    EformSharedModule,
    CasesRoutingModule,
    CommonModule,
    NgSelectModule,
    EformImportedModule,
    GallerizeModule,
    LightboxModule,
    GalleryModule,
    OwlDateTimeModule,
    // OwlMomentDateTimeModule,
    FormsModule,
    EformCasesModule,
    MatSortModule,
    MatInputModule,
    MtxGridModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  declarations: [CasesTableComponent, CaseEditComponent],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    casesPersistProvider,
  ],
})
export class CasesModule {}
