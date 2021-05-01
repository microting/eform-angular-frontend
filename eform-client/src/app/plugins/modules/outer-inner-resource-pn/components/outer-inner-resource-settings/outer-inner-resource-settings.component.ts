import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import { OuterInnerResourcePnSettingsService} from '../../services';
import {Router} from '@angular/router';
import {OuterInnerResourceBaseSettingsModel} from '../../models';
import {debounceTime, switchMap} from 'rxjs/operators';
import {EntitySearchService} from '../../../../../common/services/advanced';
import {TemplateListModel, TemplateRequestModel} from '../../../../../common/models/eforms';
import {EFormService} from '../../../../../common/services/eform';

@Component({
  selector: 'app-machine-area-settings',
  templateUrl: './outer-inner-resource-settings.component.html',
  styleUrls: ['./outer-inner-resource-settings.component.scss']
})
export class OuterInnerResourceSettingsComponent implements OnInit {
  typeahead = new EventEmitter<string>();
  settingsModel: OuterInnerResourceBaseSettingsModel = new OuterInnerResourceBaseSettingsModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();

  constructor(
    private machineAreaPnSettingsService: OuterInnerResourcePnSettingsService,
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
    this.machineAreaPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      }
    });
  }
  updateSettings() {
    this.machineAreaPnSettingsService.updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {

        }
      });
  }

  onSelectedChanged(e: any) {
    this.settingsModel.sdkeFormId = e.id;
  }
}
