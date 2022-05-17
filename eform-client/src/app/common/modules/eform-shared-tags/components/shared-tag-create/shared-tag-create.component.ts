import {
  Component,
  OnInit,
} from '@angular/core';
import { SharedTagCreateModel } from 'src/app/common/models';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-shared-tag-create',
  templateUrl: './shared-tag-create.component.html',
  styleUrls: ['./shared-tag-create.component.scss']
})
export class SharedTagCreateComponent implements OnInit {
  name = '';

  constructor( public dialogRef: MatDialogRef<SharedTagCreateComponent>,) {}

  ngOnInit() {}

  createItem() {
    this.dialogRef.close({ name: this.name } as SharedTagCreateModel);
    this.name = '';
  }

  cancelCreate() {
    this.dialogRef.close();
    this.name = '';
  }
}
