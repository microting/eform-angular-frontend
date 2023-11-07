import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {Store} from "@ngrx/store";
import {selectCurrentUserClaimsSitesDelete, selectCurrentUserClaimsSitesUpdate} from "src/app/state/auth/auth.selector";

@AutoUnsubscribe()
@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
})
export class SitesComponent implements OnInit, OnDestroy {
  private selectCurrentUserClaimsSitesUpdate$ = this.authStore.select(selectCurrentUserClaimsSitesUpdate);
  private selectCurrentUserClaimsSitesDelete$ = this.authStore.select(selectCurrentUserClaimsSitesDelete);
  constructor(
    private authStore: Store,
    private sitesService: SitesService,
    private authStateService: AuthStateService,
    private eFormTagService: EformTagService,
    public dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
  ) {}
  @ViewChild('modalTags', { static: true }) modalSiteTags: EformsTagsComponent;
  sitesDto: Array<SiteNameDto> = [];
  availableTags: Array<CommonDictionaryModel> = [];
  siteEditComponentAfterClosedSub$: Subscription;
  getCurrentUserClaimsAsyncSub$: Subscription;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Microting UID'), field: 'siteUId'},
    {header: this.translateService.stream('Name'), field: 'siteName'},
    { header: this.translateService.stream('Units'), field: 'units', },
    { header: this.translateService.stream('Tags'), field: 'tags', },
  ]

  getTagName(tagId: number): string {
    return this.availableTags.find((x) => x.id === tagId).name;
  }

  ngOnInit() {
    // this.loadAllSites();
    this.loadAllTags();
    let actionsAdded = false;
    this.selectCurrentUserClaimsSitesUpdate$.subscribe(x => {
      if (x) {
        actionsAdded = true;
        this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
          },
        ];
      }
    });
    this.selectCurrentUserClaimsSitesDelete$.subscribe(x => {
      if (x && !actionsAdded) {
        this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
          {
            header: this.translateService.stream('Actions'),
            field: 'actions',
          },
        ];
      }
    });
    //   if(x.sitesDelete || x.sitesUpdate) {
    //     this.tableHeaders = [...this.tableHeaders.filter(x => x.field !== 'actions'),
    //       {
    //         header: this.translateService.stream('Actions'),
    //         field: 'actions',
    //       },
    //     ];
    //   }
    // })
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

  ngOnDestroy(): void {
  }
}
