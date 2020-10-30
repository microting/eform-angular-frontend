import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserClaimsEnum } from 'src/app/common/const';
import { ClaimsGuard } from 'src/app/common/guards/claims.guard';
import { NavigationMenuPageComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: NavigationMenuPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavigationMenuRouting {}
