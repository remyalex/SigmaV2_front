import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { GrupoModel } from '../models/grupo.model';
import { GrupoCriteria } from '../models/grupo-criteria.model';
import { CONST_ADMINISTRACION_GRUPO } from '../grupo.constant';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  /** Variable usada para notificación a otros componentes de cambios de grupos */
  private group = new BehaviorSubject({});
  /** Observable usado para tener la totalización de los elementos devueltos de formatos actualizados */
  group$ = this.group.asObservable();
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GRUPO;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_grupo;
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de grupos
   */
  list (): Observable<GrupoModel[]> {
    return this.http.get<GrupoModel[]>(this.resourceUrl, httpOptions);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(groupToSearch: GrupoCriteria): Observable<CollectionResponse<GrupoModel>> {
    return this.http.get<CollectionResponse<GrupoModel>>(this.resourceUrl + 'search?' + groupToSearch.getUrlParameters() , httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de grupos.
   *
   * @param groupId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail(groupId: Number): Observable<GrupoModel> {
    return this.http.get<GrupoModel>(this.resourceUrl + groupId, httpOptions)
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de grupos.
   *
   * @param newGroup Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (newGroup: GrupoModel): Observable<GrupoModel> {
    return this.http.post<GrupoModel>(this.resourceUrl, newGroup, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de grupos.
  *
  * @param updateGroup Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (updateGroup: GrupoModel): Observable<GrupoModel> {
    return this.http.put<GrupoModel>(this.resourceUrl, updateGroup, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de grupos.
  *
  * @param DeleteGroupId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (DeleteGroupId: Number) {
    return this.http.delete(this.resourceUrl + DeleteGroupId);
  }

  /**
   * Método encargado de generar la petición al servidor para la actualización de
   * un registro de grupos
   *
   * @param group Objeto de tipo grupo con la información a actualizar
   */
  updateGroupList(group) {
    this.group.next(group);
  }

}
