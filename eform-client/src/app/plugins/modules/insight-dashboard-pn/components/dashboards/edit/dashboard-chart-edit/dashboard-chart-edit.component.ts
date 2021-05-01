import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DashboardChartTypesEnum, DashboardItemQuestionTypesEnum, DashboardPeriodUnitsEnum} from '../../../../const/enums';
import {DashboardItemModel} from '../../../../models';
import {CommonDictionaryModel} from 'src/app/common/models';
import {
  line,
  lineSmiley, multi,
  multiSmiley, multiStacked, multiStackedSmiley, single, singleSmiley
} from './chart-data';
import {DashboardChartDataModel} from 'src/app/plugins/modules/insight-dashboard-pn/models/dashboard/dashboard-chart-data.model';
import {getChartData} from 'src/app/plugins/modules/insight-dashboard-pn/helpers/preview-values-generator.helper';

@Component({
  selector: 'app-dashboard-chart-edit',
  templateUrl: './dashboard-chart-edit.component.html',
  styleUrls: ['./dashboard-chart-edit.component.scss']
})
export class DashboardChartEditComponent implements OnChanges {
  @Input() chartPosition: number;
  @Input() questionType: DashboardItemQuestionTypesEnum;
  @Input() period: number;
  @Input() chartType: number;
  @Input() dashboardItem: DashboardItemModel = new DashboardItemModel();
  @Input() answers: CommonDictionaryModel[] = [];
  @Input() chartGeneratedPreviewData: DashboardChartDataModel;
  chartData: any[];
  darkTHeme: boolean;

  get chartTypes() {
    return DashboardChartTypesEnum;
  }

  view: any[] = [800, 400];
  multiChartView: any[] = [800, 400];

  colorScheme = {
    domain: ['#3f51b5', '#ff9800', '#8bc34a', '#00bcd4', '#9e9e9e', '#9c27b0', '#ffc107', '#009688', '#cddc39', '#2196f3']
  };

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  showGridLines = true;
  barPadding = 8;
  roundDomains = false;
  animations = true;
  showDataLabel = false;
  noBarWhenZero = true;
  barWidth = 7;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;

  customColors = [
    {
      name: 'Meget glad',
      value: '#007E33'
    },
    {
      name: 'Glad',
      value: '#00C851'
    },
    {
      name: 'Neutral',
      value: '#ffbb33'
    },
    {
      name: 'Sur',
      value: '#ff4444'
    },
    {
      name: 'Meget sur',
      value: '#CC0000'
    },
    {
      name: 'Ved ikke',
      value: '#0099CC'
    }
  ];

  constructor() {
    this.darkTHeme = localStorage.getItem('darkTheme') === 'true';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.questionType) {
        this.chartData = [];
        const currentValue = changes.questionType.currentValue as DashboardItemQuestionTypesEnum;
        this.chartData = [...getChartData(currentValue, this.period, this.dashboardItem.chartType)];
      }
      if (changes.period) {
        this.chartData = [];
        const currentValue = changes.period.currentValue as DashboardPeriodUnitsEnum;
        this.chartData = [...getChartData(this.questionType, currentValue, this.dashboardItem.chartType)];
      }
      if (changes.chartType) {
        this.chartData = [];
        const currentValue = changes.chartType.currentValue as DashboardChartTypesEnum;
        this.chartData = [...getChartData(this.questionType, this.period, currentValue)];
      }
    }
  }
}
