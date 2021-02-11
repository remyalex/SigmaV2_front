import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalPlanta } from '../models/personal-planta.model';
import { PlanillaOperacionCriteria } from '../models/personal-planta-personal.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../personal-planta.constant';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { WorkflowMantenimientoActividadModel } from '../../../workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';

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
export class PlanillaOperacionService {
  /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;
  private resulrceUrlSelect: string;
  private resourceUrl_Personal: string;
  private resourceUrl_save: string;
  private resoruceUrl_M_A: string;
  private resource_mantenimiento: string;
  private resourceUrlFechaSistema: string;

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
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_produccion_personal_planta_consulta;
    this.resourceUrl_Personal = appSettings.settings.hostApi + this.constants.path_produccion_personal_planta_consulta_programacion;
    this.resourceUrl_save = appSettings.settings.hostApi + this.constants.path_produccion_personal_planta_save;
    this.resoruceUrl_M_A = appSettings.settings.hostApi + '/api/workflow';
    this.resource_mantenimiento = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
    this.resulrceUrlSelect = appSettings.settings.hostApi + '/api/produccion/solicitudTipoMaterial/select';
    this.resourceUrlFechaSistema = appSettings.settings.hostApi + '/api/administracion/Contrato/getFechaSistema';
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
  search(criteria: PlanillaOperacionCriteria): Observable<CollectionResponse<PersonalPlanta>> {
    return this.http.get<CollectionResponse<PersonalPlanta>>(this.resulrceUrlSelect + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list(): Observable<PersonalPlanta[]> {
    return this.http.get<PersonalPlanta[]>(this.resulrceUrlSelect);
  }

  listProgramacionPersonal(criteria: PlanillaOperacionCriteria): Observable<CollectionResponse<PersonalPlanta>> {
    return this.http.get<CollectionResponse<PersonalPlanta>>(this.resourceUrl_Personal + '/searchPlanta?' + criteria.getUrlParameters_Trabajadores());
  }

  create(model): Observable<PersonalPlanta> {
    return this.http.post<PersonalPlanta>(this.resourceUrl_save, model, httpOptions);
  }

  _getMantenimientoActividad(nombreProceso: string, nombreActividad: string): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.get<WorkflowMantenimientoActividadModel>(this.resoruceUrl_M_A + '/' + nombreProceso + '/' + nombreActividad);
  }

  detailByPk(pk: number): Observable<WorkflowMantenimientoModel> {
    if (pk !== undefined) {
      return this.http.get<WorkflowMantenimientoModel>(this.resource_mantenimiento + '/' + pk);
    }
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update(equipo: PersonalPlanta): Observable<PersonalPlanta> {
    return this.http.put<PersonalPlanta>(this.resourceUrl, equipo, httpOptions);
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail(equipoId: number): Observable<PersonalPlanta> {
    return this.http.get<PersonalPlanta>(this.resourceUrl + '/' + equipoId);
  }

  getFechaSistema(): Observable<any> {
    return this.http.get<any>(this.resourceUrlFechaSistema );
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete(equipoId: number): Observable<PersonalPlanta> {
    return this.http.delete<PersonalPlanta>(this.resourceUrl + '/' + equipoId);
  }

}
