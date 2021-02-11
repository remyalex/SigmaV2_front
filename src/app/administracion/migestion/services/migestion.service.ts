import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { CONST_ADMINISTRACION_MIGESTION } from '../migestion.constant';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { MiGestionCriteria } from '../models/migestion-criteria.model';
import { MiGestionWidgetCriteria } from '../models/migestion-widget-criteria.model';

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
  providedIn: 'root'
})
export class MiGestionService {
 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_MIGESTION;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    appSettings: AppSettings,
    private dataGeneric: DataGenericService,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_migestion;
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
  search(criteria: MiGestionCriteria): Observable<CollectionResponse<WorkflowMantenimientoModel>> {
    return this.http.get<CollectionResponse<WorkflowMantenimientoModel>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de relizar la búsqueda de registros de gestion del usuario
   * @param criteria Datos por los cuales se desea realizar la consulta de información
   */
  searchFirstThreeRecords(criteria: MiGestionWidgetCriteria): Observable<CollectionResponse<WorkflowMantenimientoModel>> {
    return this.http.get<CollectionResponse<WorkflowMantenimientoModel>>(this.resourceUrl + '/searchFirstThreeRecords?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<WorkflowMantenimientoModel[]> {
    return this.http.get<WorkflowMantenimientoModel[]>(this.resourceUrl);
  }


}
