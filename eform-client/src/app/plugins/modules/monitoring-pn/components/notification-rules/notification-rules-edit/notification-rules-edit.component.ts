import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EFormService} from '../../../../../../common/services/eform';
import {MonitoringPnNotificationRulesService} from '../../../services';
import {NotificationRuleModel} from '../../../models';
import {debounceTime, switchMap} from 'rxjs/operators';
import {FieldDto} from '../../../../../../common/models/dto/field.dto';
import {TemplateListModel, TemplateRequestModel} from '../../../../../../common/models/eforms';
import {KeyValuePairDto, SiteDto, TemplateDto} from '../../../../../../common/models/dto';
import {NotificationRuleType, SupportedFieldTypes} from '../../../const';
import {BaseDataItem, CheckBoxBlock, NumberBlock, SelectBlock} from '../../../models/blocks';
import {EntitySearchService, EntitySelectService} from '../../../../../../common/services/advanced';
import {CommonDictionaryTextModel} from '../../../../../../common/models/common';
import {DeviceUserModel} from '../../../models/device-user.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-monitoring-pn-notification-rules-edit',
  templateUrl: './notification-rules-edit.component.html',
  styleUrls: ['./notification-rules-edit.component.scss']
})
export class NotificationRulesEditComponent implements OnInit {
  @Input() deviceUsers: SiteDto[];
  @ViewChild('frame', {static: false}) frame;
  @Output() ruleSaved: EventEmitter<void> = new EventEmitter<void>();
  selectedDeviceUserId: number;
  items: Array<TemplateDto> = [];
  selectedRuleId: number;

  templateTypeahead = new EventEmitter<string>();
  recipientEmail: string;

  // Models
  ruleModel: NotificationRuleModel = new NotificationRuleModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templates: TemplateDto[] = [];
  selectedTemplate: TemplateDto = new TemplateDto();
  fields: FieldDto[] = [];
  selectedField: FieldDto = new FieldDto();

  get ruleType() {
    return NotificationRuleType;
  }

