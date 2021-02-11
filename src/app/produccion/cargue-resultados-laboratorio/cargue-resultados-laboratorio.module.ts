import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargueResultadosLaboratorioAdminComponent } from './cargue-resultados-laboratorio-admin/cargue-resultados-laboratorio-admin.component';
import { CargueResultadosLaboratorioListComponent } from './cargue-resultados-laboratorio-list/cargue-resultados-laboratorio-list.component';
import { CargueResultadosLaboratorioEditComponent } from './cargue-resultados-laboratorio-edit/cargue-resultados-laboratorio-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
// tslint:disable-next-line: max-line-length
import { CargueResultadosLaboratorioDetailComponent } from './cargue-resultados-laboratorio-detail/cargue-resultados-laboratorio-detail.component';
import { RouterModule } from '@angular/router';
import { PRODUCCION_CARGUE_LAB_ROUTES } from './cargue-resultados-laboratorio.routing.module';

@NgModule({
  declarations: [CargueResultadosLaboratorioAdminComponent,
     CargueResultadosLaboratorioListComponent,
     CargueResultadosLaboratorioEditComponent,
     CargueResultadosLaboratorioDetailComponent
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
    RouterModule.forChild(PRODUCCION_CARGUE_LAB_ROUTES)
  ],
  entryComponents: [
    CargueResultadosLaboratorioAdminComponent,
    CargueResultadosLaboratorioListComponent,
    CargueResultadosLaboratorioEditComponent,
    CargueResultadosLaboratorioDetailComponent
  ],
  exports: [CargueResultadosLaboratorioAdminComponent,
    CargueResultadosLaboratorioListComponent,
    CargueResultadosLaboratorioEditComponent,
    CargueResultadosLaboratorioDetailComponent
   ]

})
export class CargueResultadosLaboratorioModule { }
