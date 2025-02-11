import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FolderDto } from 'src/app/common/models/dto/folder.dto';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
    selector: 'app-eform-tree-view-picker',
    templateUrl: './eform-tree-view-picker.component.html',
    styleUrls: ['./eform-tree-view-picker.component.scss'],
    standalone: false
})
export class EformTreeViewPickerComponent implements OnChanges, OnDestroy {
  @Input() nodes: FolderDto[] = [];
  @Input() showActions = false;
  @Input() showCreateAction = true;
  @Input() showEditAction = true;
  @Input() showDeleteAction = true;
  @Input() focusedNodeId: number;
  @Input() lockSelectedNode = false;
  @Input() showCollapseButton = true;
  @Input() allowSelectingParents = true;
  @Output() createNode: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  @Output() editNode: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  @Output() deleteNode: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  @Output() nodeSelected: EventEmitter<FolderDto> = new EventEmitter<
    FolderDto
  >();
  collapsed = true;
  selectedFolderIds: number[] = [];

  private _transformer = (node: FolderDto, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id,
      microtingUId: node.microtingUId,
      description: node.description,
      createdAt: node.createdAt,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getLevel = (node: FlatNode) => node.level;

  folders = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  delete(folderId: number) {
    const folder =  this.flatten(this.nodes).find((node) => node.id === folderId)
    this.deleteNode.emit(folder);
  }

  edit(folderId: number) {
    const folder = this.flatten(this.nodes).find((node) => node.id === folderId)
    this.editNode.emit(folder);
  }

  createChild(folderId: number) {
    const folder =  this.flatten(this.nodes).find((node) => node.id === folderId)
    this.createNode.emit(folder);
  }

  selected(folderId: number) {
    if(!this.lockSelectedNode) {
      const folder = this.flatten(this.nodes).find((node) => node.id === folderId);
      this.nodeSelected.emit(folder);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.nodes && changes.nodes.currentValue){
      this.folders.data = changes.nodes.currentValue;
    }
    if (changes && changes.focusedNodeId && changes.focusedNodeId.currentValue) {
      this.selectedFolderIds = [];
      const flattenFolders = this.flatten(this.nodes).reverse();
      let findId = changes.focusedNodeId.currentValue;
      for (let i = 0; i < flattenFolders.length; i++) {
        if (flattenFolders[i].id === findId) {
          this.selectedFolderIds = [...this.selectedFolderIds, flattenFolders[i].id];
          findId = flattenFolders[i].parentId;
        }
      }
    }
  }

  flatten(array: FolderDto[]) {
    let returnArray = [...array];
    for(let i = 0; i < array.length; i++) {
      if(array[i].children) {
        returnArray = [...returnArray, ...this.flatten(array[i].children)];
      }/* else {
        returnArray = [...returnArray, ...array[i].children];
      }*/
    }
    return returnArray;
  }

  ngOnDestroy(): void {
  }
}
