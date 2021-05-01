import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedPnService } from '../../../../shared/services';
import { TrashInspectionPnProducersService } from '../../../services';
import { PageSettingsModel } from '../../../../../../common/models/settings';
import {
  ProducerPnModel,
  ProducerPnRequestModel,
  ProducersPnModel,
} from '../../../models/producer';

@Component({
  selector: 'app-producer-page',
  templateUrl: './producer-page.component.html',
  styleUrls: ['./producer-page.component.scss'],
})
export class ProducerPageComponent implements OnInit {
  @ViewChild('createProducerModal') createProducerModal;
  @ViewChild('editProducerModal') editProducerModal;
  @ViewChild('deleteProducerModal') deleteProducerModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  producersModel: ProducersPnModel = new ProducersPnModel();
  producersRequestModel: ProducerPnRequestModel = new ProducerPnRequestModel();

  constructor(
    private sharedPnService: SharedPnService,
    private trashInspectionPnProducerService: TrashInspectionPnProducersService
  ) {}

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings(
      'trashInspectionsPnSettings',
      'Producers'
    ).settings;
    this.getAllInitialData();
  }
  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      'trashInspectionsPnSettings',
      this.localPageSettings,
      'Producers'
    );
    this.getAllProducers();
  }
  getAllInitialData() {
    this.getAllProducers();
  }

  getAllProducers() {
    this.producersRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.producersRequestModel.sort = this.localPageSettings.sort;
    this.producersRequestModel.pageSize = this.localPageSettings.pageSize;
    this.trashInspectionPnProducerService
      .getAllProducers(this.producersRequestModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.producersModel = data.model;
        }
      });
  }
  showCreateProducerModal() {
    this.createProducerModal.show();
  }
  showEditProducerModal(producer: ProducerPnModel) {
    this.editProducerModal.show(producer);
  }
  showDeleteProducerModal(producer: ProducerPnModel) {
    this.deleteProducerModal.show(producer);
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
      this.producersRequestModel.offset = e;
      if (e === 0) {
        this.producersRequestModel.pageIndex = 0;
      } else {
        this.producersRequestModel.pageIndex = Math.floor(
          e / this.producersRequestModel.pageSize
        );
      }
      this.getAllProducers();
    }
  }
}
