import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoAdminComponent } from './evento-admin/evento-admin.component';
import { EventoCreateComponent } from './evento-create/evento-create.component';
import { EventoDetailComponent } from './evento-detail/evento-detail.component';
import { EventoEditComponent } from './evento-edit/evento-edit.component';
import { EventoListComponent } from './evento-list/evento-list.component';
import { EventoDeleteComponent } from './evento-delete/evento-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule, MatFormFieldModule } from '@angular/material';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { EventorolModule } from './eventorol/eventorol.module';
import { EventousuarioModule } from './eventousuario/eventousuario.module';

@NgModule({
  declarations: [
    EventoAdminComponent,
    EventoCreateComponent,
    EventoDetailComponent,
    EventoEditComponent,
    EventoListComponent,
    EventoDeleteComponent,
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
    EventorolModule,
    EventousuarioModule,
  ],
  exports: [
    EventoListComponent,
    EventoAdminComponent,
    EventoCreateComponent,
    EventoEditComponent,
    EventoDetailComponent,
    EventoDeleteComponent,
  ]
})
export class EventoModule { }
