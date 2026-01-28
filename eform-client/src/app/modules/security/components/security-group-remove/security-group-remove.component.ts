import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import { SecurityGroupModel } from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-security-group-remove',
    templateUrl: './security-group-remove.component.html',
    styleUrls: ['./security-group-remove.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslatePipe]
})
export class SecurityGroupRemoveComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SecurityGroupRemoveComponent>>(MatDialogRef);
  selectedSecurityGroup = inject<SecurityGroupModel>(MAT_DIALOG_DATA) ?? new SecurityGroupModel();

  onSecurityGroupRemoved: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {}

  hide() {
    this.dialogRef.close();
  }

  deleteSingle() {
    this.onSecurityGroupRemoved.emit(this.selectedSecurityGroup.id);
  }
}
