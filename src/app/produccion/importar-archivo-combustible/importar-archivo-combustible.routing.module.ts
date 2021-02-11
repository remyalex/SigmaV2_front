import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { ImportarArchivoCombustibleVehiculoComponent } from './importar-archivo-combustible-vehiculo/importar-archivo-combustible-vehiculo.component';
import { ImportarArchivoCombustibleMaquinariaComponent } from './importar-archivo-combustible-maquinaria/importar-archivo-combustible-maquinaria.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { MaquinariaComponent } from './maquinaria/maquinaria.component';

export const PRODUCCION_IMPORTAR_ARCHIVO_COMBUSTIBLE_ROUTES: Routes = [
  {
    path: 'vehiculo', component: VehiculoComponent, data: { breadcrumb: 'Importar Archivo Consumo Combustible' }
  },
  {
    path: 'maquinaria', component: MaquinariaComponent, data: { breadcrumb: 'Importar Archivo Consumo Maquinaria' }
  },
];
