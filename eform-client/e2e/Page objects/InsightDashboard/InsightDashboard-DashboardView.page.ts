import Page from '../Page';
import { $ } from '@wdio/globals';
import {expect} from 'chai';
import {DashboardTestConfigEditModel, DashboardTestItemEditModel} from './InsightDashboard-DashboardEdit.page';
import {format, parse, set} from 'date-fns';
import {customDaLocale} from '../../../src/app/common/const';

export class InsightDashboardDashboardViewPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(1000);
    return (await $$('#dashboardViewItem')).length;
  }

  public async returnToDashboards() {
    const ele = await $('#returnToPrevious');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async firstQuestion(rowNum: number) {
    const ele = await $(`#firstQuestion${rowNum}`);
    await ele.waitForDisplayed({timeout: 30000});
    return ele;
  }

  public async filterQuestion(rowNum: number) {
    return $(`#filterQuestion${rowNum}`);
  }

  public async filterAnswer(rowNum: number) {
    return $(`#filterAnswer${rowNum}`);
  }

  public async dateFrom(rowNum: number) {
    return await $$(`.mat-column-dateFrom span`)[rowNum]; // 0 - it's table header
  }

  public async dateTo(rowNum: number) {
    return await $$(`.mat-column-dateTo span`)[rowNum]; // 0 - it's table header
  }

  public async rawChartDataHeaders(rowNum: number, rawDataNum: number) {
    return (await $(`#dashboardViewChartData${rowNum}_${rawDataNum}`)).$$(`#dataViewRawHeader`);
  }

  public async rawChartDataPercentValueRows(rowNum: number, rawDataNum: number, dataItemNum: number) {
    const dataViewPercentRow = await (await $(`#dashboardViewChartData${rowNum}_${rawDataNum}`)).$$(`#dataViewPercent${dataItemNum}`);
    return dataViewPercentRow.map(x => {
      return x.$$(`#dataViewPercentValue`);
    });
  }

  public async rawChartDataAmountValueRows(rowNum: number, rawDataNum: number, dataItemNum: number) {
    const dataViewPercentRow = await (await $(`#dashboardViewChartData${rowNum}_${rawDataNum}`)).$$(`#dataViewAmount${dataItemNum}`);
    return dataViewPercentRow.map(x => {
      return x.$$(`#dataViewAmountValue`);
    });
  }

  public async compareHeaders(dataJson: any) {
    // items in dashboard
    var rowNum = await dashboardsViewPage.rowNum();
    //console.log(rowNum);
    for (let itemIndex = 0; itemIndex < rowNum; itemIndex++) {
      // raw data in item
      for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
        const headerArray = await dashboardsViewPage.rawChartDataHeaders(itemIndex, rawDataIndex);
        // headers in raw data
        for (let headerIndex = 0; headerIndex < headerArray.length; headerIndex++) {
          expect(dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawHeaders[headerIndex]
            , `Header is incorrect on ${itemIndex} item, ${headerIndex} header`)
            .equal(await headerArray[headerIndex].getText());
        }
      }
    }
  }

  public async comparePercentage(dataJson: any, addPercentSymbol: boolean = true) {
    for (let itemIndex = 0; itemIndex < await dashboardsViewPage.rowNum(); itemIndex++) {
      // raw data in item
      for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
        // data items in raw data
        for (let rawDataItemIndex = 0; rawDataItemIndex < dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems.length;
             rawDataItemIndex++) {
          const percentValueRows = await dashboardsViewPage.rawChartDataPercentValueRows(itemIndex, rawDataIndex, rawDataItemIndex);
          // rows in data item
          for (let row = 0; row < percentValueRows.length; row++) {
            // columns in row
            for (let value = 0; value < await percentValueRows[row].length; value++) {
              // Requires % to compare correctly
              expect(`${dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems[rawDataIndex].rawDataValues[row].percents[value]}${addPercentSymbol ? '%' : ''}`,
                `Percentage is incorrect on ${itemIndex} item, ${row} row, ${value} value`)
                .equal(await percentValueRows[row][value].getText());
            }
          }
        }
      }
    }
  }

//   export class DashboardChartRawDataModel {
//   rawHeaders: string[];
//   rawDataItems: DashboardChartRawDataItemsModel[];
// }
//
// export class DashboardChartRawDataItemsModel {
//   rawValueName: string;
//   rawDataValues: DashboardChartRawDataValuesModel[];
// }

  public async compareAmounts(dataJson: any) {
    for (let itemIndex = 0; itemIndex < await dashboardsViewPage.rowNum(); itemIndex++) {
      // raw data in item
      for (let rawDataIndex = 0; rawDataIndex < dataJson.items[itemIndex].chartData.rawData.length; rawDataIndex++) {
        // data items in raw data
        for (
          let rawDataItemIndex = 0;
          rawDataItemIndex < dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems.length;
          rawDataItemIndex++
        ) {
          const amountValueRows = await dashboardsViewPage.rawChartDataAmountValueRows(itemIndex, rawDataIndex, rawDataItemIndex);
          // rows in raw data
          for (let row = 0; row < amountValueRows.length; row++) {
            for (let amount = 0; amount < await amountValueRows[row].length; amount++) {
              // Requires cast to integer or to string
              // eslint-disable-next-line max-len
              expect(dataJson.items[itemIndex].chartData.rawData[rawDataIndex].rawDataItems[rawDataIndex].rawDataValues[row].amounts[amount],
                `Amount is incorrect on ${itemIndex} item, ${row} row, ${amount} value`)
                .equal(+(await amountValueRows[row][amount].getText()));
            }
          }
        }
      }
    }
  }

  async compareItem(rowNum: number, originalItem: DashboardTestItemEditModel, config: DashboardTestConfigEditModel) {
    await browser.pause(1000);
    expect(await (await this.firstQuestion(rowNum)).getText()).equal(originalItem.firstQuestion);
    expect(await (await this.filterQuestion(rowNum)).getText()).equal(originalItem.filterQuestion);
    expect(await (await this.filterAnswer(rowNum)).getText()).equal(originalItem.filterAnswer);

    const dateFrom = set(new Date, {
      year: config.dateRange.yearFrom,
      month: config.dateRange.monthFrom - 1,
      date: config.dateRange.dayFrom,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });
    const dateTo = set(new Date, {
      year: config.dateRange.yearTo,
      month: config.dateRange.monthTo - 1,
      date: config.dateRange.dayTo,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    const dateFromInTableRaw = parse(await (await $(`#dateFrom${rowNum}`)).getText(), 'yyyy/MM/dd', new Date());
    const dateToInTableRaw = parse(await (await $(`#dateTo${rowNum}`)).getText(), 'yyyy/MM/dd', new Date());
    const dateFromInTable = set(dateFromInTableRaw, {
      year: dateFromInTableRaw.getFullYear(),
      month: dateFromInTableRaw.getMonth(),
      date: dateFromInTableRaw.getDate(),
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });
    const dateToInTable = set(dateToInTableRaw, {
      year: dateToInTableRaw.getFullYear(),
      month: dateToInTableRaw.getMonth(),
      date: dateToInTableRaw.getDate(),
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    expect(format(dateFromInTable, 'P', {locale: customDaLocale})).equal(format(dateFrom, 'P', {locale: customDaLocale}));
    expect(format(dateToInTable, 'P', {locale: customDaLocale})).equal(format(dateTo, 'P', {locale: customDaLocale}));
  }
}

const dashboardsViewPage = new InsightDashboardDashboardViewPage();
export default dashboardsViewPage;
