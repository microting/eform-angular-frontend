import {
  Component,
  EventEmitter, Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SiteNameDto } from 'src/app/common/models';
import { AuthService } from 'src/app/common/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { FolderDto } from 'src/app/common/models/dto/folder.dto';
import { FoldersService } from 'src/app/common/services/advanced/folders.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-workorders-folders-modal',
  templateUrl: './workorders-folders-modal.component.html',
  styleUrls: ['./workorders-folders-modal.component.scss']
})
export class WorkOrdersFoldersModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', {static: true}) frame;
  @Output() folderSelected: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  sitesDto: Array<SiteNameDto> = [];
  @Input() folders: FolderDto[] = [];
  getAllFolders$: Subscription;
  selectedFolderId: number;

  get userClaims() {
    return this.authService.userClaims;
  }

  constructor(private folderService: FoldersService,
              private authService: AuthService) {
  }

  ngOnInit() {

  }

  show(selectedFolderId?: number) {
    this.selectedFolderId = selectedFolderId;
    this.frame.show();
  }

  select(folder: FolderDto) {
    this.folderSelected.emit(folder);
    this.frame.hide();
  }


  ngOnDestroy(): void {
  }
}
