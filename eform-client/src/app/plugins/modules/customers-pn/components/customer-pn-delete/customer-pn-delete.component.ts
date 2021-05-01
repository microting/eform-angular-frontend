import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerPnFieldsEnum} from 'src/app/plugins/modules/customers-pn/enums';
import {CustomerPnModel} from 'src/app/plugins/modules/customers-pn/models/customer';
import {FieldsPnUpdateModel} from 'src/app/plugins/modules/customers-pn/models/field';
import {CustomersPnService} from '../../services';

@Component({
  selector: 'app-customer-pn-delete',
  templateUrl: './customer-pn-delete.component.html',
  styleUrls: ['./customer-pn-delete.component.scss']
})
export class CustomerPnDeleteComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onCustomerDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedCustomer: CustomerPnModel = new CustomerPnModel();
  @Input() fields: FieldsPnUpdateModel = new FieldsPnUpdateModel();
  get fieldsEnum() { return CustomerPnFieldsEnum; }


  constructor(private customersService: CustomersPnService) { }

  ngOnInit() {
  }

  show(customer: CustomerPnModel) {
    this.selectedCustomer = customer;
    this.frame.show();
  }

  deleteCustomer() {
    this.customersService.deleteCustomer(this.selectedCustomer.id).subscribe(((data) => {
      if (data && data.success) {
        this.onCustomerDeleted.emit();
        this.frame.hide();
      }
    }));
  }

}
