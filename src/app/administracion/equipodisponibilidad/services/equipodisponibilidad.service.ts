import { Modelcalendario } from './../../recurso/models/modelcalendario.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Equipodisponibilidad } from '../models/equipodisponibilidad.model';
import { EquipoDisponibilidadCriteria } from '../models/equipodisponibilidad-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD } from './../equipodisponibilidad.constant';
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
export class EquipodisponibilidadService {

  /** Variable usada para notificación a otros componentes de cambios */
  public loadSubject = new BehaviorSubject({});
  /** Evento usado para notificación a otros componentes de cambios */
  public load$ = this.loadSubject.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPODISPONIBILIDAD;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  public resourceUrl: string;

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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_equipodisponibilidad;
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param equipodisponibilidad Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (equipodisponibilidad: Equipodisponibilidad): Observable<Equipodisponibilidad> {
    return this.http.post<Equipodisponibilidad>(this.resourceUrl, equipodisponibilidad, httpOptions);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: EquipoDisponibilidadCriteria): Observable<CollectionResponse<Equipodisponibilidad>> {
    return this.http.get<CollectionResponse<Equipodisponibilidad>>(this.resourceUrl + 'search?' + criteria.getUrlParameters());
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de equipodisponibilidad.
  *
  * @param equipodisponibilidad Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (equipodisponibilidad: Equipodisponibilidad): Observable<Equipodisponibilidad> {
    return this.http.put<Equipodisponibilidad>(this.resourceUrl, equipodisponibilidad, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la visualización de detalle de
  * un registro de equipo disponibilidad.
  *
  * @param equipodisponibilidadId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  detail(equipodisponibilidadId: number): Observable<Equipodisponibilidad> {
    return this.http.get<Equipodisponibilidad>(this.resourceUrl + equipodisponibilidadId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de disponibilidad de equipo.
  *
  * @param equipodisponibilidadId Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (equipodisponibilidadId: number): Observable<Equipodisponibilidad> {
    return this.http.delete<Equipodisponibilidad>(this.resourceUrl + equipodisponibilidadId);
  }

  /**
   * Método encargado de listar los calendarios del equipo indicado
   * @param equipoId Id del equipo del que se desea listar el calendario
   */
  listCalendariosByEquipo (equipoId: number): Observable<Modelcalendario[]> {
    return this.http.get<Modelcalendario[]>(this.resourceUrl +
    'findAllCalendariosByEquipo/' + equipoId);
  }

  /**
   * Método encargado de listar los calendarios del equipo y fecha indicado
   * @param equipoId Id del equipo del que se desea listar el calendario
   */
  listCalendariosByEquipoAndFecha (lugarId: number, fechaStr: string): Observable<Modelcalendario[]> {
    return this.http.get<Modelcalendario[]>(this.resourceUrl +
    'findAllCalendariosByEquipo/' + lugarId + '/fecha/' + fechaStr);
  }

}
