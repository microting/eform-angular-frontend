import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TemplateListModel} from 'src/app/common/models/eforms';
import {EformBindGroupModel} from 'src/app/common/models/security/group-permissions/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';

@Component({
  selector: 'app-security-group-eforms-add',
  templateUrl: './security-group-eforms-add.component.html',
  styleUrls: ['./security-group-eforms-add.component.scss']
})
export class SecurityGroupEformsAddComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Input() templateListModel: TemplateListModel = new TemplateListModel();
  @Output() onEformBound: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSearchInputChanged: EventEmitter<string> = new EventEmitter<string>();
  eformBindGroupModel: EformBindGroupModel = new EformBindGroupModel();
  spinnerStatus = false;
  constructor(private securityGroupEformsService: SecurityGroupEformsPermissionsService) { }

  ngOnInit() {
  }

  show(groupId: number) {
    this.eformBindGroupModel.groupId = groupId;
    this.frame.show();
  }

  addEformToGroup(eformId: number) {
    this.eformBindGroupModel.eformId = eformId;
    this.spinnerStatus = true;
    this.securityGroupEformsService.addEformToGroup(this.eformBindGroupModel).subscribe((data) => {
      if (data && data.success) {
        this.onEformBound.emit();
      }
      this.spinnerStatus = false;
    });
  }

  onLabelInputChanged(label: string) {
    this.onSearchInputChanged.emit(label);
  }

}
