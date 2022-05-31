import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SiteNameDto,
  CommonDictionaryModel,
  TableHeaderElementModel,
} from 'src/app/common/models';
import { EformsTagsComponent } from 'src/app/common/modules/eform-shared-tags/components';
import { EformTagService, SitesService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
})
export class SitesComponent implements OnInit {
  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private sitesService: SitesService,
    private authStateService: AuthStateService,
    private eFormTagService: EformTagService
  ) {}
  @ViewChild('modalSiteEdit', { static: true }) modalSiteEdit;
  @ViewChild('modalSiteDelete', { static: true }) modalSiteDelete;
  @ViewChild('modalTags', { static: true }) modalSiteTags: EformsTagsComponent;
  sitesDto: Array<SiteNameDto> = [];
  selectedSiteDto: SiteNameDto = new SiteNameDto();
  availableTags: Array<CommonDictionaryModel> = [];

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Microting UID', elementId: '', sortable: false },
    { name: 'Name', elementId: '', sortable: false },
    { name: 'Units', elementId: '', sortable: false },
    { name: 'Tags', elementId: '', sortable: false },
    this.userClaims.sitesDelete || this.userClaims.sitesUpdate
      ? { name: 'Actions', elementId: '', sortable: false }
      : null,
  ];

  getTagName(tagId: number): string {
    return this.availableTags.find((x) => x.id === tagId).name;
  }

  ngOnInit() {
    // this.loadAllSites();
    this.loadAllTags();
  }

  openEditModal(siteNameDto: SiteNameDto) {
    this.modalSiteEdit.show(siteNameDto.id);
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

  openEditTagsModal() {
    this.modalSiteTags.show();
  }

  loadAllTags() {
    this.eFormTagService.getAvailableTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
        this.loadAllSites();
      }
    });
  }
}
