import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Proceso } from '../models/proceso.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_PROCESO } from './../proceso.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { ProcesoCriteria } from '../models/proceso-criteria.model';

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
export class ProcesoService {

  private procesodataSource = new BehaviorSubject({});
  Procesodata = this.procesodataSource.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESO;
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_proceso;
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
  search(criteria: ProcesoCriteria): Observable<CollectionResponse<Proceso>> {
    return this.http.get<CollectionResponse<Proceso>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(this.resourceUrl);
  }

  listActivities (urlToGetActivitiesListByProcessId: string): Observable<Proceso> {
    return this.http.get<Proceso>( this.appSettings.settings.hostApi + urlToGetActivitiesListByProcessId);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (proceso: Proceso): Observable<Proceso> {
    proceso.activo= true;
    return this.http.post<Proceso>(this.resourceUrl, proceso, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (proceso: Proceso): Observable<Proceso> {
    return this.http.put<Proceso>(this.resourceUrl, proceso, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (procesoId: number): Observable<Proceso> {
    return this.http.get<Proceso>(this.resourceUrl + '/' + procesoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (procesoId: number): Observable<Proceso> {
    return this.http.delete<Proceso>(this.resourceUrl + '/' + procesoId);
  }
  sendNewDataSelection(Procesodata){
    this.procesodataSource.next(Procesodata);
  }
}
