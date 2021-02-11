import { Routes } from '@angular/router';
import { EstadisticaUsuarioDetailComponent } from './estadistica-usuario-detail/estadistica-usuario-detail.component';
import { EstadisticaUsuarioDetailWidgetComponent } from './estadistica-usuario-detail-widget/estadistica-usuario-detail-widget.component';


export const ADMINISTRACION_ESTADISTICA_USUARIO_ROUTES: Routes = [
    {
        path: 'detail', component: EstadisticaUsuarioDetailComponent, data: {breadcrumb: ''}
    },
    {
        path: 'widget', component: EstadisticaUsuarioDetailWidgetComponent, data: {breadcrumb: ''}
    }
];
