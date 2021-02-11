import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearMaquinariaComponent } from './crear-maquinaria/crear-maquinaria.component';
import { PRODUCCION_MAQUINARIA_ROUTES } from './maquinaria.routing.module';
import { RouterModule } from '@angular/router';
import { ListMaquinariaComponent } from './list-maquinaria/list-maquinaria.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaquinariaAdminComponent } from './maquinaria-admin/maquinaria-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { MaquinariaDeleteComponent } from './maquinaria-delete/maquinaria-delete.component';

@NgModule({
  declarations: [
    CrearMaquinariaComponent,
    ListMaquinariaComponent,
    MaquinariaAdminComponent,
    MaquinariaDeleteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SeguridadModule,
    RouterModule.forChild(PRODUCCION_MAQUINARIA_ROUTES)
  ],
  entryComponents: [
    MaquinariaDeleteComponent
  ]
})
export class MaquinariaModule { }
