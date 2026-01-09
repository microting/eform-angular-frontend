import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

interface LicenseInfo {
  name: string;
  version: string;
  license: string;
  repository: string;
  licenseUrl?: string;
  licenseText?: string;
  loading?: boolean;
  error?: string;
  isDirect?: boolean;
  isNuGet?: boolean;
}

interface LicenseData {
  generated: string;
  totalPackages: number;
  directPackages: number;
  nugetPackages?: number;
  packages: LicenseInfo[];
}

@Component({
  selector: 'app-license-page',
  standalone: true,
  templateUrl: './license-page.component.html',
  styleUrls: ['./license-page.component.scss'],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    TranslateModule,
    FormsModule
  ]
})
export class LicensePageComponent implements OnInit {
  private http = inject(HttpClient);

  allLicenses: LicenseInfo[] = [];
  filteredLicenses: LicenseInfo[] = [];
  totalPackages = 0;
  directPackages = 0;
  nestedPackages = 0;
  npmPackages = 0;
  nugetPackages = 0;
  
  showFilter: 'all' | 'direct' | 'nested' = 'direct';
  searchQuery = '';
  loading = true;

  ngOnInit(): void {
    this.loadLicenses();
  }

  loadLicenses(): void {
    this.http.get<LicenseData>('/assets/licenses.json').subscribe({
      next: (data) => {
        this.allLicenses = data.packages;
        this.totalPackages = data.totalPackages;
        this.directPackages = data.directPackages;
        this.nestedPackages = data.totalPackages - data.directPackages;
        this.nugetPackages = data.nugetPackages || 0;
        this.npmPackages = data.totalPackages - this.nugetPackages;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load licenses', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = this.allLicenses;

    // Apply show filter
    if (this.showFilter === 'direct') {
      filtered = filtered.filter(l => l.isDirect);
    } else if (this.showFilter === 'nested') {
      filtered = filtered.filter(l => !l.isDirect);
    }

    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(query) ||
        l.license.toLowerCase().includes(query)
      );
    }

    this.filteredLicenses = filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  onFilterChange(filter: 'all' | 'direct' | 'nested'): void {
    this.showFilter = filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  onPanelOpened(license: LicenseInfo): void {
    if (!license.licenseText && !license.loading && !license.error && license.licenseUrl) {
      license.loading = true;
      this.http.get(license.licenseUrl, { responseType: 'text' }).subscribe({
        next: (text) => {
          license.licenseText = text;
          license.loading = false;
        },
        error: (err) => {
          license.error = 'Failed to load license text';
          license.loading = false;
        }
      });
    }
  }

  getPackageTypeLabel(license: LicenseInfo): string {
    return license.isNuGet ? 'NuGet' : 'npm';
  }

  getDependencyTypeLabel(license: LicenseInfo): string {
    return license.isDirect ? 'Direct' : 'Transitive';
  }
}
