import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE } from '../../registrar-acta-vecindad-volante/registrar-acta-vecindad-volante.constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { ActaVolanteModel } from '../models/acta-volante.model';
import { ActaVolanteCriteria } from '../models/acta-volante-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class ActaVolanteService {
 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_ACTA_VECINDAD_VOLANTE;
  private resoruceUrl: string;
  private resourceReport: string;
  private resourceUrlPermisos: string;

  public acta = new BehaviorSubject({});
  rol$ = this.acta.asObservable();

  public serviceListener = new BehaviorSubject({});
  serviceListener$ = this.serviceListener.asObservable();


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
    private tokenStore: TokenStorageService,
  ) {
    this.resoruceUrl = appSettings.settings.hostApi + '/api/social/actaVolante';
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
  search(criteria: ActaVolanteCriteria): Observable<CollectionResponse<ActaVolanteModel>> {
    return this.http.get<CollectionResponse<ActaVolanteModel>>(this.resoruceUrl + "/search?" + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la búsqueda
   * de todos los registros de {nombre_modelo}
   */
  list (): Observable<ActaVolanteModel[]> {
    return this.http.get<ActaVolanteModel[]>(this.resoruceUrl);
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (actaVolante: ActaVolanteModel): Observable<ActaVolanteModel> {
    return this.http.post<ActaVolanteModel>(this.resoruceUrl, actaVolante, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (actaVolante: ActaVolanteModel): Observable<ActaVolanteModel> {
    return this.http.put<ActaVolanteModel>(this.resoruceUrl, actaVolante, httpOptions);
  }

  detail(actaVolanteresidenteId: number): Observable<ActaVolanteModel> {
    return this.http.get<ActaVolanteModel>(this.resoruceUrl + '/' + actaVolanteresidenteId);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (actaVolanteresidenteId: number): Observable<ActaVolanteModel> {
    return this.http.delete<ActaVolanteModel>(this.resoruceUrl + '/' + actaVolanteresidenteId);
  }

  updateActaData(actaVolanteUpdated) {
    this.acta.next(actaVolanteUpdated);
  }

  exportarPDF(acta_id: number): Observable<any> {
    const path = this.resourceReport + '/' + acta_id + '/exportActaVolantePDF';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  exportarDocumento(acta_id: number, tipo_documento: string): Observable<any> {
    const path = this.resourceReport + '/' + acta_id + '/' + tipo_documento + '/exportDocumentoActaVecindadVolante';
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
      a.download = 'actaVolante_' + acta_id + '.pdf';
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

  generarDocumento(acta_id: number, tipo_documento: string) {
    this.exportarDocumento(acta_id, tipo_documento).subscribe(data => {
      const body = data;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      if (tipo_documento === 'pdf') {
        a.download = 'actaVolante_' + acta_id + '.pdf';
      } else {
        a.download = 'actaVolante_' + acta_id + '.xlsx';
      }
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

  listenerAction(data) {
    this.serviceListener.next(data);
  }

}
