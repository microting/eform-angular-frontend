import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { SiteNameDto } from 'src/app/common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { WorkOrdersSettingsService } from '../../../services';
import {eqBy, prop, symmetricDifferenceWith} from 'ramda';

@AutoUnsubscribe()
@Component({
  selector: 'app-settings-add-site-modal',
  templateUrl: './settings-add-site-modal.component.html',
  styleUrls: ['./settings-add-site-modal.component.scss'],
})
export class SettingsAddSiteModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: false }) frame;
  @Output() siteAdded: EventEmitter<void> = new EventEmitter<void>();
  availableSites: SiteNameDto[] = [];
  selectedSiteId: number;
  addSiteSub$: Subscription;

  constructor(private settingsService: WorkOrdersSettingsService) {}

  ngOnInit(): void {}

  show(sites: SiteNameDto[], assignedSites: SiteNameDto[]) {
    // Removing assigned sites from all sites by id
    const propEqual = eqBy(prop('siteUId'));
    this.availableSites = symmetricDifferenceWith(propEqual, sites, assignedSites);
    this.frame.show();
  }

  assignSite() {
    this.addSiteSub$ = this.settingsService
      .addSiteToSettings(this.selectedSiteId)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.selectedSiteId = null;
          this.availableSites = [];
          this.siteAdded.emit();
        }
      });
  }

  ngOnDestroy(): void {}
}
