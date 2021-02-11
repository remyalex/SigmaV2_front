import { Permiso } from './../../permisos/models/permiso.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { UsuarioCriteria } from '../models/usuario-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_USUARIO } from './../usuario.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_USUARIO;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  public roles = [];


  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param dataGeneric Referencia al servicio por el cual se obtendrán los datos requeridos
  */
    constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_usuario;
   }

  /**
   * Método encargado de obtener los datos de una lista
   * dado el path de esta y el id correspondiente.
   *
   * @param path Cadena de texto que indica la ruta de la
   * lista de la cual se obtendrá información
   *
   * @param id Identificador de el item de la lista por el cual
   * se desea filtrar los items de la lista
   **/
  searchByList(path: string, id: number) {
    return this.dataGeneric.buscarListaId(path, id);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: UsuarioCriteria): Observable<CollectionResponse<Usuario>> {
    return this.http.get<CollectionResponse<Usuario>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.resourceUrl, usuario, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(this.resourceUrl, usuario, httpOptions);
  }

  setPassword(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(this.resourceUrl + '/setPassword', usuario, httpOptions);
  }

  detail(usuarioId: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.resourceUrl + '/' + usuarioId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (usuarioId: number): Observable<Usuario> {
    return this.http.delete<Usuario>(this.resourceUrl + '/' + usuarioId);
  }

  listaOrigen(): Observable<any> {
    return this.http.get<CollectionResponse<any>>(
      this.appSettings.settings.hostApi + this.constants.path_administracion_usuario_origenId
    );
  }

  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.resourceUrl + '/permisos');
  }
  
}
