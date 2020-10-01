import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedTagModel } from 'src/app/common/models';

@Component({
  selector: 'app-shared-tag-delete',
  templateUrl: './shared-tag-delete.component.html',
  styleUrls: ['./shared-tag-delete.component.scss']
})
export class SharedTagDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() tagDelete: EventEmitter<SharedTagModel> = new EventEmitter<
    SharedTagModel
  >();
  @Output() tagDeleteCancelled: EventEmitter<void> = new EventEmitter<void>();
  tagModel: SharedTagModel = new SharedTagModel();

  constructor() {}

  show(model: SharedTagModel) {
    this.tagModel = model;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  ngOnInit() {}

  deleteTag() {
    this.tagDelete.emit(this.tagModel);
  }

  cancelDelete() {
    this.frame.hide();
    this.tagDeleteCancelled.emit();
  }
}
