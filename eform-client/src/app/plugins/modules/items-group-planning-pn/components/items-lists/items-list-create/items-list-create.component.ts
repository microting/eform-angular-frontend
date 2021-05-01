import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ItemsGroupPlanningPnListsService} from '../../../services';
import {EFormService} from 'src/app/common/services/eform';
import {SitesService} from 'src/app/common/services/advanced';
import {AuthService} from 'src/app/common/services';
import {ItemsListPnCreateModel, ItemsListPnItemModel} from '../../../models/list';
import {TemplateListModel, TemplateRequestModel} from 'src/app/common/models/eforms';
import moment = require('moment');
import {Location} from '@angular/common';


@Component({
  selector: 'app-items-group-planning-pn-items-list-create',
  templateUrl: './items-list-create.component.html',
  styleUrls: ['./items-list-create.component.scss']
})
export class ItemsListCreateComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @ViewChild('unitImportModal', {static: false}) importUnitModal;
  @Output() listCreated: EventEmitter<void> = new EventEmitter<void>();
  newListModel: ItemsListPnCreateModel = new ItemsListPnCreateModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  typeahead = new EventEmitter<string>();

  get userClaims() {
    return this.authService.userClaims;
  }
  constructor(private itemsGroupPlanningPnListsService: ItemsGroupPlanningPnListsService,
              private sitesService: SitesService,
              private authService: AuthService,
              private eFormService: EFormService,
              private cd: ChangeDetectorRef,
              private location: Location) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe(items => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    // this.loadAllSites();
  }

  goBack() {
    this.location.back();
  }

  createItemsList() {

    if (this.newListModel.internalRepeatUntil) {
      const tempDate = moment(this.newListModel.internalRepeatUntil).format('DD/MM/YYYY');
      const datTime = moment.utc(tempDate, 'DD/MM/YYYY');
      this.newListModel.repeatUntil = datTime.format('YYYY-MM-DD');
    }

    this.itemsGroupPlanningPnListsService.createList(this.newListModel).subscribe((data) => {
      if (data && data.success) {
        this.listCreated.emit();
        // this.submitDeployment();
        this.newListModel = new ItemsListPnCreateModel();
        this.location.back();
      }
    });
  }

  show() {
    this.frame.show();
  }
  showImportModal() {
    this.importUnitModal.show();
  }

  addNewItem() {
    const newItem = new ItemsListPnItemModel();
    // set corresponding id
    if (!this.newListModel.items.length) {
      newItem.id = this.newListModel.items.length;
    } else {
      newItem.id = this.newListModel.items[this.newListModel.items.length - 1].id + 1;
    }
    this.newListModel.items.push(newItem);
  }

  removeItem(id: number) {
    this.newListModel.items = this.newListModel.items.filter(x => x.id !== id);
  }
}
