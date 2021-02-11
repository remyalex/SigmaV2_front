import { Component, OnInit } from '@angular/core';
import { CONST_ADMINISTRACION_PLANILLAOPERACIONES } from '../planillaoperaciones.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'sigma-administracion-planillaoperaciones-admin',
  templateUrl: './planillaoperaciones-admin.component.html'
})
export class PlanillaoperacionesAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PLANILLAOPERACIONES;

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
