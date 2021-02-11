import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_CONSULTA_ESTADO_MAQUINARIA } from './../estado-maquinaria-propio.constant';

@Component({
  selector: 'sigma-administracion-estado-maquinaria-propio-admin',
  templateUrl: './estado-maquinaria-propio-admin.component.html'
})

export class EstadoMaquinariaPropioAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_CONSULTA_ESTADO_MAQUINARIA;
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
