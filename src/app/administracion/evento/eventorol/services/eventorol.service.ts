import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Eventorol } from '../models/eventorol.model';
import { EventorolCriteria } from '../models/eventorol-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_EVENTOROL } from '../eventorol.constant';
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
export class EventorolService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EVENTOROL;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  /** Id del evento usado */
  public eventoId: number;
  /** Variable usada para notificación a otros componentes de cambios */
  private loadSubject = new BehaviorSubject({});
  /** Variable usada para notificación a otros componentes de cambios */
  public load$ = this.loadSubject.asObservable();
  /** Variable usada para notificación a otros componentes de cambios */
  private changeNoticeSubject = new BehaviorSubject<Boolean>(true);
  /** Evento usada para notificación a otros componentes de cambios */
  public changeNoticeEventoRol$ = this.changeNoticeSubject.asObservable();


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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_eventorol;
  }

  /** Método encargado de notificar el cambio del evento rol */
  setChangeNoticeEventoRol(value: Boolean) {
    this.changeNoticeSubject.next(value);
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
  search(criteria: EventorolCriteria): Observable<CollectionResponse<Eventorol>> {
    criteria.eventoId = '' + this.eventoId;
    return this.http.get<CollectionResponse<Eventorol>>(this.resourceUrl + 'search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros del evento del rol
   */
  list (): Observable<Eventorol[]> {
    return this.http.get<Eventorol[]>(this.resourceUrl);
  }

  /**
   * Método encargado de listar los roles según el evento indicado
   * @param nombreEvento Nombre del evento indicado
   */
  listbyEvent(nombreEvento: string): Observable<Eventorol[]> {
    if (nombreEvento !== '') {
      return this.http.get<Eventorol[]>(this.resourceUrl + '/listbyEvento/' + nombreEvento);
    } else {
      return this.http.get<Eventorol[]>(this.resourceUrl);
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
   * un registro del evento del rol.
   *
   * @param eventorolId Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (eventorol: Eventorol): Observable<Eventorol> {
    return this.http.post<Eventorol>(this.resourceUrl, eventorol, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro del evento del rol.
  *
  * @param eventorolId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (eventorol: Eventorol): Observable<Eventorol> {
    return this.http.put<Eventorol>(this.resourceUrl, eventorol, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro del evento del rol.
   *
   * @param eventorolId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (eventorolId: number): Observable<Eventorol> {
    return this.http.get<Eventorol>(this.resourceUrl + eventorolId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro del evento del rol.
  *
  * @param eventorolId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (eventorolId: number): Observable<Eventorol> {
    return this.http.delete<Eventorol>(this.resourceUrl + eventorolId);
  }

}
