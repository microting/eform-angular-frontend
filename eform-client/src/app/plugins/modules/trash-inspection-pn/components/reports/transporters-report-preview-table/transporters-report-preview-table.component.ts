import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TransporterPnStatsByYearModel } from '../../../models/transporter';
import { Paged, TableHeaderElementModel } from 'src/app/common/models';
import { TransportersReportPreviewTableStateService } from './store/transporters-report-preview-table-state-service';

@Component({
  selector: 'app-transporters-report-preview-table',
  templateUrl: './transporters-report-preview-table.component.html',
  styleUrls: ['./transporters-report-preview-table.component.scss'],
})
export class TransportersReportPreviewTableComponent
  implements OnInit, OnChanges {
  @Input() thisYear: number;
  @Output()
  onShowGraphModal: EventEmitter<TransporterPnStatsByYearModel> = new EventEmitter<TransporterPnStatsByYearModel>();
  transporterYearModel: Paged<TransporterPnStatsByYearModel> = new Paged<TransporterPnStatsByYearModel>();

  tableHeaders: TableHeaderElementModel[] = [
    {
      name: 'Name',
      elementId: 'nameTableHeaderProducers',
      sortable: true,
      visibleName: 'Transporter',
    },
    {
      name: 'Weighings',
      elementId: 'descriptionTableHeaderProducers',
      sortable: true,
      visibleName: 'Amount of load',
    },
    {
      name: 'AmountOfWeighingsControlled',
      elementId: 'ForeignIdTableHeaderProducers',
      sortable: true,
      visibleName: 'Amount of load controlled',
    },
    {
      name: 'ControlPercentage',
      elementId: 'addressTableHeaderProducers',
      sortable: true,
      visibleName: 'Controlled percentage',
    },
    {
      name: 'ApprovedPercentage',
      elementId: 'cityTableHeaderProducers',
      sortable: true,
      visibleName: 'Approved percentage',
    },
    {
      name: 'ConditionalApprovedPercentage',
      elementId: 'zipCodeTableHeaderProducers',
      sortable: true,
      visibleName: 'Conditional approved percentage',
    },
    {
      name: 'NotApprovedPercentage',
      elementId: 'phoneTableHeaderProducers',
      sortable: true,
      visibleName: 'Not approved percentage',
    },
  ];

  constructor(
    public transportersReportPreviewTableStateService: TransportersReportPreviewTableStateService
  ) {}

  ngOnInit() {
    this.getAllInitialDataTransporters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.thisYear.firstChange) {
      this.transportersReportPreviewTableStateService.updateYear(this.thisYear);
      this.getAllTransportersByYear();
    }
  }

  getAllInitialDataTransporters() {
    this.transportersReportPreviewTableStateService.updateYear(this.thisYear);
    this.getAllTransportersByYear();
  }

  getAllTransportersByYear() {
    this.transportersReportPreviewTableStateService
      .getAllTransportersByYear()
      .subscribe((data) => {
        if (data && data.success) {
          this.transporterYearModel = data.model;
        }
      });
  }

  sortTableTransporters(sort: string) {
    this.transportersReportPreviewTableStateService.onSortTable(sort);
    this.getAllTransportersByYear();
  }

  showGraphModal(transporter: TransporterPnStatsByYearModel) {
    this.onShowGraphModal.emit(transporter);
  }
}
