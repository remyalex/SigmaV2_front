import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SolicitudLaboratorio } from 'src/app/workflow/models/solicitud-laboratorio.model';
//import { SolicitudEnsayosCriteria } from '../models/solicitud-ensayos-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
//import { CONST_PRODUCCION_SOLICITUD_ENSAYOS } from './../solicitud-ensayos.constant';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
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
export class SolicitudLaboratorioService {
  private resoruceUrl: string;
  private resourceUrlPermisos: string;

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
    this.resoruceUrl = appSettings.settings.hostApi + '/api/intervencion/solicitudLaboratorio';
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

/*
  search(criteria: SolicitudEnsayosCriteria): Observable<CollectionResponse<SolicitudLaboratorio>> {
    return this.http.get<CollectionResponse<SolicitudLaboratorio>>(this.resoruceUrl + "/search?" + criteria.getUrlParameters());
  }
*/

  list(): Observable<SolicitudLaboratorio[]> {
    return this.http.get<SolicitudLaboratorio[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (ensayo: SolicitudLaboratorio): Observable<SolicitudLaboratorio> {
    // ensayo.mantenimiento = this.tokenStore.getId();
    return this.http.post<SolicitudLaboratorio>(this.resoruceUrl, ensayo, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (ensayo: SolicitudLaboratorio): Observable<SolicitudLaboratorio> {
    return this.http.put<SolicitudLaboratorio>(this.resoruceUrl, ensayo, httpOptions);
  }

  detail(ensayoId: number): Observable<SolicitudLaboratorio> {
    return this.http.get<SolicitudLaboratorio>(this.resoruceUrl + '/' + ensayoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (ensayoId: number): Observable<SolicitudLaboratorio> {
    return this.http.delete<SolicitudLaboratorio>(this.resoruceUrl + '/' + ensayoId);
  }

  updateRolData(ensayoUpdated) {
    this.rol.next(ensayoUpdated);
  }

}