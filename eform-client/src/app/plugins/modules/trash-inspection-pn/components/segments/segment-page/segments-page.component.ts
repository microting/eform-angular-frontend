import { Component, OnInit, ViewChild } from '@angular/core';

import { SegmentPnModel, SegmentsPnModel } from '../../../models/segment';
import { SegmentsStateService } from '../../../components/segments/store/segments-state-service';
import { TableHeaderElementModel } from 'src/app/common/models';

@Component({
  selector: 'app-trash-inspection-pn-segments-page',
  templateUrl: './segments-page.component.html',
  styleUrls: ['./segments-page.component.scss'],
})
export class SegmentsPageComponent implements OnInit {
  @ViewChild('createSegmentModal') createSegmentModal;
  @ViewChild('editSegmentModal') editSegmentModal;
  @ViewChild('deleteSegmentModal') deleteSegmentModal;
  segmentsPnModel: SegmentsPnModel = new SegmentsPnModel();

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    {
      name: 'SdkFolderId',
      elementId: 'sdkFolderIdTableHeader',
      sortable: true,
      visibleName: 'SDK folder id',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(public segmentsStateService: SegmentsStateService) {}

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getAllSegments();
  }

  getAllSegments() {
    this.segmentsStateService.getAllSegments().subscribe((data) => {
      if (data && data.success) {
        this.segmentsPnModel = data.model;
      }
    });
  }
  showEditSegmentModal(segment: SegmentPnModel) {
    this.editSegmentModal.show(segment);
  }

  showDeleteSegmentModal(segment: SegmentPnModel) {
    this.deleteSegmentModal.show(segment);
  }

  showCreateSegmentModal() {
    this.createSegmentModal.show();
  }

  sortTable(sort: string) {
    this.segmentsStateService.onSortTable(sort);
    this.getAllSegments();
  }

  changePage(offset: number) {
    this.segmentsStateService.changePage(offset);
    this.getAllSegments();
  }

  onSegmentDeleted() {
    this.segmentsStateService.onDelete();
    this.getAllSegments();
  }

  onPageSizeChanged(pageSize: number) {
    this.segmentsStateService.updatePageSize(pageSize);
    this.getAllSegments();
  }
}
