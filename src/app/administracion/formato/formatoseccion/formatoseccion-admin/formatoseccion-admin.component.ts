import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONST_ADMINISTRACION_FORMATOSECCION } from '../formatoseccion.constant';
import { Formato } from '../../models/formato.model';
import { FormatoService } from '../../services/formato.service';

/** Clase encargada de la gestión del componente */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-formatoseccion-admin',
  templateUrl: './formatoseccion-admin.component.html'
})
export class FormatoseccionAdminComponent implements OnInit {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCION;
  /** Objeto que recibe parametro por URL  */
  formatoId = null;
  /** Objeto usado para enviar al servicio de CRUD*/
  formato: Formato;

  /**
  * Método encargado de construir una instancia de la clase
  * 
  * @param router Componente usado para redireccionar entre componentes
  * @param activeRoute Componente usado para recibir los parametros enviados por la URL
  * @param servicio Servicio usado en el componente para gestionar las peticiones
  */
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private servicio: FormatoService
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      if (params.formato) {
        this.formatoId = params.formato;
      }
    });
  }

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
    this.router.navigate([urlBack], { queryParams: { formato: this.formatoId } });
  }

  /** Método encargado de devolver a la pagina principal el componente */
  backFormato(): void {
    const formato = {};
    this.servicio.updateDataFormato(formato);
    this.router.navigate([this.constants.path_administracion_formato_return]);
  }
}
