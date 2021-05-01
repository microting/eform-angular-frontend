import { Component, OnInit, ViewChild } from '@angular/core';
import {
  InstallationPnModel,
  InstallationsPnModel,
} from '../../../models/installation';
import { TableHeaderElementModel } from 'src/app/common/models';
import { InstallationsStateService } from '../store/installations-state-service';

@Component({
  selector: 'app-trash-inspection-pn-installations-page',
  templateUrl: './installations-page.component.html',
  styleUrls: ['./installations-page.component.scss'],
})
export class InstallationsPageComponent implements OnInit {
  @ViewChild('createInspectionModal') createInspectionModal;
  @ViewChild('editInstallationModal') editInstallationModal;
  @ViewChild('deleteInstallationModal') deleteInstallationModal;
  installationsModel: InstallationsPnModel = new InstallationsPnModel();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    { name: 'Actions', elementId: '', sortable: false },
  ];
  constructor(public installationsStateService: InstallationsStateService) {}

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllInstallations();
  }

  getAllInstallations() {
    this.installationsStateService.getAllInstallations().subscribe((data) => {
      if (data && data.success) {
        this.installationsModel = data.model;
      }
    });
  }

  showEditInstallationModal(installation: InstallationPnModel) {
    this.editInstallationModal.show(installation);
  }

  showDeleteInstallationModal(installation: InstallationPnModel) {
    this.deleteInstallationModal.show(installation);
  }

  showCreateInstallationModal() {
    this.createInspectionModal.show();
  }

  sortTable(sort: string) {
    this.installationsStateService.onSortTable(sort);
    this.getAllInstallations();
  }

  changePage(offset: number) {
    this.installationsStateService.changePage(offset);
    this.getAllInstallations();
  }

  onPageSizeChanged(pageSize: number) {
    this.installationsStateService.updatePageSize(pageSize);
    this.getAllInstallations();
  }

  onInstallationDeleted() {
    this.installationsStateService.onDelete();
    this.getAllInstallations();
  }
}
