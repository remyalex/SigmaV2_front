import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventorolAdminComponent } from './eventorol-admin/eventorol-admin.component';
import { EventorolCreateComponent } from './eventorol-create/eventorol-create.component';
import { EventorolDetailComponent } from './eventorol-detail/eventorol-detail.component';
import { EventorolEditComponent } from './eventorol-edit/eventorol-edit.component';
import { EventorolListComponent } from './eventorol-list/eventorol-list.component';
import { EventorolDeleteComponent } from './eventorol-delete/eventorol-delete.component';
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
    EventorolAdminComponent,
    EventorolCreateComponent,
    EventorolDetailComponent,
    EventorolEditComponent,
    EventorolListComponent,
    EventorolDeleteComponent,
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
    EventorolListComponent,
    EventorolAdminComponent,
    EventorolCreateComponent,
    EventorolEditComponent,
    EventorolDetailComponent,
    EventorolDeleteComponent,
  ]
})
export class EventorolModule { }
