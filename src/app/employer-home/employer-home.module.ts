import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployerHomePageRoutingModule } from './employer-home-routing.module';

import { EmployerHomePage } from './employer-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EmployerHomePageRoutingModule
  ],
  declarations: [EmployerHomePage]
})
export class EmployerHomePageModule {}
