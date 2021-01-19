import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedTagCreateModel } from 'src/app/common/models';

@Component({
  selector: 'app-shared-tag-create',
  templateUrl: './shared-tag-create.component.html',
  styleUrls: ['./shared-tag-create.component.scss']
})
export class SharedTagCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() tagCreate: EventEmitter<SharedTagCreateModel> = new EventEmitter<
    SharedTagCreateModel
  >();
  @Output() tagCreateCancelled: EventEmitter<void> = new EventEmitter<void>();
  name = '';

  constructor() {}

  ngOnInit() {}

  show() {
    this.frame.show();
  }

  hide() {
    this.frame.hide();
    this.name = '';
  }

  createItem() {
    this.tagCreate.emit({ name: this.name } as SharedTagCreateModel);
    this.name = '';
  }

  cancelCreate() {
    this.frame.hide();
    this.tagCreateCancelled.emit();
    this.name = '';
  }
}
