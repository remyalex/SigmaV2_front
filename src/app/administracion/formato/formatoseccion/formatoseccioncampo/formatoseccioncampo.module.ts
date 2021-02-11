import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatoseccioncampoAdminComponent } from './formatoseccioncampo-admin/formatoseccioncampo-admin.component';
import { FormatoseccioncampoCreateComponent } from './formatoseccioncampo-create/formatoseccioncampo-create.component';
import { FormatoseccioncampoDetailComponent } from './formatoseccioncampo-detail/formatoseccioncampo-detail.component';
import { FormatoseccioncampoEditComponent } from './formatoseccioncampo-edit/formatoseccioncampo-edit.component';
import { FormatoseccioncampoListComponent } from './formatoseccioncampo-list/formatoseccioncampo-list.component';
import { FormatoseccioncampoDeleteComponent } from './formatoseccioncampo-delete/formatoseccioncampo-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    FormatoseccioncampoAdminComponent,
    FormatoseccioncampoCreateComponent,
    FormatoseccioncampoDetailComponent,
    FormatoseccioncampoEditComponent,
    FormatoseccioncampoListComponent,
    FormatoseccioncampoDeleteComponent,
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
    FormatoseccioncampoListComponent,
    FormatoseccioncampoAdminComponent,
    FormatoseccioncampoCreateComponent,
    FormatoseccioncampoEditComponent,
    FormatoseccioncampoDetailComponent,
    FormatoseccioncampoDeleteComponent,
  ]
})
export class FormatoseccioncampoModule { }
