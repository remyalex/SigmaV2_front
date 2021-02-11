import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActividadViewerComponent } from './viewers/actividad-viewer/actividad-viewer.component';

export const WORKFLOW_ROUTES: Routes = [
  {
    path: ':proceso/:actividad', component: ActividadViewerComponent, data: { breadcrumb: 'Actividad Workflow' }
  },
  {
    path: ':proceso/:actividad/:mantenimientoId/:accion', component: ActividadViewerComponent, data: { breadcrumb: 'Actividad Workflow' }
  },

];

@NgModule({
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
