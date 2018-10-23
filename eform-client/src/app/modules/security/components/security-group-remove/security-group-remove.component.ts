import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-security-group-remove',
  templateUrl: './security-group-remove.component.html',
  styleUrls: ['./security-group-remove.component.scss']
})
export class SecurityGroupRemoveComponent implements OnInit {
  @Output() onSecurityGroupRemoved: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame') frame;

  selectedSecurityGroup = {
    id: 1,
    name: 'MyGroup',
    usersAmount: 50
  };

  spinnerStatus = false;
  constructor() { }

  ngOnInit() {
  }

  show(securityGroup: any) {
    this.selectedSecurityGroup = securityGroup;
    this.frame.show();
  }

  deleteSingle() {

  }

}
