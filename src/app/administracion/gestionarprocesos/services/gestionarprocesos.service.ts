import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { CONST_ADMINISTRACION_GESTIONARPROCESOS } from '../gestionarprocesos.constant';
import { GestionarProcesosModel } from '../models/gestionarprocesos.model';
import { GestionarProcesosCriteria } from '../models/gestionarprocesos-criteria.model';
import { Proceso } from '../../proceso/models/proceso.model';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Documento } from '../../proceso/transicion/documentos/models/documento.model';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class GestionarprocesosService {

  /** Variable usada para notificación a otros componentes de cambios de grupos */
  private group = new BehaviorSubject({});
  /** Observable usado para tener la totalización de los elementos devueltos de formatos actualizados */
  group$ = this.group.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_GESTIONARPROCESOS;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  /** Variable usada para contruir path url a invocar del servicio de almacenamiento
   * según el método de petición requerido */
  private resourceUrlRecords: String;
  /** Variable usada para contruir path url a invocar del servicio de acciones
   * según el método de petición requerido */
  private resourceUrlAcciones: string;
  /** Variable usada para contruir path url a invocar del servicio de documentos
   * según el método de petición requerido */
  private resourceUrlDocumento: string;

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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_gestionarprocesos;
    this.resourceUrlRecords = appSettings.settings.hostApi + this.constants.path_administracion_gestionarprocesos_records;
    this.resourceUrlAcciones = appSettings.settings.hostApi + this.constants.path_administracion_gestionarprocesos_acciones_request;
    this.resourceUrlDocumento = appSettings.settings.hostApi + this.constants.path_administracion_documento;
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de gestion de procesos
   */
  list (): Observable<GestionarProcesosModel[]> {
    return this.http.get<GestionarProcesosModel[]>(this.resourceUrl, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para listar los registros
   * según el mantenimiento indicado
   *
   * @param idMantenimiento Id del mantenimiento sobre el cual se desea realizar el
   * la petición
   */
  listRecords(idMantenimiento: Number): Observable<GestionarProcesosModel[]> {
    return this.http.get<GestionarProcesosModel[]>(this.resourceUrlRecords + '/' + idMantenimiento, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para listar las actividades
   * asociadas al proceso indicado
   *
   * @param urlToGetActivitiesListByProcessId URL de la actividad relacionada con el proceso
   * en la cual se desea realizar la consulta al servidor
   */
  listActivities(urlToGetActivitiesListByProcessId: string): Observable<Proceso> {
    return this.http.get<Proceso>(this.appSettings.settings.hostApi + urlToGetActivitiesListByProcessId);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param groupToSearch Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(groupToSearch: GestionarProcesosCriteria):
    Observable<CollectionResponse<GestionarProcesosModel>> {
    return this.http.get<CollectionResponse<GestionarProcesosModel>>
    (this.resourceUrl + '/search/GP?' + groupToSearch.getUrlParameters(), httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de gestión de procesos.
   *
   * @param groupId Identificador de tipo modelo con los datos del
   * registro que se va a presentar
   */
  detail(groupId: Number): Observable<GestionarProcesosModel> {
    return this.http.get<GestionarProcesosModel>(this.resourceUrl + '/' + groupId, httpOptions)
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * solicitud de acciones a realizar por el usuario
   *
   * @param accion Acción que el usuario desea invocar en la petición
   * @param mantenimiento Objeto del mantenimiento sobre el cual se desea realizar el
   * la petición
   **/
  acciones(accion: string, mantenimiento: WorkflowMantenimientoModel) {
    return this.http.post<WorkflowMantenimientoModel>(this.resourceUrlAcciones + '/' + accion, mantenimiento, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de gestion de procesos.
  *
  * @param updateGroup Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (updateGroup: GestionarProcesosModel): Observable<GestionarProcesosModel> {
    return this.http.put<GestionarProcesosModel>(this.resourceUrl, updateGroup, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de gestion de procesos.
  *
  * @param updateGroup Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (DeleteGroupId: Number) {
    return this.http.delete(this.resourceUrl + '/' + DeleteGroupId);
  }

  /**
   * Método encargado de generar la petición al servidor para listar los documentos
   * según el mantenimiento indicado
   *
   * @param idMant Id del mantenimiento sobre el cual se desea realizar el
   * la petición
   */
  listDocuments(idMant): Observable<Documento> {
    return this.http.get<Documento>(this.resourceUrlDocumento + '/' + idMant, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para actualizar los procesos
   * indicados
   *
   * @param group Grupo de proceso a actualizar
   */
  updateGestionarProcesoList(group) {
    this.group.next(group);
  }
}

