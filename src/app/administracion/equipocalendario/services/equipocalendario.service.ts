import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipocalendario } from '../models/equipocalendario.model';
import { EquipocalendarioCriteria, EquipocalendarioCalendarsCriteria } from '../models/equipocalendario-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_EQUIPOCALENDARIO } from './../equipocalendario.constant';
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
export class EquipocalendarioService {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCALENDARIO;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  /** Variable usada para contruir path url a invocar del servicio de calendarios
   * según el método de petición requerido */
  private resourceUrlCalendars: string;
  /** Variable usada para contruir path url a invocar del servicio de visitas asignadas
   * según el método de petición requerido */
  private resourceUrlCalendarsVisitaAsignacion: string;

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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_equipocalendario;
    this.resourceUrlCalendars = appSettings.settings.hostApi + this.constants.path_administracion_equipocalendario_calendars_compl;
    this.resourceUrlCalendarsVisitaAsignacion = appSettings.settings.hostApi + this.constants.path_administracion_equipocalendarios_visita_asignacion;
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
   * @param absoluta Identifica si la ruta enviada es relativa o absoluta
   **/
  getActividad(path: string, absoluta = false) {
    return this.dataGeneric.buscarGeneralId(path, absoluta);
  }

  /**
   * Método encargado de buscar los calendarios según los criterios proporciondos
   *
   * @param criteria Criterios por los cuales se realizará la consulta
  */
  searchCalendars(criteria: EquipocalendarioCalendarsCriteria): Observable<CollectionResponse<Equipocalendario>> {
    return this.http.get<CollectionResponse<Equipocalendario>>(this.resourceUrlCalendars + 'search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de buscar los calendarios según los criterios proporciondos
   *
   * @param criteria Criterios por los cuales se realizará la consulta
  */
  searchCalendarsVisitaAsignacion(criteria: EquipocalendarioCalendarsCriteria): Observable<CollectionResponse<Equipocalendario>> {
    return this.http.get<CollectionResponse<Equipocalendario>>(this.resourceUrlCalendarsVisitaAsignacion + 'search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: EquipocalendarioCriteria, path = ''): Observable<CollectionResponse<Equipocalendario>> {
    let patConsulta = this.resourceUrl + 'search?' + criteria.getUrlParameters();
    if (path) {
      patConsulta = this.appSettings.settings.hostApi + path;
    }
    return this.http.get<CollectionResponse<Equipocalendario>>(patConsulta);
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Equipocalendario[]> {
    return this.http.get<Equipocalendario[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de equipo calendario.
   *
   * @param equipocalendario Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (equipocalendario: Equipocalendario): Observable<Equipocalendario> {
    return this.http.post<Equipocalendario>(this.resourceUrl, equipocalendario, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de equipocalendario.
  *
  * @param equipocalendario Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (equipocalendario: Equipocalendario): Observable<Equipocalendario> {
    return this.http.put<Equipocalendario>(this.resourceUrl, equipocalendario, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la visualización de detalle de
  * un registro de equipocalendario.
  *
  * @param equipocalendarioId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  detail(equipocalendarioId: number): Observable<Equipocalendario> {
    return this.http.get<Equipocalendario>(this.resourceUrl + equipocalendarioId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de equipo calendario.
  *
  * @param equipocalendarioId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (equipocalendarioId: number): Observable<Equipocalendario> {
    return this.http.delete<Equipocalendario>(this.resourceUrl + equipocalendarioId);
  }

}
