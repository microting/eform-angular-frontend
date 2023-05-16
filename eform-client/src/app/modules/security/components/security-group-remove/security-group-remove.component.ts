import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import { SecurityGroupModel } from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-security-group-remove',
  templateUrl: './security-group-remove.component.html',
  styleUrls: ['./security-group-remove.component.scss'],
})
export class SecurityGroupRemoveComponent implements OnInit {
  onSecurityGroupRemoved: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public dialogRef: MatDialogRef<SecurityGroupRemoveComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedSecurityGroup: SecurityGroupModel = new SecurityGroupModel()
  ) {}

  ngOnInit() {}

  hide() {
    this.dialogRef.close();
  }

  deleteSingle() {
    this.onSecurityGroupRemoved.emit(this.selectedSecurityGroup.id);
  }
}
