import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';

/** Componente encargado de gestionar la la disponibilidad de los equipos */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-equipodisponibilidad-admin',
  templateUrl: './equipodisponibilidad-admin.component.html'
})
export class EquipodisponibilidadAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
  /**
  * Método encargado de construir una instancia de componente
  *
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    private router: Router
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }
  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    const result = location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length - 2], 'equipodisponibilidad');
    const urlBack = result.split('/').splice(0, result.split('/').length - 1).join('/') + '/create';
    this.router.navigate([urlBack]);
  }
}
