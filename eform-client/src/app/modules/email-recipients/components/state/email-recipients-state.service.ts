import { Injectable } from '@angular/core';
import { EmailRecipientsStore } from './email-recipients.store';
import { EmailRecipientsService } from 'src/app/common/services';
import {
  EmailRecipientModel,
  OperationDataResult,
  Paged,
} from 'src/app/common/models';
import { Observable } from 'rxjs';
import { EmailRecipientsQuery } from 'src/app/modules/email-recipients/components/state/email-recipients.query';

@Injectable({ providedIn: 'root' })
export class EmailRecipientsStateService {
  constructor(
    private store: EmailRecipientsStore,
    private service: EmailRecipientsService,
    private query: EmailRecipientsQuery
  ) {}

  getEmailRecipients(): Observable<
    OperationDataResult<Paged<EmailRecipientModel>>
  > {
    return this.service.getEmailRecipients(this.query.pageSetting);
  }

  updateOffset(offset: number) {
    this.store.update({ offset: offset });
  }

  get sort(): string {
    return this.query.pageSetting.sort;
  }

  get isSortDsc(): boolean {
    return this.query.pageSetting.isSortDsc;
  }

  get offset(): number {
    return this.query.pageSetting.offset;
  }

  pageSize(): number {
    return this.query.pageSetting.pageSize;
  }

  // updateSort(sort: string) {
  //   this.store.update({ sort: sort });
  // }
  //
  // updateIsSortDsc(isSortDsc: boolean) {
  //   this.store.update({ isSortDsc: isSortDsc });
  // }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
  }

  getOffset(): Observable<number> {
    return this.query.selectOffset$;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
  }

  addTagIds(id: number) {
    const tagIds = this.query.pageSetting.tagsIds;
    if (!tagIds.find((x) => x === id)) {
      this.store.update({ tagsIds: [...tagIds, id] });
    }
  }

  removeTagIds(id: number) {
    const tagIds = this.query.pageSetting.tagsIds;
    this.store.update({ tagsIds: tagIds.filter((x) => x !== id) });
  }

  // updateTagIds(ids: number[]) {
  //   this.store.update({ tagsIds: ids });
  // }

  getTagIds(): Observable<number[]> {
    return this.query.selectTagsIds$;
  }

  updateSorting(sort: string, isSortDsc: boolean) {
    this.store.update({ sort: sort, isSortDsc: isSortDsc });
  }

  getSorting(): { sort: string; isSortDsc: boolean } {
    return {
      sort: this.query.pageSetting.sort,
      isSortDsc: this.query.pageSetting.isSortDsc,
    };
  }
}
