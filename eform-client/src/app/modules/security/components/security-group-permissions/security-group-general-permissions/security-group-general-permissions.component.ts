import {flatten} from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  SecurityGroupGeneralPermissionsModel,
  SecurityGroupGeneralPermissionsUpdateModel
} from 'src/app/common/models/security/group-permissions/general';
import {SecurityGroupGeneralPermissionsService} from 'src/app/common/services/security';

@Component({
  selector: 'app-security-group-general-permissions',
  templateUrl: './security-group-general-permissions.component.html',
  styleUrls: ['./security-group-general-permissions.component.scss']
})
export class SecurityGroupGeneralPermissionsComponent implements OnInit {
  selectedGroupId: number;
  securityGroupGeneralPermissionsModel: SecurityGroupGeneralPermissionsModel = new SecurityGroupGeneralPermissionsModel();
  securityGroupGeneralPermissionsUpdateModel: SecurityGroupGeneralPermissionsUpdateModel = new SecurityGroupGeneralPermissionsUpdateModel();
  spinnerStatus = false;
  constructor(
    private securityGroupGeneralPermissionsService: SecurityGroupGeneralPermissionsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedGroupId = params['groupId'];
      if (this.selectedGroupId) {
        this.getSecurityGroupGeneralPermissions();
      }
    });
  }

  getSecurityGroupGeneralPermissions() {
    this.spinnerStatus = true;
    this.securityGroupGeneralPermissionsService.getGeneralPermissions(this.selectedGroupId).subscribe((data) => {
      if (data && data.success) {
        this.securityGroupGeneralPermissionsModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  updateSecurityGroupGeneralPermissions() {
    debugger;
    this.spinnerStatus = true;
    this.securityGroupGeneralPermissionsUpdateModel.groupId = this.selectedGroupId;
    this.securityGroupGeneralPermissionsUpdateModel.permissions = flatten(this.securityGroupGeneralPermissionsModel.permissionTypes
      .map(x => x.permissions));
    this.securityGroupGeneralPermissionsService.updateGeneralPermissions(this.securityGroupGeneralPermissionsUpdateModel).subscribe((data) => {
       this.spinnerStatus = false;
    });
  }

}
