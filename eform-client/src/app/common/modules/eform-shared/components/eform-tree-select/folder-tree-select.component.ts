import {Component, Input, Output, EventEmitter, OnChanges, ViewChild} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FolderDto } from 'src/app/common/models';
import {TranslateModule} from '@ngx-translate/core';
import {MtxSelect} from '@ng-matero/extensions/select';
import {ReactiveFormsModule} from '@angular/forms';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: number;
  microtingUId: number;
  parentId?: number;
}

@Component({
  selector: 'app-folder-tree-select',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './folder-tree-select.component.html',
  styleUrls: ['./folder-tree-select.component.scss']
})
export class FolderTreeSelectComponent implements OnChanges {
  @Input() nodes: FolderDto[] = [];
  @Input() selectedNodeId: number | null = null;
  @Input() disabled = false;

  @Output() nodeSelected = new EventEmitter<FolderDto>();

  @ViewChild(MatSelect) matSelect: MatSelect;

  selectedNodeName: string = '';
  compareById = (a: number, b: number) => a === b;

  private transformer = (node: FolderDto, level: number): FlatNode => ({
    expandable: !!node.children?.length,
    name: node.name,
    id: node.id,
    microtingUId: node.microtingUId,
    parentId: node.parentId,
    level
  });

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnChanges() {
    this.dataSource.data = this.nodes;

    if (this.selectedNodeId != null) {
      const flat = this.flatten(this.nodes);
      const selected = flat.find(x => x.id === this.selectedNodeId);
      this.selectedNodeId = selected.id;
      this.selectedNodeName = selected?.name || '';
    }
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  selectNode(node: FlatNode) {
    const folder = this.flatten(this.nodes).find(x => x.id === node.id);
    if (!folder) {return;}

    this.selectedNodeId = node.id;
    this.selectedNodeName = folder.name;
    this.nodeSelected.emit(folder);
    this.matSelect.close();
  }


  onPanelOpened(open: boolean) {
    if (open) {
      this.treeControl.expandAll();
    }
  }

  flatten(array: FolderDto[]): FolderDto[] {
    let result: FolderDto[] = [...array];
    array.forEach(x => {
      if (x.children) {result = [...result, ...this.flatten(x.children)];}
    });
    return result;
  }
}
