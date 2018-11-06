import {Component, OnInit, ViewChild} from '@angular/core';
import {SecurityGroupsRequestModel, SecurityGroupsModel} from 'src/app/common/models';
import {SecurityGroupsService} from 'src/app/common/services';

@Component({
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrls: ['./security-page.component.scss']
})
export class SecurityPageComponent implements OnInit {
  @ViewChild('modalGroupDelete') modalGroupDelete;
  securityGroups: SecurityGroupsModel = new SecurityGroupsModel();
  securityGroupsRequestModel: SecurityGroupsRequestModel = new SecurityGroupsRequestModel();
  spinnerStatus = false;

  constructor(private securityGroupsService: SecurityGroupsService) {
  }

  ngOnInit() {
    this.getSecurityGroups();
  }

  getSecurityGroups() {
    this.spinnerStatus = true;
    this.securityGroupsService.getAllSecurityGroups(this.securityGroupsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.securityGroups = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  openDeleteModal(securityGroup: any) {
    this.modalGroupDelete.show(securityGroup);
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.securityGroupsRequestModel.offset = e;
      if (e === 0) {
        this.securityGroupsRequestModel.pageIndex = 0;
      } else {
        this.securityGroupsRequestModel.pageIndex
          = Math.floor(e / this.securityGroupsRequestModel.pageSize);
      }
      this.getSecurityGroups();
    }
  }

  onLabelInputChanged(label: string) {
    this.securityGroupsRequestModel.nameFilter = label;
    this.getSecurityGroups();
  }

}
