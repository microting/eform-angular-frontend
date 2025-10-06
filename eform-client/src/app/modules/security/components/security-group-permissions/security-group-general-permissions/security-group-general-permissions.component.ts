import * as R from 'ramda';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SecurityGroupGeneralPermissionsModel,
  SecurityGroupGeneralPermissionsUpdateModel,
} from 'src/app/common/models/security/group-permissions/general';
import { SecurityGroupGeneralPermissionsService } from 'src/app/common/services/security';

@Component({
    selector: 'app-security-group-general-permissions',
    templateUrl: './security-group-general-permissions.component.html',
    styleUrls: ['./security-group-general-permissions.component.scss'],
    standalone: false
})
export class SecurityGroupGeneralPermissionsComponent implements OnInit {
  private securityGroupGeneralPermissionsService = inject(SecurityGroupGeneralPermissionsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedGroupId: number;
  securityGroupGeneralPermissionsModel: SecurityGroupGeneralPermissionsModel = new SecurityGroupGeneralPermissionsModel();
  securityGroupGeneralPermissionsUpdateModel: SecurityGroupGeneralPermissionsUpdateModel = new SecurityGroupGeneralPermissionsUpdateModel();

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.selectedGroupId = params['groupId'];
      if (this.selectedGroupId) {
        this.getSecurityGroupGeneralPermissions();
      }
    });
  }

  getSecurityGroupGeneralPermissions() {
    this.securityGroupGeneralPermissionsService
      .getGeneralPermissions(this.selectedGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.securityGroupGeneralPermissionsModel = data.model;
          this.securityGroupGeneralPermissionsModel.permissionTypes.sort(
            function (a, b) {
              return b.permissions.length - a.permissions.length;
            }
          );
        }
      });
  }

  updateSecurityGroupGeneralPermissions() {
    this.securityGroupGeneralPermissionsUpdateModel.groupId = this.selectedGroupId;
    this.securityGroupGeneralPermissionsUpdateModel.permissions = R.flatten(
      this.securityGroupGeneralPermissionsModel.permissionTypes.map(
        (x) => x.permissions
      )
    );
    this.securityGroupGeneralPermissionsService
      .updateGeneralPermissions(this.securityGroupGeneralPermissionsUpdateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigate(['/security']).then();
        }
      });
  }
}
