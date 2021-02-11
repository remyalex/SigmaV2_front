import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetAdminComponent} from './widget-admin/widget-admin.component';
import { WidgetDetailComponent} from './widget-detail/widget-detail.component';
import { WidgetEditComponent } from './widget-edit/widget-edit.component';
import { WidgetListComponent } from './widget-list/widget-list.component';
import { WidgetCreateComponent } from './widget-create/widget-create.component';
import { WidgetDeleteComponent } from './widget-delete/widget-delete.component';

export const ADMINISTRACION_WIDGET_ROUTES: Routes = [
  {
    path: 'admin', component : WidgetAdminComponent, data: { breadcrumb: '' } //Administración de widget
  },
  {
    path: 'detail', component: WidgetDetailComponent, data: { breadcrumb: 'Detallar widget' }
  },
  {
    path: 'create', component: WidgetCreateComponent, data: { breadcrumb: 'Crear widget' }
  },
  {
    path: 'edit', component: WidgetEditComponent, data: { breadcrumb: 'Editar widget' }
  },
  {
    path: 'list', component: WidgetListComponent, data: { breadcrumb: 'Listar widget' }
  },
  {
    path: 'delete', component: WidgetDeleteComponent, data: { breadcrumb: 'Eliminar widget' }
  },
];
