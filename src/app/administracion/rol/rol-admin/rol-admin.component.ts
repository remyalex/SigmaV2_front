import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_ROL } from '../rol.constant';

/** Componente encargado de gestionar los roles */
@Component({
  selector: 'sigma-administracion-rol-admin',
  templateUrl: './rol-admin.component.html'
})
export class RolAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ROL;
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
    this.router.navigateByUrl('/administracion/rol/create');
  }
}
