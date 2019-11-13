import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {EformPermissionsModel} from 'src/app/common/models/security/group-permissions/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';

@Component({
  selector: 'app-security-group-eforms-edit',
  templateUrl: './security-group-eforms-edit.component.html',
  styleUrls: ['./security-group-eforms-edit.component.scss']
})
export class SecurityGroupEformsEditComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() onEformUpdated: EventEmitter<void> = new EventEmitter<void>();
  eformSecurityModel: EformPermissionsModel = new EformPermissionsModel();
  spinnerStatus = false;
  constructor(private securityGroupEformsService: SecurityGroupEformsPermissionsService) { }

  ngOnInit() {
  }

  show(model: EformPermissionsModel) {
    this.eformSecurityModel = model;
    this.frame.show();
  }

  updateEformGroupPermissions() {
    this.spinnerStatus = true;
    this.securityGroupEformsService.updateGroupEformPermissions(this.eformSecurityModel).subscribe((data) => {
      if (data && data.success) {
        this.onEformUpdated.emit();
      }
      this.spinnerStatus = false;
      this.frame.hide();
    });
  }

}
