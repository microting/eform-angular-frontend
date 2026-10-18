import {Component, Input, OnInit} from '@angular/core';
import {ElementDto} from 'src/app/common/models';
import { NgFor, NgIf } from '@angular/common';
import { EformCasesModule } from '../../eform-cases.module';

@Component({
    selector: 'app-case-edit-nav',
    templateUrl: './case-edit-nav.component.html',
    imports: [NgFor, NgIf, EformCasesModule]
})
export class CaseEditNavComponent implements OnInit {
  @Input() element: ElementDto = new ElementDto();
  ngOnInit(): void {
  }

  goToSection(location: string): void {
    window.location.hash = location;
    setTimeout(() => {
      document.querySelector(location).parentElement.scrollIntoView();
      return true;
    });
  }
}
