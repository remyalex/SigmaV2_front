import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Persona } from '../models/persona.model';
import { PersonaCriteria } from '../models/persona-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_PERSONA } from './../persona.constant';
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
export class PersonaService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_PERSONA;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  public persona: Persona = new Persona();
  public personaClone = new BehaviorSubject<Persona>(new Persona);
  public personaClone$ = this.personaClone.asObservable();


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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_persona;
  }

  updateClonePersona(persona: Persona) {
    this.personaClone.next(persona);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: PersonaCriteria): Observable<CollectionResponse<Persona>> {
    return this.http.get<CollectionResponse<Persona>>(this.resourceUrl + 'search?' + criteria.getUrlParameters());
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
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de personaId
   */
  list (): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de personaId.
   *
   * @param personaId Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.resourceUrl, persona, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de personaId.
  *
  * @param personaId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(this.resourceUrl, persona, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de personaId.
   *
   * @param personaId Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (personaId: number): Observable<Persona> {
    return this.http.get<Persona>(this.resourceUrl + personaId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de personaId.
  *
  * @param personaId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (personaId: number): Observable<Persona> {
    return this.http.delete<Persona>(this.resourceUrl + personaId);
  }

  getPersonasByRol( rol: string ): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.resourceUrl}personaByRol?rol=` + rol);
  }

  getAllResidentesSocialesConNumeroAsignaciones(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.resourceUrl}findAllResidentesSocialesConNumeroAsignaciones`);
  }

  getAllResidentesAmbientalesConNumeroAsignaciones(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.resourceUrl}findAllResidentesAmbientalesConNumeroAsignaciones`);
  }

  getAllResidentesSSTConNumeroAsignaciones(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.resourceUrl}findAllResidentesSSTConNumeroAsignaciones`);
  }

}
