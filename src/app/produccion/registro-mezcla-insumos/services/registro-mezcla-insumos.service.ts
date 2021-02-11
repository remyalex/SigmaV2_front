import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SolicitudMezclaInsumos, EditarVale } from '../models/registro-mezcla-insumos.model';
import { RegistroMezclaInsumoCriteria } from '../models/registro-mezcla-insumos-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_REGISTRAR_MEZCLA_INSUMOS } from './../registro-mezcla-insumos.constant';
import { DataGenericService } from '../../../shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { WorkflowMantenimientoActividadModel } from '../../../workflow/models/workflow-mantenimiento-actividad.model';

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
export class RegistroMezclaInsumosService {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_MEZCLA_INSUMOS;
  private resoruceUrl: string;
  private resoruceUrl_create: string;
  private resoruceUrl_detalle: string;
  private resoruceUrl_solicitud_consultar: string;
  private resoruceUrl_delete: string;
  private resoruceUrl_M_A: string;

  data: any;

  public rol = new BehaviorSubject({});
  rol$ = this.rol.asObservable();
  public listenerMantenimientoActividad = new BehaviorSubject({});
  listenerMantenimientoActividad$ = this.listenerMantenimientoActividad.asObservable();

  /**
  * M�todo encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
    private tokenStore: TokenStorageService,
  ) {
    this.resoruceUrl = appSettings.settings.hostApi + '/api/produccion/solicitudTipoMaterial/searchPk?pk=';
    this.resoruceUrl_create = appSettings.settings.hostApi + '/api/produccion/solicitudTMD';
    this.resoruceUrl_delete = appSettings.settings.hostApi + '/api/produccion/solicitudTMD/detalle/';
    this.resoruceUrl_detalle = appSettings.settings.hostApi + '/api/produccion/solicitudTMD/detalle?id=';
    this.resoruceUrl_solicitud_consultar = appSettings.settings.hostApi + '/api/produccion/solicitudTipoMaterialMezcla/search?pk=';
    this.resoruceUrl_M_A = appSettings.settings.hostApi + '/api/workflow';
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
  search(criteria: RegistroMezclaInsumoCriteria, pk ): Observable<CollectionResponse<SolicitudMezclaInsumos>> {
    return this.http.get<CollectionResponse<SolicitudMezclaInsumos>>(this.resoruceUrl + pk + criteria.getUrlParameters());
  }

  listDetallesVales(criteria: RegistroMezclaInsumoCriteria, id): Observable<CollectionResponse<SolicitudMezclaInsumos>> {
    return this.http.get<CollectionResponse<SolicitudMezclaInsumos>>(this.resoruceUrl_detalle + id + criteria.getUrlParameters_detalles());
  }

  listSolicitudConsultar(criteria: RegistroMezclaInsumoCriteria, pk, id, material): Observable<CollectionResponse<SolicitudMezclaInsumos>> {
    return this.http.get<CollectionResponse<SolicitudMezclaInsumos>>(this.resoruceUrl_solicitud_consultar + pk + '&solicitudTipoMaterialId=' + id + '&tipoMaterialId=' + material + criteria.getUrlParameters_detalles());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<SolicitudMezclaInsumos[]> {
    return this.http.get<SolicitudMezclaInsumos[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (model: SolicitudMezclaInsumos): Observable<SolicitudMezclaInsumos> {
    return this.http.post<SolicitudMezclaInsumos>(this.resoruceUrl_create, model, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (model: any): Observable<EditarVale> {
    return this.http.put<EditarVale>(this.resoruceUrl_create, model, httpOptions);
  }

  detail(ensayoId: number): Observable<SolicitudMezclaInsumos> {
    return this.http.get<SolicitudMezclaInsumos>(this.resoruceUrl + '/' + ensayoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (id: number): Observable<SolicitudMezclaInsumos> {
    return this.http.delete<SolicitudMezclaInsumos>(this.resoruceUrl_delete + id);
  }

  _getMantenimientoActividad(nombreProceso: string, nombreActividad: string): Observable<WorkflowMantenimientoActividadModel> {
    return this.http.get<WorkflowMantenimientoActividadModel>(this.resoruceUrl_M_A + '/' + nombreProceso + '/' + nombreActividad);
  }

  updateRolData(ensayoUpdated) {
    this.rol.next(ensayoUpdated);
  }

  setDataService(payload: any) {
    this.data =  payload;
  }

  getDataService() {
    let getData = localStorage.getItem('dataMapa');
    let jsonData = JSON.parse(getData);
    return jsonData;
  }

  getDataSolicitudService() {
    let getData = localStorage.getItem('dataSolicitud');
    let jsonData = JSON.parse(getData);
    return jsonData;
  }

  getDataDetalleService() {
    let getData = localStorage.getItem('dataDetalle');
    let jsonData = JSON.parse(getData);
    return jsonData;
  }

  _setListenerMantenimientoActividad(data) {
    this.listenerMantenimientoActividad.next(data);
  }

}