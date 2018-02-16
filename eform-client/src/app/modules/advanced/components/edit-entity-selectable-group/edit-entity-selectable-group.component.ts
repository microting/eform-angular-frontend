import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {AdvEntitySelectableGroupEditModel, AdvEntitySelectableItemModel} from 'app/models/advanced';
import {EntitySelectService} from 'app/services';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'edit-entity-selectable-group',
  templateUrl: './edit-entity-selectable-group.component.html',
  styleUrls: ['./edit-entity-selectable-group.component.css']
})
export class EditEntitySelectableGroupComponent implements OnChanges {
  @Input() selectedId: string;
  advEntitySelectableGroupEditModel: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  @Output() onLoading = new EventEmitter<boolean>();
  @Output() onEntitySelectableGroupChanged = new EventEmitter<void>();
  @ViewChild('editAdvEntitySelectableItemModal') editAdvEntitySelectableItemModal: ModalComponent;
  @ViewChild('importAdvEntitySelectableGroupModal') importAdvEntitySelectableGroupModal: ModalComponent;
  @ViewChild('createAdvEntitySelectableGroupModal') createAdvEntitySelectableGroupModal: ModalComponent;

  selectedAdvEntitySelectableItemModel: AdvEntitySelectableItemModel = new AdvEntitySelectableItemModel;
  spinnerStatus: boolean;

  constructor(private entitySelectService: EntitySelectService, private notifyService: NotifyService) {
  }

  ngOnChanges(changes) {
    if (changes.selectedId) {
      this.loadEntitySelectableGroup();
    }
  }

  loadEntitySelectableGroup() {
    if (this.selectedId) {
      this.entitySelectService.getEntitySelectableGroup(this.selectedId).subscribe((data) => {
        this.advEntitySelectableGroupEditModel.name = data.model.name;
        this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels = data.model.entityGroupItemLst;
        this.advEntitySelectableGroupEditModel.groupUid = this.selectedId;
      });
    } else {
      this.advEntitySelectableGroupEditModel = Object.assign({}, new AdvEntitySelectableGroupEditModel());
    }
  }

  createEntitySelectableGroup() {
    if (!this.advEntitySelectableGroupEditModel.name) {
      return;
    }
    this.actualizeAdvEntitySelectableItemPositions();
    this.spinnerStatus = true;
    this.onLoading.emit(true);
    if (this.advEntitySelectableGroupEditModel.groupUid) {
      this.entitySelectService.updateEntitySelectableGroup(this.advEntitySelectableGroupEditModel).subscribe((data) => {
        if (data.success) {
          this.notifyService.success({text: data.message});
          this.onEntitySelectableGroupChanged.emit();
        } else {
          this.notifyService.error({text: data.message});
        }
        this.spinnerStatus = false;
        this.onLoading.emit(false);
      });
    } else {
      this.entitySelectService.createEntitySelectableGroup(this.advEntitySelectableGroupEditModel).subscribe((data) => {
        if (data.success) {
          this.notifyService.success({text: data.message});
          this.onEntitySelectableGroupChanged.emit();
        } else {
          this.notifyService.error({text: data.message});
        }
        this.spinnerStatus = false;
        this.onLoading.emit(false);
      });
    }
  }

  showImportAdvEntitySelectableGroupModal() {
    this.importAdvEntitySelectableGroupModal.open().then();
  }

  onChildModalDismissed() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('modal-open');
  }

  importAdvEntitySelectableGroup(importString: string) {
    const lines = importString.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.push(new AdvEntitySelectableItemModel(lines[i]));
    }
    this.importAdvEntitySelectableGroupModal.dismiss().then();
  }

  openEditAdvEntitySelectableModal(model: AdvEntitySelectableItemModel) {
    this.actualizeAdvEntitySelectableItemPositions();
    this.selectedAdvEntitySelectableItemModel = Object.assign({}, model);
    this.editAdvEntitySelectableItemModal.open().then();
  }

  onAdvEntitySelectableItemChanged(model: any) {
    for (let i = 0; i < this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length; i++) {
      if (this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels[i].entityItemUId === model.entityItemUId) {
        this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels[i] = Object.assign({}, model);
      }
    }
    this.selectedAdvEntitySelectableItemModel = new AdvEntitySelectableItemModel;
    this.editAdvEntitySelectableItemModal.dismiss().then();
  }

  addNewAdvEntitySelectableItem() {
    const item = new AdvEntitySelectableItemModel();
    item.entityItemUId = this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length.toString();
    this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.push(item);
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length; i++) {
      this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels[i].entityItemUId = i.toString();
    }
  }

  deleteAdvEntitySelectableItem(model: any) {
    for (let i = 0; i < this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length; i++) {
      const item = this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels[i];
      if (item.entityItemUId === model.entityItemUId) {
        this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.splice(i, 1);
      }
    }
    this.actualizeAdvEntitySelectableItemPositions();
  }
}
