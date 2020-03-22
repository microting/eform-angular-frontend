import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'eform-page-subheader',
  templateUrl: './eform-page-subheader.component.html',
  styleUrls: ['./eform-page-subheader.component.scss']
})
export class EformPageSubheaderComponent implements OnInit {

  @ViewChild(('heading'), {static: false}) heading: ElementRef;

  @Input() title = '';
  @Input() subtitle = '';
  @Input() heandingSizeRem = 2.5;

  constructor() { }

  ngOnInit() {
    this.heading.nativeElement.style.fontSize = `${this.heandingSizeRem}rem`;
  }
}
