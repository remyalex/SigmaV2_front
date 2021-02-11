import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipocargueestructuraAdminComponent } from './tipocargueestructura-admin/tipocargueestructura-admin.component';
import { TipocargueestructuraCreateComponent } from './tipocargueestructura-create/tipocargueestructura-create.component';
import { TipocargueestructuraDetailComponent } from './tipocargueestructura-detail/tipocargueestructura-detail.component';
import { TipocargueestructuraEditComponent } from './tipocargueestructura-edit/tipocargueestructura-edit.component';
import { TipocargueestructuraListComponent } from './tipocargueestructura-list/tipocargueestructura-list.component';
import { TipocargueestructuraDeleteComponent } from './tipocargueestructura-delete/tipocargueestructura-delete.component';
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
    TipocargueestructuraAdminComponent,
    TipocargueestructuraCreateComponent,
    TipocargueestructuraDetailComponent,
    TipocargueestructuraEditComponent,
    TipocargueestructuraListComponent,
    TipocargueestructuraDeleteComponent,
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
    TipocargueestructuraListComponent,
    TipocargueestructuraAdminComponent,
    TipocargueestructuraCreateComponent,
    TipocargueestructuraEditComponent,
    TipocargueestructuraDetailComponent,
    TipocargueestructuraDeleteComponent,
  ]
})
export class TipocargueestructuraModule { }
