import { Routes } from '@angular/router';
import { ConsultarListComponent } from './consultar-list/consultar-list.component';

export const INTERVENCION_CONSULTA_PROGRAMACION_PERIODICA_ROUTES: Routes = [
    {
        path: 'list', component : ConsultarListComponent,  data: { breadcrumb: '' }
    }
];