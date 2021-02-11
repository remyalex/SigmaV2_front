import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipofallaAdminComponent } from './equipo-falla-admin/equipo-falla-admin.component';
import { RouterModule } from '@angular/router';
import { PORDUCCION_EQUIPOFALLA_ROUTES } from './equipo-falla.routing.module';
import { EquipofallaListComponent } from './equipo-falla-list/equipo-falla-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { EquipoFallaCancelComponent } from './equipo-falla-cancel/equipo-falla-cancel.component';

@NgModule({
  declarations: [EquipofallaAdminComponent, EquipofallaListComponent, EquipoFallaCancelComponent],
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
    RouterModule.forChild(PORDUCCION_EQUIPOFALLA_ROUTES)
  ]
})
export class EquipofallaModule { }
