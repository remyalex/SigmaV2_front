import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AsignarConductoresMaquinaria } from '../models/asignar-conductores-maquinaria.model';
import { AsignarConductoresMaquinariaCriteria, AsignarConductoresMaquinariaPersonas } from '../models/asignar-conductores-maquinaria-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ASIGNAR_CONDUCTORES_MAQUINARIA } from './../asignar-conductores-maquinaria.constant';
import { DataGenericService } from '../../../shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { WorkflowMantenimientoActividadModel } from '../../../workflow/models/workflow-mantenimiento-actividad.model';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AsignarConductoresMaquinariaService {
 /** Constantes a usar en el componente */
  constants = CONST_ASIGNAR_CONDUCTORES_MAQUINARIA;
  private resoruceUrl: string;
  private resoruceUrl_create: string;
  private resoruceUrl_detalle: string;
  private resoruceUrl_update: string;
  private resoruceUrl_personal: string;
  private resoruceUrl_M_A: string;


  data: any;

  public rol = new BehaviorSubject({});
  rol$ = this.rol.asObservable();


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
    private tokenStore: TokenStorageService,
  ) {
    //this.resoruceUrl = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento/search/grupo?pk=';
    this.resoruceUrl = appSettings.settings.hostApi + '/api/administracion/equipoConductorMaquinaria/search?pk=';
    this.resoruceUrl_create = appSettings.settings.hostApi + '/api/intervencion/progcalendariopersona';
    this.resoruceUrl_detalle = appSettings.settings.hostApi + '/api/administracion/equipoDisponibleIntervencion/search?pk=';
    this.resoruceUrl_personal = appSettings.settings.hostApi + '/api/administracion/personaResponsableMaquinaria/search';
    this.resoruceUrl_update = appSettings.settings.hostApi + '/api/administracion/ProgDiarPersCancelacion/eliminar';
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
  search(criteria: AsignarConductoresMaquinariaCriteria, pk ): Observable<CollectionResponse<AsignarConductoresMaquinaria>> {
    return this.http.get<CollectionResponse<AsignarConductoresMaquinaria>>(this.resoruceUrl + pk + '&' + criteria.getUrlParameters());
  }

  listMaquinaria(criteria: AsignarConductoresMaquinariaCriteria, pk): Observable<CollectionResponse<AsignarConductoresMaquinaria>> {
    return this.http.get<CollectionResponse<AsignarConductoresMaquinaria>>(this.resoruceUrl_detalle + pk + '&' + criteria.getUrlParameters());
    // return this.http.get<CollectionResponse<AsignarConductoresMaquinaria>>('../assets/img/datos/maquinariaDetalle.json');

  }

  listPersonas(criteria: AsignarConductoresMaquinariaPersonas): Observable<CollectionResponse<AsignarConductoresMaquinaria>> {
    return this.http.get<CollectionResponse<AsignarConductoresMaquinaria>>(this.resoruceUrl_personal + criteria.getUrlParameters_Personas());
    // return this.http.get<CollectionResponse<AsignarConductoresMaquinaria>>('../assets/img/datos/maquinariaDetalle.json');
  }

  listPersonas_All(payload) {
    return this.http.get(this.resoruceUrl_personal + `?fecha=&horario=&nombreCompleto=&fechaInicio=${payload}&fechaFin=&page=0&size=5300&sortBy=id&sortOrder=asc`);
    // return this.http.get<CollectionResponse<AsignarConductoresMaquinaria>>('../assets/img/datos/maquinariaDetalle.json');
  }


  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<AsignarConductoresMaquinaria[]> {
    return this.http.get<AsignarConductoresMaquinaria[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (model): Observable<AsignarConductoresMaquinaria> {
    // ensayo.mantenimiento = this.tokenStore.getId();
    return this.http.post<AsignarConductoresMaquinaria>(this.resoruceUrl_create, model, httpOptions);
  }

  post_cancelar(model): Observable<AsignarConductoresMaquinaria> {
    return this.http.post<AsignarConductoresMaquinaria>(this.resoruceUrl_update, model, httpOptions);
  }

  detail(maquinariaId: number): Observable<AsignarConductoresMaquinaria> {
    return this.http.get<AsignarConductoresMaquinaria>(this.resoruceUrl + '/' + maquinariaId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (maquinariaId: number): Observable<AsignarConductoresMaquinaria> {
    return this.http.delete<AsignarConductoresMaquinaria>(this.resoruceUrl + '/' + maquinariaId);
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

}