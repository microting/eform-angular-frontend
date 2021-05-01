import {
  DashboardChartTypesEnum,
  DashboardItemQuestionTypesEnum,
  DashboardPeriodUnitsEnum
} from '../const';
import {
  lineDataByMonth, lineDataByQuarter, lineDataBySixMonth,
  lineDataByWeek, lineDataByYear, lineSmileyDataByMonth, lineSmileyDataByQuarter, lineSmileyDataBySixMonth,
  lineSmileyDataByWeek, lineSmileyDataByYear
} from '../const/chart-data/chart-data-line';
import {
  advancedPieData, advancedPieSmileyData,
  barChartData,
  barChartSmileyData,
  pieGridData, pieGridSmileyData
} from '../const/chart-data/chart-data-single';
import {
  stackedDataByMonth, stackedDataByQuarter, stackedDataBySixMonth,
  stackedDataByWeek, stackedDataByYear, stackedSmileyDataByMonth, stackedSmileyDataByQuarter, stackedSmileyDataBySixMonth,
  stackedSmileyDataByWeek, stackedSmileyDataByYear
} from '../const/chart-data/chart-data-stacked';
import {
  stackedGroupedSmileyDataByMonth, stackedGroupedSmileyDataByQuarter, stackedGroupedSmileyDataBySixMonth,
  stackedGroupedSmileyDataByWeek, stackedGroupedSmileyDataByYear
} from 'src/app/plugins/modules/insight-dashboard-pn/const/chart-data/chart-data-stacked-grouped';

export function getChartData(questionType: DashboardItemQuestionTypesEnum,
                             period: DashboardPeriodUnitsEnum, chartType: DashboardChartTypesEnum) {
  if (questionType && period && chartType) {
    switch (period) {
      case DashboardPeriodUnitsEnum.Week:
        return getChartDataByWeek(chartType, questionType);
      case DashboardPeriodUnitsEnum.Month:
        return getChartDataByMonth(chartType, questionType);
      case DashboardPeriodUnitsEnum.Quarter:
        return getChartDataByQuarter(chartType, questionType);
      case DashboardPeriodUnitsEnum.SixMonth:
        return getChartDataBySixMonth(chartType, questionType);
      case DashboardPeriodUnitsEnum.Year:
        return getChartDataByYear(chartType, questionType);
      case DashboardPeriodUnitsEnum.Total:
        return getChartDataByTotal(chartType, questionType);
    }
  } else {
    return [];
  }
}

function getChartDataByWeek(chartType: DashboardChartTypesEnum, questionType: DashboardItemQuestionTypesEnum) {
  switch (chartType) {
    case DashboardChartTypesEnum.Line:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? lineDataByWeek : lineSmileyDataByWeek;
    case DashboardChartTypesEnum.HorizontalBarStacked:
    case DashboardChartTypesEnum.HorizontalBarGrouped:
    case DashboardChartTypesEnum.VerticalBarStacked:
    case DashboardChartTypesEnum.VerticalBarGrouped:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? stackedDataByWeek : stackedSmileyDataByWeek;
    case DashboardChartTypesEnum.HorizontalBarStackedGrouped:
      return stackedGroupedSmileyDataByWeek;
  }
}

function getChartDataByMonth(chartType: DashboardChartTypesEnum, questionType: DashboardItemQuestionTypesEnum) {
  switch (chartType) {
    case DashboardChartTypesEnum.Line:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? lineDataByMonth : lineSmileyDataByMonth;
    case DashboardChartTypesEnum.HorizontalBarStacked:
    case DashboardChartTypesEnum.HorizontalBarGrouped:
    case DashboardChartTypesEnum.VerticalBarStacked:
    case DashboardChartTypesEnum.VerticalBarGrouped:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? stackedDataByMonth : stackedSmileyDataByMonth;
    case DashboardChartTypesEnum.HorizontalBarStackedGrouped:
      return stackedGroupedSmileyDataByMonth;
  }
}

function getChartDataByQuarter(chartType: DashboardChartTypesEnum, questionType: DashboardItemQuestionTypesEnum) {
  switch (chartType) {
    case DashboardChartTypesEnum.Line:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? lineDataByQuarter : lineSmileyDataByQuarter;
    case DashboardChartTypesEnum.HorizontalBarStacked:
    case DashboardChartTypesEnum.HorizontalBarGrouped:
    case DashboardChartTypesEnum.VerticalBarStacked:
    case DashboardChartTypesEnum.VerticalBarGrouped:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? stackedDataByQuarter : stackedSmileyDataByQuarter;
    case DashboardChartTypesEnum.HorizontalBarStackedGrouped:
      return stackedGroupedSmileyDataByQuarter;
  }
} 

function getChartDataBySixMonth(chartType: DashboardChartTypesEnum, questionType: DashboardItemQuestionTypesEnum) {
  switch (chartType) {
    case DashboardChartTypesEnum.Line:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? lineDataBySixMonth : lineSmileyDataBySixMonth;
    case DashboardChartTypesEnum.HorizontalBarStacked:
    case DashboardChartTypesEnum.HorizontalBarGrouped:
    case DashboardChartTypesEnum.VerticalBarStacked:
    case DashboardChartTypesEnum.VerticalBarGrouped:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? stackedDataBySixMonth : stackedSmileyDataBySixMonth;
    case DashboardChartTypesEnum.HorizontalBarStackedGrouped:
      return stackedGroupedSmileyDataBySixMonth;
  }
}

function getChartDataByYear(chartType: DashboardChartTypesEnum, questionType: DashboardItemQuestionTypesEnum) {
  switch (chartType) {
    case DashboardChartTypesEnum.Line:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? lineDataByYear : lineSmileyDataByYear;
    case DashboardChartTypesEnum.HorizontalBarStacked:
    case DashboardChartTypesEnum.HorizontalBarGrouped:
    case DashboardChartTypesEnum.VerticalBarStacked:
    case DashboardChartTypesEnum.VerticalBarGrouped:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? stackedDataByYear : stackedSmileyDataByYear;
    case DashboardChartTypesEnum.HorizontalBarStackedGrouped:
      return stackedGroupedSmileyDataByYear;
  }
}

function getChartDataByTotal(chartType: DashboardChartTypesEnum, questionType: DashboardItemQuestionTypesEnum) {
  switch (chartType) {
    case DashboardChartTypesEnum.HorizontalBar:
    case DashboardChartTypesEnum.VerticalBar:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? barChartData : barChartSmileyData;
    case DashboardChartTypesEnum.Pie:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? advancedPieData : advancedPieSmileyData;
    case DashboardChartTypesEnum.PieGrid:
      return questionType !== DashboardItemQuestionTypesEnum.Smiley ? pieGridData : pieGridSmileyData;
  }
}
