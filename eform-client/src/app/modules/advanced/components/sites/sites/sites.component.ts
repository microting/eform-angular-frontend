import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SiteNameDto,
  CommonDictionaryModel,
} from 'src/app/common/models';
import { EformsTagsComponent } from 'src/app/common/modules/eform-shared-tags/components';
import { EformTagService, SitesService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {SiteDeleteComponent, SiteEditComponent} from 'src/app/modules/advanced/components';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
})
export class SitesComponent implements OnInit {
  siteEditComponentAfterClosedSub$: any;
  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private sitesService: SitesService,
    private authStateService: AuthStateService,
    private eFormTagService: EformTagService,
    public dialog: MatDialog,
    private overlay: Overlay,
  ) {}
  @ViewChild('modalTags', { static: true }) modalSiteTags: EformsTagsComponent;
  sitesDto: Array<SiteNameDto> = [];
  availableTags: Array<CommonDictionaryModel> = [];

  tableHeaders: MtxGridColumn[] = [
    {header: 'Microting UID', field: 'siteUId'},
    {header: 'Name', field: 'siteName'},
    { header: 'Units', field: 'units', },
    { header: 'Tags', field: 'tags', },
    this.authStateService.currentUserClaims.sitesDelete ||
    this.authStateService.currentUserClaims.sitesUpdate
      ? {header: 'Actions', field: 'actions'}
      : undefined,
  ]

  getTagName(tagId: number): string {
    return this.availableTags.find((x) => x.id === tagId).name;
  }

  ngOnInit() {
    // this.loadAllSites();
    this.loadAllTags();
  }

  openEditModal(siteNameDto: SiteNameDto) {
    this.siteEditComponentAfterClosedSub$ = this.dialog.open(SiteEditComponent,
      {
        ...dialogConfigHelper(this.overlay, {
          siteId: siteNameDto.id,
          availableTags: this.availableTags,
        }), minWidth: 500
      })
      .afterClosed().subscribe(data => data ? this.loadAllSites() : undefined);
  }

  openDeleteModal(siteNameDto: SiteNameDto) {
    this.siteEditComponentAfterClosedSub$ = this.dialog.open(SiteDeleteComponent,
      {...dialogConfigHelper(this.overlay, siteNameDto), maxWidth: 400})
      .afterClosed().subscribe(data => data ? this.loadAllSites() : undefined);
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
