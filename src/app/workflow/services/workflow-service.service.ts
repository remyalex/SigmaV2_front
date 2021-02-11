import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { WorkflowMantenimientoActividadModel } from '../models/workflow-mantenimiento-actividad.model';
import { WorkflowMantenimientoModel } from '../models/workflow-mantenimiento.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { TransicionModel } from 'src/app/administracion/proceso/models/transicion.model';

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
export class WorkflowService {

  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

    /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/workflow';
  }

  /**
   * Método encargado de devolver on apuntador al mantenimiento actividad
   * @param nombreProceso Nombre del proceso del cual obtener la actividad
   * @param nombreActividad Nombre de la actividad del cual se desea obtener el mantenimiento de la actividad
   */
  get(nombreProceso: string, nombreActividad: string): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.get<WorkflowMantenimientoActividadModel>(this.resourceUrl + '/' + nombreProceso + '/' + nombreActividad);
  }

  /**
   * Método enargado de solicitar la ejecución del servicio work retornando el observable del mantenimiento
   * @param mantenimientoId mantenimiento al cual se le va a realizar la acción
   * @param actividadId Actividad en la cual se encuentra el mantenimiento
   */
  work(mantenimientoId: number, actividadId: number): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.get<WorkflowMantenimientoActividadModel>(this.resourceUrl + '/work/' + mantenimientoId + '/' + actividadId);
  }

  /**
   * Método enargado de solicitar la ejecución del servicio work retornando el observable del mantenimiento
   * @param mantenimientoId mantenimiento al cual se le va a realizar la acción
   */
  workMantenimiento(mantenimientoId: number): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.get<WorkflowMantenimientoActividadModel>(this.resourceUrl + '/work/' + mantenimientoId);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de workflow.
   *
   * @param mantenimientoActividad Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (mantenimientoActividad: WorkflowMantenimientoActividadModel): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.post<WorkflowMantenimientoActividadModel>(this.resourceUrl + '/actividad', mantenimientoActividad, httpOptions);
  }

  /**
   * Método encargado de invocar el servicio de almnacenamiento de la información
   *
   * @param nombreProceso Nombre del proceso que corresponde al mantenimiento a almacenar
   * @param nombreActividad  Nombre de la actividad que corresponde al mantenimiento a almacenar
   * @param mantenimientoBody Datos del mantenimiento a almacenar
   */
  save(nombreProceso: string, nombreActividad: string, mantenimientoBody): Observable<any> {
    return this.http.post(this.resourceUrl + '/' + nombreProceso + '/' + nombreActividad, mantenimientoBody, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de mantenimiento actividad.
  *
  * @param mantenimientoActividad Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (mantenimientoActividad: WorkflowMantenimientoActividadModel): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.post<WorkflowMantenimientoActividadModel>(this.resourceUrl + '/actividad', mantenimientoActividad, httpOptions);
  }

  /**
   * Método encargado invocar la petición para asignar el radicado de salida al mantenimiento
   *
   * @param mantenimiento Mantenimiento al cual se va a aasignar el radicado de salida
   */
  setRadicadoSalida(mantenimiento: WorkflowMantenimientoModel): Observable<WorkflowMantenimientoModel> {
    const url = this.appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento/radicadoSalida';
    return this.http.post<WorkflowMantenimientoModel>(url, mantenimiento, httpOptions);
  }

  /**
   * Método encargado de invocar la petición de visualización del detalle del mantenimiento
   *
   * @param mantenimiento Mantenimiento al cual se va a presentar el detalle del radicado de salida
   */
  detail(mantenimientoId: number): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.get<WorkflowMantenimientoActividadModel>(this.resourceUrl + '/mantenimiento-registro/' + mantenimientoId);
  }

  /**
   * Método encargado de crear una lista de actividades del mantenimiento
   * @param mantenimientoActividad Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  createList(mantenimientosActividad: WorkflowMantenimientoActividadModel[]):
    Observable<CollectionResponse<WorkflowMantenimientoActividadModel>> {
    return this.http.post<CollectionResponse<WorkflowMantenimientoActividadModel>>
      (this.resourceUrl + '/actividadList', mantenimientosActividad, httpOptions);
  }

  /**
   * Método encargado de invocar la petición para asignar el radicado de solicitud de la reserva
   * @param mantenimiento Mantenimiento al cual se va a presentar el detalle del radicado de salida
   */
  setRadicadoSolicitudReserva(mantenimiento: WorkflowMantenimientoModel): Observable<WorkflowMantenimientoModel> {
    const url = this.appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento/radicadoSolicitudReserva';
    return this.http.post<WorkflowMantenimientoModel>(url, mantenimiento, httpOptions);
  }

  /**
   * Método encargado de invocar la petición para asignar el radicado de respuesta de la reserva
   * @param mantenimiento Mantenimiento al cual se va a presentar el detalle del radicado de salida
   */
  setRadicadoRespuestaReserva(mantenimiento: WorkflowMantenimientoModel): Observable<WorkflowMantenimientoModel> {
    const url = this.appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento/radicadoRespuestaReserva';
    return this.http.post<WorkflowMantenimientoModel>(url, mantenimiento, httpOptions);
  }

  /**
   * Método encargado de invocar la petición para listar los ingeneros de diseño de la visita
   * @param path Ruta con los datos de solicitud de la consulta
   */
  listIngenierosDisenio(path): Observable<CollectionResponse<Persona>> {
    return this.http.get<CollectionResponse<Persona>>(path);
  }

  /**
   * Método encargado de invocar la petición de consulta del detalle de la transición invocada
   * @param idTransicion Identificador de transición a consultar
   */
  detailTransicion (idTransicion: number): Observable<TransicionModel> {
    return this.http.get<TransicionModel>(this.resourceUrl + '/detalleTransicion/' + idTransicion);
  }
}
