import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SolicitudEnsayos } from '../models/solicitud-ensayos.model';
import { SolicitudEnsayosCriteria } from '../models/solicitud-ensayos-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_PRODUCCION_SOLICITUD_ENSAYOS } from '../solicitud-ensayos.constant';
import { DataGenericService } from '../../../shared/services/data-generic.service';

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
export class SolicitudEnsayosGeneralesService {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_SOLICITUD_ENSAYOS;
  private resoruceUrl: string;
  private resourceUrlPermisos: string;
  data: any;

  public rol = new BehaviorSubject({});
  rol$ = this.rol.asObservable();


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService
  ) {
    this.resoruceUrl = appSettings.settings.hostApi + '/api/intervencion/solicitudEnsayo';
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
  search(criteria: SolicitudEnsayosCriteria): Observable<CollectionResponse<SolicitudEnsayos>> {
    const path = '/searchGenericas?' ;
    return this.http.get<CollectionResponse<SolicitudEnsayos>>(`${this.resoruceUrl}${path}${criteria.getUrlParameters()}`);
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<SolicitudEnsayos[]> {
    return this.http.get<SolicitudEnsayos[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (ensayo: SolicitudEnsayos): Observable<SolicitudEnsayos> {
    // ensayo.mantenimiento = this.tokenStore.getId();
    return this.http.post<SolicitudEnsayos>(this.resoruceUrl, ensayo, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (ensayo: SolicitudEnsayos): Observable<SolicitudEnsayos> {
    return this.http.put<SolicitudEnsayos>(this.resoruceUrl, ensayo, httpOptions);
  }

  detail(ensayoId: number): Observable<SolicitudEnsayos> {
    return this.http.get<SolicitudEnsayos>(this.resoruceUrl + '/' + ensayoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (ensayoId: number): Observable<SolicitudEnsayos> {
    return this.http.delete<SolicitudEnsayos>(this.resoruceUrl + '/' + ensayoId);
  }

  updateRolData(ensayoUpdated) {
    this.rol.next(ensayoUpdated);
  }

}
