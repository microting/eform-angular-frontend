import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  EformPermissionsModel,
  EformsPermissionsModel,
  EformsPermissionsRequestModel,
  TemplateListModel,
  TemplateRequestModel
} from 'src/app/common/models';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';

@Component({
  selector: 'app-security-group-eforms-permissions',
  templateUrl: './security-group-eforms-permissions.component.html',
  styleUrls: ['./security-group-eforms-permissions.component.scss']
})
export class SecurityGroupEformsPermissionsComponent implements OnInit {
  @ViewChild(('eformBindModal'), {static: false}) eformBindModal;
  @ViewChild(('eformEditPermissionsModal'), {static: false}) eformEditPermissionsModal;
  @ViewChild(('eformDeleteFromGroupModal'), {static: false}) eformDeleteFromGroupModal;
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;
  templateListModel: TemplateListModel = new TemplateListModel();
  eformSecurityModel: EformsPermissionsModel = new EformsPermissionsModel();
  eformsSecurityRequestModel: EformsPermissionsRequestModel = new EformsPermissionsRequestModel();
  selectedGroupId: number;
  spinnerStatus = false;

  constructor(
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedGroupId = params['groupId'];
      if (this.selectedGroupId) {
        this.getAvailableEforms();
        this.getSecurityGroupEfroms();
      }
    });
  }

  getAvailableEforms() {
    this.spinnerStatus = true;
    this.securityGroupEformsService.getAvailableEformsForGroup(this.templateRequestModel, this.selectedGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.templateListModel = data.model;
        }
        this.spinnerStatus = false;
      });
  }

  getAvailableEformsWithNameFilter(label: string) {
    this.templateRequestModel.nameFilter = label;
    this.getAvailableEforms();
  }

  getSecurityGroupEfroms() {
    this.spinnerStatus = true;
    this.eformsSecurityRequestModel = this.selectedGroupId;
    this.securityGroupEformsService.getGroupEforms(this.selectedGroupId).subscribe((data) => {
      if (data && data.success) {
        this.eformSecurityModel = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  openEformBindModal() {
    this.eformBindModal.show(this.selectedGroupId);
  }

  openEformEditPermissionsModal(model: EformPermissionsModel) {
    this.eformEditPermissionsModal.show(model);
  }

  openEformDeleteFromGroupModal(model: EformPermissionsModel) {
    this.eformDeleteFromGroupModal.show(model, this.selectedGroupId);
  }
}
