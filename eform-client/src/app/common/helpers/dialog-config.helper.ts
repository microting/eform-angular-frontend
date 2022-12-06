import { Overlay } from '@angular/cdk/overlay';
import { MatDialogConfig } from '@angular/material/dialog';

export function dialogConfigHelper(overlay: Overlay, data?: any): MatDialogConfig {
  return {
    disableClose: true,
    minWidth: 300,
    scrollStrategy: overlay.scrollStrategies.reposition(),
    data: data,
  }
}
