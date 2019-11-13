import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SecurityGroupModel} from 'src/app/common/models/security';
import {SecurityGroupsService} from 'src/app/common/services';

@Component({
  selector: 'app-security-group-remove',
  templateUrl: './security-group-remove.component.html',
  styleUrls: ['./security-group-remove.component.scss']
})
export class SecurityGroupRemoveComponent implements OnInit {
  @Output() onSecurityGroupRemoved: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;

  selectedSecurityGroup: SecurityGroupModel = new SecurityGroupModel;

  spinnerStatus = false;
  constructor(private securityGroupService: SecurityGroupsService) { }

  ngOnInit() {
  }

  show(securityGroup: any) {
    this.selectedSecurityGroup = securityGroup;
    this.frame.show();
  }

  deleteSingle() {
    this.spinnerStatus = true;
    this.securityGroupService.deleteSecurityGroup(this.selectedSecurityGroup.id).subscribe(data => {
      if (data && data.success) {
        this.frame.hide();
        this.onSecurityGroupRemoved.emit();
      }
      this.spinnerStatus = false;
    });
  }

}
