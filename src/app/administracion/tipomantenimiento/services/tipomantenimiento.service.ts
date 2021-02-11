import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipomantenimiento } from '../models/tipomantenimiento.model';
import { TipomantenimientoCriteria } from '../models/tipomantenimiento-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ADMINISTRACION_TIPOMANTENIMIENTO } from './../tipomantenimiento.constant';
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
export class TipomantenimientoService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TIPOMANTENIMIENTO;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private dataGeneric: DataGenericService,
    private http: HttpClient,
    private appSettings: AppSettings
  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_tipomantenimiento;
  }
  searchByList(path: string, id: number) {    
    return this.dataGeneric.buscarListaId(path, id);
  }
  search(criteria: TipomantenimientoCriteria): Observable<CollectionResponse<Tipomantenimiento>> {
    return this.http.get<CollectionResponse<Tipomantenimiento>>(this.resourceUrl + 'search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Tipomantenimiento[]> {
    return this.http.get<Tipomantenimiento[]>(this.resourceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (tipomantenimiento: Tipomantenimiento): Observable<Tipomantenimiento> {
    tipomantenimiento.activo=true;
    return this.http.post<Tipomantenimiento>(this.resourceUrl, tipomantenimiento, httpOptions );
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (tipomantenimiento: Tipomantenimiento): Observable<Tipomantenimiento> {
    return this.http.put<Tipomantenimiento>(this.resourceUrl, tipomantenimiento, httpOptions );
  }

  /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
  detail (tipomantenimientoId: number): Observable<Tipomantenimiento> {
    return this.http.get<Tipomantenimiento>(this.resourceUrl + tipomantenimientoId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (tipomantenimientoId: number): Observable<Tipomantenimiento> {
    return this.http.delete<Tipomantenimiento>(this.resourceUrl + tipomantenimientoId);
  }

}
