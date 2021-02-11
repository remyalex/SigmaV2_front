import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Acta } from '../models/actas-vecindad.model';
import { ActasCriteria } from '../models/actas-vecindad-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ACTAS_VECINDAD } from './../actas-vecindad.constant';
import { DataGenericService } from '../../../shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { WorkflowActividadModel } from 'src/app/workflow/models/workflow-actividad.model';

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
export class ActasService {
 /** Constantes a usar en el componente */
  constants = CONST_ACTAS_VECINDAD;
  private resoruceUrl: string;
  private resourceReport: string;
  private resuorceActividad: string;

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
    this.resoruceUrl = appSettings.settings.hostApi + '/api/social/actaVecindad';
    this.resourceReport = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
    this.resuorceActividad = appSettings.settings.hostApi + '/api/administracion/actividad';
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
  search(criteria: ActasCriteria): Observable<CollectionResponse<Acta>> {
    return this.http.get<CollectionResponse<Acta>>(this.resoruceUrl + "/search?" + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<Acta[]> {
    return this.http.get<Acta[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (acta: Acta): Observable<Acta> {
    return this.http.post<Acta>(this.resoruceUrl, acta, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (acta: Acta): Observable<Acta> {
    return this.http.put<Acta>(this.resoruceUrl, acta, httpOptions);
  }

  detail(actaId: number): Observable<Acta> {
    return this.http.get<Acta>(this.resoruceUrl + '/' + actaId);
  }

  detailActividad(actividadId: number): Observable<WorkflowActividadModel> {
    return this.http.get<WorkflowActividadModel>(this.resuorceActividad + '/' + actividadId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (actaId: number): Observable<Acta> {
    return this.http.delete<Acta>(this.resoruceUrl + '/' + actaId);
  }

  exportarPDF(acta_id: number): Observable<any> {
    const path = this.resourceReport + '/' + acta_id + '/exportActaVecindadPDF';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  generarPDF(acta_id: number) {
    this.exportarPDF(acta_id).subscribe(data => {
      const body = data;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'actaVecindad_' + acta_id + '.pdf';
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 0);
    },
      error => {
        console.log('Error: ' + error);
      });

  }
}