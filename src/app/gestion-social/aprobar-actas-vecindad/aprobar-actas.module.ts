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
import { AprobarActasAdminComponent } from './aprobar-actas-admin/aprobar-actas.component';
import { AprobarActasListComponent } from './aprobar-actas-list/aprobar-actas-list.component';
import { AprobarActasAttachComponent } from './aprobar-actas-attach/aprobar-actas-attach.component';
import { AprobarActasAproveComponent } from './aprobar-actas-aprove/aprobar-actas-aprove.component';

@NgModule({
  declarations: [AprobarActasAdminComponent,
    AprobarActasListComponent,
    AprobarActasAttachComponent,
    AprobarActasAproveComponent,
    // ActasVecindadAttachComponent,
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
  exports: [AprobarActasAdminComponent,
    AprobarActasListComponent,
    AprobarActasAttachComponent,
    AprobarActasAproveComponent,
    // ActasVecindadAttachComponent,
  ]
})
export class AprobarActasModule { }