import {CONST_ADMINISTRACION_ESTADISTICA_USUARIO} from './../estadisticaUsuario.constants'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { EstadisticaUsuarioModel } from '../models/estadisticaUsuario.model';
import { Injectable } from '@angular/core';
import { CollectionResponse } from 'src/app/shared/models/collection-response';


/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders ({ 'Content-Type': 'application/json'})
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({providedIn: 'root'})
export class EstadisticaUsuarioService {

  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ESTADISTICA_USUARIO;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl = '';

   /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param _appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  */
  constructor(
       private _http: HttpClient,
       private _appSettings: AppSettings
   ) {
    this.resourceUrl = _appSettings.settings.hostApi + this.constants.path_administracion_usuario;
   }

   /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de estadisticas de usuario.
   */
   detail(): Observable<EstadisticaUsuarioModel[]> {
     return this._http.get<EstadisticaUsuarioModel[]>(this.resourceUrl + '/estadisticaUsuario', httpOptions);
   }

}
