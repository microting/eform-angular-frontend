import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DashboardEditModel} from '../../../../models';
import {DashboardFieldsEnum} from '../../../../const/enums';
import {format, parseISO} from 'date-fns';
import {LabelValueExtendedModel} from 'src/app/plugins/modules/insight-dashboard-pn/models/label-value-extended.model';

@Component({
  selector: 'app-dashboard-edit-header',
  templateUrl: './dashboard-edit-header.component.html',
  styleUrls: ['./dashboard-edit-header.component.scss']
})
export class DashboardEditHeaderComponent implements OnInit, OnChanges {
  @Input() dashboardEditModel: DashboardEditModel = new DashboardEditModel;
  @Input() availableLocationsTags: LabelValueExtendedModel[] = [];
  @Output() dashboardChanged: EventEmitter<DashboardEditModel> = new EventEmitter<DashboardEditModel>();
  selectedLocationId: number | null;
  reportTagId: number | null;
  selectedLocationTagId: number;
  selectedLocationTag: { value: number, label: string } = null;
  selectedDateRange = [];

  get dashboardFields() {
    return DashboardFieldsEnum;
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.dashboardEditModel) {
      const currentValue = changes.dashboardEditModel.currentValue as DashboardEditModel;
      this.selectedLocationTagId = currentValue.tagId ? currentValue.tagId : currentValue.locationId;
      this.selectedLocationTag = currentValue.tagId ? {value: currentValue.tagId, label: currentValue.tagName} : {
        value: currentValue.locationId,
        label: currentValue.locationName
      };

      if (currentValue.answerDates) {
        if (this.selectedDateRange) {
          this.selectedDateRange = [
            currentValue.answerDates.dateFrom ? parseISO(currentValue.answerDates.dateFrom) : null,
            currentValue.answerDates.dateTo ? parseISO(currentValue.answerDates.dateTo) : null
          ];
        } else {
          this.selectedDateRange = [currentValue.answerDates.dateFrom, currentValue.answerDates.dateTo];
        }
      }
    }
  }

  fieldChanged(value: any, fieldName: string) {
    switch (fieldName) {
      case DashboardFieldsEnum.dashboardName:
        this.dashboardEditModel.dashboardName = value;
        break;
      case DashboardFieldsEnum.dateFrom:
        this.dashboardEditModel.answerDates.dateFrom = value ? format(value, 'yyyy/MM/dd') : null;
        break;
      case DashboardFieldsEnum.dateTo:
        this.dashboardEditModel.answerDates.dateTo = value ? format(value, 'yyyy/MM/dd') : null;
        break;
      case DashboardFieldsEnum.today:
        this.dashboardEditModel.answerDates.today = value;
        break;
      case DashboardFieldsEnum.tagId:
        this.dashboardEditModel.tagId = value;
        this.dashboardEditModel.locationId = null;
        break;
      case DashboardFieldsEnum.locationId:
        this.dashboardEditModel.locationId = value;
        this.dashboardEditModel.tagId = null;
        break;
    }
    this.dashboardChanged.emit(this.dashboardEditModel);
  }


  onLocationTagSelected(model: any) {
    if (model.isTag) {
      this.reportTagId = model.value;
      this.selectedLocationId = null;
      this.fieldChanged(model.value, DashboardFieldsEnum.tagId);
    } else {
      this.selectedLocationId = model.value;
      this.reportTagId = null;
      this.fieldChanged(model.value, DashboardFieldsEnum.locationId);
    }
  }

  // clearDateTo() {
  //   this.selectedDateRange = [this.selectedDateRange[0], null];
  //   this.fieldChanged(null, DashboardFieldsEnum.dateTo);
  // }
  //
  // clearDateFrom() {
  //   this.selectedDateRange = [null, this.selectedDateRange[1]];
  //   this.fieldChanged(null, DashboardFieldsEnum.dateFrom);
  // }
}
