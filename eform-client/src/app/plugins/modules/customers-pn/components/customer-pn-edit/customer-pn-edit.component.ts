import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerPnFieldsEnum, CustomersPnFieldStatusEnum} from '../../enums';
import {FieldsPnUpdateModel, CustomerPnFullModel} from '../../models';
import {CustomersPnService} from '../../services';

@Component({
  selector: 'app-customer-pn-edit',
  templateUrl: './customer-pn-edit.component.html',
  styleUrls: ['./customer-pn-edit.component.scss']
})
export class CustomerPnEditComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Input() fieldsModel = new FieldsPnUpdateModel();
  @Output() onCustomerUpdated: EventEmitter<void> = new EventEmitter<void>();

  get fieldsEnum() { return CustomerPnFieldsEnum; }

  selectedCustomerModel = new CustomerPnFullModel();

  constructor(private customersService: CustomersPnService) {
  }

  ngOnInit() {
  }

  show(customerId: number) {
    this.selectedCustomerModel = new CustomerPnFullModel();
    this.getSingleCustomer(customerId);
    this.frame.show();
  }

  getSingleCustomer(customerId: number) {
    this.customersService.getSingleCustomer(customerId).subscribe(((data) => {
      if (data && data.success) {
        this.selectedCustomerModel = data.model;
      }

    }));
  }

  updateCustomer() {
    this.customersService.updateCustomer(this.selectedCustomerModel).subscribe(((data) => {
      if (data && data.success) {
        this.selectedCustomerModel = new CustomerPnFullModel();
        this.onCustomerUpdated.emit();
        this.frame.hide();
      }

    }));
  }

  isFieldAvailable(field: number) {
    const foundField = this.fieldsModel.fields.find(x => x.name == CustomerPnFieldsEnum[field]);
    if (foundField) {
      return foundField.fieldStatus === CustomersPnFieldStatusEnum.Enabled;
    } else {
      return false;
    }
  }


}
