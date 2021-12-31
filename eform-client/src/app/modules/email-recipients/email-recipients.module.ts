import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EformSharedModule } from '../../common/modules/eform-shared/eform-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
// TODO import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EmailRecipientsRouting } from './email-recipients.routing';
import {
  EmailRecipientDeleteComponent,
  EmailRecipientEditComponent,
  EmailRecipientsNewComponent,
  EmailRecipientsPageComponent,
  EmailRecipientsTagsComponent,
} from './components';
import { EformSharedTagsModule } from '../../common/modules/eform-shared-tags/eform-shared-tags.module';
import { emailRecipientsPersistProvider } from './components/store/email-recipients.store';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';

@NgModule({
  declarations: [
    EmailRecipientsPageComponent,
    EmailRecipientsNewComponent,
    EmailRecipientEditComponent,
    EmailRecipientsTagsComponent,
    EmailRecipientDeleteComponent,
  ],
  imports: [
    CommonModule,
    EformSharedModule,
    CommonModule,
    NgSelectModule,
    TranslateModule,
// TODO     MDBBootstrapModule,
    FormsModule,
    FontAwesomeModule,
    EmailRecipientsRouting,
    EformSharedTagsModule,
    MdbTooltipModule,
  ],
  providers: [emailRecipientsPersistProvider],
})
export class EmailRecipientsModule {}
