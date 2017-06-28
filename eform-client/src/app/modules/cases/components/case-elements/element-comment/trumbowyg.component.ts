// Fixed from https://github.com/MuhammedHasan/ng2-trumbowyg
import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'trumbowyg-editor',
  template: `
    <div class="trumbowyg-editor"></div>`,
})
export class TrumbowygComponent implements OnInit {
  elementRef: ElementRef;
  ele: any;
  @Input() content: String;
  @Output() contentChange: EventEmitter<string>;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
    this.contentChange = new EventEmitter();
  }

  ngOnInit() {
    this.ele = jQuery(this.elementRef.nativeElement).find('.trumbowyg-editor');
    this.ele.trumbowyg({
      svgPath: '/assets/svg/icons.svg',
      fullscreenable: false,
      semantic: false,
      btns: ['bold', 'italic', 'underline'],
      tagsToRemove: ['a', 'h1', 'h2', 'h3', 'h4'],
      inlineElementsSelector: 'b, i, u',
      resetCss: true,
      removeformatPasted: true,
    }).on('tbwchange', () =>
      this.contentChange.emit(this.ele.trumbowyg('html')));

    this.ele.trumbowyg('html', this.content);
  }
}
