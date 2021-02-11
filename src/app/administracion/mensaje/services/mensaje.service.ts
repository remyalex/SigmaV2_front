import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../models/mensaje.model';
import { MensajeCriteria } from '../models/mensaje-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_MENSAJE } from './../mensaje.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

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
export class MensajeService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MENSAJE;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param tokenStore Componente usado para obtener información del token del usuario
  * @param dataGeneric Referencia al servicio por el cual se obtendrán los datos requeridos
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
    private tokenStore: TokenStorageService,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_mensaje;
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
  search(criteria: MensajeCriteria): Observable<CollectionResponse<Mensaje>> {
    criteria.destinatarioId = this.tokenStore.getId();
    return this.http.get<CollectionResponse<Mensaje>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de mensaje
   */
  list (): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de mensaje.
   *
   * @param mensaje Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (mensaje: Mensaje): Observable<Mensaje> {
    return this.http.post<Mensaje>(this.resourceUrl, mensaje, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de mensaje.
  *
  * @param mensaje Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (mensaje: Mensaje): Observable<Mensaje> {
    return this.http.put<Mensaje>(this.resourceUrl, mensaje, httpOptions );
  }

  leido (mensaje: Mensaje): Observable<Mensaje> {
    mensaje.leido = 1;
    return this.http.put<Mensaje>(this.resourceUrl, mensaje, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de mensaje.
   *
   * @param mensajeId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (mensajeId: number): Observable<Mensaje> {
    return this.http.get<Mensaje>(this.resourceUrl + '/' + mensajeId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de mensaje.
  *
  * @param mensajeId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (mensajeId: number): Observable<Mensaje> {
    return this.http.delete<Mensaje>(this.resourceUrl + '/' + mensajeId);
  }

}
