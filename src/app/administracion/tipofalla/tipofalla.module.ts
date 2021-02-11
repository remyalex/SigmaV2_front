import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipofallaAdminComponent } from './tipofalla-admin/tipofalla-admin.component';
import { TipofallaCreateComponent } from './tipofalla-create/tipofalla-create.component';
import { TipofallaDetailComponent } from './tipofalla-detail/tipofalla-detail.component';
import { TipofallaEditComponent } from './tipofalla-edit/tipofalla-edit.component';
import { TipofallaListComponent } from './tipofalla-list/tipofalla-list.component';
import { TipofallaDeleteComponent } from './tipofalla-delete/tipofalla-delete.component';
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
    TipofallaAdminComponent,
    TipofallaCreateComponent,
    TipofallaDetailComponent,
    TipofallaEditComponent,
    TipofallaListComponent,
    TipofallaDeleteComponent,
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
    TipofallaListComponent,
    TipofallaAdminComponent,
    TipofallaCreateComponent,
    TipofallaEditComponent,
    TipofallaDetailComponent,
    TipofallaDeleteComponent,
  ]
})
export class TipofallaModule { }
