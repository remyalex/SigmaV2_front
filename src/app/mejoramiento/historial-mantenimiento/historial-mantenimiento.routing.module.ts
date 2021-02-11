import { Routes } from '@angular/router';
import {HistorialListComponent} from './historial-list/historial-list.component';

export const MEJORAMIENTO_HISTORIAL_MANTENIMIENTO_ROUTES: Routes = [
    {
        path: 'list', component : HistorialListComponent, data: { breadcrumb: 'consulta' }
    }
];
