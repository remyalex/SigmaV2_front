import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';

/** Componente encargado de gestionar los usuarios */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-usuario-admin',
  templateUrl: './usuario-admin.component.html'
})
export class UsuarioAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;

  /**
   * Método encargado de construir una instancia de componente
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
