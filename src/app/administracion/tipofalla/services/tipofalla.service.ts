import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipofalla } from '../models/tipofalla.model';
import { TipofallaCriteria } from '../models/tipofalla-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_TIPOFALLA } from './../tipofalla.constant';
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
export class TipofallaService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOFALLA;
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_tipofalla;
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
  search(criteria: TipofallaCriteria): Observable<CollectionResponse<Tipofalla>> {
    return this.http.get<CollectionResponse<Tipofalla>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de tipo de falla
   */
  list (): Observable<Tipofalla[]> {
    return this.http.get<Tipofalla[]>(this.resourceUrl);
  }

  /**
   * Método encargado de obtener el listado de tipos de falla según el tipo
   * de superficie indicado.
   *
   * @param tipoSuperfiecieId Tipo de superficie por el cual se realizará la consulta
   */
  listByTipoSuperficieId (tipoSuperfiecieId): Observable<Tipofalla[]> {
    return this.http.get<Tipofalla[]>(this.resourceUrl + '/listByTipoSuperficie/' + tipoSuperfiecieId);
  }

  /**
   * Método por medio del cual se envia la peticion al servidor de la creación de
   * de una nueva falla
   *
   * @param tipofalla Tipo de Falla nueva a registrar al diagnóstico
   */
  create (tipofalla: Tipofalla): Observable<Tipofalla> {
    return this.http.post<Tipofalla>(this.resourceUrl, tipofalla, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de tipo de falla.
  *
  * @param tipofalla Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (tipofalla: Tipofalla): Observable<Tipofalla> {
    return this.http.put<Tipofalla>(this.resourceUrl, tipofalla, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de tipo de falla.
   *
   * @param tipofalla Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (tipofallaId: number): Observable<Tipofalla> {
    return this.http.get<Tipofalla>(this.resourceUrl + '/' + tipofallaId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de tipo de falla.
  *
  * @param tipofalla Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (tipofallaId: number): Observable<Tipofalla> {
    return this.http.delete<Tipofalla>(this.resourceUrl + '/' + tipofallaId);
  }

}
