import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SitesService } from 'src/app/common/services';
import { CommonDictionaryModel, SiteNameModel } from 'src/app/common/models';

@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.component.html',
})
export class SiteEditComponent implements OnInit {
  @Input() availableTags: CommonDictionaryModel[] = [];
  @ViewChild('frame', { static: true }) frame;
  @Output() siteUpdate: EventEmitter<void> = new EventEmitter<void>();
  site: SiteNameModel = new SiteNameModel();

  constructor(private sitesService: SitesService) {}

  ngOnInit() {}

  show(id: number) {
    this.sitesService.getSingleSite(id).subscribe((data) => {
      if (data && data.success) {
        this.site = data.model;
        this.frame.show();
      }
    });
  }

  updateSingle() {
    this.site = { ...this.site };
    this.sitesService.updateSingleSite(this.site).subscribe((operation) => {
      if (operation && operation.success) {
        this.siteUpdate.emit();
        this.frame.hide();
      }
    });
  }
}
