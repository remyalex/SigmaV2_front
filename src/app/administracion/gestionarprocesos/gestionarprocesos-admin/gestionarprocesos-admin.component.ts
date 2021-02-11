import { Component, OnInit } from '@angular/core';
import { CONST_ADMINISTRACION_GESTIONARPROCESOS } from '../gestionarprocesos.constant';

/** Componente encargado de mantener la gestión de los procesos en administración */
@Component({
  selector: 'sigma-administracion-gestionarprocesos-admin',
  templateUrl: './gestionarprocesos-admin.component.html'
})
export class GestionarprocesosAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONARPROCESOS;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }

}
