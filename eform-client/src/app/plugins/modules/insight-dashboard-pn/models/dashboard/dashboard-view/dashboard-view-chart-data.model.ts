export class DashboardViewChartDataModel {
  single: DashboardViewChartDataSingleModel[];
  multi: DashboardViewChartDataMultiModel[];
  multiStacked: DashboardViewChartDataMultiStackedModel[];
  rawData: DashboardViewChartRawDataModel[];
}

export class DashboardViewChartRawDataModel {
  rawHeaders: string[];
  rawValueName: string;
  rawDataValues: DashboardViewChartRawDataValuesModel[];
}

export class DashboardViewChartRawDataValuesModel {
  valueName: string;
  percents: number[];
  amounts: number[];
}

export class DashboardViewChartDataSingleModel {
  name: string;
  value: number;
}

export class DashboardViewChartDataMultiModel {
  name: string;
  series: DashboardViewChartDataSingleModel[];
}

export class DashboardViewChartDataMultiStackedModel {
  name: string;
  series: DashboardViewChartDataMultiModel[];
}
