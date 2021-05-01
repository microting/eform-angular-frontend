import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { TrashInspectionPnSettingsService } from '../../services';
import { Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EntitySearchService } from '../../../../../common/services/advanced';
import {
  TemplateListModel,
  TemplateRequestModel,
} from '../../../../../common/models/eforms';
import { EFormService } from '../../../../../common/services/eform';
import { TrashInspectionBaseSettingsModel } from '../../models/trash-inspection-base-settings.model';

@Component({
  selector: 'app-trash-inspection-settings',
  templateUrl: './trash-inspection-settings.component.html',
  styleUrls: ['./trash-inspection-settings.component.scss'],
})
export class TrashInspectionSettingsComponent implements OnInit {
  typeahead = new EventEmitter<string>();
  settingsModel: TrashInspectionBaseSettingsModel = new TrashInspectionBaseSettingsModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();

  constructor(
    private trashInspectionPnSettingsService: TrashInspectionPnSettingsService,
    private router: Router,
    private eFormService: EFormService,
    private entitySearchService: EntitySearchService,
    private cd: ChangeDetectorRef
  ) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe((items) => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    this.trashInspectionPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      }
    });
  }
  updateSettings() {
    this.trashInspectionPnSettingsService
      .updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {
        }
      });
  }

  onSelectedChanged(e: any) {
    this.settingsModel.extendedInspectioneFormId = e.id;
  }
}
