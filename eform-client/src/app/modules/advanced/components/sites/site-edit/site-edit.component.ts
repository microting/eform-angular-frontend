import {
  Component,
  EventEmitter, Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SitesService } from 'src/app/common/services';
import {CommonDictionaryModel, DeviceUserModel, SiteNameModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-site-edit',
    templateUrl: './site-edit.component.html',
    standalone: false
})
export class SiteEditComponent implements OnInit {
  availableTags: CommonDictionaryModel[] = [];
  site: SiteNameModel = new SiteNameModel();

  constructor(
    private sitesService: SitesService,
    public dialogRef: MatDialogRef<SiteEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: { siteId: number, availableTags: CommonDictionaryModel[] }) {
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
