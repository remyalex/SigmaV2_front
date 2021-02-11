import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_FORMATO } from './../formato.constant';

/** Clase encargada de la gestión del componente */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-formato-admin',
  templateUrl: './formato-admin.component.html'
})
export class FormatoAdminComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATO;

  /**
  * Método encargado de construir una instancia
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(private router: Router) {}

  /** Método encargado de inicializar el componente */
  ngOnInit() {}

  /**
   * Método encargado de realizar el llamado al componente de creación
   * de un registro de la grilla.
   */
  create(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'create';
    this.router.navigate([urlBack]);
  }
}
