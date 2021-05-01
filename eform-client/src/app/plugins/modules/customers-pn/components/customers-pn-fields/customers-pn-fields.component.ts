import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {debounceTime, switchMap} from 'rxjs/operators';
import {AdvEntitySearchableGroupListModel, AdvEntitySearchableGroupListRequestModel} from 'src/app/common/models/advanced';
import {EntitySearchService} from 'src/app/common/services/advanced';
import {CustomersPnFieldStatusEnum} from '../../enums';
import {CustomersPnSettingsModel, FieldPnUpdateModel, FieldsPnUpdateModel} from '../../models';
import {CustomersPnFieldsService, CustomersPnSettingsService} from '../../services';

@Component({
  selector: 'app-customers-pn-fields',
  templateUrl: './customers-pn-fields.component.html',
  styleUrls: ['./customers-pn-fields.component.scss']
})
export class CustomersPnFieldsComponent implements OnInit {
  isChecked = false;
  fieldsUpdateModel: FieldsPnUpdateModel = new FieldsPnUpdateModel();
  customersPnSettingsModel: CustomersPnSettingsModel = new CustomersPnSettingsModel();
  advEntitySearchableGroupListModel: AdvEntitySearchableGroupListModel = new AdvEntitySearchableGroupListModel();
  advEntitySearchableGroupListRequestModel: AdvEntitySearchableGroupListRequestModel
    = new AdvEntitySearchableGroupListRequestModel();
  typeahead = new EventEmitter<string>();
  get fieldStatusEnum() { return CustomersPnFieldStatusEnum; }

  constructor(
    private customersFieldsService: CustomersPnFieldsService,
    private entitySearchService: EntitySearchService,
    private cd: ChangeDetectorRef,
    private customersSettingsService: CustomersPnSettingsService,
    private router: Router) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.advEntitySearchableGroupListRequestModel.nameFilter = term;
          return this.entitySearchService.getEntitySearchableGroupList(this.advEntitySearchableGroupListRequestModel);
        })
      )
      .subscribe(items => {
        this.advEntitySearchableGroupListModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    this.advEntitySearchableGroupListRequestModel.pageSize = 15;
    this.getAllFields();
    this.getSettings();
  }

  getAllFields() {
    this.customersFieldsService.getAllFields().subscribe((data) => {
      if (data && data.success) {
        this.fieldsUpdateModel = data.model;
      }
    });
  }

  getSettings() {
    this.customersSettingsService.getAllSettings().subscribe((data => {
      if (data && data.success) {
        this.customersPnSettingsModel = data.model;
      }
    }));
  }

  updateSettings() {
    // debugger;
    this.customersSettingsService.updateSettings(this.customersPnSettingsModel).subscribe((data) => {
      if (data && data.success) {
        this.customersFieldsService.updateFields(this.fieldsUpdateModel).subscribe((innerData) => {
          if (innerData && innerData.success) {
            this.router.navigate(['/plugins-settings']).then();
          }
        });
      }
    });
  }

  checkBoxChanged(e: any, field: FieldPnUpdateModel) {
    if (e.target && e.target.checked) {
      this.fieldsUpdateModel.fields.find(x => x.id === field.id).fieldStatus = CustomersPnFieldStatusEnum.Enabled;
    } else if (e.target && !e.target.checked) {
      this.fieldsUpdateModel.fields.find(x => x.id === field.id).fieldStatus = CustomersPnFieldStatusEnum.Disabled;
    }
  }

  onSelectedChanged(e: any) {
    this.customersPnSettingsModel.relatedEntityId = e.microtingUUID;
  }
}
