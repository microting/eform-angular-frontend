import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'subheader-pn',
  templateUrl: './subheader-pn.component.html',
  styleUrls: ['./subheader-pn.component.scss']
})
export class SubheaderPnComponent implements OnInit {

  @ViewChild('heading') heading: ElementRef;

  @Input() title = '';
  @Input() subtitle = '';
  @Input() heandingSizeRem = 2.5;

  constructor() { }

  ngOnInit() {
    this.heading.nativeElement.style.fontSize = `${this.heandingSizeRem}rem`;
  }
}
