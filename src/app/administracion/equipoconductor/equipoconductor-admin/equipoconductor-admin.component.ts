import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';

/** Componente encargado de gestionar los conductores de equipos */
@Component({
  selector: 'sigma-administracion-equipoconductor-admin',
  templateUrl: './equipoconductor-admin.component.html'
})
export class EquipoConductorAdminComponent implements OnInit {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;

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
    var result= location.pathname.replace(location.pathname.split('/')[location.pathname.split('/').length-2],'equipoconductor');
    var urlBack =result.split('/').splice(0, result.split('/').length - 1).join('/') + '/create' ;
    this.router.navigate([urlBack]);
  }
}
