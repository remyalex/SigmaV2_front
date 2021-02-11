import { CONST_PRODUCCION_REGISTRO_VALE_PLANTA } from './../registrarValePlanta.constant';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { RegistrarValePlanta } from '../models/registrar-vale-planta.model';
import { RegistrarValePlantaCriteria } from '../models/registrar-vale-planta-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
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
export class RegistrarValePlantaService {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRO_VALE_PLANTA;

  public formato = new BehaviorSubject({});
  format$ = this.formato.asObservable();

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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_produccion_registrar_vale_planta;
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
  search(criteria: RegistrarValePlantaCriteria): Observable<CollectionResponse<RegistrarValePlanta>> {
    return this.http.get<CollectionResponse<RegistrarValePlanta>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<RegistrarValePlanta[]> {
    return this.http.get<RegistrarValePlanta[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (formato: RegistrarValePlanta): Observable<RegistrarValePlanta> {
    return this.http.post<RegistrarValePlanta>(this.resourceUrl, formato, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (formato: RegistrarValePlanta): Observable<RegistrarValePlanta> {
    return this.http.put<RegistrarValePlanta>(this.resourceUrl, formato, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (formatoId: number): Observable<RegistrarValePlanta> {
    return this.http.get<RegistrarValePlanta>(this.resourceUrl + '/' + formatoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (formatoId: number): Observable<RegistrarValePlanta> {
    return this.http.delete<RegistrarValePlanta>(this.resourceUrl + '/' + formatoId);
  }
  updateDataRegistrarValePlanta(data) {
    this.formato.next(data);
  }
}
