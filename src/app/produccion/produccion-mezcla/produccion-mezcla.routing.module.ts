import { Routes } from '@angular/router';
import { ProgramarListComponent } from './programar-list/programar-list.component';


export const PRODUCCION_MEZCLA_ROUTES: Routes = [
    {
      path: 'programar', component : ProgramarListComponent, data: { breadcrumb: 'programar' }
    }
  ];
