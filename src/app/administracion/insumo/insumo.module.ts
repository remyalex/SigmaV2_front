import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsumoAdminComponent } from './insumo-admin/insumo-admin.component';
import { InsumoCreateComponent } from './insumo-create/insumo-create.component';
import { InsumoDetailComponent } from './insumo-detail/insumo-detail.component';
import { InsumoEditComponent } from './insumo-edit/insumo-edit.component';
import { InsumoListComponent } from './insumo-list/insumo-list.component';
import { InsumoDeleteComponent } from './insumo-delete/insumo-delete.component';
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
    InsumoAdminComponent,
    InsumoCreateComponent,
    InsumoDetailComponent,
    InsumoEditComponent,
    InsumoListComponent,
    InsumoDeleteComponent,
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
    InsumoListComponent,
    InsumoAdminComponent,
    InsumoCreateComponent,
    InsumoEditComponent,
    InsumoDetailComponent,
    InsumoDeleteComponent,
  ]
})
export class InsumoModule { }
