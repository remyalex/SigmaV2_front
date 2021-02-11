import { Component, OnInit } from '@angular/core';
import { CONST_PRODUCCION_EQUIPOFALLA } from './../equipo-falla.constant';

@Component({
  selector: 'app-produccion-equipo-falla-admin',
  templateUrl: './equipo-falla-admin.component.html'
})
export class EquipofallaAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_EQUIPOFALLA;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
