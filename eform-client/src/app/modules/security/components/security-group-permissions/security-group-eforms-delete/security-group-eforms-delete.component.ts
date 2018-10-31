import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {EformPermissionsModel} from 'src/app/common/models/security/group-permissions/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';

@Component({
  selector: 'app-security-group-eforms-delete',
  templateUrl: './security-group-eforms-delete.component.html',
  styleUrls: ['./security-group-eforms-delete.component.scss']
})
export class SecurityGroupEformsDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onEformDeleted: EventEmitter<void> = new EventEmitter<void>();
  eformSecurityModel: EformPermissionsModel = new EformPermissionsModel();
  spinnerStatus = false;
  constructor(private securityGroupEformsService: SecurityGroupEformsPermissionsService) { }

  ngOnInit() {
  }

  show(model: EformPermissionsModel) {
    this.eformSecurityModel = model;
    this.frame.show();
  }

  deleteEformFromSecurityGroup() {
    this.spinnerStatus = true;
    this.securityGroupEformsService.deleteEformFromGroup(this.eformSecurityModel.templateId).subscribe((data) => {
      if (data && data.success) {
        this.onEformDeleted.emit();
      } this.spinnerStatus = false;
    });
  }

}
