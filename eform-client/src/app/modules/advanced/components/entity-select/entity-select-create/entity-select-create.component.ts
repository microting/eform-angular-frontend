import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel,
} from 'src/app/common/models/advanced';
import { EntitySelectService } from 'src/app/common/services/advanced';
import { Location } from '@angular/common';

@Component({
  selector: 'app-entity-select-create',
  templateUrl: './entity-select-create.component.html',
  styleUrls: ['./entity-select-create.component.scss'],
})
export class EntitySelectCreateComponent implements OnInit {
  advEntitySelectableGroupCreateModel: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  @ViewChild('modalSelectEditName', { static: true }) modalSelectEditName;
  selectedItem: AdvEntitySelectableItemModel = new AdvEntitySelectableItemModel();

  items = [];

  constructor(
    private entitySelectService: EntitySelectService,
    private location: Location
  ) {}

  ngOnInit() {}

  show() {
    this.advEntitySelectableGroupCreateModel.name = '';
    this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels = [];
  }

  openModalSelectEditName(itemModel: AdvEntitySelectableItemModel) {
    this.selectedItem = itemModel;
    this.modalSelectEditName.show();
  }

  createEntitySelectableGroup() {
    this.entitySelectService
      .createEntitySelectableGroup(this.advEntitySelectableGroupCreateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.advEntitySelectableGroupCreateModel = new AdvEntitySelectableGroupEditModel();
          this.location.back();
        }
      });
  }

  goBack() {
    // window.history.back();
    this.location.back();
    console.debug('goBack()...');
  }

  addNewAdvEntitySelectableItem() {
    const item = new AdvEntitySelectableItemModel();
    item.entityItemUId = this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.length.toString();
    this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.push(
      item
    );
  }

  updateItem(itemModel: AdvEntitySelectableItemModel) {
    this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.find(
      (x) => x.entityItemUId === itemModel.entityItemUId
    ).name = itemModel.name;
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      const lengthBeforeImport = this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.length;
      for (let i = 0; i < lines.length; i++) {
        this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.push(
          {
            description: '',
            displayIndex: lengthBeforeImport + i,
            workflowState: '',
            name: lines[i],
            entityItemUId: (lengthBeforeImport + i).toString()
          }
        );
      }
    }
  }
}
