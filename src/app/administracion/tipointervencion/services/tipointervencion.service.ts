import { TipointervencionCriteria } from './../models/tipointervencion-criteria.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipointervencion } from '../models/tipointervencion.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_TIPOINTERVENCION } from './../tipointervencion.constant';
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
export class TipointervencionService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOINTERVENCION;
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_tipointervencion;
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
  search(criteria: TipointervencionCriteria): Observable<CollectionResponse<Tipointervencion>> {
    return this.http.get<CollectionResponse<Tipointervencion>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de tipos de intervención
   */
  list (): Observable<Tipointervencion[]> {
    return this.http.get<Tipointervencion[]>(this.resourceUrl);
  }

  /**
   * Método encargado de consultar los tipos de intervención de acuerdo
   * al tipo de superficie indicado
   *
   * @param tipoSuperfiecieId Tipo de superficie por el cual se va a realizar
   * la consulta
   */
  listByTipoSuperficieId (tipoSuperfiecieId): Observable<Tipointervencion[]> {
    return this.http.get<Tipointervencion[]>(this.resourceUrl + '/listByTipoSuperficie/' + tipoSuperfiecieId);
  }

  /**
   * Método encargado de realizar la creación de un tipo de intervención
   *
   * @param tipointervencion Objeto con los datos del tipo de intervención a crear
   */
  create (tipointervencion: Tipointervencion): Observable<Tipointervencion> {
    return this.http.post<Tipointervencion>(this.resourceUrl, tipointervencion, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de tipos de intervención.
  *
  * @param tipointervencion Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (tipointervencion: Tipointervencion): Observable<Tipointervencion> {
    return this.http.put<Tipointervencion>(this.resourceUrl, tipointervencion, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de tipos de intervención.
   *
   * @param tipointervencionId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (tipointervencionId: number): Observable<Tipointervencion> {
    return this.http.get<Tipointervencion>(this.resourceUrl + '/' + tipointervencionId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de tipos de intervención.
  *
  * @param tipointervencionId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (tipointervencionId: number): Observable<Tipointervencion> {
    return this.http.delete<Tipointervencion>(this.resourceUrl + '/' + tipointervencionId);
  }

}
