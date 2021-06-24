import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EformVisualEditorCollapseService {
  public collapse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  updateState(collapsed: boolean): void {
    this.collapse.next(collapsed);
  }
}
