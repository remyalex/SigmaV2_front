import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormulaMezclaLaboratorioComponent} from './registrar-formulas-mezcla-laboratorio/registrar-formulas-mezcla-laboratorio.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioDetailComponent} from './registrar-formulas-mezcla-laboratorio-detail/registrar-formulas-mezcla-laboratorio-detail.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioEditComponent } from './registrar-formulas-mezcla-laboratorio-edit/registrar-formulas-mezcla-laboratorio-edit.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioListComponent } from './registrar-formulas-mezcla-laboratorio-list/registrar-formulas-mezcla-laboratorio-list.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioCreateComponent } from './registrar-formulas-mezcla-laboratorio-create/registrar-formulas-mezcla-laboratorio-create.component';
// tslint:disable-next-line: max-line-length
import { FormulaMezclaLaboratorioDeleteComponent } from './registrar-formulas-mezcla-laboratorio-delete/registrar-formulas-mezcla-laboratorio-delete.component';

export const PRODUCCION_FORMULA_MEZCLA_LABORATORIO_ROUTES: Routes = [
  {
    path: 'admin', component : FormulaMezclaLaboratorioComponent, data: { breadcrumb: '' }
  },
  {
    path: 'detail', component: FormulaMezclaLaboratorioDetailComponent, data: { breadcrumb: 'Detallar formulas de mezcla de laboratorio' }
  },
  {
    path: 'create', component: FormulaMezclaLaboratorioCreateComponent, data: { breadcrumb: 'Crear formulas de mezcla de laboratorio' }
  },
  {
    path: 'edit', component: FormulaMezclaLaboratorioEditComponent, data: { breadcrumb: 'Editar formulas de mezcla de laboratorio' }
  },
  {
    path: 'list', component: FormulaMezclaLaboratorioListComponent, data: { breadcrumb: 'Listar formulas de mezcla de laboratorio' }
  },
  {
    path: 'delete', component: FormulaMezclaLaboratorioDeleteComponent, data: { breadcrumb: 'Eliminar formulas de mezcla de laboratorio' }
  },
];
