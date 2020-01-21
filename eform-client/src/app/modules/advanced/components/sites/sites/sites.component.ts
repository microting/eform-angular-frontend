import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {SiteNameDto} from 'src/app/common/models/dto';
import {SitesService, SiteTagsService} from 'src/app/common/services/advanced';
import {AuthService} from 'src/app/common/services/auth';
import {SiteTagsComponent} from '../..';
import {CommonDictionaryModel} from '../../../../../common/models/common';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html'
})
export class SitesComponent implements OnInit {
  @ViewChild('modalSiteEdit') modalSiteEdit;
  @ViewChild('modalSiteDelete') modalSiteDelete;
  @ViewChild('modalSiteTags') modalSiteTags: SiteTagsComponent;
  spinnerStatus = false;
  sitesDto: Array<SiteNameDto> = [];
  selectedSiteDto: SiteNameDto = new SiteNameDto();
  availableTags: Array<CommonDictionaryModel> = [];

  get userClaims() {
    return this.authService.userClaims;
  }

  constructor(private sitesService: SitesService, private router: Router,
              private authService: AuthService, private siteTagsService: SiteTagsService) {

  }

  ngOnInit() {
    this.loadAllSites();
    this.loadAllTags();
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

  openEditTagsModal(siteNameDto: SiteNameDto) {
    this.selectedSiteDto = siteNameDto;
    this.modalSiteTags.show(siteNameDto);
  }

  loadAllTags() {
    this.spinnerStatus = true;
    this.siteTagsService.getAvailableTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
      this.spinnerStatus = false;
    }, (error) => {
      this.spinnerStatus = false;
    });
  }
}
