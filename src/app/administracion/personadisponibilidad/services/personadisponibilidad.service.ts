import { Modelcalendario } from './../../recurso/models/modelcalendario.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Personadisponibilidad } from '../models/personadisponibilidad.model';
import { PersonadisponibilidadCriteria } from '../models/personadisponibilidad-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_PERSONADISPONIBILIDAD } from './../personadisponibilidad.constant';
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
export class PersonadisponibilidadService {

  private loadSubject = new BehaviorSubject({});
  public load$ = this.loadSubject.asObservable();

  private modelIsChangeSubjet = new BehaviorSubject({});
  public modelIsChangeSubjet$ = this.modelIsChangeSubjet.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONADISPONIBILIDAD;
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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_personadisponibilidad;
  }
  public notifyChangeModel(newData: any ) {
    this.modelIsChangeSubjet.next(newData);
  }
  disparar(accion){
    this.loadSubject.next({accion: accion});
  }
  searchByList(path: string, id: number) {
    return this.dataGeneric.buscarListaId(path, id);
  }
  searchById(path: string, id: number) {
    return this.dataGeneric.buscarGeneralId(path);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: PersonadisponibilidadCriteria): Observable<CollectionResponse<Personadisponibilidad>> {
    return this.http.get<CollectionResponse<Personadisponibilidad>>(this.resourceUrl + 'search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Personadisponibilidad[]> {
    return this.http.get<Personadisponibilidad[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (personadisponibilidad: Personadisponibilidad): Observable<Personadisponibilidad> {
    return this.http.post<Personadisponibilidad>(this.resourceUrl, personadisponibilidad, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (personadisponibilidad: Personadisponibilidad): Observable<Personadisponibilidad> {
    return this.http.put<Personadisponibilidad>(this.resourceUrl, personadisponibilidad, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (personadisponibilidadId: number): Observable<Personadisponibilidad> {
    return this.http.get<Personadisponibilidad>(this.resourceUrl + personadisponibilidadId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (personadisponibilidadId: number): Observable<Personadisponibilidad> {
    return this.http.delete<Personadisponibilidad>(this.resourceUrl +  personadisponibilidadId);
  }

  listCalendariosByPersona (personaId: number): Observable<Modelcalendario[]> {
    return this.http.get<Modelcalendario[]>(this.resourceUrl +
    'findAllCalendariosByPersona/' + personaId);
  }

  listCalendariosByPersonaAndFecha (personaId: number, fechaStr: string): Observable<Modelcalendario[]> {
    return this.http.get<Modelcalendario[]>(this.resourceUrl +
    'findAllCalendariosByPersona/' + personaId + '/fecha/' + fechaStr);
  }
}
