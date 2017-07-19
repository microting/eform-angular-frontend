import {Injectable} from '@angular/core';
// import PNotify from 'pnotify';
import 'pnotify/dist/pnotify.css';
import 'pnotify/dist/pnotify.buttons.js';
import 'pnotify/dist/pnotify.buttons.css';

declare const PNotify: any;

@Injectable()
export class NotifyService {
  pnotifySettings: any;
  isDesktop = false;

  constructor() {
    this.pnotifySettings = Object.assign({styling: 'bootstrap3'}, {});

    if (typeof this.pnotifySettings.styling === 'undefined') {
      throw new Error('pnotifySettings.styling must be a string');
    }
  }

  private desktop() {
    PNotify.desktop.permission();
    this.isDesktop = true;
  }

  private pnotify(opts) {
    opts.styling = this.pnotifySettings.styling;
    if (this.isDesktop) {
      opts.desktop = opts.desktop || {};
      opts.desktop.desktop = true;
    }
    return new PNotify(opts);
  }

  success(opts) {
    opts.type = 'success';
    return this.pnotify(opts);
  }

  notice(opts) {
    opts.type = 'notice';
    return this.pnotify(opts);
  }

  error(opts) {
    opts.type = 'error';
    return this.pnotify(opts);
  }

  info(opts) {
    opts.type = 'info';
    return this.pnotify(opts);
  }
}
