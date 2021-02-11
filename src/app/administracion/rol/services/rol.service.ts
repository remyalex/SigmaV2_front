import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Rol } from '../models/rol.model';
import { RolCriteria } from '../models/rol-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_ROL } from './../rol.constant';
import { DataGenericService } from './../../../shared/services/data-generic.service';

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
export class RolService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_ROL; 
  private resoruceUrl: string;
  private resourceUrlPermisos: string;

  public rol = new BehaviorSubject({});
  rol$ = this.rol.asObservable();


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
    this.resoruceUrl = appSettings.settings.hostApi + '/api/administracion/rol';
    this.resourceUrlPermisos = appSettings.settings.hostApi + '/api/administracion/permiso';
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
  search(criteria: RolCriteria): Observable<CollectionResponse<Rol>> {
    return this.http.get<CollectionResponse<Rol>>(this.resoruceUrl+"/search?"+criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (rol: Rol): Observable<Rol> {
    rol.nombre = rol.nombre.toUpperCase();
    return this.http.post<Rol>(this.resoruceUrl, rol, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (rol: Rol): Observable<Rol> {
    rol.nombre = rol.nombre.toUpperCase();
    return this.http.put<Rol>(this.resoruceUrl, rol, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (rolId: number): Observable<Rol> {
    return this.http.get<Rol>(this.resoruceUrl + '/' + rolId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (rolId: number): Observable<Rol> {
    return this.http.delete<Rol>(this.resoruceUrl + '/' + rolId);
  }

  getallPermisos (): Observable<Rol> {
    return this.http.get<Rol>(this.resourceUrlPermisos);
  }

  // getPermisosFromRol (rolId:number): Observable<CollectionResponse<Permiso>> {
  //   //return this.http.get<Rol>(this.resourceUrlPermisos);
  //   return this.http.get<CollectionResponse<Permiso>>(this.resoruceUrl+"/rolId?"+rolId);
  // }

  getPermisosFromRol (rolId:number): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.resoruceUrl+"/rolId?"+rolId);
  }

  updateRolData(rolUpdated) {
    this.rol.next(rolUpdated);
  }
}