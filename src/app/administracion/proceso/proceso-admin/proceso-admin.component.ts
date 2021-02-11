import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_PROCESO } from './../proceso.constant';

/** Componente encargado de gestionar los procesos */
@Component({
  selector: 'sigma-administracion-proceso-admin',
  templateUrl: './proceso-admin.component.html'
})
export class ProcesoAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESO;

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
