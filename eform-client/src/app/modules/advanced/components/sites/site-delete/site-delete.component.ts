import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SiteNameDto} from 'src/app/common/models/dto';
import {SitesService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-site-delete',
  templateUrl: './site-delete.component.html',
  styleUrls: ['./site-delete.component.scss']
})
export class SiteDeleteComponent implements OnInit {
  @Input() siteNameDto: SiteNameDto = new SiteNameDto();
  @Output() onSiteRemoved: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(('frame'), {static: false}) frame;
  spinnerStatus = false;

  constructor(private sitesService: SitesService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  deleteSingle() {
    this.spinnerStatus = true;
    this.sitesService.deleteSingleSite(this.siteNameDto.id).subscribe(operation => {
      if (operation && operation.success) {
        this.onSiteRemoved.emit();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    });
  }

}
