import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../registrar-acta-vecindad-volante.constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { ActaAficheModel } from '../models/acta-afiche.model';
import { ActaAficheCriteria } from '../models/acta-afiche-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class ActaAficheService {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  private resoruceUrl: string;
  private resourceReport: string;
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
    this.resoruceUrl = appSettings.settings.hostApi + '/api/social/actaAfiche';
    this.resourceReport = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
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
  search(criteria: ActaAficheCriteria): Observable<CollectionResponse<ActaAficheModel>> {
    return this.http.get<CollectionResponse<ActaAficheModel>>(this.resoruceUrl + "/search?" + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<ActaAficheModel[]> {
    return this.http.get<ActaAficheModel[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (actaAfiche: ActaAficheModel): Observable<ActaAficheModel> {
    return this.http.post<ActaAficheModel>(this.resoruceUrl, actaAfiche, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (actaAfiche: ActaAficheModel): Observable<ActaAficheModel> {
    return this.http.put<ActaAficheModel>(this.resoruceUrl, actaAfiche, httpOptions);
  }

  detail(actaAficheId: number): Observable<ActaAficheModel> {
    return this.http.get<ActaAficheModel>(this.resoruceUrl + '/' + actaAficheId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (actaAficheId: number): Observable<ActaAficheModel> {
    return this.http.delete<ActaAficheModel>(this.resoruceUrl + '/' + actaAficheId);
  }

  updateActaData(actaAficheUpdated) {
    this.acta.next(actaAficheUpdated);
  }

  exportarPDF(acta_id: number): Observable<any> {
    const path = this.resourceReport + '/' + acta_id + '/exportActaAfichePDF';
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
      a.download = 'actaAfiche_' + acta_id + '.pdf';
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
