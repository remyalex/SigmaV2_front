import { Routes} from '@angular/router';
import { GestionarRadicadosPqrsfdComponent } from './gestionar-radicados-pqrsfd/gestionar-radicados-pqrsfd.component';

export const GESTIONAR_RADICADOS_ROUTES: Routes = [
  {
    path: 'list', component : GestionarRadicadosPqrsfdComponent, data: { breadcrumb: 'Gestionar radicados PQRSFD' }
  },
];
