import { Component, OnInit } from '@angular/core';
import { CONST_ADMINISTRACION_ZONA } from './../models/zona.constants';
import { Router } from '@angular/router';

/** Componente encargado de gestionar las zonas */
@Component({
  selector: 'app-zona-admin',
  templateUrl: './zona-admin.component.html'
})
export class ZonaAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ZONA;

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
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'create';
    this.router.navigate([urlBack]);
  }

}
