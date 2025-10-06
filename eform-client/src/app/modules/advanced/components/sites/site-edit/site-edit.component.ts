import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { SitesService } from 'src/app/common/services';
import {CommonDictionaryModel, DeviceUserModel, SiteNameModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-site-edit',
    templateUrl: './site-edit.component.html',
    standalone: false
})
export class SiteEditComponent implements OnInit {
  private sitesService = inject(SitesService);
  dialogRef = inject<MatDialogRef<SiteEditComponent>>(MatDialogRef);

  availableTags: CommonDictionaryModel[] = [];
  site: SiteNameModel = new SiteNameModel();

  constructor() {
    const data = inject<{
    siteId: number;
    availableTags: CommonDictionaryModel[];
}>(MAT_DIALOG_DATA);

    this.availableTags = data.availableTags;
    this.sitesService.getSingleSite(data.siteId).subscribe((data) => {
      if (data && data.success) {
        this.site = data.model;
      }
    });
  }

  ngOnInit() {}


  updateSingle() {
    this.site = { ...this.site };
    this.sitesService.updateSingleSite(this.site).subscribe((operation) => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
