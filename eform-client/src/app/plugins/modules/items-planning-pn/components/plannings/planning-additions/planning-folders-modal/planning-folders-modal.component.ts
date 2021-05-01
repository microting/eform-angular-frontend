import {
  Component,
  EventEmitter, Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FolderDto, SiteNameDto } from 'src/app/common/models';
import { FoldersService } from 'src/app/common/services/advanced';
import { AuthService } from 'src/app/common/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { PlanningModel } from '../../../../models/plannings';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-planning-folders-modal',
  templateUrl: './planning-folders-modal.component.html',
  styleUrls: ['./planning-folders-modal.component.scss']
})
export class PlanningFoldersModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', {static: true}) frame;
  @Output() folderSelected: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  selectedPlanning: PlanningModel = new PlanningModel();
  sitesDto: Array<SiteNameDto> = [];
  @Input() folders: FolderDto[] = [];
  getAllFolders$: Subscription;

  get userClaims() {
    return this.authService.userClaims;
  }

  constructor(private folderService: FoldersService,
              private authService: AuthService) {
  }

  ngOnInit() {

  }

  show(planningModel?: PlanningModel) {
    this.selectedPlanning = planningModel;
    this.frame.show();
  }

  select(folder: FolderDto) {
    this.folderSelected.emit(folder);
    this.frame.hide();
  }


  ngOnDestroy(): void {
  }
}
