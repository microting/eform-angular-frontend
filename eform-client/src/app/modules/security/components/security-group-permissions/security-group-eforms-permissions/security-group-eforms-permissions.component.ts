import {Component, OnInit, ViewChild} from '@angular/core';
import {TemplateListModel, TemplateRequestModel} from 'src/app/common/models';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';

@Component({
  selector: 'app-security-group-eforms-permissions',
  templateUrl: './security-group-eforms-permissions.component.html',
  styleUrls: ['./security-group-eforms-permissions.component.scss']
})
export class SecurityGroupEformsPermissionsComponent implements OnInit {
  @ViewChild('eformBindModal') eformBindModal;
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;
  templateListModel: TemplateListModel = new TemplateListModel();

  constructor(private securityGroupEformsService: SecurityGroupEformsPermissionsService) { }

  ngOnInit() {
  }

  getAvailableEforms() {

  }

  openEformBindModal() {
    this.eformBindModal.show();
  }

}
