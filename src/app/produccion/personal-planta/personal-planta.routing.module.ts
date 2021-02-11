import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalPlantaAdminComponent} from './personal-planta-admin/personal-planta-admin.component';
import { PersonalPlantaDetailComponent} from './personal-planta-detail/personal-planta-detail.component';
import { PersonalPlantaEditComponent } from './personal-planta-edit/personal-planta-edit.component';
import { PersonalPlantaActividadesComponent } from './personal-planta-actividades/personal-planta-actividades.component';
import { PersonalPlantaListComponent } from './personal-planta-list/personal-planta-list.component';
import { PersonalPlantaCreateComponent } from './personal-planta-create/personal-planta-create.component';
import { PersonalPlantaDeleteComponent } from './personal-planta-delete/personal-planta-delete.component';

export const PRODUCCION_PERSONAL_PLANTA_ROUTES: Routes = [
  {
    path: 'admin', component : PersonalPlantaAdminComponent, data: { breadcrumb: '' } //Administración de PlanillaOperacio
  },
  {
    path: 'admin/:pk', component : PersonalPlantaAdminComponent, data: { breadcrumb: 'pk' } //Administración de PlanillaOperacio
  },
  {
    path: 'detail', component: PersonalPlantaDetailComponent, data: { breadcrumb: 'Detallar planilla operación' }
  },
  {
    path: 'create', component: PersonalPlantaCreateComponent, data: { breadcrumb: 'Crear planilla operación' }
  },
  {
    path: 'edit', component: PersonalPlantaEditComponent, data: { breadcrumb: 'Editar planilla operación' }
  },
  {
    path: 'actividades', component: PersonalPlantaActividadesComponent, data: { breadcrumb: 'Actividades' }
  },
  {
    path: 'list', component: PersonalPlantaListComponent, data: { breadcrumb: 'Listar planilla operación' }
  },
  {
    path: 'delete', component: PersonalPlantaDeleteComponent, data: { breadcrumb: 'Eliminar planillaoperación' }
  },
];
