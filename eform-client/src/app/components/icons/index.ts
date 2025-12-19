import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { CUSTOM_ICONS } from './icons';
import {
  WordIcon,
  CodeIcon,
  CsvIcon,
  FileUploadIcon,
  ExcelIcon,
  PdfIcon,
  PasswordValidationIcon,
  AndroidIcon,
  iOSIcon
} from 'src/app/common/const';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(private registry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  register(): void {
    // Register custom icons from icons.ts
    Object.entries(CUSTOM_ICONS).forEach(([name, svg]) => {
      this.registry.addSvgIconLiteral(
        name,
        this.sanitizer.bypassSecurityTrustHtml(svg)
      );
    });

    // Register icons from icons.const.ts
    const globalIcons = {
      'file-word': WordIcon,
      'file-code': CodeIcon,
      'file-csv': CsvIcon,
      'file-upload': FileUploadIcon,
      'file-excel': ExcelIcon,
      'file-pdf': PdfIcon,
      'password-validation': PasswordValidationIcon,
      'android-icon': AndroidIcon,
      'ios-icon': iOSIcon,
    };

    Object.entries(globalIcons).forEach(([name, svg]) => {
      this.registry.addSvgIconLiteral(
        name,
        this.sanitizer.bypassSecurityTrustHtml(svg)
      );
    });
  }
}
