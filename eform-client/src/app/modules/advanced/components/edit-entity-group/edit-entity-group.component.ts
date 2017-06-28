import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {AdvEntityGroupEditModel, AdvEntityItemModel} from 'app/models/advanced';
import {EntitySearchService} from 'app/services';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NotifyService} from 'app/modules/helpers/services/notify.service';

@Component({
  selector: 'edit-entity-group',
  templateUrl: './edit-entity-group.component.html',
  styleUrls: ['./edit-entity-group.component.css']
})
export class EditEntityGroupComponent implements OnChanges {
  @Input() selectedId: string;
  advEntityGroupEditModel: AdvEntityGroupEditModel = new AdvEntityGroupEditModel();
  @Output() onLoading = new EventEmitter<boolean>();
  @Output() onEntityGroupChanged = new EventEmitter<void>();
  @ViewChild('editAdvEntityItemModal') editAdvEntityItemModal: ModalComponent;
  @ViewChild('importAdvEntityGroupModal') importAdvEntityGroupModal: ModalComponent;
  @ViewChild('createAdvEntityGroupModal') createAdvEntityGroupModal: ModalComponent;

  selectedAdvEntityItemModel: AdvEntityItemModel = new AdvEntityItemModel;
  spinnerStatus: boolean;

  constructor(private entitySearchService: EntitySearchService, private notifyService: NotifyService) {
  }

  ngOnChanges(changes) {
    if (changes.selectedId) {
      this.loadEntityGroup();
    }
  }

  loadEntityGroup() {
    if (this.selectedId) {
      this.entitySearchService.getEntityGroup(this.selectedId).subscribe((data) => {
        this.advEntityGroupEditModel.name = data.model.name;
        this.advEntityGroupEditModel.advEntityItemModels = data.model.entityGroupItemLst;
        this.advEntityGroupEditModel.groupUid = this.selectedId;
      });
    } else {
      this.advEntityGroupEditModel = Object.assign({}, new AdvEntityGroupEditModel());
    }
  }

  createEntityGroup() {
    if (!this.advEntityGroupEditModel.name) {
      return;
    }
    this.actualizeAdvEntityItemPositions();
    this.spinnerStatus = true;
    this.onLoading.emit(true);
    if (this.advEntityGroupEditModel.groupUid) {
      this.entitySearchService.updateEntityGroup(this.advEntityGroupEditModel).subscribe((data) => {
        if (data.success) {
          this.notifyService.success({text: data.message});
          this.onEntityGroupChanged.emit();
        } else {
          this.notifyService.error({text: data.message});
        }
        this.spinnerStatus = false;
        this.onLoading.emit(false);
      });
    } else {
      this.entitySearchService.createEntityGroup(this.advEntityGroupEditModel).subscribe((data) => {
        if (data.success) {
          this.notifyService.success({text: data.message});
          this.onEntityGroupChanged.emit();
        } else {
          this.notifyService.error({text: data.message});
        }
        this.spinnerStatus = false;
        this.onLoading.emit(false);
      });
    }
  }

  showImportAdvEntityGroupModal() {
    this.importAdvEntityGroupModal.open().then();
  }

  onChildModalDismissed() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('modal-open');
  }

  importAdvEntityGroup(importString: string) {
    const lines = importString.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.advEntityGroupEditModel.advEntityItemModels.push(new AdvEntityItemModel(lines[i]));
    }
    this.importAdvEntityGroupModal.dismiss().then();
  }

  openEditAdvEntityModal(model: AdvEntityItemModel) {
    this.actualizeAdvEntityItemPositions();
    this.selectedAdvEntityItemModel = Object.assign({}, model);
    this.editAdvEntityItemModal.open().then();
  }

  onAdvEntityItemChanged(model: any) {
    for (let i = 0; i < this.advEntityGroupEditModel.advEntityItemModels.length; i++) {
      if (this.advEntityGroupEditModel.advEntityItemModels[i].entityItemUId === model.entityItemUId) {
        this.advEntityGroupEditModel.advEntityItemModels[i] = Object.assign({}, model);
      }
    }
    this.selectedAdvEntityItemModel = new AdvEntityItemModel;
    this.editAdvEntityItemModal.dismiss().then();
  }

  addNewAdvEntityItem() {
    const item = new AdvEntityItemModel();
    item.entityItemUId = this.advEntityGroupEditModel.advEntityItemModels.length.toString();
    this.advEntityGroupEditModel.advEntityItemModels.push(item);
  }

  actualizeAdvEntityItemPositions() {
    for (let i = 0; i < this.advEntityGroupEditModel.advEntityItemModels.length; i++) {
      this.advEntityGroupEditModel.advEntityItemModels[i].entityItemUId = i.toString();
    }
  }

  deleteAdvEntityItem(model: any) {
    for (let i = 0; i < this.advEntityGroupEditModel.advEntityItemModels.length; i++) {
      const item = this.advEntityGroupEditModel.advEntityItemModels[i];
      if (item.entityItemUId === model.entityItemUId) {
        this.advEntityGroupEditModel.advEntityItemModels.splice(i, 1);
      }
    }
    this.actualizeAdvEntityItemPositions();
  }
}
