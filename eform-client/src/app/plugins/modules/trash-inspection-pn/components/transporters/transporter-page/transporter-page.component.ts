import { Component, OnInit, ViewChild } from '@angular/core';
import { PageSettingsModel } from '../../../../../../common/models/settings';
import {
  TransporterPnModel,
  TransporterPnRequestModel,
  TransportersPnModel,
} from '../../../models/transporter';
import { SharedPnService } from '../../../../shared/services';
import { TrashInspectionPnTransporterService } from '../../../services';

@Component({
  selector: 'app-transporter-page',
  templateUrl: './transporter-page.component.html',
  styleUrls: ['./transporter-page.component.scss'],
})
export class TransporterPageComponent implements OnInit {
  @ViewChild('createTransporterModal') createTransporterModal;
  @ViewChild('editTransporterModal') editTransporterModal;
  @ViewChild('deleteTransporterModal') deleteTransporterModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  transportersModel: TransportersPnModel = new TransportersPnModel();
  transporterRequestModel: TransporterPnRequestModel = new TransporterPnRequestModel();

  constructor(
    private sharedPnService: SharedPnService,
    private trashInspectionPnTransporterService: TrashInspectionPnTransporterService
  ) {}

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings(
      'trashInspectionsPnSettings',
      'Transporters'
    ).settings;
    this.getAllInitialData();
  }
  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      'trashInspectionsPnSettings',
      this.localPageSettings,
      'Transporters'
    );
    this.getAllTransporters();
  }
  getAllInitialData() {
    this.getAllTransporters();
  }

  getAllTransporters() {
    this.transporterRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.transporterRequestModel.sort = this.localPageSettings.sort;
    this.transporterRequestModel.pageSize = this.localPageSettings.pageSize;
    this.trashInspectionPnTransporterService
      .getAllTransporters(this.transporterRequestModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.transportersModel = data.model;
        }
      });
  }
  showCreateTransporterModal() {
    this.createTransporterModal.show();
  }
  showEditTransporterModal(transporter: TransporterPnModel) {
    this.editTransporterModal.show(transporter);
  }
  showDeleteTransporterModal(transporter: TransporterPnModel) {
    this.deleteTransporterModal.show(transporter);
  }
  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.transporterRequestModel.offset = e;
      if (e === 0) {
        this.transporterRequestModel.pageIndex = 0;
      } else {
        this.transporterRequestModel.pageIndex = Math.floor(
          e / this.transporterRequestModel.pageSize
        );
      }
      this.getAllTransporters();
    }
  }
}
