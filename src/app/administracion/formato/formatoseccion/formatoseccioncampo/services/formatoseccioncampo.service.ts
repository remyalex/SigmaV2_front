import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formatoseccioncampo } from '../models/formatoseccioncampo.model';
import { FormatoseccioncampoCriteria } from '../models/formatoseccioncampo-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_FORMATOSECCIONCAMPO } from '../formatoseccioncampo.constant';
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
export class FormatoseccioncampoService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_FORMATOSECCIONCAMPO;
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_formatoseccioncampo;
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
  search(criteria: FormatoseccioncampoCriteria): Observable<CollectionResponse<Formatoseccioncampo>> {
    return this.http.get<CollectionResponse<Formatoseccioncampo>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de formato sección
   */
  list (): Observable<Formatoseccioncampo[]> {
    return this.http.get<Formatoseccioncampo[]>(this.resourceUrl);
  }

  listbyCodigoformato(codigoFormato: string): Observable<CollectionResponse<Formatoseccioncampo>> {
    if (codigoFormato !== '') {
      return this.http.get<CollectionResponse<Formatoseccioncampo>>(this.resourceUrl + '/listbyCodigoFormato/' + codigoFormato);
    }
    else {
      return this.http.get<CollectionResponse<Formatoseccioncampo>>(this.resourceUrl);
    }
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de formato sección.
   *
   * @param formatoseccioncampo Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (formatoseccioncampo: Formatoseccioncampo): Observable<Formatoseccioncampo> {
    return this.http.post<Formatoseccioncampo>(this.resourceUrl, formatoseccioncampo, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de formato sección.
  *
  * @param formatoseccioncampo Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (formatoseccioncampo: Formatoseccioncampo): Observable<Formatoseccioncampo> {
    return this.http.put<Formatoseccioncampo>(this.resourceUrl, formatoseccioncampo, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de formato sección.
   *
   * @param formatoseccioncampoId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (formatoseccioncampoId: number): Observable<Formatoseccioncampo> {
    return this.http.get<Formatoseccioncampo>(this.resourceUrl + '/' + formatoseccioncampoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de formato sección.
  *
  * @param formatoseccioncampoId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (formatoseccioncampoId: number): Observable<Formatoseccioncampo> {
    return this.http.delete<Formatoseccioncampo>(this.resourceUrl + '/' + formatoseccioncampoId);
  }

}