  constructor(private activateRoute: ActivatedRoute,
    private monitoringRulesService: MonitoringPnNotificationRulesService,
    private entitySelectService: EntitySelectService,
    private entitySearchService: EntitySearchService,
    private eFormService: EFormService,
    private location: Location,
    private cd: ChangeDetectorRef
  ) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.selectedRuleId = +params['id'];
    });
    this.templateTypeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe(items => {
        this.templates = items.model.templates;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    this.eFormService.getAll(this.templateRequestModel).subscribe(operation => {
      if (operation && operation.success) {
        this.items = operation.model.templates;
        if (this.selectedRuleId) {
          this.getSelectedRule(this.selectedRuleId);
        }
      }
    });
  }

  // onClose() {
  //   this.ruleModel = new NotificationRuleModel();
  //   this.frame.hide();
  // }

  goBack() {
    // window.history.back();
    this.location.back();

    console.log( 'goBack()...' );
  }

  onTemplateChange(e: any) {
    this.ruleModel.checkListId = e.id;
    this.fields = [];
    this.selectedField = null;
    this.ruleModel.dataItemId = null;
    this.ruleModel.data = null;
    this.updateSelectedEform();
  }

  onFieldChange() {
    this.selectedField = this.fields.find(f => f.id === this.ruleModel.dataItemId);

    const baseDataItem = {
      label: this.selectedField.label,
      description: (this.selectedField.description as any).inderValue
    } as BaseDataItem;

    switch (this.selectedField.fieldType) {
      case SupportedFieldTypes.CheckBox:
        this.ruleModel.ruleType = NotificationRuleType.CheckBox;
        this.ruleModel.data = {
          ...baseDataItem,
          defaultValue: false,
          selected: false
        } as CheckBoxBlock;
        break;
      case SupportedFieldTypes.Number:
        this.ruleModel.ruleType = NotificationRuleType.Number;
        this.ruleModel.data = baseDataItem as NumberBlock;
        break;
      case SupportedFieldTypes.SingleSelect:
      case SupportedFieldTypes.MultiSelect:
        this.ruleModel.ruleType = NotificationRuleType.Select;
        this.ruleModel.data = {
          ...baseDataItem,
          keyValuePairList: this.selectedField.keyValuePairList
        } as SelectBlock;
        break;
      case SupportedFieldTypes.EntitySearch:
        this.ruleModel.ruleType = NotificationRuleType.Select;
        this.entitySearchService.getEntitySearchableGroupDictionary(this.selectedField.entityGroupId, '')
          .subscribe(r => {
            this.ruleModel.data = {
              ...baseDataItem,
              keyValuePairList: r.model
                .map(x => ({key: x.id, value: x.text, selected: false, displayOrder: x.id}))
            } as SelectBlock;
          });
        break;
      case SupportedFieldTypes.EntitySelect:
        this.ruleModel.ruleType = NotificationRuleType.Select;
        this.entitySelectService.getEntitySelectableGroupDictionary(this.selectedField.entityGroupId)
          .subscribe(r => {
            this.ruleModel.data = {
              ...baseDataItem,
              keyValuePairList: r.model
                .map(x => ({key: x.id, value: x.text, selected: false, displayOrder: x.id}))
            } as SelectBlock;
          });
        break;
    }
  }

  // show(id?: number) {
  //   this.ruleModel = new NotificationRuleModel();
  //   this.selectedTemplate = new TemplateDto();
  //   this.selectedField = new FieldDto();
  //   // this.ruleModel.checkListId = null;
  //
  //   if (id) {
  //     this.getSelectedRule(id);
  //   } else {
  //     this.ruleModel = {
  //       id: null,
  //       attachReport: false,
  //       attachLink: false,
  //       includeValue: false,
  //       data: null,
  //       dataItemId: null,
  //       recipients: [],
  //       deviceUsers: [],
  //       ruleType: null,
  //       subject: '',
  //       checkListId: null,
  //       text: ''
  //     };
  //   }
  //   this.frame.show();
  // }

  getSelectedRule(id: number) {
    this.monitoringRulesService.getRule(id).subscribe((data) => {
      if (data && data.success) {
        this.ruleModel = data.model;
        this.updateSelectedEform();
      }
    });
  }

  saveRule() {

    if (this.ruleModel.id) {
      this.monitoringRulesService.updateRule(this.ruleModel).subscribe((data) => {
        if (data && data.success) {
          this.ruleSaved.emit();
          this.location.back();
        }
      });
    } else {
      this.monitoringRulesService.createRule(this.ruleModel).subscribe((data) => {
        if (data && data.success) {
          this.ruleSaved.emit();
          this.location.back();
        }
      });
    }
  }

  updateSelectedEform() {
    if (!this.ruleModel.checkListId) {
      return;
    }
    this.eFormService.getSingle(this.ruleModel.checkListId).subscribe(formOp => {
      if (formOp && formOp.success) {
        this.selectedTemplate = formOp.model;
        this.templates = [this.selectedTemplate];

        this.eFormService.getFields(this.ruleModel.checkListId).subscribe(fieldsOp => {
          if (fieldsOp && fieldsOp.success) {
            this.selectedField = null;
            this.fields = fieldsOp.model.filter(f => Object.values(SupportedFieldTypes).includes(f.fieldType));
          }
        });
      }
    });

  }

  addNewRecipient() {
    this.ruleModel.recipients.push({email: this.recipientEmail});
    this.recipientEmail = '';
  }

  addDeviceUser() {
    const baseDataItem = {
      label: '',
      description: ''
    } as BaseDataItem;

    if (this.selectedDeviceUserId) {
      const foundDeviceUser = this.deviceUsers.find(x => x.siteId === this.selectedDeviceUserId);
      this.ruleModel.deviceUsers
          .push(new DeviceUserModel(
              {id: foundDeviceUser.siteId, firstName: foundDeviceUser.firstName, lastName: foundDeviceUser.lastName}));
      this.ruleModel.data = {
        ...baseDataItem,
      };
    }

  }

  removeDeviceUser(i: number) {
    this.ruleModel.deviceUsers.splice(i, 1);
  }

  removeRecipient(i: number) {
    this.ruleModel.recipients.splice(i, 1);
  }

  asCheckboxBlock(item: BaseDataItem) {
    return item as CheckBoxBlock;
  }

  asNumberBlock(item: BaseDataItem) {
    return item as NumberBlock;
  }

  asSelectBlock(item: BaseDataItem) {
    return item as SelectBlock;
  }
}
