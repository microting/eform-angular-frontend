import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SimpleTreeNode } from 'src/app/common/models';
import { FolderDto } from 'src/app/common/models/dto/folder.dto';
import { ITreeState, TreeComponent } from '@circlon/angular-tree-component';

@Component({
  selector: 'app-eform-tree-view-picker',
  templateUrl: './eform-tree-view-picker.component.html',
  styleUrls: ['./eform-tree-view-picker.component.scss'],
})
export class EformTreeViewPickerComponent implements OnChanges, OnDestroy {
  @ViewChild('tree') tree: TreeComponent;
  @Input() nodes: FolderDto[] = [];
  @Input() showActions = false;
  @Input() showCreateAction = true;
  @Input() showEditAction = true;
  @Input() showDeleteAction = true;
  @Input() focusedNodeId: number;
  @Output() createNode: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  @Output() editNode: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  @Output() deleteNode: EventEmitter<FolderDto> = new EventEmitter<FolderDto>();
  @Output() nodeSelected: EventEmitter<FolderDto> = new EventEmitter<
    FolderDto
  >();
  state: ITreeState;
  options = { animateExpand: true };
  collapsed = true;

  edit(e: any, node: FolderDto) {
    e.stopPropagation();
    this.editNode.emit(node);
  }

  createChild(e: any, node: FolderDto) {
    e.stopPropagation();
    this.createNode.emit(node);
  }

  delete(e: any, node: FolderDto) {
    e.stopPropagation();
    this.deleteNode.emit(node);
  }

  selected(node: FolderDto, isNodeActive: boolean) {
    this.nodeSelected.emit(isNodeActive ? node : null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.focusedNodeId) {
      const newNodeValue = changes.focusedNodeId.currentValue;
      if (newNodeValue) {
        setTimeout(() => {
          const foundNode = this.tree.treeModel.getNodeById(newNodeValue);
          foundNode.setActiveAndVisible();
        }, 500);
      } else {
        this.tree.treeModel.setActiveNode(null, null);
      }
    }
  }

  ngOnDestroy(): void {
  }
}
