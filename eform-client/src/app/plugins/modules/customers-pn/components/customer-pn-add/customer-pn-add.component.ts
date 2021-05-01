import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerPnFieldsEnum, CustomersPnFieldStatusEnum} from '../../enums';
import {FieldsPnUpdateModel, CustomerPnFullModel} from '../../models';
import {CustomersPnService} from '../../services';

@Component({
  selector: 'app-customer-pn-add',
  templateUrl: './customer-pn-add.component.html',
  styleUrls: ['./customer-pn-add.component.scss']
})
export class CustomerPnAddComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onCustomerCreated: EventEmitter<void> = new EventEmitter<void>();
  @Input() fieldsModel = new FieldsPnUpdateModel();
  get fieldsEnum() { return CustomerPnFieldsEnum; }
  newCustomerModel: CustomerPnFullModel = new CustomerPnFullModel();

  constructor(private customersService: CustomersPnService) { }

  ngOnInit() {
  }

  show() {
    this.newCustomerModel = new CustomerPnFullModel();
    this.frame.show();
  }
  showCopy(customerId: number) {
    this.newCustomerModel = new CustomerPnFullModel();
    this.getSingleCustomer(customerId);
    this.frame.show();
  }

  getSingleCustomer(customerId: number) {
    this.customersService.getSingleCustomer(customerId).subscribe(((data) => {
      if (data && data.success) {
        this.newCustomerModel = data.model;
      }

    }));
  }

  createCustomer() {
    this.newCustomerModel.relatedEntityId = null;
    this.customersService.createCustomer(this.newCustomerModel).subscribe(((data) => {
      if (data && data.success) {
        this.newCustomerModel = new CustomerPnFullModel();
        this.onCustomerCreated.emit();
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
