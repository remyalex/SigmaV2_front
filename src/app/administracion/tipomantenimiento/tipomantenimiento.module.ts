import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipomantenimientoAdminComponent } from './tipomantenimiento-admin/tipomantenimiento-admin.component';
import { TipomantenimientoCreateComponent } from './tipomantenimiento-create/tipomantenimiento-create.component';
import { TipomantenimientoDetailComponent } from './tipomantenimiento-detail/tipomantenimiento-detail.component';
import { TipomantenimientoEditComponent } from './tipomantenimiento-edit/tipomantenimiento-edit.component';
import { TipomantenimientoListComponent } from './tipomantenimiento-list/tipomantenimiento-list.component';
import { TipomantenimientoDeleteComponent } from './tipomantenimiento-delete/tipomantenimiento-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    TipomantenimientoAdminComponent,
    TipomantenimientoCreateComponent,
    TipomantenimientoDetailComponent,
    TipomantenimientoEditComponent,
    TipomantenimientoListComponent,
    TipomantenimientoDeleteComponent,
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
    SeguridadModule
  ],
  exports: [
    TipomantenimientoListComponent,
    TipomantenimientoAdminComponent,
    TipomantenimientoCreateComponent,
    TipomantenimientoEditComponent,
    TipomantenimientoDetailComponent,
    TipomantenimientoDeleteComponent,
  ]
})
export class TipomantenimientoModule { }
