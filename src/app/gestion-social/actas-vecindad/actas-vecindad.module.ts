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
import { ActasVecindadComponent } from './actas-vecindad/actas-vecindad.component';
import { ActasVecindadCreateComponent } from './actas-vecindad-create/actas-vecindad-create.component';
import { ActasVecindadListComponent } from './actas-vecindad-list/actas-vecindad-list.component';
import { ActasVecindadEditComponent } from './actas-vecindad-edit/actas-vecindad-edit.component';
import { ActasVecindadAttachComponent } from './actas-vecindad-attach/actas-vecindad-attach.component';

@NgModule({
  declarations: [ActasVecindadComponent,
    ActasVecindadCreateComponent,
    ActasVecindadListComponent,
    ActasVecindadEditComponent,
    ActasVecindadAttachComponent,
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
  exports: [ActasVecindadComponent,
    ActasVecindadCreateComponent,
    ActasVecindadListComponent,
    ActasVecindadEditComponent,
    ActasVecindadAttachComponent,
  ]
})
export class ActasVecindadModule { }