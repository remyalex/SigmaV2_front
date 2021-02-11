import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';
import { FormatoService } from '../../../services/formato.service';

/** Clase encargada de la gestión del componente */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sigma-administracion-formatoseccioncampo-admin',
  templateUrl: './formatoseccioncampo-admin.component.html'
})
export class FormatoseccioncampoAdminComponent implements OnInit {

  /** Variable que recibe parametro por URL  */
  formatoId = null;
  /** Objeto que recibe parametro por URL  */
  seccionId = null;
  /** Objeto que recibe parametro por URL  */
  sectionPosition = null;

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;

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
      if (params.formato && params.seccion) {
        this.formatoId = params.formato;
        this.seccionId = params.seccion;
        this.sectionPosition = params.key;
      }
    });
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() { }

  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'create';
    this.router.navigate([urlBack], { queryParams: { key: this.sectionPosition, formato: this.formatoId, seccion: this.seccionId } });
  }

  /** Método encargado de actualizar formato y devolver a la pagina principal el componente */
  backSeccion(): void {
    const formato = {};
    this.servicio.updateDataFormato(formato);
    this.router.navigate(
      [this.constants.path_administracion_formatoseccion_return],
      { queryParams: { formato: this.formatoId } }
    );
  }
}
