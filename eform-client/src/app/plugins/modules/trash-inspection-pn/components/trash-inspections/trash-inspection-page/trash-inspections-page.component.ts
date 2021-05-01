import { Component, OnInit, ViewChild } from '@angular/core';
import { TrashInspectionPnModel } from '../../../models';
import {
  TrashInspectionPnSettingsService,
  TrashInspectionPnTrashInspectionsService,
} from '../../../services';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Paged, TableHeaderElementModel } from 'src/app/common/models';
import { TrashInspectionsStateService } from '../store/trash-inspections-state-service';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-page',
  templateUrl: './trash-inspections-page.component.html',
  styleUrls: ['./trash-inspections-page.component.scss'],
})
export class TrashInspectionsPageComponent implements OnInit {
  @ViewChild('createTrashInspectionModal') createTrashInspectionModal;
  @ViewChild('editTrashInspectionModal') editTrashInspectionModal;
  @ViewChild('deleteTrashInspectionModal') deleteTrashInspectionModal;
  @ViewChild('versionViewModal') versionViewModal;

  searchSubject = new Subject();
  trashInspectionsModel: Paged<TrashInspectionPnModel> = new Paged<TrashInspectionPnModel>();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Date', elementId: 'dateTableHeader', sortable: true },
    { name: 'Time', elementId: 'timeTableHeader', sortable: true },
    {
      name: 'EakCode',
      elementId: 'eakCodeTableHeader',
      sortable: true,
      visibleName: 'Eak code',
    },
    {
      name: 'InstallationId',
      elementId: 'installationTableHeader',
      sortable: true,
      visibleName: 'Installation',
    },
    {
      name: 'SegmentId',
      elementId: 'segmentTableHeader',
      sortable: true,
      visibleName: 'Segment',
    },
    {
      name: 'MustBeInspected',
      elementId: 'mustBeInspectedTableHeader',
      sortable: true,
      visibleName: 'Must be inspected',
    },
    { name: 'Producer', elementId: 'producerTableHeader', sortable: true },
    {
      name: 'RegistrationNumber',
      elementId: 'registrationNumberTableHeader',
      sortable: true,
      visibleName: 'Registration number',
    },
    {
      name: 'Transporter',
      elementId: 'transporterTableHeader',
      sortable: true,
    },
    {
      name: 'TrashFraction',
      elementId: 'trashFractionTableHeader',
      sortable: true,
      visibleName: 'Trash fraction',
    },
    {
      name: 'WeighingNumber',
      elementId: 'weighingNumberTableHeader',
      sortable: true,
      visibleName: 'Weighing number',
    },
    {
      name: 'ExtendedInspection',
      elementId: 'isExtendedInspectionTableHeader',
      sortable: true,
      visibleName: 'Extended inspection',
    },
    {
      name: 'IsApproved',
      elementId: 'isApprovedTableHeader',
      sortable: true,
      visibleName: 'Is approved',
    },
    { name: 'Comment', elementId: 'commentTableHeader', sortable: true },
    { name: 'Status', elementId: 'statusTableHeader', sortable: true },
    {
      name: 'WorkflowState',
      elementId: 'isRemovedTableHeader',
      sortable: true,
      visibleName: 'Is removed',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private trashInspectionPnSettingsService: TrashInspectionPnSettingsService,
    private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService,
    public trashInspectionsStateService: TrashInspectionsStateService,
    private authStateService: AuthStateService
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.trashInspectionsStateService.updateNameFilter(val);
      this.getAllTrashInspections();
    });
  }

  get currentRole(): string {
    return this.authStateService.currentRole;
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllTrashInspections();
  }

  getAllTrashInspections() {
    this.trashInspectionsStateService
      .getAllTrashInspections()
      .subscribe((data) => {
        if (data && data.success) {
          this.trashInspectionsModel = data.model;
        }
      });
  }

  onLabelInputChanged(label: string) {
    this.searchSubject.next(label);
  }

  showCreateTrashInspection() {
    this.createTrashInspectionModal.show();
  }

  showDeleteTrashInspectionModal(trashInspection: TrashInspectionPnModel) {
    this.deleteTrashInspectionModal.show(trashInspection);
  }

  showVersionViewModal(trashInspectionId: number) {
    this.versionViewModal.show(trashInspectionId);
  }

  downloadPDF(trashInspection: TrashInspectionPnModel) {
    window.open(
      '/api/trash-inspection-pn/inspection-results/' +
        trashInspection.weighingNumber +
        '?token=' +
        trashInspection.token +
        '&fileType=pdf',
      '_blank'
    );
  }

  downloadDocx(trashInspection: TrashInspectionPnModel) {
    window.open(
      '/api/trash-inspection-pn/inspection-results/' +
        trashInspection.weighingNumber +
        '?token=' +
        trashInspection.token +
        '&fileType=docx',
      '_blank'
    );
  }

  sortTable(sort: string) {
    this.trashInspectionsStateService.onSortTable(sort);
    this.getAllTrashInspections();
  }

  changePage(offset: number) {
    this.trashInspectionsStateService.changePage(offset);
    this.getAllTrashInspections();
  }

  onPageSizeChanged(pageSize: number) {
    this.trashInspectionsStateService.updatePageSize(pageSize);
    this.getAllTrashInspections();
  }

  onTrashInspectionDeleted() {
    this.trashInspectionsStateService.onDelete();
    this.getAllTrashInspections();
  }
}
