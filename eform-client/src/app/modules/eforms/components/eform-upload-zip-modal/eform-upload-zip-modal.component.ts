import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-eform-upload-zip-modal',
  templateUrl: './eform-upload-zip-modal.component.html',
  styleUrls: ['./eform-upload-zip-modal.component.scss']
})
export class EformUploadZipModalComponent implements OnInit {

  @ViewChild('frame') frame;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

}
