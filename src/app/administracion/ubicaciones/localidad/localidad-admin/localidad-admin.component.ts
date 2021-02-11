import { Component, OnInit } from '@angular/core';
import {CONST_ADMINISTRACION_LOCALIDAD} from '../models/localidad.constants';
import { Router } from '@angular/router';

/** Componente encargado de gestionar las localidades */
@Component({
  selector: 'app-localidad-admin',
  templateUrl: './localidad-admin.component.html'
})
export class LocalidadAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LOCALIDAD;

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
