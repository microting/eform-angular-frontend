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
import { FractionPnStatsByYearModel } from '../../../models';
import { FractionsReportPreviewTableStateService } from './store/fractions-report-preview-table-state-service';

@Component({
  selector: 'app-fractions-report-preview-table',
  templateUrl: './fractions-report-preview-table.component.html',
  styleUrls: ['./fractions-report-preview-table.component.scss'],
})
export class FractionsReportPreviewTableComponent implements OnInit, OnChanges {
  @Input() thisYear: number;
  @Output()
  onShowGraphModal: EventEmitter<FractionPnStatsByYearModel> = new EventEmitter<FractionPnStatsByYearModel>();
  fractionYearModel: Paged<FractionPnStatsByYearModel> = new Paged<FractionPnStatsByYearModel>();

  tableHeaders: TableHeaderElementModel[] = [
    {
      name: 'Name',
      elementId: 'nameTableHeaderFractions',
      sortable: true,
      visibleName: 'Item Name',
    },
    {
      name: 'Weighings',
      elementId: 'descriptionTableHeaderFractions',
      sortable: true,
      visibleName: 'Amount of load',
    },
    {
      name: 'AmountOfWeighingsControlled',
      elementId: 'ForeignIdTableHeaderFractions',
      sortable: true,
      visibleName: 'Amount of load controlled',
    },
    {
      name: 'ControlPercentage',
      elementId: 'addressTableHeaderFractions',
      sortable: true,
      visibleName: 'Controlled percentage',
    },
    {
      name: 'ApprovedPercentage',
      elementId: 'cityTableHeaderFractions',
      sortable: true,
      visibleName: 'Approved percentage',
    },
    {
      name: 'ConditionalApprovedPercentage',
      elementId: 'zipCodeTableHeaderFractions',
      sortable: true,
      visibleName: 'Conditional approved percentage',
    },
    {
      name: 'NotApprovedPercentage',
      elementId: 'phoneTableHeaderFractions',
      sortable: true,
      visibleName: 'Not approved percentage',
    },
  ];

  constructor(
    public fractionsReportPreviewTableStateService: FractionsReportPreviewTableStateService
  ) {}

  ngOnInit() {
    this.getAllInitialDataFractions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.thisYear.firstChange) {
      this.fractionsReportPreviewTableStateService.updateYear(this.thisYear);
      this.getAllFractions();
    }
  }

  getAllInitialDataFractions() {
    this.fractionsReportPreviewTableStateService.updateYear(this.thisYear);
    this.getAllFractions();
  }

  getAllFractions() {
    this.fractionsReportPreviewTableStateService
      .getAllFractionsStatsByYear()
      .subscribe((data) => {
        if (data && data.success) {
          this.fractionYearModel = data.model;
        }
      });
  }

  sortTableFractions(sort: string) {
    this.fractionsReportPreviewTableStateService.onSortTable(sort);
    this.getAllFractions();
  }

  showGraphModal(fraction: FractionPnStatsByYearModel) {
    this.onShowGraphModal.emit(fraction);
  }
}
