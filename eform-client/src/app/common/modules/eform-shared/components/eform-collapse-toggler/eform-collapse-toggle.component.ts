import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-eform-collapse-toggle',
    templateUrl: './eform-collapse-toggle.component.html',
    styleUrls: ['./eform-collapse-toggle.component.scss'],
    standalone: false
})
export class EformCollapseToggleComponent implements OnInit {
  @Input() collapse: any;
  @Input() collapsed: boolean;
  @Output() collapseUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  onCollapse() {
    this.collapse.toggle();
    this.collapseUpdate.emit(!this.collapsed);
  }
}
