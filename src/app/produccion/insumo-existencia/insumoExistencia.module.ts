import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { InsumoExistenciaAdminComponent } from './insumo-existencia-admin/insumo-existencia-admin.component';
import { InsumoExistenciaCreateComponent } from './insumo-existencia-create/insumo-existencia-create.component';
import { InsumoExistenciaDetailComponent } from './insumo-existencia-detail/insumo-existencia-detail.component';
import { InsumoExistenciaEditComponent } from './insumo-existencia-edit/insumo-existencia-edit.component';
import { InsumoExistenciaListComponent } from './insumo-existencia-list/insumo-existencia-list.component';
import { InsumoExistenciaDeleteComponent } from './insumo-existencia-delete/insumo-existencia-delete.component';

@NgModule({
  declarations: [
    InsumoExistenciaAdminComponent,
    InsumoExistenciaCreateComponent,
    InsumoExistenciaDetailComponent,
    InsumoExistenciaEditComponent,
    InsumoExistenciaListComponent,
    InsumoExistenciaDeleteComponent,
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
    InsumoExistenciaListComponent,
    InsumoExistenciaAdminComponent,
    InsumoExistenciaCreateComponent,
    InsumoExistenciaEditComponent,
    InsumoExistenciaDetailComponent,
    InsumoExistenciaDeleteComponent,
  ]
})
export class InsumoExistenciaModule { }
