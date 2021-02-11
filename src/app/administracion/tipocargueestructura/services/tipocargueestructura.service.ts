import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Tipocargueestructura } from '../models/tipocargueestructura.model';
import { TipocargueestructuraCriteria } from '../models/tipocargueestructura-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA } from './../tipocargueestructura.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { Tipocargue } from '../../tipocargue/models/tipocargue.model';

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
export class TipocargueestructuraService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOCARGUEESTRUCTURA;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  private resourceUrlTipoCargue: string;
  public tipoCargue: Tipocargue;
  private loadSubject = new BehaviorSubject({});
  public load$ = this.loadSubject.asObservable();

  private tipoCargeUpdate = new BehaviorSubject<Tipocargue>(new Tipocargue);
  public tipoCargeUpdate$ = this.tipoCargeUpdate.asObservable();

  private changeNoticeSubject = new BehaviorSubject<Boolean>(true);
  public changeNoticeTipoCargueEstructura$ = this.changeNoticeSubject.asObservable();


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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_tipocargueestructura;
    this.resourceUrlTipoCargue = appSettings.settings.hostApi + this.constants.path_administracion_tipocargue;
  }

  updateTipoCargueClone(tipoCargue: Tipocargue){
    this.tipoCargeUpdate.next(tipoCargue);
  }

  setChangeNoticeTipoCargueEstructura(value:Boolean) {
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
  search(criteria: TipocargueestructuraCriteria): Observable<CollectionResponse<Tipocargueestructura>> {
    return this.http.get<CollectionResponse<Tipocargueestructura>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  disparar(accion){
    this.loadSubject.next({accion: accion});
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Tipocargueestructura[]> {
    return this.http.get<Tipocargueestructura[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (tipocargueestructura: Tipocargueestructura): Observable<Tipocargueestructura> {
    return this.http.post<Tipocargueestructura>(this.resourceUrl, tipocargueestructura, httpOptions );
  }

  updateTipoCargue (tipocargue: Tipocargue): Observable<Tipocargue> {
    return this.http.put<Tipocargue>(this.resourceUrlTipoCargue, tipocargue, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (tipocargueestructura: Tipocargueestructura): Observable<Tipocargueestructura> {
    return this.http.put<Tipocargueestructura>(this.resourceUrl, tipocargueestructura, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (tipocargueestructuraId: number): Observable<Tipocargueestructura> {
    return this.http.get<Tipocargueestructura>(this.resourceUrl + '/' + tipocargueestructuraId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (tipocargueestructuraId: number): Observable<Tipocargueestructura> {
    return this.http.delete<Tipocargueestructura>(this.resourceUrl + '/' + tipocargueestructuraId);
  }

  getFechaServerFormat (fecha: Date) {
    if (fecha == null) {
      return '';
    }
    let fechaStr = fecha.toJSON().substring(0, 10);
    fechaStr = fechaStr.substring(8, 10) + '-' + fechaStr.substring(5, 7) + '-' + fechaStr.substring(0, 4);
    return fechaStr;
  }
  

}
