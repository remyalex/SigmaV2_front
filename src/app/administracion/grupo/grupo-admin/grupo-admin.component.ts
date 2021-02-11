import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_GRUPO } from '../grupo.constant';

/** Componente encargado de gestionar los grupos de usuarios del sistema */
@Component({
  selector: 'sigma-administracion-grupo-admin',
  templateUrl: './grupo-admin.component.html'
})
export class GrupoAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GRUPO;

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
  create() {
    const urlActual = location.pathname.lastIndexOf('/');
    const urlToGo = location.pathname.substr(0, urlActual + 1) + 'create';
    this.router.navigate([urlToGo]);
  }
}
