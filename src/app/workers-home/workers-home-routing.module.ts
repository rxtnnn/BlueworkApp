import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkersHomePage } from './workers-home.page';

const routes: Routes = [
  {
    path: '',
    component: WorkersHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkersHomePageRoutingModule {}
