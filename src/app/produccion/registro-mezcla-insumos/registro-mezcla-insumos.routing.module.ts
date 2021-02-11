import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResgistroMezclaInsumosListComponent } from './registro-mezcla-insumos-list/registro-mezcla-insumos-list.component';
import { ResgistroMezclaInsumosSolicitudesComponent } from './registro-mezcla-insumos-solicitudes/registro-mezcla-insumos-solicitudes.component';
import { ResgistroMezclaInsumosCreateComponent } from './registro-mezcla-insumos-create/registro-mezcla-insumos-create.component';
import { RegistroMezclaInsumoComponent } from './registro-mezcla-insumos/registro-mezcla-insumos.component';
import { RegistroMezclaInsumosEditComponent } from './registro-mezcla-insumos-edit/registro-mezcla-insumos-edit.component';
import { RegistroMezclaInsumosDetalleComponent } from './registro-mezcla-insumos-detalle/registro-mezcla-insumos-detalle.component';
import { RegistroMezclaInsumosDeleteComponent } from './registro-mezcla-insumos-delete/registro-mezcla-insumos-delete.component';

export const PRODUCCION_REGISTRO_MEZCLA_INSUMOS_ROUTES: Routes = [
  {
    path: 'view', component: RegistroMezclaInsumoComponent, data: { breadcrumb: '' } //Administración de rol
  },
  {
    path: 'create', component: ResgistroMezclaInsumosCreateComponent, data: { breadcrumb: 'Crear registro mezcla' }
  },
  {
    path: 'list', component: ResgistroMezclaInsumosListComponent, data: { breadcrumb: 'Listar registro mezcla' }
  },
  {
    path: 'solicitudes', component: ResgistroMezclaInsumosSolicitudesComponent, data: { breadcrumb: 'Listar solicitudes' }
  },
  {
    path: 'edit', component: RegistroMezclaInsumosEditComponent, data: { breadcrumb: 'Editar registro mezcla' }
  },
  {
    path: 'detalle', component: RegistroMezclaInsumosDetalleComponent, data: { breadcrumb: 'Detalle registro mezcla' }
  },
  {
    path: 'delete', component: RegistroMezclaInsumosDeleteComponent, data: { breadcrumb: 'Eliminar registro material' }
  },
];