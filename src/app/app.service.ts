import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { SITE_ROUTES } from './site/site.routing';
//import { ADMINISTRACION_ROUTES } from './administracion/administracion.routing';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routing';
import { SEGURIDAD_ROUTES } from './seguridad/seguridad.routing';
import { AuthGuardService } from './seguridad/services/auth-guard.service';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { Routes } from '@angular/router';
import { Injectable } from '@angular/core';
/*import { WORKFLOW_ROUTES } from './workflow/workflow-routing.module';
import { PRODUCCION_ROUTES } from './produccion/produccion.routing';
import { GESTION_AMBIENTAL_ROUTES } from './gestion-ambiental/gestion-ambiental.routing';
import { GESTION_SOCIAL_ROUTES } from './gestion-social/gestion-social.routing';
import { MEJORAMIENTO_ROUTES } from './mejoramiento/mejoramiento.routing';
import { INTERVENCION_ROUTES } from './intervencion/intervencion.routing';
import { SHARED_ROUTES } from './shared/shared.routing';
*/
export const routes: Routes = [
    {
        path: 'site', component: SiteLayoutComponent,
        children: [
            {
                path: '', children: SITE_ROUTES
            },
        ]
    },
    {
        path: 'seguridad', component: SiteLayoutComponent,
        children: SEGURIDAD_ROUTES
    },
    {
        path: 'administracion/dashboard', component: AppLayoutComponent, canActivate: [AuthGuardService],
        children: DASHBOARD_ROUTES, data: { breadcrumb: 'Dashboard' }
    },
    {
        path: '',
        redirectTo: 'site/home',
        pathMatch: 'full'
    }, {
        path: '**',
        component: NotFoundComponent,
    }, {
        path: 'not-access',
        component: NotFoundComponent,
    }/*,{
          path: 'administracion', component: AppLayoutComponent, canActivate: [AuthGuardService],
          children: ADMINISTRACION_ROUTES, data: { breadcrumb: 'Administración' }
    },
    {
        path: 'workflow', component: AppLayoutComponent,
        children: WORKFLOW_ROUTES, data: { breadcrumb: 'Workflow' }
    },
    {
        path: 'produccion', component: AppLayoutComponent,
        children: PRODUCCION_ROUTES, data: { breadcrumb: 'Workflow' }
    },
    {
        path: 'gestion-ambiental', component: AppLayoutComponent,
        children: GESTION_AMBIENTAL_ROUTES, data: { breadcrumb: 'Gestión ambiental' }
    },
    {
        path: 'gestion-social', component: AppLayoutComponent,
        children: GESTION_SOCIAL_ROUTES, data: { breadcrumb: 'Gestión social' }
    },
    {
        path: 'mejoramiento', component: AppLayoutComponent,
        children: MEJORAMIENTO_ROUTES, data: { breadcrumb: 'Mejoramiento' }
    },
    {
        path: 'intervencion', component: AppLayoutComponent,
        children: INTERVENCION_ROUTES, data: { breadcrumb: 'Intervención' }
    },
    {
        path: 'shared', component: SiteLayoutComponent,
        children: SHARED_ROUTES, data: { breadcrumb: 'Shared' }
    },*/

];

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
    providedIn: 'root'
})
export class AppService {
    static internalRoutes = routes;
    constructor() {
    }
    static getComponent(path: string) {
        const clearArray = path.split('/').filter((ruta: string) => ruta != '');
        if (clearArray.length > 1) {
            return AppService.foundComponent(clearArray, AppService.internalRoutes).component;
        }
    }

    static foundComponent(pathArray, arrayChildren) {
        if (pathArray.length > 0) {
            if (typeof arrayChildren[0].children !== 'undefined') {
                const newChildren = arrayChildren.filter((child: any) => (child.path == pathArray[0]))[0];
                if (typeof newChildren.children !== 'undefined') {
                    return this.foundComponent(pathArray.slice(1), newChildren.children);
                }
            } else {
                const newChildren = arrayChildren.filter((child: any) => (child.path == pathArray[0]))[0];
                return newChildren;
            }
        } else {
            return arrayChildren;
        }
    }

}
