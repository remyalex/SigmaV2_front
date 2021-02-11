import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LugarAdminComponent } from './lugar-admin/lugar-admin.component';
import { LugarCreateComponent } from './lugar-create/lugar-create.component';
import { LugarDetailComponent } from './lugar-detail/lugar-detail.component';
import { LugarEditComponent } from './lugar-edit/lugar-edit.component';
import { LugarListComponent } from './lugar-list/lugar-list.component';
import { LugarDeleteComponent } from './lugar-delete/lugar-delete.component';
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
    LugarAdminComponent,
    LugarCreateComponent,
    LugarDetailComponent,
    LugarEditComponent,
    LugarListComponent,
    LugarDeleteComponent,
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
    LugarListComponent,
    LugarAdminComponent,
    LugarCreateComponent,
    LugarEditComponent,
    LugarDetailComponent,
    LugarDeleteComponent,
  ],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'co' },
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: UMV_DATES_FORMATS }
    ],
})
export class LugarModule { }
