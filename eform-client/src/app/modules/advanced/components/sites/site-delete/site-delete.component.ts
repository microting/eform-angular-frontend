import {Component, Inject, OnInit,} from '@angular/core';
import {SiteNameDto} from 'src/app/common/models/dto';
import {SitesService} from 'src/app/common/services/advanced';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-site-delete',
    templateUrl: './site-delete.component.html',
    styleUrls: ['./site-delete.component.scss'],
    standalone: false
})
export class SiteDeleteComponent implements OnInit {
  constructor(
    private sitesService: SitesService,
    public dialogRef: MatDialogRef<SiteDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public siteNameDto: SiteNameDto = new SiteNameDto()
  ) { }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  deleteSingle() {
    this.sitesService.deleteSingleSite(this.siteNameDto.id).subscribe(operation => {
      if (operation && operation.success) {
        this.hide(true);
      }
    });
  }

}
