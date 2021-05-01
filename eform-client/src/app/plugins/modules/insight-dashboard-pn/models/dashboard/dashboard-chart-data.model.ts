export class DashboardChartDataModel {
  single: DashboardChartDataSingleModel[];
  multi: DashboardChartDataMultiModel[];
  multiStacked: DashboardChartDataMultiStackedModel[];
  rawData: DashboardChartRawDataModel[];
}

export class DashboardChartRawDataModel {
  rawHeaders: string[];
  rawDataItems: DashboardChartRawDataItemsModel[];
}

export class DashboardChartRawDataItemsModel {
  rawValueName: string;
  rawDataValues: DashboardChartRawDataValuesModel[];
}

export class DashboardChartRawDataValuesModel {
  valueName: string;
  percents: number[];
  amounts: number[];
}

export class DashboardChartDataSingleModel {
  name: string;
  value: number;
}

export class DashboardChartDataMultiModel {
  name: string;
  series: DashboardChartDataSingleModel[];
}

export class DashboardChartDataMultiStackedModel {
  name: string;
  series: DashboardChartDataMultiModel[];
}
