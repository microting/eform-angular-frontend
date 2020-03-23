import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../common/models/common';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientTagDeleteComponent, EmailRecipientTagEditComponent, EmailRecipientTagNewComponent} from '../..';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipients-tags',
  templateUrl: './email-recipients-tags.component.html',
  styleUrls: ['./email-recipients-tags.component.scss']
})
export class EmailRecipientsTagsComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @ViewChild('tagCreateModal') tagCreateModal: EmailRecipientTagNewComponent;
  @ViewChild('tagEditModal') tagEditModal: EmailRecipientTagEditComponent;
  @ViewChild('tagDeleteModal') tagDeleteModal: EmailRecipientTagDeleteComponent;
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() tagsChanged: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;


  constructor() {
  }

  show() {
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  createNewTag() {
    this.frame.hide();
    this.tagCreateModal.show();
  }

  openEditTagNameModal(tag: CommonDictionaryModel) {
    this.frame.hide();
    this.tagEditModal.show(tag);
  }

  deleteTagModal(tag: CommonDictionaryModel) {
    this.frame.hide();
    this.tagDeleteModal.show(tag);
  }

  onChildrenModalHide() {
    this.frame.show();
  }

  onTagUpdated() {
    this.frame.show();
    this.tagsChanged.emit();
  }

  onTagCreated() {
    this.frame.show();
    this.tagsChanged.emit();
  }

  onTagDeleted() {
    this.frame.show();
    this.tagsChanged.emit();
  }
}
