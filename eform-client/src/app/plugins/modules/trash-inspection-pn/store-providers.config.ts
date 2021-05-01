import { fractionsPersistProvider } from './components/fractions/store/fractions-store';
import { installationsPersistProvider } from './components/installations/store/installations-store';
import { fractionsReportPreviewTablePersistProvider } from './components/reports/fractions-report-preview-table/store/fractions-report-preview-table-store';
import { producersReportPreviewTablePersistProvider } from './components/reports/producers-report-preview-table/store/producers-report-preview-table-store';
import { transportersReportPreviewTablePersistProvider } from './components/reports/transporters-report-preview-table/store/transporters-report-preview-table-store';
import { segmentsPersistProvider } from './components/segments/store/segments-store';
import { trashInspectionPersistProvider } from './components/trash-inspections/store/trash-inspections-store';

export const trashInspectionStoreProviders = [
  fractionsPersistProvider,
  installationsPersistProvider,
  fractionsReportPreviewTablePersistProvider,
  producersReportPreviewTablePersistProvider,
  transportersReportPreviewTablePersistProvider,
  segmentsPersistProvider,
  trashInspectionPersistProvider,
];
