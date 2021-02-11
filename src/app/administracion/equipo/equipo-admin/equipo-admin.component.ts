import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_EQUIPO } from './../equipo.constant';

/** Clase encargada de la gestión y administración de equipos */
@Component({
  selector: 'sigma-administracion-equipo-admin',
  templateUrl: './equipo-admin.component.html'
})
export class EquipoAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPO;

  /**
  * Método encargado de construir una instancia de componente
  *
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    private router: Router
  ) { }

  /**
  * Método encargado de inicializar el componente
  */
  ngOnInit() {
  }

  /**
  * Método encargado de redireccionar al usuario al componente de crear
  */
  create(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'create';
    this.router.navigate([urlBack]);
  }
}
