import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipocargueAdminComponent } from './tipocargue-admin/tipocargue-admin.component';
import { TipocargueCreateComponent } from './tipocargue-create/tipocargue-create.component';
import { TipocargueDetailComponent } from './tipocargue-detail/tipocargue-detail.component';
import { TipocargueEditComponent } from './tipocargue-edit/tipocargue-edit.component';
import { TipocargueListComponent } from './tipocargue-list/tipocargue-list.component';
import { TipocargueDeleteComponent } from './tipocargue-delete/tipocargue-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { TipocargueestructuraModule } from '../tipocargueestructura/tipocargueestructura.module';

@NgModule({
  declarations: [
    TipocargueAdminComponent,
    TipocargueCreateComponent,
    TipocargueDetailComponent,
    TipocargueEditComponent,
    TipocargueListComponent,
    TipocargueDeleteComponent,
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
    TipocargueestructuraModule
  ],
  exports: [
    TipocargueListComponent,
    TipocargueAdminComponent,
    TipocargueCreateComponent,
    TipocargueEditComponent,
    TipocargueDetailComponent,
    TipocargueDeleteComponent,
  ]
})
export class TipocargueModule { }
