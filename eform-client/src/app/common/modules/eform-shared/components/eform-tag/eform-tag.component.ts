import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SharedTagModel} from 'src/app/common/models';

@Component({
    selector: 'app-eform-tag',
    templateUrl: './eform-tag.component.html',
    styleUrls: ['./eform-tag.component.scss'],
    standalone: false
})
export class EformTagComponent implements OnInit {
  constructor() { }

  @Input() tags: SharedTagModel[] = [];
  @Input() id: string = '';
  @Output() clickOnTag: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
  }

  onClickTag(id: number) {
    this.clickOnTag.emit(id);
  }
}
