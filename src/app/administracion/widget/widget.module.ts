import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetAdminComponent } from './widget-admin/widget-admin.component';
import { WidgetCreateComponent } from './widget-create/widget-create.component';
import { WidgetDetailComponent } from './widget-detail/widget-detail.component';
import { WidgetEditComponent } from './widget-edit/widget-edit.component';
import { WidgetListComponent } from './widget-list/widget-list.component';
import { WidgetDeleteComponent } from './widget-delete/widget-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    WidgetAdminComponent,
    WidgetCreateComponent,
    WidgetDetailComponent,
    WidgetEditComponent,
    WidgetListComponent,
    WidgetDeleteComponent,
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
    WidgetListComponent,
    WidgetAdminComponent,
    WidgetCreateComponent,
    WidgetEditComponent,
    WidgetDetailComponent,
    WidgetDeleteComponent,
  ]
})
export class WidgetModule { }
