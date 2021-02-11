import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransicionAdminComponent } from './transicion-admin/transicion-admin.component';
import { TransicionCreateComponent } from './transicion-create/transicion-create.component';
import { TransicionDeleteComponent } from './transicion-delete/transicion-delete.component';
import { TransicionDetailComponent } from './transicion-detail/transicion-detail.component';
import { TransicionEditComponent } from './transicion-edit/transicion-edit.component';
import { TransicionListComponent } from './transicion-list/transicion-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { DocumentosListComponent } from '../transicion/documentos/documentos-list/documentos-list.component';
import { DocumentosCreateComponent } from '../transicion/documentos/documentos-create/documentos-create.component';
import { DocumentosUpdateComponent } from '../transicion/documentos/documentos-update/documentos-update.component';
import { DocumentosDeleteComponent } from '../transicion/documentos/documentos-delete/documentos-delete.component';

@NgModule({
  declarations: [
    TransicionAdminComponent,
    TransicionCreateComponent,
    TransicionDeleteComponent,
    TransicionDetailComponent,
    TransicionEditComponent,
    TransicionListComponent,
    DocumentosListComponent,
    DocumentosCreateComponent,
    DocumentosUpdateComponent,
    DocumentosDeleteComponent
  ],
  entryComponents: [
    TransicionCreateComponent,
    TransicionDeleteComponent,
    TransicionDetailComponent,
    TransicionEditComponent,
    DocumentosListComponent,
    DocumentosCreateComponent,
    DocumentosUpdateComponent,
    DocumentosDeleteComponent
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
    TransicionAdminComponent,
    TransicionCreateComponent,
    TransicionDeleteComponent,
    TransicionDetailComponent,
    TransicionEditComponent,
    TransicionListComponent
  ]
})
export class TransicionModule { }
