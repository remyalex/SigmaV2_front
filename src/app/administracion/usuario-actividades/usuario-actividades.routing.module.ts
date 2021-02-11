import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioActividadesAdminComponent } from './usuario-actividades-admin/usuario-actividades-admin.component';
import { UsuarioActividadesListComponent } from './usuario-actividades-list/usuario-actividades-list.component';

export const ADMINISTRACION_UsuarioActividades_ROUTES: Routes = [
    {
        path: 'admin', component: UsuarioActividadesAdminComponent, data: { breadcrumb: '' } //Administración de UsuarioActividades
    },
    {
        path: 'list', component: UsuarioActividadesListComponent, data: { breadcrumb: 'Listar UsuarioActividades' }
    }

];

@NgModule({
    imports: [RouterModule.forChild(ADMINISTRACION_UsuarioActividades_ROUTES)],
    exports: [RouterModule]
})

export class AdministracionUsuarioActividadesRoutingModule { }