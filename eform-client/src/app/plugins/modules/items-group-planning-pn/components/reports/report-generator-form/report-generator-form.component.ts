import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocaleService} from 'src/app/common/services/auth';
import {format} from 'date-fns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportPnGenerateModel} from '../../../models/report';
import {ItemsListPnRequestModel, ItemsListsPnModel} from '../../../models/list';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ItemsGroupPlanningPnListsService} from '../../../services';
import {ItemsListPnItemModel} from '../../../models/list';
import {DateTimeAdapter} from 'ng-pick-datetime-ex';

@Component({
  selector: 'app-items-group-planning-pn-report-generator-form',
  templateUrl: './report-generator-form.component.html',
  styleUrls: ['./report-generator-form.component.scss']
})
export class ReportGeneratorFormComponent implements OnInit {
  @Output() generateReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  @Output() saveReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  generateForm: FormGroup;
  typeahead = new EventEmitter<string>();
  itemLists: ItemsListsPnModel = new ItemsListsPnModel();
  items: Array<ItemsListPnItemModel> = [];
  listRequestModel: ItemsListPnRequestModel = new ItemsListPnRequestModel();

  constructor(dateTimeAdapter: DateTimeAdapter<any>,
              private localeService: LocaleService,
              private formBuilder: FormBuilder,
              private listsService: ItemsGroupPlanningPnListsService,
              private cd: ChangeDetectorRef) {
    dateTimeAdapter.setLocale(this.localeService.getCurrentUserLocale());
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.listRequestModel.nameFilter = term;
          return this.listsService.getAllLists(this.listRequestModel);
        })
      )
      .subscribe(itemLists => {
        this.itemLists = itemLists.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    this.generateForm = this.formBuilder.group({
      dateRange: ['', Validators.required],
      itemList: [null, Validators.required],
      item: [null, Validators.required]
    });
  }

  onSubmit() {
    const model = this.extractData(this.generateForm.value);
    this.generateReport.emit(model);
  }

  onSave() {
    const model = this.extractData(this.generateForm.value);
    this.saveReport.emit(model);
  }

  onItemListSelected(e: any) {
    this.listsService.getSingleList(e.id)
      .subscribe(itemList => {
        this.items = itemList.model.items;
        this.cd.markForCheck();
      });
  }

  private extractData(formValue: any): ReportPnGenerateModel {
    return new ReportPnGenerateModel(
      {
        itemList: formValue.itemList,
        item: formValue.item,
        dateFrom: format(formValue.dateRange[0], 'YYYY-MM-DD'),
        dateTo: format(formValue.dateRange[1], 'YYYY-MM-DD')
      }
    );
  }

}
