import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteNameDto } from 'src/app/common/models/dto';
import {
  SitesService,
  SiteTagsService,
} from 'src/app/common/services/advanced';
import { SiteTagsComponent } from '../..';
import {
  CommonDictionaryModel,
  TableHeaderElementModel,
} from '../../../../../common/models/common';
import { AuthService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
})
export class SitesComponent implements OnInit {
  @ViewChild('modalSiteEdit', { static: true }) modalSiteEdit;
  @ViewChild('modalSiteDelete', { static: true }) modalSiteDelete;
  @ViewChild('modalSiteTags', { static: true })
  modalSiteTags: SiteTagsComponent;
  sitesDto: Array<SiteNameDto> = [];
  selectedSiteDto: SiteNameDto = new SiteNameDto();
  availableTags: Array<CommonDictionaryModel> = [];

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Microting UID', elementId: '', sortable: false },
    { name: 'Name', elementId: '', sortable: false },
    { name: 'Units', elementId: '', sortable: false },
    { name: 'Tags', elementId: '', sortable: false },
    this.userClaims.sitesDelete || this.userClaims.sitesUpdate
      ? { name: 'Actions', elementId: '', sortable: false }
      : null,
  ];

  constructor(
    private sitesService: SitesService,
    private authStateService: AuthStateService,
    private siteTagsService: SiteTagsService
  ) {}

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
    this.sitesService.getAllSites().subscribe((operation) => {
      if (operation && operation.success) {
        this.sitesDto = operation.model;
      }
    });
  }

  openEditTagsModal(siteNameDto: SiteNameDto) {
    this.selectedSiteDto = siteNameDto;
    this.modalSiteTags.show(siteNameDto);
  }

  loadAllTags() {
    this.siteTagsService.getAvailableTags().subscribe(
      (data) => {
        if (data && data.success) {
          this.availableTags = data.model;
        }
      },
      (error) => {}
    );
  }
}
