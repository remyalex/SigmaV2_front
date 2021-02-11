import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Procesotransicionobjeto } from '../models/procesotransicionobjeto.model';
import { ProcesotransicionobjetoCriteria } from '../models/procesotransicionobjeto-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_PROCESOTRANSICIONOBJETO } from './../sigma-proceso-detalle.constant';
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
export class ProcesotransicionobjetoService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PROCESOTRANSICIONOBJETO;
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_procesotransicionobjeto;
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

  searchById(path: string, id: number) {
    return this.dataGeneric.buscarGeneralId(`${path}${id}`);
  }

  getDataTransiciones(objetoId: Number) {
    return this.http.get<CollectionResponse<Procesotransicionobjeto>>
      (`${this.appSettings.settings.hostApi}/api/administracion/procesotransicionobjeto/objeto/${objetoId}`, httpOptions);
  }

  getData(nombreProceso: string, objetoId: Number) {
    return this.http.get<CollectionResponse<Procesotransicionobjeto>>
      (`${this.resourceUrl}/procesos/${nombreProceso}/objeto/${objetoId}`, httpOptions);
  }

  getDataView(nombreProceso: string, objetoId: Number) {
    return this.http.get<CollectionResponse<Procesotransicionobjeto>>
    (`${this.appSettings.settings.hostApi}/api/mejoramiento/diagnosticohistorial/historico/proceso/${nombreProceso}/objeto/${objetoId}`, httpOptions);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: ProcesotransicionobjetoCriteria): Observable<CollectionResponse<Procesotransicionobjeto>> {
    return this.http.get<CollectionResponse<Procesotransicionobjeto>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Procesotransicionobjeto[]> {
    return this.http.get<Procesotransicionobjeto[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (procesotransicionobjeto: Procesotransicionobjeto): Observable<Procesotransicionobjeto> {
    return this.http.post<Procesotransicionobjeto>(this.resourceUrl, procesotransicionobjeto, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (procesotransicionobjeto: Procesotransicionobjeto): Observable<Procesotransicionobjeto> {
    return this.http.put<Procesotransicionobjeto>(this.resourceUrl, procesotransicionobjeto, httpOptions);
  }

  detail(procesotransicionobjetoId: number): Observable<Procesotransicionobjeto> {
    return this.http.get<Procesotransicionobjeto>(this.resourceUrl + '/' + procesotransicionobjetoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (procesotransicionobjetoId: number): Observable<Procesotransicionobjeto> {
    return this.http.delete<Procesotransicionobjeto>(this.resourceUrl + '/' + procesotransicionobjetoId);
  }

}
