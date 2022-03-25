import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AdvEntitySearchableGroupEditModel,
  AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel,
} from 'src/app/common/models';
import {
  EntitySearchService,
} from 'src/app/common/services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-entity-search-create',
  templateUrl: './entity-search-create.component.html',
  styleUrls: ['./entity-search-create.component.scss'],
})
export class EntitySearchCreateComponent implements OnInit {
  advEntitySearchableGroupCreateModel: AdvEntitySearchableGroupEditModel = new AdvEntitySearchableGroupEditModel();
  @ViewChild('modalSearchEditName', { static: true }) modalSearchEditName;
  selectedItem: AdvEntitySearchableItemModel = new AdvEntitySearchableItemModel();

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

  openModalSearchEditName(itemModel: AdvEntitySearchableItemModel) {
    this.selectedItem = itemModel;
    this.modalSearchEditName.show();
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

  updateItem(itemModel: AdvEntitySearchableItemModel) {
    this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.find(
      (x) => x.entityItemUId === itemModel.entityItemUId
    ).name = itemModel.name;
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
            entityItemUId: (lengthBeforeImport + i).toString()
          }
        );
      }
    }
  }
}
