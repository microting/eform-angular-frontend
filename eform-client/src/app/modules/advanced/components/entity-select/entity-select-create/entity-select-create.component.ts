import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AdvEntitySearchableItemModel,
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel,
} from 'src/app/common/models/advanced';
import { EntitySelectService } from 'src/app/common/services/advanced';
import { Location } from '@angular/common';
import {EntityItemEditNameComponent} from 'src/app/common/modules/eform-shared/components';
import {getRandomInt} from 'src/app/common/helpers';

@Component({
  selector: 'app-entity-select-create',
  templateUrl: './entity-select-create.component.html',
  styleUrls: ['./entity-select-create.component.scss'],
})
export class EntitySelectCreateComponent implements OnInit {
  advEntitySelectableGroupCreateModel: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  @ViewChild('modalNameEdit', { static: true }) modalNameEdit: EntityItemEditNameComponent;

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
            entityItemUId: (lengthBeforeImport + i).toString(),
            tempId: this.getRandId(),
          }
        );
      }
    }
  }

  onItemUpdated(model: AdvEntitySelectableItemModel) {
    const index = this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels
      .findIndex(x => x.entityItemUId === model.entityItemUId);
    if (index !== -1) {
      this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels[index] = model;
    }
  }

  onOpenEditNameModal(model: AdvEntitySearchableItemModel) {
    this.modalNameEdit.show(model);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }
}
