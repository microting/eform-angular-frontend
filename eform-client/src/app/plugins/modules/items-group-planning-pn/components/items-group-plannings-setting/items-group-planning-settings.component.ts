import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import { ItemsGroupPlanningPnSettingsService} from '../../services';
import {Router} from '@angular/router';
import {debounceTime, switchMap} from 'rxjs/operators';
import {EntitySearchService} from 'src/app/common/services/advanced';
import {TemplateListModel, TemplateRequestModel} from '../../../../../common/models/eforms';
import {EFormService} from 'src/app/common/services/eform';
import {ItemsGroupPlanningBaseSettingsModel} from '../../models/items-group-planning-base-settings.model';

@Component({
  selector: 'app-items-group-planning-settings',
  templateUrl: './items-group-planning-settings.component.html',
  styleUrls: ['./items-group-planning-settings.component.scss']
})
export class ItemsGroupPlanningSettingsComponent implements OnInit {
  typeahead = new EventEmitter<string>();
  settingsModel: ItemsGroupPlanningBaseSettingsModel = new ItemsGroupPlanningBaseSettingsModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();

  constructor(
    private itemsGroupPlanningPnSettingsService: ItemsGroupPlanningPnSettingsService,
    private router: Router,
    private eFormService: EFormService,
    private entitySearchService: EntitySearchService,
    private cd: ChangeDetectorRef) {
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
    this.getSettings();
  }

  getSettings() {
    this.itemsGroupPlanningPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      }
    });
  }
  updateSettings() {
    this.itemsGroupPlanningPnSettingsService.updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {

        }
      });
  }
}
