import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployerHomePage } from './employer-home.page';

const routes: Routes = [
  {
    path: '',
    component: EmployerHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployerHomePageRoutingModule {}
