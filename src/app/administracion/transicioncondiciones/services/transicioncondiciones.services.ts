import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { CONST_ADMINISTRACION_TRANSICIONCONDICIONES } from '../transicioncondiciones.constants';
import { TransicionCondicionesCriteria } from '../models/transicioncondiciones-criteria.model';
import { Condiciones } from '../models/condiciones.model';
import { WorkflowMantenimientoModel } from './../../../workflow/models/workflow-mantenimiento.model';
import { GridMantenimientoCriteria } from 'src/app/shared/component/grid-mantenimientos/model/grid-mantenimiento.criteria.model';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CondicionService {

  private group = new BehaviorSubject({});
  group$ = this.group.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TRANSICIONCONDICIONES;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  private resourceUrlDataBase: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
  ) {
    this.resourceUrlDataBase = appSettings.settings.hostApi + this.constants.path_administracion_condicion;
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_condicion_crud;
  }

  getListAtributos(): Observable<any[]> {
    return this.http.get<any[]>(this.resourceUrlDataBase, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Condiciones[]> {
    return this.http.get<Condiciones[]>(this.resourceUrl, httpOptions);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(groupToSearch: TransicionCondicionesCriteria): Observable<CollectionResponse<Condiciones>> {
    return this.http.get<CollectionResponse<Condiciones>>(
      this.resourceUrl + '/search?' + groupToSearch.getUrlParameters(), httpOptions
    );
  }

  detail(groupId: Number): Observable<Condiciones> {
    return this.http.get<Condiciones>(this.resourceUrl + '/' + groupId, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (newGroup: Condiciones): Observable<Condiciones> {
    return this.http.post<Condiciones>(this.resourceUrl, newGroup, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (updateGroup: Condiciones): Observable<Condiciones> {
    return this.http.put<Condiciones>(this.resourceUrl, updateGroup, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (DeleteGroupId: Number) {
    return this.http.delete(this.resourceUrl + '/' + DeleteGroupId);
  }

  updateGroupList(group) {
    this.group.next(group);
  }

  mantenimientosByCondicion(criteria: GridMantenimientoCriteria): Observable<CollectionResponse<WorkflowMantenimientoModel>> {
    return this.http.post<CollectionResponse<WorkflowMantenimientoModel>>(
      this.resourceUrl + '/mantenimientosByCondicion', criteria, httpOptions);
  }
}
