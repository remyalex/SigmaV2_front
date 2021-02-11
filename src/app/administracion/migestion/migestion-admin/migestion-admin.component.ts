import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_MIGESTION } from './../migestion.constant';


@Component({
  selector: 'sigma-administracion-migestion-admin',
  templateUrl: './migestion-admin.component.html'
})
export class MiGestionAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MIGESTION;

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
}
