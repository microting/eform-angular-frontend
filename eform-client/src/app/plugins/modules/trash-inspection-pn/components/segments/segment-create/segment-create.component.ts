import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SiteNameDto, DeployModel } from 'src/app/common/models';
import { SegmentPnModel } from '../../../models';
import { TrashInspectionPnSegmentsService } from '../../../services';
import { AuthStateService } from 'src/app/common/store';
import { SitesService } from 'src/app/common/services';

@Component({
  selector: 'app-trash-inspection-pn-segment-create',
  templateUrl: './segment-create.component.html',
  styleUrls: ['./segment-create.component.scss'],
})
export class SegmentCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onSegmentCreated: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  constructor(
    private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService,
    private sitesService: SitesService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit() {
    this.loadAllSites();
  }

  createSegment() {
    this.trashInspectionPnSegmentsService
      .createSegment(this.segmentPnModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onSegmentCreated.emit();
          this.segmentPnModel = new SegmentPnModel();
          this.frame.hide();
        }
      });
  }

  loadAllSites() {
    if (this.userClaims.eformsPairingRead) {
      this.sitesService.getAllSitesForPairing().subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
    }
  }

  show() {
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
    this.frame.show();
  }

  onSelectedChanged(e: any) {}
}
