import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EformSharedModule} from '../../common/modules/eform-shared/eform-shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {EmailRecipientsRouting} from './email-recipients.routing';
import {
  EmailRecipientDeleteComponent,
  EmailRecipientEditComponent,
  EmailRecipientsNewComponent,
  EmailRecipientsPageComponent,
  EmailRecipientsTagsComponent,
} from './components';
import {EformSharedTagsModule} from '../../common/modules/eform-shared-tags/eform-shared-tags.module';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@NgModule({
  declarations: [
    EmailRecipientsPageComponent,
    EmailRecipientsNewComponent,
    EmailRecipientEditComponent,
    EmailRecipientDeleteComponent,
    EmailRecipientsTagsComponent
  ],
  imports: [
    CommonModule,
    EformSharedModule,
    CommonModule,
    NgSelectModule,
    TranslateModule,
    FormsModule,
    EmailRecipientsRouting,
    EformSharedTagsModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MtxSelectModule,
    MtxGridModule,
    MatDialogModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
})
export class EmailRecipientsModule {
}
