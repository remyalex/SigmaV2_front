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

import { TransicioncondicionesAdminComponent } from './transicioncondiciones-admin/transicioncondiciones-admin.component';
import { TransicioncondicionesListComponent } from './transicioncondiciones-list/transicioncondiciones-list.component';
import { TransicioncondicionesCreateComponent } from './transicioncondiciones-create/transicioncondiciones-create.component';
import { ValorInputComponent } from './valor-input/valor-input.component';
import { TransicioncondicionesEditComponent } from './transicioncondiciones-edit/transicioncondiciones-edit.component';
import { TransicioncondicionesDeleteComponent } from './transicioncondiciones-delete/transicioncondiciones-delete.component';

@NgModule({
  declarations: [TransicioncondicionesAdminComponent, TransicioncondicionesListComponent, TransicioncondicionesCreateComponent, ValorInputComponent, TransicioncondicionesEditComponent, TransicioncondicionesDeleteComponent],
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
    TransicioncondicionesAdminComponent,
    TransicioncondicionesCreateComponent,
    TransicioncondicionesEditComponent
  ],
  entryComponents: [
    TransicioncondicionesEditComponent,
    TransicioncondicionesDeleteComponent
  ]
})
export class TransicioncondicionesModule { }
