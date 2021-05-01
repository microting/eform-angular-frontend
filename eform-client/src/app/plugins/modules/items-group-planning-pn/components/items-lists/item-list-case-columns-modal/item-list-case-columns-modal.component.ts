import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TemplateColumnModel, UpdateColumnsModel} from 'src/app/common/models/cases';
import {TemplateDto} from 'src/app/common/models/dto';
import {ItemsListPnModel, ItemsListPnUpdateModel} from '../../../models/list';
import {ItemsGroupPlanningPnListsService} from '../../../services';
import {TemplateListModel} from '../../../../../../common/models/eforms';
import {EFormService} from '../../../../../../common/services/eform';
import moment = require('moment');


@Component({
  selector: 'app-item-list-case-column-modal',
  templateUrl: './item-list-case-columns-modal.component.html',
  styleUrls: ['./item-list-case-columns-modal.component.scss']
})
export class ItemListCaseColumnsModalComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onListUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedListModel: ItemsListPnModel = new ItemsListPnModel();
  templatesModel: TemplateListModel = new TemplateListModel();

  columnEditModel: UpdateColumnsModel = new UpdateColumnsModel;
  columnModels: Array<TemplateColumnModel> = [];

  constructor(private eFormService: EFormService,
              private itemsGroupPlanningPnListsService: ItemsGroupPlanningPnListsService) { }

  ngOnInit() {
  }

  show(listModel: ItemsListPnModel) {
    this.getSelectedList(listModel.id);
    // this.selectedTemplateDto = selectedTemplate;
    this.getColumnsForTemplate(listModel.relatedEFormId);
    this.frame.show();
  }



  getSelectedList(id: number) {
    this.itemsGroupPlanningPnListsService.getSingleList(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedListModel = data.model;
        // @ts-ignore
        this.templatesModel.templates = [{id: this.selectedListModel.relatedEFormId, label: this.selectedListModel.relatedEFormName}];
      }
    });
  }

  updateList() {
    const model = new ItemsListPnUpdateModel(this.selectedListModel);
    if (this.selectedListModel.repeatUntil) {
      const datTime = moment(this.selectedListModel.repeatUntil);
    }
    this.itemsGroupPlanningPnListsService.updateList(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.onListUpdated.emit();
          this.selectedListModel = new ItemsListPnModel();
          this.frame.hide();
        }
      });
  }

  getColumnsForTemplate(relatedeFormId: number) {
    this.eFormService.getTemplateColumns(relatedeFormId).subscribe((operation) => {
      if (operation && operation.success) {
        this.columnModels = operation.model;
        // this.eFormService.getCurrentTemplateColumns(this.selectedTemplateDto.id).subscribe((result) => {
        //   if (result && result.success) {
        //     this.columnEditModel = result.model;
        //   }
        // });
      }
    });
  }
}
