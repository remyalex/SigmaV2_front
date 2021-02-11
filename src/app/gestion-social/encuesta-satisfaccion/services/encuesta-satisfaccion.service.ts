import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { EncuestaSatisfaccion } from '../models/encuesta-satisfaccion.model';
import { EncuestaSatisfaccionCriteria } from '../models/encuesta-satisfaccion-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_ENCUESTA_SATISFACCION } from './../encuesta-satisfaccion.constant';
import { DataGenericService } from '../../../shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';

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
export class EncuestaSatisfaccionService {
 /** Constantes a usar en el componente */
  constants = CONST_ENCUESTA_SATISFACCION;
  private resoruceUrl: string;
  private resourceReport: string;

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
    this.resoruceUrl = appSettings.settings.hostApi + '/api/social/encuestaSatisfaccion';
    this.resourceReport = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
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
  search(criteria: EncuestaSatisfaccionCriteria): Observable<CollectionResponse<EncuestaSatisfaccion>> {
    return this.http.get<CollectionResponse<EncuestaSatisfaccion>>(this.resoruceUrl + "/search?" + criteria.getUrlParameters());
  }

  exportarPDF(encuesta_id: number, turno: string): Observable<any> {
    const path = this.resourceReport + '/' + encuesta_id + '/' + turno + '/exportEncuestaSatisfaccionPDF';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  generarPDF(encuesta_id: number, turno: string) {
    this.exportarPDF(encuesta_id, turno).subscribe(data => {
      const body = data;
      const type = body.headers.get('Content-Type');
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([body.body], { type: type });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'EncuestaSatisfaccion_' + encuesta_id + '.pdf';
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