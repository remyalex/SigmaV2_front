import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Eventousuario } from '../models/eventousuario.model';
import { EventousuarioCriteria } from '../models/eventousuario-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_EVENTOUSUARIO } from '../eventousuario.constant';
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
export class EventousuarioService {
  /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOUSUARIO;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  /** Id del evento usado */
  public eventoId: number;
  /** Variable usada para notificar la carga de la pagina */
  private loadSubject = new BehaviorSubject({});
  /** Variable usada para notificación a otros componentes de cambios */
  public load$ = this.loadSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  private changeNoticeSubject = new BehaviorSubject<Boolean>(true);
  /** Evento usada para notificación a otros componentes de cambios */
  public changeNoticeEventoUsuario$ = this.changeNoticeSubject.asObservable();


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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_eventousuario;
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
   * Método encargado de gestionar la acción cambio en el evento del usuario
   * @param value Valor que tomará el nuevo evento usuario
   */
  setChangeNoticeEventousuario(value: Boolean) {
    this.changeNoticeSubject.next(value);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: EventousuarioCriteria): Observable<CollectionResponse<Eventousuario>> {
    criteria.eventoId = '' + this.eventoId;
    return this.http.get<CollectionResponse<Eventousuario>>(this.resourceUrl + 'search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de evento de usuario
   */
  list (): Observable<Eventousuario[]> {
    return this.http.get<Eventousuario[]>(this.resourceUrl);
  }

  /**
   * Método encargado de listar los eventos usuarios dado el nombre del evento
   * @param nombreEvento Nombre del evento por el cual se listaran los usuarios
   */
  listbyEvent(nombreEvento: string): Observable<Eventousuario[]> {
    if (nombreEvento !== '') {
      return this.http.get<Eventousuario[]>(this.resourceUrl + '/listbyEvento/' + nombreEvento);
    }
    else {
      return this.http.get<Eventousuario[]>(this.resourceUrl);
    }
  }

   /**
   * Método encargado de notificar el disparo de la acción indicada
   * @param accion Acción a ejecutar
  */
  disparar(accion) {
    this.loadSubject.next({accion: accion});
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de evento de usuario
   *
   * @param eventousuario Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (eventousuario: Eventousuario): Observable<Eventousuario> {
    // eventousuario.eventoId = this.eventoId;
    return this.http.post<Eventousuario>(this.resourceUrl, eventousuario, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de evento de usuario
  *
  * @param eventousuario Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (eventousuario: Eventousuario): Observable<Eventousuario> {
    this.setChangeNoticeEventousuario(true);
    return this.http.put<Eventousuario>(this.resourceUrl, eventousuario, httpOptions );
  }

  /**
   * 
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de evento de usuario
   *
   * @param eventousuarioId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (eventousuarioId: number): Observable<Eventousuario> {
    return this.http.get<Eventousuario>(this.resourceUrl + eventousuarioId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de evento de usuario
  *
  * @param eventousuarioId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (eventousuarioId: number): Observable<Eventousuario> {
    return this.http.delete<Eventousuario>(this.resourceUrl + eventousuarioId);
  }

  /**
   * Método encargado de devolver la fecha en cadena
   * de texto segun requiere la petición de servidor
   *
   * @param fecha Fecha a convertir
  */
  getFechaServerFormat (fecha: Date) {
    if (fecha == null) {
      return '';
    }
    let fechaStr = fecha.toJSON().substring(0, 16);
    // tslint:disable-next-line:max-line-length
    fechaStr =
    fechaStr.substring(8, 10) + '-' +
    fechaStr.substring(5, 7) + '-' +
    fechaStr.substring(0, 4) + ' ' +

    fechaStr.substring(11, 13) + ':' +
    fechaStr.substring(14, 17) + ':00';

    return fechaStr;
  }

}
