import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SiteNameDto } from 'src/app/common/models';
import { WorkOrdersSettingsService } from '../../../services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-settings-remove-site-modal',
  templateUrl: './settings-remove-site-modal.component.html',
  styleUrls: ['./settings-remove-site-modal.component.scss'],
})
export class SettingsRemoveSiteModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: false }) frame;
  @Output() siteRemoved: EventEmitter<void> = new EventEmitter<void>();
  selectedSite: SiteNameDto = new SiteNameDto();
  removeSub$: Subscription;

  constructor(private settingsService: WorkOrdersSettingsService) {}

  ngOnInit(): void {}

  show(site: SiteNameDto) {
    this.selectedSite = site;
    this.frame.show();
  }

  removeSite() {
    this.removeSub$ = this.settingsService
      .removeSiteFromSettings(this.selectedSite.siteUId)
      .subscribe((data) => {
        this.siteRemoved.emit();
        this.frame.hide();
        this.selectedSite = new SiteNameDto();
      });
  }

  ngOnDestroy() {}
}
