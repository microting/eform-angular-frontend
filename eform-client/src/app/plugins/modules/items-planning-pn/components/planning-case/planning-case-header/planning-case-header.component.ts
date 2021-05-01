import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-installation-case-header',
  templateUrl: './planning-case-header.component.html',
  styleUrls: ['./planning-case-header.component.scss']
})
export class PlanningCaseHeaderComponent implements OnInit {
  // @Input() contractInspectionModel: ContractInspectionModel = new ContractInspectionModel();
  // @Input() customerModel: RentableItemCustomerModel = new RentableItemCustomerModel();
  @ViewChild('reportCropperModal', {static: false}) reportCropperModal;
  constructor() { }

  ngOnInit() {
  }
}
