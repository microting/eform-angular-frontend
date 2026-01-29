import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { SharedTagCreateModel } from 'src/app/common/models';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-shared-tag-create',
    templateUrl: './shared-tag-create.component.html',
    styleUrls: ['./shared-tag-create.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatInput, ReactiveFormsModule, FormsModule, MatLabel, MatDialogActions, TranslatePipe]
})
export class SharedTagCreateComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SharedTagCreateComponent>>(MatDialogRef);

  public createdTag: EventEmitter<SharedTagCreateModel> = new EventEmitter<SharedTagCreateModel>();
  name = '';

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
