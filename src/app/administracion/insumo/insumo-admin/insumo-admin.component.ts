import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_INSUMO } from './../insumo.constant';

/** Componente encargado de gestionar los insumos */
@Component({
  selector: 'sigma-administracion-insumo-admin',
  templateUrl: './insumo-admin.component.html'
})
export class InsumoAdminComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_INSUMO;

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
    this.router.navigateByUrl('/administracion/insumo/create');
  }
}
