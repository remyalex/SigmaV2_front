import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_AUDITORIA } from './../auditoria.constant';

/** Componente encargado de Gestión de la auditoria en el sistema */
@Component({
  selector: 'sigma-administracion-auditoria-admin',
  templateUrl: './auditoria-admin.component.html'
})
export class AuditoriaAdminComponent implements OnInit, OnDestroy {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_AUDITORIA;

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

  /** Método que se ejecuta una vez invocada la destrucción del componente */
  ngOnDestroy(): void {
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
