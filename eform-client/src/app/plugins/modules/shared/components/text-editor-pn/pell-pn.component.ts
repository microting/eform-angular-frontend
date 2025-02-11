import {
  Component,
  OnInit,
  OnChanges,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as pell from './pell-pn';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'pell-pn-editor',
    templateUrl: './pell-pn.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
           div p {
             margin: 0;
             padding: 0;
           }
         `,
    ],
    standalone: false
})
export class PellPnComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() actions: Array<Object> = [];
  @Input() value: String = '';
  @Output() valueChange = new EventEmitter();
  // pell = pell;
  html;
  editor;

  constructor() // private rd: Renderer2
  {}

  ngOnInit() {}

  @ViewChild('wysiwyg', { static: true }) wysiwyg: ElementRef;

  ngAfterViewInit() {
    this.wysiwygInit(this.wysiwyg.nativeElement, this.actions);
    this.editor.content.innerHTML = this.value;
  }

  ngOnChanges(changes: any) {
    try {
      if (this.editor.content.innerHTML !== this.value) {
        this.editor.content.innerHTML = this.value;
      }
    } catch (err) {}
  }

  wysiwygInit(elm, actions) {
    this.editor = pell.init({
      element: elm,
      onChange: (html) => {
        this.html = html;
        this.valueChange.emit(this.html);
      },
      defaultParagraphSeparator: 'br',
      styleWithCSS: false,
      actions: ['bold', 'underline', 'italic', 'strikethrough'].concat(actions),
      classes: {},
    });
  }
}
