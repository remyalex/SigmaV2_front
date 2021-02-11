import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Permiso } from '../models/permiso.model';
// import { PermisoCriteria } from '../models/permiso-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';

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
export class PermisosService {

  private resoruceUrl: string;

  /**
  * Método encargado de construir una instancia
  */
  constructor(private http: HttpClient, private appSettings: AppSettings) {
    this.resoruceUrl = appSettings.settings.hostApi + '/api/administracion/permiso';
    // this.resoruceUrl = appSettings.settings.hostApi + '/api/permiso';
  }  

  // search(criteria: PermisoCriteria): Observable<CollectionResponse<Permiso>> {
  //   return this.http.get<CollectionResponse<Permiso>>(this.resoruceUrl+"/search?"+criteria.getUrlParameters());
  // } 

  list (): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (permiso: Permiso): Observable<Permiso> {
    return this.http.post<Permiso>(this.resoruceUrl, permiso, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (permiso: Permiso): Observable<Permiso> {
    return this.http.put<Permiso>(this.resoruceUrl, permiso, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (permisoId: number): Observable<Permiso> {
    return this.http.get<Permiso>(this.resoruceUrl + '/' + permisoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (permisoId: number): Observable<Permiso> {
    return this.http.delete<Permiso>(this.resoruceUrl + '/' + permisoId);
  }  

}
