import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading = new BehaviorSubject(false);
  constructor() {}

  setLoading(isLoading: boolean) {
    this._isLoading.next(isLoading);
  }

  get isLoading() {
    return this._isLoading.asObservable();
  }
}
