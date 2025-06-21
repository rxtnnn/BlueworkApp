import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkersHomePageRoutingModule } from './workers-home-routing.module';

import { WorkersHomePage } from './workers-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkersHomePageRoutingModule
  ],
  declarations: [WorkersHomePage]
})
export class WorkersHomePageModule {}
