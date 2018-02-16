import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {AdvEntitySearchableGroupEditModel, AdvEntitySearchableItemModel} from 'app/models/advanced';
import {EntitySearchService} from 'app/services';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'edit-entity-searchable-group',
  templateUrl: './edit-entity-searchable-group.component.html',
  styleUrls: ['./edit-entity-searchable-group.component.css']
})
export class EditEntitySearchableGroupComponent implements OnChanges {
  @Input() selectedId: string;
  advEntitySearchableGroupEditModel: AdvEntitySearchableGroupEditModel = new AdvEntitySearchableGroupEditModel();
  @Output() onLoading = new EventEmitter<boolean>();
  @Output() onEntitySearchableGroupChanged = new EventEmitter<void>();
  @ViewChild('editAdvEntitySearchableItemModal') editAdvEntitySearchableItemModal: ModalComponent;
  @ViewChild('importAdvEntitySearchableGroupModal') importAdvEntitySearchableGroupModal: ModalComponent;
  @ViewChild('createAdvEntitySearchableGroupModal') createAdvEntitySearchableGroupModal: ModalComponent;

  selectedAdvEntitySearchableItemModel: AdvEntitySearchableItemModel = new AdvEntitySearchableItemModel;
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
      this.entitySearchService.getEntitySearchableGroup(this.selectedId).subscribe((data) => {
        this.advEntitySearchableGroupEditModel.name = data.model.name;
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels = data.model.entityGroupItemLst;
        this.advEntitySearchableGroupEditModel.groupUid = this.selectedId;
      });
    } else {
      this.advEntitySearchableGroupEditModel = Object.assign({}, new AdvEntitySearchableGroupEditModel());
    }
  }

  createEntitySearchableGroup() {
    if (!this.advEntitySearchableGroupEditModel.name) {
      return;
    }
    this.actualizeAdvEntitySearchableItemPositions();
    this.spinnerStatus = true;
    this.onLoading.emit(true);
    if (this.advEntitySearchableGroupEditModel.groupUid) {
      this.entitySearchService.updateEntitySearchableGroup(this.advEntitySearchableGroupEditModel).subscribe((data) => {
        if (data.success) {
          this.notifyService.success({text: data.message});
          this.onEntitySearchableGroupChanged.emit();
        } else {
          this.notifyService.error({text: data.message});
        }
        this.spinnerStatus = false;
        this.onLoading.emit(false);
      });
    } else {
      this.entitySearchService.createEntitySearchableGroup(this.advEntitySearchableGroupEditModel).subscribe((data) => {
        if (data.success) {
          this.notifyService.success({text: data.message});
          this.onEntitySearchableGroupChanged.emit();
        } else {
          this.notifyService.error({text: data.message});
        }
        this.spinnerStatus = false;
        this.onLoading.emit(false);
      });
    }
  }

  showImportAdvEntitySearchableGroupModal() {
    this.importAdvEntitySearchableGroupModal.open().then();
  }

  onChildModalDismissed() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('modal-open');
  }

  importAdvEntitySearchableGroup(importString: string) {
    const lines = importString.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(new AdvEntitySearchableItemModel(lines[i]));
    }
    this.importAdvEntitySearchableGroupModal.dismiss().then();
  }

  openEditAdvEntitySearchableModal(model: AdvEntitySearchableItemModel) {
    this.actualizeAdvEntitySearchableItemPositions();
    this.selectedAdvEntitySearchableItemModel = Object.assign({}, model);
    this.editAdvEntitySearchableItemModal.open().then();
  }

  onAdvEntitySearchableItemChanged(model: any) {
    for (let i = 0; i < this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length; i++) {
      if (this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].entityItemUId === model.entityItemUId) {
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i] = Object.assign({}, model);
      }
    }
    this.selectedAdvEntitySearchableItemModel = new AdvEntitySearchableItemModel;
    this.editAdvEntitySearchableItemModal.dismiss().then();
  }

  addNewAdvEntitySearchableItem() {
    const item = new AdvEntitySearchableItemModel();
    debugger;
    item.entityItemUId = this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length.toString();
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(item);
  }

  actualizeAdvEntitySearchableItemPositions() {
    for (let i = 0; i < this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length; i++) {
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].entityItemUId = i.toString();
    }
  }

  deleteAdvEntitySearchableItem(model: any) {
    for (let i = 0; i < this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length; i++) {
      const item = this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i];
      if (item.entityItemUId === model.entityItemUId) {
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.splice(i, 1);
      }
    }
    this.actualizeAdvEntitySearchableItemPositions();
  }
}
