import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SharedTagModel } from 'src/app/common/models';

@AutoUnsubscribe()
@Component({
  selector: 'app-shared-tag-edit',
  templateUrl: './shared-tag-edit.component.html',
  styleUrls: ['./shared-tag-edit.component.scss'],
})
export class SharedTagEditComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Output() tagUpdate: EventEmitter<SharedTagModel> = new EventEmitter<
    SharedTagModel
  >();
  @Output() tagUpdateCancelled: EventEmitter<void> = new EventEmitter<void>();
  tagModel: SharedTagModel = new SharedTagModel();

  constructor() {}

  ngOnInit() {}

  show(model: SharedTagModel) {
    this.tagModel = model;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  updateItem() {
    this.tagUpdate.emit(this.tagModel);
  }

  ngOnDestroy(): void {}

  cancelEdit() {
    this.frame.hide();
    this.tagUpdateCancelled.emit();
  }
}
