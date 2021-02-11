import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionarDocumentoAdminComponent} from './gestionarDocumento-admin/gestionarDocumento-admin.component';
import { GestionarDocumentoDetailComponent} from './gestionarDocumento-detail/gestionarDocumento-detail.component';
import { GestionarDocumentoListComponent } from './gestionarDocumento-list/gestionarDocumento-list.component';

export const ADMINISTRACION_GESTIONAR_DOCUMENTO_ROUTES: Routes = [
  {
    path: 'admin', component : GestionarDocumentoAdminComponent, data: { breadcrumb: '' } //Administración Gestionar Documentos
  },
  {
    path: 'detail', component: GestionarDocumentoDetailComponent, data: { breadcrumb: 'Detallar Documentos' }
  },
  {
    path: 'list', component: GestionarDocumentoListComponent, data: { breadcrumb: 'Listar Documentos '}
  },
 
];
