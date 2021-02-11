import { Routes } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaEditComponent } from './registrar-insumos-de-formula-mezcla-edit/registrar-insumos-de-formula-mezcla-edit.component';
// tslint:disable-next-line: max-line-length
import { RegistrarInsumoFormulaMezclaDetailComponent } from './registrar-insumos-de-formula-mezcla-detail/registrar-insumos-de-formula-mezcla-detail.component';


export const PRODUCCION_INSUMOS_FORMULA_MEZCLA_ROUTES: Routes = [
  {
    path: 'edit', component: RegistrarInsumoFormulaMezclaEditComponent, data: { breadcrumb: 'Editar insumos de formula' }
  },
  {
    path: 'detail', component : RegistrarInsumoFormulaMezclaDetailComponent, data: { breadcrumb: 'Detallar insumos de formula' }
  },
];
