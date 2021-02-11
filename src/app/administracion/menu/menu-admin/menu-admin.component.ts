import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_MENU } from './../constantes-menu';

/** Componente encargado de gestionar los menús */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-menu-admin',
  templateUrl: './menu-admin.component.html'
})
export class MenuAdminComponent implements OnInit {
  constantes = CONST_MENU;

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
