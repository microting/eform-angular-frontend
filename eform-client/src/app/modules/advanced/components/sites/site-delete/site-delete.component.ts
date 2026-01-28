import { Component, OnInit, inject } from '@angular/core';
import {SiteNameDto} from 'src/app/common/models/dto';
import {SitesService} from 'src/app/common/services/advanced';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DateFormatterComponent } from '../../../../../common/modules/eform-shared/components/date-formatter/date-formatter.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-site-delete',
    templateUrl: './site-delete.component.html',
    styleUrls: ['./site-delete.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DateFormatterComponent, MatDialogActions, TranslatePipe]
})
export class SiteDeleteComponent implements OnInit {
  private sitesService = inject(SitesService);
  dialogRef = inject<MatDialogRef<SiteDeleteComponent>>(MatDialogRef);
  siteNameDto = inject<SiteNameDto>(MAT_DIALOG_DATA) ?? new SiteNameDto();


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
