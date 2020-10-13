import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  SecurityGroupModel,
  SecurityGroupSettingsUpdateModel,
} from 'src/app/common/models';

@Component({
  selector: 'app-security-group-settings',
  templateUrl: './security-group-settings.component.html',
  styleUrls: ['./security-group-settings.component.scss'],
})
export class SecurityGroupSettingsComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() settingsUpdate: EventEmitter<
    SecurityGroupSettingsUpdateModel
  > = new EventEmitter<SecurityGroupSettingsUpdateModel>();
  settingsUpdateModel: SecurityGroupSettingsUpdateModel = new SecurityGroupSettingsUpdateModel();

  constructor() {}

  show(securityGroup: SecurityGroupModel) {
    this.settingsUpdateModel = {
      id: securityGroup.id,
      redirectLink: securityGroup.redirectLink,
    };
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  ngOnInit(): void {}

  updateGroupSettings() {
    this.settingsUpdate.emit(this.settingsUpdateModel);
  }
}
