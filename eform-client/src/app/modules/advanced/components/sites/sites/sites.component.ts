import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {SiteNameDto} from 'src/app/common/models/dto';
import {SitesService} from 'src/app/common/services/advanced';
import {AuthService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html'
})
export class SitesComponent implements OnInit {
  @ViewChild('modalSiteEdit', { static: true }) modalSiteEdit;
  @ViewChild('modalSiteDelete', { static: true }) modalSiteDelete;
  spinnerStatus = false;
  sitesDto: Array<SiteNameDto> = [];
  selectedSiteDto: SiteNameDto = new SiteNameDto();

  get userClaims() { return this.authService.userClaims; }

  constructor(private sitesService: SitesService, private router: Router, private authService: AuthService) {

  }

  ngOnInit() {
    this.loadAllSites();
  }

  openEditModal(siteNameDto: SiteNameDto) {
    this.selectedSiteDto = siteNameDto;
    this.modalSiteEdit.show();
  }

  openDeleteModal(siteNameDto: SiteNameDto) {
    this.selectedSiteDto = siteNameDto;
    this.modalSiteDelete.show();
  }

  loadAllSites() {
    this.spinnerStatus = true;
    this.sitesService.getAllSites().subscribe(operation => {
      if (operation && operation.success) {
        this.sitesDto = operation.model;
      }
      this.spinnerStatus = false;
    });
  }
}
