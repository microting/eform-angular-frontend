import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {SiteNameDto} from 'app/models/dto';
import {SitesService, NotifyService} from 'app/services';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {
  @ViewChild('deleteSiteModal')
  deleteSiteModal: ModalComponent;
  spinnerStatus = true;
  sitesDto: Array<SiteNameDto>;
  selectedSiteDto: SiteNameDto = new SiteNameDto();

  constructor(private sitesService: SitesService, private router: Router, private notifyService: NotifyService) {
    this.sitesDto = [];
  }

  ngOnInit() {
    this.loadAllSites();
  }

  loadAllSites() {
    this.sitesService.getAllSites().subscribe(operation => {
      this.spinnerStatus = true;
      if (operation && operation.success) {
        this.sitesDto = operation.model;
      }
      this.spinnerStatus = false;
    });
  }

  deleteSingle(id: number) {
    this.sitesService.deleteSingleSite(id).subscribe(operation => {
      if (operation && operation.success) {
        this.loadAllSites();
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
      this.deleteSiteModal.close().then();
    });
  }

  showDeleteSiteModal(siteNameDto: SiteNameDto) {
    this.selectedSiteDto = siteNameDto;
    this.deleteSiteModal.open().then();
  }

  submitDeleteSiteModal(id: number) {
    this.deleteSingle(id);
  }
}
