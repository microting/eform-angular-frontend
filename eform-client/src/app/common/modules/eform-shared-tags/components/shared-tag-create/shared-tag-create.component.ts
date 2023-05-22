import {
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { SharedTagCreateModel } from 'src/app/common/models';
import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-shared-tag-create',
  templateUrl: './shared-tag-create.component.html',
  styleUrls: ['./shared-tag-create.component.scss']
})
export class SharedTagCreateComponent implements OnInit {
  public createdTag: EventEmitter<SharedTagCreateModel> = new EventEmitter<SharedTagCreateModel>();
  name = '';

  constructor( public dialogRef: MatDialogRef<SharedTagCreateComponent>,) {}

  ngOnInit() {}

  createItem() {
    this.createdTag.emit({ name: this.name } as SharedTagCreateModel);
    this.name = '';
  }

  cancelCreate() {
    this.dialogRef.close();
    this.name = '';
  }
}
