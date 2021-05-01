import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {saveAs} from 'file-saver';
import {ActivatedRoute} from '@angular/router';
import {SharedPnService} from '../../../../shared/services';
import {ItemsGroupPlanningPnCasesService} from '../../../services';
import {ItemListCasesPnRequestModel} from '../../../models/list/item-list-cases-pn-request.model';
import {ItemListPnCaseResultListModel, ItemsListPnCaseResultModel} from '../../../models/list';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportPnGenerateModel} from '../../../models/report';
import {ToastrService} from 'ngx-toastr';
import {format} from 'date-fns';
import {EFormService} from '../../../../../../common/services/eform';
import {TemplateDto} from '../../../../../../common/models/dto';

@Component({
  selector: 'app-items-group-planning-pn-list-case-result-page',
  templateUrl: './list-case-result-page.component.html',
  styleUrls: ['./list-case-result-page.component.scss']
})

export class ListCaseResultPageComponent implements OnInit {
  @ViewChild('uploadedDataModal', {static: false}) uploadedDataModal;
  @Output() generateReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  @Output() saveReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  generateForm: FormGroup;
  currentTemplate: TemplateDto = new TemplateDto;
  listCaseRequestModel: ItemListCasesPnRequestModel = new ItemListCasesPnRequestModel();
  casesModel: ItemListPnCaseResultListModel = new ItemListPnCaseResultListModel();

  constructor(private activateRoute: ActivatedRoute,
              private sharedPnService: SharedPnService,
              private formBuilder: FormBuilder,
              private eFormService: EFormService,
              private itemsGroupPlanningPnCasesService: ItemsGroupPlanningPnCasesService,
              private toastrService: ToastrService) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.listCaseRequestModel.listId = +params['id'];
    });
  }

  ngOnInit(): void {
    this.getLocalPageSettings();
    this.generateForm = this.formBuilder.group({
      dateRange: [[this.listCaseRequestModel.dateFrom, this.listCaseRequestModel.dateTo], Validators.required]
    });

    this.getAllCases();
  }

  onGenerateReport() {
    this.listCaseRequestModel.offset = 0;
    this.listCaseRequestModel.dateFrom = format(this.generateForm.value.dateRange[0], 'YYYY-MM-DD');
    this.listCaseRequestModel.dateTo = format(this.generateForm.value.dateRange[1], 'YYYY-MM-DD');
    this.getAllCases();
  }

  onSaveReport() {
    this.listCaseRequestModel.offset = 0;
    this.itemsGroupPlanningPnCasesService.getGeneratedReport(this.listCaseRequestModel).subscribe(((data) => {
      saveAs(data, this.listCaseRequestModel.dateFrom + '_' + this.listCaseRequestModel.dateTo + '_report.xlsx');

    }), error => {
      this.toastrService.error();

    });
  }

  getLocalPageSettings() {
    const itemsGroupPlanningPnSettings = JSON.parse(localStorage.getItem('itemsGroupPlanningPnSettings'));
    const settings = itemsGroupPlanningPnSettings.find(x => x.name === 'ItemCaseResults').settings;

    if (settings.listId === this.listCaseRequestModel.listId) {
      this.listCaseRequestModel = {
        offset: settings.offset,
        dateFrom: settings.dateFrom,
        dateTo: settings.dateTo,
        isSortDsc: settings.isSortDsc,
        listId: settings.listId,
        nameFilter: settings.nameFilter,
        pageIndex: settings.pageIndex,
        pageSize: settings.pageSize,
        sort: settings.sort
      };
    }
  }

  updateLocalPageSettings() {
    const itemsGroupPlanningPnSettings = JSON.parse(localStorage.getItem('itemsGroupPlanningPnSettings'));
    const i = itemsGroupPlanningPnSettings.findIndex(x => x.name === 'ItemCaseResults');
    itemsGroupPlanningPnSettings[i].settings = this.listCaseRequestModel;
    localStorage.setItem('itemsGroupPlanningPnSettings', JSON.stringify(itemsGroupPlanningPnSettings));
  }

  getReportingSettings(eformId: number) {
    this.eFormService.getSingle(eformId).subscribe(operation => {
      if (operation && operation.success) {
        this.currentTemplate = operation.model;
      }

    });
  }

  getAllCases() {
    this.updateLocalPageSettings();
    this.itemsGroupPlanningPnCasesService.getAllCaseResults(this.listCaseRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.casesModel = data.model;
      }
      this.getReportingSettings(this.casesModel.sdkeFormId);
    });
  }

  sortTable(sort: string) {
    if (this.listCaseRequestModel.sort === sort) {
      this.listCaseRequestModel.isSortDsc = !this.listCaseRequestModel.isSortDsc;
    } else {
      this.listCaseRequestModel.isSortDsc = false;
      this.listCaseRequestModel.sort = sort;
    }
    this.getAllCases();
  }

  changePage(offset: number) {
    this.listCaseRequestModel.offset = offset;
    this.listCaseRequestModel.pageIndex = offset ? offset / this.listCaseRequestModel.pageSize : 1;
    this.getAllCases();
  }

  changePageSize(n: number) {
    this.listCaseRequestModel.pageSize = n;
    this.listCaseRequestModel.offset = 0;
    this.getAllCases();
  }

  showListCasePdfModal(itemCase: ItemsListPnCaseResultModel) {
    this.uploadedDataModal.show(itemCase);
  }

  downloadFile(itemCase: ItemsListPnCaseResultModel, fileType: string) {
    window.open('/api/items-group-planning-pn/list-case-file-report/' +
      itemCase.id + '?token=' + itemCase.token + '&fileType=' + fileType, '_blank');
  }
}
