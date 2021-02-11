import { Modelcalendario } from './../../recurso/models/modelcalendario.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Lugardisponibilidad } from '../models/lugardisponibilidad.model';
import { LugardisponibilidadCriteria } from '../models/lugardisponibilidad-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_LUGARDISPONIBILIDAD } from './../lugardisponibilidad.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
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
export class LugardisponibilidadService {

  /** Variable usada para notificación a otros componentes de cambios
   * de las disponibilidades de los lugares */
   private loadSubject = new BehaviorSubject({});
   /** Observable usado para tener la totalización de los elementos de las disponibilidades de los lugares */
   public load$ = this.loadSubject.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_LUGARDISPONIBILIDAD;
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_lugardisponibilidad;
  }

  /**
   * Método encargado de generar la petición de la acción que se
   * disparará desde el usuario según la disponibilidad de lugar
   *
   * @param accion Acción invocada por el usuario
   */
  disparar(accion) {
    this.loadSubject.next({ accion: accion });
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
   * Método encargado de obtener los datos de una lista
   * dado el path de esta y el id correspondiente.
   *
   * @param path Cadena de texto que indica la ruta de la
   * lista de la cual se obtendrá información
   *
   * @param id Identificador de el item de la lista por el cual
   * se desea filtrar los items de la lista
   **/
  searchById(path: string, id: number) {
    return this.dataGeneric.buscarGeneralId(path);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: LugardisponibilidadCriteria): Observable<CollectionResponse<Lugardisponibilidad>> {
    return this.http.get<CollectionResponse<Lugardisponibilidad>>(this.resourceUrl + 'search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de disponibilidades de los lugares
   */
  list (): Observable<Lugardisponibilidad[]> {
    return this.http.get<Lugardisponibilidad[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de disponibilidades de los lugares.
   *
   * @param lugardisponibilidad Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (lugardisponibilidad: Lugardisponibilidad): Observable<Lugardisponibilidad> {
    return this.http.post<Lugardisponibilidad>(this.resourceUrl, lugardisponibilidad, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de disponibilidades de los lugares.
  *
  * @param lugardisponibilidad Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (lugardisponibilidad: Lugardisponibilidad): Observable<Lugardisponibilidad> {
    return this.http.put<Lugardisponibilidad>(this.resourceUrl, lugardisponibilidad, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de disponibilidades de los lugares.
   *
   * @param lugardisponibilidadId Objeto de tipo modelo con los datos del
   * registro que se va a consultar
   */
  detail(lugardisponibilidadId: number): Observable<Lugardisponibilidad> {
    return this.http.get<Lugardisponibilidad>(this.resourceUrl + '/' + lugardisponibilidadId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de disponibilidades de los lugares.
  *
  * @param lugardisponibilidadId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (lugardisponibilidadId: number): Observable<Lugardisponibilidad> {
    return this.http.delete<Lugardisponibilidad>(this.resourceUrl + lugardisponibilidadId);
  }

  /**
   * Método encargado de generar la petición de consulta de los calendarios
   * disponibles para el lugar indicado
   *
   * @param lugarId Identificador del lugar del cual se debe consultar los calendarios
   */
  listCalendariosByLugar (lugarId: number): Observable<Modelcalendario[]> {
    return this.http.get<Modelcalendario[]>(this.resourceUrl +
    'findAllCalendariosByLugar/' + lugarId);
  }

  /**
   * Método encargado de generar la petición de consulta de los calendarios
   * disponibles, según el lugar y la fecha indicados
   *
   * @param lugarId Identificador del lugar sobre el cual se realizará la consulta
   * @param fechaStr Cadena de texto desde la cual se realizará la busqueda de calendarios
   */
  listCalendariosByLugarAndFecha (lugarId: number, fechaStr: string): Observable<Modelcalendario[]> {
    return this.http.get<Modelcalendario[]>(this.resourceUrl +
    'findAllCalendariosByLugar/' + lugarId + '/fecha/' + fechaStr);
  }
}
