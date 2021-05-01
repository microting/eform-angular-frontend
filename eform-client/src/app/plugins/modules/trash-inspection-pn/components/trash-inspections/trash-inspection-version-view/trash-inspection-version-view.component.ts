import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedPnService } from '../../../../shared/services';
import {
  TrashInspectionPnSettingsService,
  TrashInspectionPnTrashInspectionsService,
} from '../../../services';
import { PageSettingsModel } from 'src/app/common/models';
import { TrashInspectionVersionsPnModel } from '../../../models';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-version-view',
  templateUrl: './trash-inspection-version-view.component.html',
  styleUrls: ['./trash-inspection-version-view.component.scss'],
})
export class TrashInspectionVersionViewComponent implements OnInit {
  @ViewChild('frame') frame;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  trashInspectionVersionsModel: TrashInspectionVersionsPnModel = new TrashInspectionVersionsPnModel();

  constructor(
    private sharedPnService: SharedPnService,
    private trashInspectionPnSettingsService: TrashInspectionPnSettingsService,
    private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService
  ) {}

  ngOnInit() {}

  show(trashInspectionId: number) {
    this.frame.show();
    this.trashInspectionVersionsModel = new TrashInspectionVersionsPnModel();
    this.getSelectedVersions(trashInspectionId);
  }

  getSelectedVersions(trashInspectionId: number) {
    this.trashInspectionPnTrashInspectionsService
      .getTrashInspectionVersions(trashInspectionId)
      .subscribe((data) => {
        if (data && data.success) {
          this.trashInspectionVersionsModel = data.model;
        }
      });
  }
}
