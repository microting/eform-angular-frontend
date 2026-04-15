import Page from '../Page';
import { $ } from '@wdio/globals';
import {
  selectDateRangeOnDatePicker,
  selectValueInNgSelector,
  selectValueInNgSelectorWithSeparateValueAndSearchValue
} from '../../Helpers/helper-functions';

export class InsightDashboardDashboardEditPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#dashboardItem')).length;
  }

  public async initialItemCreateBtn() {
    const ele = await $('#initialItemCreateBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardUpdateSaveBtn() {
    const ele = await $('#dashboardUpdateSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardUpdateSaveCancelBtn() {
    const ele = await $('#dashboardUpdateSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardName() {
    const ele = await $('#dashboardNameCreate');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardRangeToTodayCheckbox() {
    const ele = await $('#rangeToTodayCheckbox label');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dateRange() {
    const ele = await $('mat-date-range-input');
    await ele.waitForDisplayed({timeout: 30000});
    // await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async firstQuestionSearchField(rowNum: number) {
    const ele = await $(`#editFirstQuestion${rowNum} `);
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async firstQuestionListOfOptions(rowNum: number) {
    return $$(`#editFirstQuestion${rowNum} .ng-option`);
  }

  public async filterQuestion(rowNum: number) {
    return $(`#editFilterQuestion${rowNum}`);
  }

  public async filterQuestionSearchField(rowNum: number) {
    return $(`#editFilterQuestion${rowNum}`);
  }

  public async filterQuestionListOfOptions(rowNum: number) {
    return $$(`#editFilterQuestion${rowNum} .ng-option`);
  }

  public async filterAnswer(rowNum: number) {
    return $(`#editFilterAnswer${rowNum}`);
  }

  public async filterAnswerSearchField(rowNum: number) {
    return $(`#editFilterAnswer${rowNum}`);
  }

  public async filterAnswerListOfOptions(rowNum: number) {
    return $$(`#editFilterAnswer${rowNum} .ng-option`);
  }

  public async period(rowNum: number) {
    return $(`#editPeriod${rowNum}`);
  }

  public async calculateAverageCheckbox(rowNum: number) {
    const ele = await $(`#calcAverageCheckbox${rowNum} label`);
    await ele.waitForDisplayed({timeout: 30000});
    return ele;
  }

  public async enableCompareCheckbox(rowNum: number) {
    const ele = await $(`#enableCompare${rowNum} label`);
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async enableIgnoreCheckbox(rowNum: number) {
    return $(`#enableIgnoreCheckbox${rowNum}`);
  }

  public async answerIgnoreCheckbox(rowNum: number, ignoredAnswerId: number) {
    return $(`#ignoreCheckbox${ignoredAnswerId}_${rowNum} label`);
  }

  public async compareItemInput(rowNum: number, compareItemIndex: number) {
    return $(`#locationTag${rowNum}_${compareItemIndex}`);
  }

  public async periodSearchField(rowNum: number) {
    return $(`#editPeriod${rowNum}`);
  }

  public async periodListOfOptions(rowNum: number) {
    return $$(`#editPeriod${rowNum} .ng-option`);
  }

  public async chartType(rowNum: number) {
    return $(`#editChartType${rowNum}`);
  }

  public async chartTypeSearchField(rowNum: number) {
    return $(`#editChartType${rowNum}`);
  }

  public async chartTypeListOfOptions(rowNum: number) {
    return $$(`#editChartType${rowNum} .ng-option`);
  }


  public async getLocationTagSearchField() {
    const ele = await $('#selectLocationTag');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  async setDashboardSettings(model: DashboardTestConfigEditModel) {
    await (await this.dateRange()).click();
    // Set date from and date to
    if (model.dateRange) {
      await selectDateRangeOnDatePicker(
        model.dateRange.yearFrom,
        model.dateRange.monthFrom,
        model.dateRange.dayFrom,
        model.dateRange.yearTo,
        model.dateRange.monthTo,
        model.dateRange.dayTo,
      )
    }

    // Set today
    if (model.today) {
      await (await this.dashboardRangeToTodayCheckbox()).click();
    }

    await selectValueInNgSelector(await this.getLocationTagSearchField(), model.locationTagName)
  }

  async createFirstItem() {
    await (await this.initialItemCreateBtn()).click();
  }

  async createItem(rowObject: InsightDashboardEditRowObject) {
    await (await rowObject.itemCreateBtn).click();
  }

  async deleteItem(rowObject: InsightDashboardEditRowObject) {
    await (await rowObject.itemDeleteBtn).click();
  }

  async copyItem(rowObject: InsightDashboardEditRowObject) {
    await (await rowObject.itemCopyBtn).click();
  }

  async fillItem(rowNum: number, itemObject: DashboardTestItemEditModel) {
    // Select first question
    await selectValueInNgSelectorWithSeparateValueAndSearchValue(await this.firstQuestionSearchField(rowNum),
      itemObject.firstQuestion, itemObject.firstQuestionForSelect);
    // Select filter question
    if (itemObject.filterQuestion) {
      await selectValueInNgSelectorWithSeparateValueAndSearchValue(await this.filterQuestionSearchField(rowNum),
        itemObject.filterQuestion, itemObject.filterQuestionForSelect);
    }
    // Select filter answer
    if (itemObject.filterAnswer) {
      await selectValueInNgSelector(await this.filterAnswerSearchField(rowNum), itemObject.filterAnswer);
    }
    // Select period
    await selectValueInNgSelector(await this.periodSearchField(rowNum), itemObject.period);
    // Select calculate average
    if (itemObject.calculateAverage) {
      const ele = await this.calculateAverageCheckbox(rowNum);
      await ele.waitForDisplayed({timeout: 20000});
      await ele.waitForClickable({timeout: 20000});
      await ele.click();
    }

    // Ignored answers
    for (const ignoredAnswerId of itemObject.ignoredAnswerIds) {
      const ele = await this.answerIgnoreCheckbox(rowNum, ignoredAnswerId);
      await ele.waitForDisplayed({timeout: 20000});
      await ele.waitForClickable({timeout: 20000});
      await ele.click();
    }

    // Compared items
    if (itemObject.comparedItems.length) {
      await (await this.enableCompareCheckbox(rowNum)).click();
      for (const compareItem of itemObject.comparedItems) {
        await (await this.compareItemInput(rowNum, compareItem.itemIndex)).addValue(compareItem.value);
      }
    }

    // Select chart type
    await selectValueInNgSelector(await this.chartTypeSearchField(rowNum), itemObject.chartType);
  }

  async generateItems(itemsArray: DashboardTestItemEditModel[]) {
    await this.createFirstItem();
    for (let i = 0; i < itemsArray.length; i++) {
      await this.fillItem(i + 1, itemsArray[i]);
      if (i < itemsArray.length - 1) {
        await this.createItem(await this.getDashboardItem(i + 1));
      }
    }
  }

  async getFirstItemObject(): Promise<InsightDashboardEditRowObject> {
    await browser.pause(500);
    const obj = new InsightDashboardEditRowObject();
    return await obj.getRow(1);
  }

  async getDashboardItem(num): Promise<InsightDashboardEditRowObject> {
    await browser.pause(500);
    const obj = new InsightDashboardEditRowObject();
    return obj.getRow(num);
  }
}

const dashboardsEditPage = new InsightDashboardDashboardEditPage();
export default dashboardsEditPage;

export class InsightDashboardEditRowObject {
  constructor() {}

  public firstQuestion;
  public firstQuestionSearchField;
  public firstQuestionListOfOptions;
  public filterQuestion;
  public filterQuestionSearchField;
  public filterQuestionListOfOptions;
  public filterAnswer;
  public filterAnswerSearchField;
  public filterAnswerListOfOptions;
  public period;
  public periodSearchField;
  public periodListOfOptions;
  public calcAverageCheckbox;
  public chartType;
  public chartTypeSearchField;
  public chartTypeListOfOptions;
  public itemCreateBtn;
  public itemDeleteBtn;
  public itemCopyBtn;

  async getRow(rowNum: number): Promise<InsightDashboardEditRowObject> {
    this.firstQuestion = (await $$('#editFirstQuestion'))[rowNum - 1];
    this.firstQuestionSearchField = (await $$('#editFirstQuestion .ng-input > input'))[rowNum - 1];
    this.firstQuestionListOfOptions = (await $$('#editFirstQuestion .ng-option'))[rowNum - 1];

    this.filterQuestion = (await $$('#editFilterQuestion'))[rowNum - 1];
    this.filterQuestionSearchField = (await $$('#editFilterQuestion .ng-input > input'))[rowNum - 1];
    this.filterQuestionListOfOptions = (await $$('#editFilterQuestion .ng-option'))[rowNum - 1];

    this.filterAnswer = (await $$('#editFilterAnswer'))[rowNum - 1];
    this.filterAnswerSearchField = (await $$('#editFilterAnswer .ng-input > input'))[rowNum - 1];
    this.filterAnswerListOfOptions = (await $$('#editFilterAnswer .ng-option'))[rowNum - 1];

    this.period = (await $$('#editPeriod'))[rowNum - 1];
    this.periodSearchField = (await $$('#editPeriod .ng-input > input'))[rowNum - 1];
    this.periodListOfOptions = (await $$('#editPeriod .ng-option'))[rowNum - 1];

    this.calcAverageCheckbox = (await $$('#calcAverageCheckbox'))[rowNum - 1];

    this.chartType = (await $$('#editChartType'))[rowNum - 1];
    this.chartTypeSearchField = (await $$('#editChartType .ng-input > input'))[rowNum - 1];
    this.chartTypeListOfOptions = (await $$('#editChartType .ng-option'))[rowNum - 1];
    // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`))[rowNum - 1];
    this.itemCreateBtn = (await $$('#createItemBtn'))[rowNum - 1];
    this.itemDeleteBtn = (await $$('#deleteItemBtn'))[rowNum - 1];
    this.itemCopyBtn = (await $$('#copyItemBtn'))[rowNum - 1];
    return this;
  }
}

export interface DashboardTestItemEditModel {
  firstQuestion: string;
  firstQuestionForSelect: string;
  filterQuestion: string;
  filterQuestionForSelect: string;
  filterAnswer: string;
  period: string;
  chartType: string;
  calculateAverage: boolean;
  ignoredAnswerIds: number[];
  comparedItems: { itemIndex: number, value: number }[];
}

export interface DashboardTestConfigEditModel {
  locationTagName: string;
  dateRange?: {
    yearFrom: number,
    monthFrom: number,
    dayFrom: number,
    yearTo: number,
    monthTo: number,
    dayTo: number,
  };
  today: boolean;
}

