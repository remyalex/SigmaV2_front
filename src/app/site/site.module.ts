import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteHomeComponent } from './site-home/site-home.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SiteHomeComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [SiteHomeComponent]
})
export class SiteModule { }
