import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SecurityGroupModel } from 'src/app/common/models/security';

@Component({
  selector: 'app-security-group-remove',
  templateUrl: './security-group-remove.component.html',
  styleUrls: ['./security-group-remove.component.scss'],
})
export class SecurityGroupRemoveComponent implements OnInit {
  @Output()
  onSecurityGroupRemoved: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('frame', { static: true }) frame;

  selectedSecurityGroup: SecurityGroupModel = new SecurityGroupModel();
  constructor() {}

  ngOnInit() {}

  show(securityGroup: any) {
    this.selectedSecurityGroup = securityGroup;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  deleteSingle() {
    this.onSecurityGroupRemoved.emit(this.selectedSecurityGroup.id);
  }
}
