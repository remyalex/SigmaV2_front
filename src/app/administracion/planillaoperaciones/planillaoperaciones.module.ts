import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanillaoperacionesCreateComponent } from './planillaoperaciones-create/planillaoperaciones-create.component';
import { PlanillaoperacionesAdminComponent } from './planillaoperaciones-admin/planillaoperaciones-admin.component';
import { PlanillaoperacionesEditComponent } from './planillaoperaciones-edit/planillaoperaciones-edit.component';
import { PlanillaoperacionesListComponent } from './planillaoperaciones-list/planillaoperaciones-list.component';
import { PlanillaoperacionesDeleteComponent } from './planillaoperaciones-delete/planillaoperaciones-delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { RouterModule } from '@angular/router';
import { ADMINISTRACION_PLANILLAOPERACIONES_ROUTES } from './planillaoperaciones.routing.module';

@NgModule({
  declarations: [
    PlanillaoperacionesCreateComponent,
    PlanillaoperacionesAdminComponent,
    PlanillaoperacionesEditComponent,
    PlanillaoperacionesListComponent,
    PlanillaoperacionesDeleteComponent
  ],
  imports: [
    CommonModule,
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
    RouterModule.forChild(ADMINISTRACION_PLANILLAOPERACIONES_ROUTES),
  ]
})
export class PlanillaoperacionesModule { }
