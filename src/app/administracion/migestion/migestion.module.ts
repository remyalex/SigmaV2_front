import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { MiGestionListComponent } from './migestion-list/migestion-list.component';
import { MiGestionAdminComponent } from './migestion-admin/migestion-admin.component';
import { MiGestionWidgetComponent } from './migestion-widget/migestion-widget.component';

@NgModule({
  declarations: [
    MiGestionListComponent,
    MiGestionAdminComponent,
    MiGestionWidgetComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    PipesModule,
    HttpClientModule,
    NgxDatatableModule,
    SharedModule,
    SeguridadModule,
  ],
  exports: [
    MiGestionListComponent,
    MiGestionAdminComponent,
    MiGestionWidgetComponent
  ]
})
export class MiGestionModule { }
