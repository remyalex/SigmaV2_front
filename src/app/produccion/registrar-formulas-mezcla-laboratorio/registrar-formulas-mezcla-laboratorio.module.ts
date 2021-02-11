import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulaMezclaLaboratorioComponent } from './registrar-formulas-mezcla-laboratorio/registrar-formulas-mezcla-laboratorio.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioCreateComponent } from './registrar-formulas-mezcla-laboratorio-create/registrar-formulas-mezcla-laboratorio-create.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioDetailComponent } from './registrar-formulas-mezcla-laboratorio-detail/registrar-formulas-mezcla-laboratorio-detail.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioEditComponent } from './registrar-formulas-mezcla-laboratorio-edit/registrar-formulas-mezcla-laboratorio-edit.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioListComponent } from './registrar-formulas-mezcla-laboratorio-list/registrar-formulas-mezcla-laboratorio-list.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioDeleteComponent } from './registrar-formulas-mezcla-laboratorio-delete/registrar-formulas-mezcla-laboratorio-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaEditComponent } from '../registrar-insumos-de-formula-mezcla/registrar-insumos-de-formula-mezcla-edit/registrar-insumos-de-formula-mezcla-edit.component';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaDetailComponent } from '../registrar-insumos-de-formula-mezcla/registrar-insumos-de-formula-mezcla-detail/registrar-insumos-de-formula-mezcla-detail.component';
import { RegistrarInsumosFormulaMezclaModule } from '../registrar-insumos-de-formula-mezcla/registrar-insumos-de-formula-mezcla.module';

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
    FormulaMezclaLaboratorioComponent,
    FormulaMezclaLaboratorioCreateComponent,
    FormulaMezclaLaboratorioDetailComponent,
    FormulaMezclaLaboratorioEditComponent,
    FormulaMezclaLaboratorioListComponent,
    FormulaMezclaLaboratorioDeleteComponent
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
    RegistrarInsumosFormulaMezclaModule
  ],
  exports: [
    FormulaMezclaLaboratorioListComponent,
    FormulaMezclaLaboratorioComponent,
    FormulaMezclaLaboratorioCreateComponent,
    FormulaMezclaLaboratorioEditComponent,
    FormulaMezclaLaboratorioDetailComponent,
    FormulaMezclaLaboratorioDeleteComponent,
  ],
  entryComponents: [
    RegistrarInsumoFormulaMezclaEditComponent,
    RegistrarInsumoFormulaMezclaDetailComponent,
  ],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'co' },
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: UMV_DATES_FORMATS }
    ],
})
export class FormulaMezclaLaboratorioModule { }
