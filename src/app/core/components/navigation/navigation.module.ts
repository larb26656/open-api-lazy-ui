import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { NavigationRoutes } from './navigation.routing';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  imports: [
    CommonModule,
    NavigationRoutes,
    MatToolbarModule
  ],
  declarations: [NavigationComponent]
})
export class NavigationModule { }
