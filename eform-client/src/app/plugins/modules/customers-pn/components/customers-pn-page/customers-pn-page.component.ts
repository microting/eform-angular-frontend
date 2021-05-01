import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PageSettingsModel, UserInfoModel} from 'src/app/common/models';
import {AuthService, LocaleService} from 'src/app/common/services/auth';
import {SharedPnService} from 'src/app/plugins/modules/shared/services';
import {CustomersPnFieldStatusEnum, CustomerPnFieldsEnum, CustomersPnClaims} from '../../enums';
import {CustomerPnModel, CustomersPnModel, CustomersPnRequestModel, FieldsPnUpdateModel, CustomerPnFullModel} from '../../models';
import {CustomersPnFieldsService, CustomersPnService} from '../../services';
import {PluginClaimsHelper} from '../../../../../common/helpers';

declare var require: any;

@Component({
  selector: 'app-customers-pn-page',
  templateUrl: './customers-pn-page.component.html',
  styleUrls: ['./customers-pn-page.component.scss']
})
export class CustomersPnPageComponent implements OnInit {
  @ViewChild('createCustomerModal', {static: false}) createCustomerModal;
  @ViewChild('editCustomerModal', {static: false}) editCustomerModal;
  @ViewChild('deleteCustomerModal', {static: false}) deleteCustomerModal;
  @Output() onCustomerDuplicated: EventEmitter<void> = new EventEmitter<void>();
  get fieldStatusEnum() { return CustomersPnFieldStatusEnum; }
  get fieldStatusEnumString() { return CustomersPnFieldStatusEnum; }
  get fieldsEnum() { return CustomerPnFieldsEnum; }

  customersRequestModel: CustomersPnRequestModel = new CustomersPnRequestModel();
  customersModel: CustomersPnModel = new CustomersPnModel();
  fieldsModel: FieldsPnUpdateModel = new FieldsPnUpdateModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  customerModel: CustomerPnFullModel = new CustomerPnFullModel();

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get customersPnClaims() {
    return CustomersPnClaims;
  }

  constructor(private customersService: CustomersPnService,
              private customersFieldsService: CustomersPnFieldsService,
              private translateService: TranslateService,
              private localeService: LocaleService,
              private authService: AuthService,
              private sharedPnService: SharedPnService) {

  }

  get currentRole(): string {
    return this.authService.currentRole;
  }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    // debugger;
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('customersPnSettings').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('customersPnSettings', this.localPageSettings);
    this.getAllCustomers();
  }

  getAllInitialData() {
    this.customersFieldsService.getAllFields().subscribe((data) => {
      if (data && data.success) {
        this.fieldsModel = data.model;
        this.getAllCustomers();
      }
    });
  }

  getAllCustomers() {
    this.customersRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.customersRequestModel.sortColumnName = this.localPageSettings.sort;
    this.customersRequestModel.pageSize = this.localPageSettings.pageSize;
    this.customersService.getAllCustomers(this.customersRequestModel).subscribe((result => {
      if (result && result.success) {
        this.customersModel = result.model;
      }

    }));
  }
  duplicateCustomer(customerId: number) {
    this.customersService.getSingleCustomer(customerId).subscribe(((data) => {
      if (data && data.success) {
        // debugger;
        this.customerModel = data.model;
        this.customerModel.relatedEntityId = null;
        this.customerModel.companyName += '_copy';
        this.customersService.createCustomer(this.customerModel).subscribe(((result) => {
          if (result && result.success) {
            this.customerModel = new CustomerPnFullModel();
            this.onCustomerDuplicated.emit();
          }
        }));
      }
    }));

  }
  changePage(e: any) {
    if (e || e === 0) {
      this.customersRequestModel.offset = e;
      if (e === 0) {
        this.customersRequestModel.pageIndex = 0;
      } else {
        this.customersRequestModel.pageIndex = Math.floor(e / this.customersRequestModel.pageSize);
      }
      this.getAllCustomers();
    }
  }

  sortTable(sort: string, sortByDesc: boolean) {
    this.localPageSettings.isSortDsc = sortByDesc;
    this.localPageSettings.sort = sort;
    this.updateLocalPageSettings();
  }

  showCreateCustomerModal() {
    this.createCustomerModal.show();
  }

  showCopyCustomerModal(model: CustomerPnModel) {
    this.createCustomerModal.showCopy(model.id);
  }

  showEditCustomerModal(model: CustomerPnModel) {
    this.editCustomerModal.show(model.id);
  }

  showDeleteCustomerModal(model: CustomerPnModel) {
    this.deleteCustomerModal.show(model);
  }

  onSearchInputChanged(value: any) {
    this.customersRequestModel.name = value;
    this.getAllCustomers();
  }
}
