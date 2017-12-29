import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
  // and so on...
} from "@angular/material";

const MAT_MODULES  = [
  LayoutModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
  // and so on...
];

@NgModule({
  imports: MAT_MODULES,
  exports: MAT_MODULES,
  declarations: []
})
export class MyMaterialModule { }
