import { TipointervencionAdminComponent } from './tipointervencion-admin/tipointervencion-admin.component';
import { TipointervencionDeleteComponent } from './tipointervencion-delete/tipointervencion-delete.component';
import { TipointervencionEditComponent } from './tipointervencion-edit/tipointervencion-edit.component';
import { TipointervencionListComponent } from './tipointervencion-list/tipointervencion-list.component';
import { TipointervencionCreateComponent } from './tipointervencion-create/tipointervencion-create.component';
import { TipointervencionDetailComponent } from './tipointervencion-detail/tipointervencion-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    TipointervencionDetailComponent,
    TipointervencionCreateComponent,
    TipointervencionListComponent,
    TipointervencionEditComponent,
    TipointervencionDeleteComponent,
    TipointervencionAdminComponent,
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
  ]
})
export class TipointervencionModule { }
