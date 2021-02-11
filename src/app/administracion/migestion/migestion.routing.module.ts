import { Routes } from '@angular/router';
import { MiGestionListComponent } from './migestion-list/migestion-list.component';
import { MiGestionAdminComponent } from './migestion-admin/migestion-admin.component';
import { MiGestionWidgetComponent } from './migestion-widget/migestion-widget.component';

export const ADMINISTRACION_MIGESTION_ROUTES: Routes = [
  {
    path: 'admin', component: MiGestionAdminComponent, data: { breadcrumb: 'Mi gestión' }
  },
  {
    path: 'list', component: MiGestionListComponent, data: { breadcrumb: 'Mi gestión' }
  },
  {
    path: 'widget', component: MiGestionWidgetComponent, data: { breadcrumb: 'Mi gestión' }
  }
];
