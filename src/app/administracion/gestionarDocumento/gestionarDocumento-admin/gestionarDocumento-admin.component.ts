import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_ADMINISTRACION_GESTIONAR_DOCUMENTO } from '../gestionarDocumento.constant';

/** Componente encargado de gestionar los documentos */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sigma-administracion-gestionarDocumento-admin',
  templateUrl: './gestionarDocumento-admin.component.html'
})
export class GestionarDocumentoAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONAR_DOCUMENTO;
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
  create (): void {
    var posUltimaPosicion = location.pathname.lastIndexOf('/');
    var urlBack = location.pathname.substr(0, posUltimaPosicion + 1 ) + 'create';
    this.router.navigate([urlBack]);
   }
}
