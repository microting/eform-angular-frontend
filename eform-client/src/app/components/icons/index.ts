import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { CUSTOM_ICONS } from './icons';

@Injectable({ providedIn: 'root' })
class IconService {
  constructor(private registry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  register(): void {
    Object.entries(CUSTOM_ICONS).forEach(([name, svg]) => {
      this.registry.addSvgIconLiteral(
        name,
        this.sanitizer.bypassSecurityTrustHtml(svg)
      );
    });
  }
}

export default IconService
