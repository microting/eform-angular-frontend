import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Paged, TableHeaderElementModel } from 'src/app/common/models';
import { ProducerPnStatsByYearModel } from '../../../models/producer';
import { ProducersReportPreviewTableStateService } from './store/producers-report-preview-table-state-service';

@Component({
  selector: 'app-producers-report-preview-table',
  templateUrl: './producers-report-preview-table.component.html',
  styleUrls: ['./producers-report-preview-table.component.scss'],
})
export class ProducersReportPreviewTableComponent implements OnInit, OnChanges {
  @Input() thisYear: number;
  @Output()
  onShowGraphModal: EventEmitter<ProducerPnStatsByYearModel> = new EventEmitter<ProducerPnStatsByYearModel>();
  producerYearModel: Paged<ProducerPnStatsByYearModel> = new Paged<ProducerPnStatsByYearModel>();

  tableHeaders: TableHeaderElementModel[] = [
    {
      name: 'Name',
      elementId: 'nameTableHeaderProducers',
      sortable: true,
      visibleName: 'Producer',
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
    public producersReportPreviewTableStateService: ProducersReportPreviewTableStateService
  ) {}

  ngOnInit() {
    this.getAllInitialDataProducers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.thisYear.firstChange) {
      this.producersReportPreviewTableStateService.updateYear(this.thisYear);
      this.getAllProducers();
    }
  }

  getAllInitialDataProducers() {
    this.producersReportPreviewTableStateService.updateYear(this.thisYear);
    this.getAllProducers();
  }

  getAllProducers() {
    this.producersReportPreviewTableStateService
      .getAllProducersStatsByYear()
      .subscribe((data) => {
        if (data && data.success) {
          this.producerYearModel = data.model;
        }
      });
  }

  showGraphModal(producer: ProducerPnStatsByYearModel) {
    this.onShowGraphModal.emit(producer);
  }

  sortTableProducers(sort: string) {
    this.producersReportPreviewTableStateService.onSortTable(sort);
    this.getAllProducers();
  }
}
