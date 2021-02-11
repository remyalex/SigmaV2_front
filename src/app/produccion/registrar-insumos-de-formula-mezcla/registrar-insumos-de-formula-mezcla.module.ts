import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaEditComponent } from './registrar-insumos-de-formula-mezcla-edit/registrar-insumos-de-formula-mezcla-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
// tslint:disable-next-line: max-line-length
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaDetailComponent } from './registrar-insumos-de-formula-mezcla-detail/registrar-insumos-de-formula-mezcla-detail.component';

export const UMV_DATES_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@NgModule({
  declarations: [
    RegistrarInsumoFormulaMezclaEditComponent,
    RegistrarInsumoFormulaMezclaDetailComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
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
    RegistrarInsumoFormulaMezclaEditComponent,
    RegistrarInsumoFormulaMezclaDetailComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'co' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: UMV_DATES_FORMATS },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
})
export class RegistrarInsumosFormulaMezclaModule { }
