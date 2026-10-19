import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientsStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {
  CommonDictionaryModel,
  Paged,
  EmailRecipientModel,
  PaginationModel,
} from 'src/app/common/models';
import {
  EmailRecipientDeleteComponent,
  EmailRecipientEditComponent,
  EmailRecipientsNewComponent,
  EmailRecipientsTagsComponent,
} from '../';
import {
  EmailRecipientsService,
  EmailRecipientsTagsService,
} from 'src/app/common/services';
import { MtxGridColumn, MtxGrid } from '@ng-matero/extensions/grid';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {
  selectEmailRecipientsIsSortDsc,
  selectEmailRecipientsPagination, selectEmailRecipientsSort,
  selectEmailRecipientsTagIds
} from "src/app/state/email-recipients/email-recipiencts.selector";
import { EformNewSubheaderComponent } from '../../../../common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { EformTagComponent } from '../../../../common/modules/eform-shared/components/eform-tag/eform-tag.component';
import { EformPaginationComponent } from '../../../../common/modules/eform-shared/components/eform-pagination/eform-pagination.component';
import { EmailRecipientsTagsComponent as EmailRecipientsTagsComponent_1 } from '../tags/email-recipients-tags.component';
import { AsyncPipe } from '@angular/common';

@AutoUnsubscribe()
@Component({
    selector: 'app-email-recipients-page',
    templateUrl: './email-recipients-page.component.html',
    styleUrls: ['./email-recipients-page.component.scss'],
    imports: [EformNewSubheaderComponent, MatTooltip, MatIcon, MatFormField, MatLabel, MtxSelect, ReactiveFormsModule, FormsModule, MtxGrid, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem, EformTagComponent, EformPaginationComponent, EmailRecipientsTagsComponent_1, AsyncPipe, TranslatePipe]
})
export class EmailRecipientsPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private emailRecipientsService = inject(EmailRecipientsService);
  private tagsService = inject(EmailRecipientsTagsService);
  emailRecipientsStateService = inject(EmailRecipientsStateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private translateService = inject(TranslateService);

  @ViewChild('recipientsTagsModal')
  recipientTagsModal: EmailRecipientsTagsComponent;
  emailRecipientsListModel: Paged<EmailRecipientModel> = new Paged<EmailRecipientModel>();
  availableTags: CommonDictionaryModel[] = [];

  getAllSub$: Subscription;
  getTagsSub$: Subscription;
  emailRecipientDeleteComponentAfterClosedSub$: Subscription;
  emailRecipientEditComponentAfterClosedSub$: Subscription;
  emailRecipientsNewComponentAfterClosedSub$: Subscription;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Name'), sortProp: {id: 'Name'}, field: 'name', sortable: true},
    {
      header: this.translateService.stream('Email'),
      field: 'email',
      sortable: true,
      sortProp: {id: 'Email'}
    },
    {header: this.translateService.stream('Tags'), field: 'tags'},
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  public selectEmailRecipientsNameFilter$ = this.store.select(selectEmailRecipientsPagination);
  public selectEmailRecipientsSort$ = this.store.select(selectEmailRecipientsSort);
  public selectEmailRecipientsIsSortDsc$ = this.store.select(selectEmailRecipientsIsSortDsc);
  public selectEmailRecipientsPagination$ = this.store.select(selectEmailRecipientsPagination);
  public selectEmailRecipientsTagIds$ = this.store.select(selectEmailRecipientsTagIds);

  ngOnInit(): void {
    this.getEmailRecipients();
    this.getTags();
  }

  getEmailRecipients() {
    this.getAllSub$ = this.emailRecipientsStateService
      .getEmailRecipients()
      .subscribe((data) => {
        if (data && data.success) {
          this.emailRecipientsListModel = data.model;
        }
      });
  }

  getTags() {
    this.getTagsSub$ = this.tagsService
      .getEmailRecipientsTags()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableTags = data.model;
        }
      });
  }

  onSortTable(sort: Sort) {
    this.emailRecipientsStateService.onSortTable(sort.active);
    this.getEmailRecipients();
  }

  openCreateModal() {
    this.emailRecipientsNewComponentAfterClosedSub$ = this.dialog.open(EmailRecipientsNewComponent,
      {...dialogConfigHelper(this.overlay, this.availableTags), minWidth: 600})
      .afterClosed().subscribe(data => data ? this.onEmailRecipientCreated() : undefined);
  }

  openEditModal(model: EmailRecipientModel) {
    this.emailRecipientEditComponentAfterClosedSub$ = this.dialog.open(EmailRecipientEditComponent,
      dialogConfigHelper(this.overlay, {emailRecipientUpdateModel: model, availableTags: this.availableTags}))
      .afterClosed().subscribe(data => data ? this.getEmailRecipients() : undefined);
  }

  openDeleteModal(model: EmailRecipientModel) {
    this.emailRecipientDeleteComponentAfterClosedSub$ = this.dialog.open(EmailRecipientDeleteComponent,
      dialogConfigHelper(this.overlay, model))
      .afterClosed().subscribe(data => data ? this.onEmailRecipientDeleted() : undefined);
  }

  openTagsModal() {
    this.recipientTagsModal.show();
  }

  removeSavedTag(e: any) {
    this.emailRecipientsStateService.addOrRemoveTagIds(e.id);
    this.getEmailRecipients();
  }

  tagSelected(id: number) {
    this.emailRecipientsStateService.addOrRemoveTagIds(id);
    this.getEmailRecipients();
  }

  onEmailRecipientCreated() {
    this.getEmailRecipients();
    this.getTags();
  }

  onEmailRecipientDeleted() {
    this.emailRecipientsStateService.onDelete();
    this.getEmailRecipients();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.emailRecipientsStateService.updatePagination(paginationModel);
    this.getEmailRecipients();
  }

  ngOnDestroy(): void {
  }
}
