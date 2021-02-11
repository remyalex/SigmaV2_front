import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { EquipoConductor } from '../models/equipoconductor.model';
import { EquipoConductorCriteria } from '../models/equipoconductor-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_EQUIPOCONDUCTOR } from './../equipoconductor.constant';
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
export class EquipoConductorService {

  public loadSubject = new BehaviorSubject({});
  public load$ = this.loadSubject.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_EQUIPOCONDUCTOR;
  public resourceUrl: string;
  public resourceUrlCargue: string;

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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_equipoconductor;
    this.resourceUrlCargue = appSettings.settings.hostApi + this.constants.path_administracion_equipoconductorcargue;
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (equipoconductor: EquipoConductor): Observable<EquipoConductor> {
    return this.http.post<EquipoConductor>(this.resourceUrl, equipoconductor, httpOptions);
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: EquipoConductorCriteria): Observable<CollectionResponse<EquipoConductor>> {
    return this.http.get<CollectionResponse<EquipoConductor>>(this.resourceUrlCargue + '/search?' + criteria.getUrlParameters());
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (equipoconductor: EquipoConductor): Observable<EquipoConductor> {
    return this.http.put<EquipoConductor>(this.resourceUrl, equipoconductor, httpOptions);
  }

  detail(equipoconductorId: number): Observable<EquipoConductor> {
    return this.http.get<EquipoConductor>(this.resourceUrl + equipoconductorId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (equipoconductorId: number): Observable<EquipoConductor> {
    return this.http.delete<EquipoConductor>(this.resourceUrl + equipoconductorId);
  }

  // listCalendariosByEquipo (equipoId: number): Observable<Modelcalendario[]> {
  //   return this.http.get<Modelcalendario[]>(this.resourceUrl +
  //   '/findAllCalendariosByEquipo/' + equipoId);
  // }

  // listCalendariosByEquipoAndFecha (lugarId:number, fechaStr:string): Observable<Modelcalendario[]> {
  //   return this.http.get<Modelcalendario[]>(this.resourceUrl +
  //   '/findAllCalendariosByEquipo/' + lugarId + '/fecha/' + fechaStr);
  // }

}
