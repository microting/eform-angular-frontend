import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AdvEntitySearchableGroupEditModel, AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel,
} from 'src/app/common/models';
import {
  EntitySearchService,
} from 'src/app/common/services';
import { Location } from '@angular/common';
import {EntityItemEditNameComponent} from 'src/app/common/modules/eform-shared/components';
import {getRandomInt} from 'src/app/common/helpers';

@Component({
  selector: 'app-entity-search-create',
  templateUrl: './entity-search-create.component.html',
  styleUrls: ['./entity-search-create.component.scss'],
})
export class EntitySearchCreateComponent implements OnInit {
  advEntitySearchableGroupCreateModel: AdvEntitySearchableGroupEditModel = new AdvEntitySearchableGroupEditModel();
  @ViewChild('modalNameEdit', { static: true }) modalNameEdit: EntityItemEditNameComponent;

  items = [];

  constructor(
    private entitySearchService: EntitySearchService,
    private location: Location
  ) {}

  ngOnInit() {}

  show() {
    this.advEntitySearchableGroupCreateModel.name = '';
    this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels = [];
  }

  createEntitySearchableGroup() {
    this.entitySearchService
      .createEntitySearchableGroup(this.advEntitySearchableGroupCreateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.advEntitySearchableGroupCreateModel = new AdvEntitySearchableGroupEditModel();
          // this.frame.hide();
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
    item.entityItemUId = this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.length.toString();
    this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.push(
      item
    );
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      const lengthBeforeImport = this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.length;
      for (let i = 0; i < lines.length; i++) {
        this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.push(
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
  onItemUpdated(model: AdvEntitySearchableItemModel) {
    const index = this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels
      .findIndex(x => x.entityItemUId === model.entityItemUId);
    if (index !== -1) {
      this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels[index] = model;
    }
  }

  onOpenEditNameModal(model: AdvEntitySearchableItemModel) {
    this.modalNameEdit.show(model);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }
}
