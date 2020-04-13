import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EformSharedModule} from '../../common/modules/eform-shared/eform-shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {EmailRecipientsRouting} from './email-recipients.routing';
import {
  EmailRecipientDeleteComponent,
  EmailRecipientEditComponent,
  EmailRecipientsNewComponent,
  EmailRecipientsPageComponent,
  EmailRecipientsTagsComponent,
  EmailRecipientTagDeleteComponent,
  EmailRecipientTagEditComponent
} from './components';
import {SharedPnModule} from '../../plugins/modules/shared/shared-pn.module';
import { EmailRecipientTagNewComponent } from './components/tags/email-recipient-tag-new/email-recipient-tag-new.component';

@NgModule({
  declarations: [
    EmailRecipientsPageComponent, EmailRecipientsNewComponent, EmailRecipientEditComponent,
    EmailRecipientsTagsComponent, EmailRecipientDeleteComponent, EmailRecipientTagEditComponent, EmailRecipientTagDeleteComponent, EmailRecipientTagNewComponent],
  imports: [
    CommonModule,
    EformSharedModule,
    CommonModule,
    NgSelectModule,
    TranslateModule,
    MDBBootstrapModule,
    FormsModule,
    FontAwesomeModule,
    EmailRecipientsRouting,
    SharedPnModule
  ]
})
export class EmailRecipientsModule {
}
