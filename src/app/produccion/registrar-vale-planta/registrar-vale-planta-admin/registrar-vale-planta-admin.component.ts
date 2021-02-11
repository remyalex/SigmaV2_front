import { CONST_PRODUCCION_REGISTRO_VALE_PLANTA } from './../registrarValePlanta.constant';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-produccion-registrar-vale-planta-admin',
  templateUrl: './registrar-vale-planta-admin.component.html'
})
export class RegistrarValePlantaAdminComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_VALE_PLANTA;

  /**
   * Método encargado de construir una instancia de componente
   * @param router Componente usado para redireccionar entre componentes
   */
  constructor(
    private router: Router
  ){}

  /** Método encargado de inicializar el componente */
  ngOnInit() {}
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
