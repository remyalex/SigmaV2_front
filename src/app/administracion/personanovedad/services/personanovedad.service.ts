import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Personanovedad } from '../models/personanovedad.model';
import { PersonanovedadCriteria } from '../models/personanovedad-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_PERSONANOVEDAD } from './../personanovedad.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { Persona } from '../../persona/models/persona.model';
import { CONST_ADMINISTRACION_PERSONA } from '../../persona/persona.constant';

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
export class PersonanovedadService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONANOVEDAD;
  constantsPersona = CONST_ADMINISTRACION_PERSONA;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  private resourceUrlPersona: string;
  private loadSubject = new BehaviorSubject({});
  public load$ = this.loadSubject.asObservable();

  private changeNoticeSubject = new BehaviorSubject<Boolean>(true);
  public changeNoticePersonaNovedad$ = this.changeNoticeSubject.asObservable();


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,

  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_personanovedad;
    this.resourceUrlPersona = appSettings.settings.hostApi + this.constantsPersona.path_administracion_persona;
  }

  setChangeNoticePersonaNovedad(value: Boolean) {
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
  search(criteria: PersonanovedadCriteria): Observable<CollectionResponse<Personanovedad>> {
    return this.http.get<CollectionResponse<Personanovedad>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Personanovedad[]> {
    return this.http.get<Personanovedad[]>(this.resourceUrl);

  }
  disparar(accion){
    this.loadSubject.next({accion: accion});
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (personanovedad: Personanovedad): Observable<Personanovedad> {
    return this.http.post<Personanovedad>(this.resourceUrl, personanovedad, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (personanovedad: Personanovedad): Observable<Personanovedad> {
    return this.http.put<Personanovedad>(this.resourceUrl, personanovedad, httpOptions );
  }

  updatePersona (persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(this.resourceUrlPersona, persona, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (personanovedadId: number): Observable<Personanovedad> {
    return this.http.get<Personanovedad>(this.resourceUrl + '/' + personanovedadId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (personanovedadId: number): Observable<Personanovedad> {
    return this.http.delete<Personanovedad>(this.resourceUrl + '/' + personanovedadId);
  }

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
