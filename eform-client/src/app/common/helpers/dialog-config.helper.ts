import { Overlay } from '@angular/cdk/overlay';
import { MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';

export function dialogConfigHelper(overlay: Overlay, data?: any): MatDialogConfig {
  return {
    disableClose: true,
    minWidth: 300,
    scrollStrategy: overlay.scrollStrategies.reposition(),
    data: data,
  }
}
