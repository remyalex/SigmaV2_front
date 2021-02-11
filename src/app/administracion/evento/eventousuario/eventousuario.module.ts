import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventousuarioAdminComponent } from './eventousuario-admin/eventousuario-admin.component';
import { EventousuarioCreateComponent } from './eventousuario-create/eventousuario-create.component';
import { EventousuarioDetailComponent } from './eventousuario-detail/eventousuario-detail.component';
import { EventousuarioEditComponent } from './eventousuario-edit/eventousuario-edit.component';
import { EventousuarioListComponent } from './eventousuario-list/eventousuario-list.component';
import { EventousuarioDeleteComponent } from './eventousuario-delete/eventousuario-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';

@NgModule({
  declarations: [
    EventousuarioAdminComponent,
    EventousuarioCreateComponent,
    EventousuarioDetailComponent,
    EventousuarioEditComponent,
    EventousuarioListComponent,
    EventousuarioDeleteComponent,
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
    EventousuarioListComponent,
    EventousuarioAdminComponent,
    EventousuarioCreateComponent,
    EventousuarioEditComponent,
    EventousuarioDetailComponent,
    EventousuarioDeleteComponent,
  ]
})
export class EventousuarioModule { }
