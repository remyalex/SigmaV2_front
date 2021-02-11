import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanillaOperacionAdminComponent} from './planilla-operacion-admin/planilla-operacion-admin.component';
import { PlanillaOperacionDetailComponent} from './planilla-operacion-detail/planilla-operacion-detail.component';
import { PlanillaOperacionEditComponent } from './planilla-operacion-edit/planilla-operacion-edit.component';
import { PlanillaOperacionActividadesComponent } from './planilla-operacion-actividades/planilla-operacion-actividades.component';

import { PlanillaOperacionListComponent } from './planilla-operacion-list/planilla-operacion-list.component';
import { PlanillaOperacionCreateComponent } from './planilla-operacion-create/planilla-operacion-create.component';
import { PlanillaOperacionDeleteComponent } from './planilla-operacion-delete/planilla-operacion-delete.component';

export const PRODUCCION_PLANILLA_OPERACION_ROUTES: Routes = [
  {
    path: 'admin', component : PlanillaOperacionAdminComponent, data: { breadcrumb: '' } //Administración de PlanillaOperacio
  },
  {
    path: 'detail', component: PlanillaOperacionDetailComponent, data: { breadcrumb: 'Detallar planilla operación' }
  },
  {
    path: 'create', component: PlanillaOperacionCreateComponent, data: { breadcrumb: 'Crear planilla operación' }
  },
  {
    path: 'edit', component: PlanillaOperacionEditComponent, data: { breadcrumb: 'Editar planilla operación' }
  },
  {
    path: 'actividades', component: PlanillaOperacionActividadesComponent, data: { breadcrumb: 'Actividades' }
  },
  {
    path: 'list', component: PlanillaOperacionListComponent, data: { breadcrumb: 'Listar planilla operación' }
  },
  {
    path: 'delete', component: PlanillaOperacionDeleteComponent, data: { breadcrumb: 'Eliminar planillaoperación' }
  },
];
