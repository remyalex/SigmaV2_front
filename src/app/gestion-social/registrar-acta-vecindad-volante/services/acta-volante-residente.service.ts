import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { ActaVolanteResidenteModel } from '../models/acta-volante-residente.model';
import { ActaVolanteResidenteCriteria } from '../models/acta-volante-residente-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class ActaVolanteResidenteService {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  private resoruceUrl: string;
  private resourceUrlPermisos: string;

  public acta = new BehaviorSubject({});
  rol$ = this.acta.asObservable();


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
    private tokenStore: TokenStorageService,
  ) {
    this.resoruceUrl = appSettings.settings.hostApi + '/api/social/actaVolanteResidente';
   }
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
  search(criteria: ActaVolanteResidenteCriteria): Observable<CollectionResponse<ActaVolanteResidenteModel>> {
    return this.http.get<CollectionResponse<ActaVolanteResidenteModel>>(this.resoruceUrl + "/search?" + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<ActaVolanteResidenteModel[]> {
    return this.http.get<ActaVolanteResidenteModel[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (actaVolanteResidente: ActaVolanteResidenteModel): Observable<ActaVolanteResidenteModel> {
    return this.http.post<ActaVolanteResidenteModel>(this.resoruceUrl, actaVolanteResidente, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (actaVolanteResidente: ActaVolanteResidenteModel): Observable<ActaVolanteResidenteModel> {
    return this.http.put<ActaVolanteResidenteModel>(this.resoruceUrl, actaVolanteResidente, httpOptions);
  }

  detail(actaVolanteresidenteId: number): Observable<ActaVolanteResidenteModel> {
    return this.http.get<ActaVolanteResidenteModel>(this.resoruceUrl + '/' + actaVolanteresidenteId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (actaVolanteresidenteId: number): Observable<ActaVolanteResidenteModel> {
    return this.http.delete<ActaVolanteResidenteModel>(this.resoruceUrl + '/' + actaVolanteresidenteId);
  }

  updateActaData(actaVolanteresidenteUpdated) {
    this.acta.next(actaVolanteresidenteUpdated);
  }
}
