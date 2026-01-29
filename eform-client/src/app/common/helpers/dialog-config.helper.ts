import { Overlay } from '@angular/cdk/overlay';
import { MatDialogConfig } from '@angular/material/dialog';

export function dialogConfigHelper(overlay: Overlay, data?: any): MatDialogConfig {
  return {
    disableClose: true,
    hasBackdrop: true,
    minWidth: 300,
    scrollStrategy: overlay.scrollStrategies.block(),
    data: data,
  }
}
