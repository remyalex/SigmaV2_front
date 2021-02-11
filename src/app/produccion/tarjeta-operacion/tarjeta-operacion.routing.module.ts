import { Routes } from '@angular/router';
import { TarjetaOperacionAdminComponent} from './tarjeta-operacion-admin/tarjeta-operacion-admin.component';
import { TarjetaOperacionListComponent } from './tarjeta-operacion-list/tarjeta-operacion-list.component';
import { TarjetaOperacionCreateComponent } from './tarjeta-operacion-create/tarjeta-operacion-create.component';

export const PRODUCCION_TARJETA_OPERACION_ROUTES: Routes = [
  {
    path: 'admin', component : TarjetaOperacionAdminComponent, data: { breadcrumb: '' } //Administración de TarjetaOperacion
  },
  {
    path: 'create', component: TarjetaOperacionCreateComponent, data: { breadcrumb: 'Crear Tarjeta Operacion' }
  },
  {
    path: 'list', component: TarjetaOperacionListComponent, data: { breadcrumb: 'Listar Tarjeta Operacion' }
  },
];
