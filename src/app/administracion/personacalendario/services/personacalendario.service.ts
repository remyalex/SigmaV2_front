import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personacalendario } from '../models/personacalendario.model';
import { PersonacalendarioCriteria, PersonacalendarioCalendarsCriteria } from '../models/personacalendario-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_PERSONACALENDARIO } from './../personacalendario.constant';
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
export class PersonacalendarioService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONACALENDARIO;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  private resourceUrlCalendars: string;
 

  /**
  * Método encargado de construir una instancia del componente
  */
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_personacalendario;
    this.resourceUrlCalendars = appSettings.settings.hostApi + this.constants.path_administracion_personacalendario_calendars;
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
  search(criteria: PersonacalendarioCriteria, path = ''): Observable<CollectionResponse<Personacalendario>> {
    let patConsulta = this.resourceUrl + '/search?' + criteria.getUrlParameters();
    if (path) {
      patConsulta = this.appSettings.settings.hostApi + path;
    }
    return this.http.get<CollectionResponse<Personacalendario>>(patConsulta);
  }

  listCalendars(path: string): Observable<CollectionResponse<Personacalendario>> {
    return this.http.get<CollectionResponse<Personacalendario>>(path);
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Personacalendario[]> {
    return this.http.get<Personacalendario[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (personacalendario: Personacalendario): Observable<Personacalendario> {
    return this.http.post<Personacalendario>(this.resourceUrl, personacalendario, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (personacalendario: Personacalendario): Observable<Personacalendario> {
    return this.http.put<Personacalendario>(this.resourceUrl, personacalendario, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (personacalendarioId: number): Observable<Personacalendario> {
    return this.http.get<Personacalendario>(this.resourceUrl + '/' + personacalendarioId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (personacalendarioId: number): Observable<Personacalendario> {
    return this.http.delete<Personacalendario>(this.resourceUrl + '/' + personacalendarioId);
  }

}
