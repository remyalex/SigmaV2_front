import { GestionSocialAdelantadaModel } from './../models/gestion-social-adelantada.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA } from './../gestion-social-adelantada.constant';
import { DataGenericService } from '../../../shared/services/data-generic.service';
import { TokenStorageService } from 'src/app/seguridad/services/token-storage.service';
import { GestionSocialAdelantadaCriteria } from '../models/gestion-social-adelantada-criteria.model';

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
export class GestionSocialAdelantadaService {
 /** Constantes a usar en el componente */
  constants = CONST_SOCIAL_REGISTRAR_GESTION_ADELANTADA;
  private resoruceUrl: string;
  private resourceReport: string;

  public gestion = new BehaviorSubject({});
  gestion$ = this.gestion.asObservable();

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
    this.resoruceUrl = appSettings.settings.hostApi + '/api/social/gestionSocial';
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
  search(criteria: GestionSocialAdelantadaCriteria): Observable<CollectionResponse<GestionSocialAdelantadaModel>> {
    return this.http.get<CollectionResponse<GestionSocialAdelantadaModel>>(this.resoruceUrl + '/search?' + criteria.getUrlParameters());
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (gestionSocial: GestionSocialAdelantadaModel): Observable<GestionSocialAdelantadaModel> {
    return this.http.post<GestionSocialAdelantadaModel>(this.resoruceUrl, gestionSocial, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (gestionSocial: GestionSocialAdelantadaModel): Observable<GestionSocialAdelantadaModel> {
    return this.http.put<GestionSocialAdelantadaModel>(this.resoruceUrl, gestionSocial, httpOptions);
  }

  detail(gestionSocialId: number): Observable<GestionSocialAdelantadaModel> {
    return this.http.get<GestionSocialAdelantadaModel>(this.resoruceUrl + '/' + gestionSocialId);
  }

  exportarPDF(encuesta_id: number, turno: string): Observable<any> {
    const path = this.resourceReport + '/' + encuesta_id + '/' + turno + '/exportGestionSocialAdelantadaPDF';
    return this.http.get(path, {
      responseType: 'arraybuffer', observe: 'response'
    });
  }

  updateGestionData(gestionSocialUpdate) {
    this.gestion.next(gestionSocialUpdate);
  }

  listenerAction(data) {
    this.serviceListener.next(data);
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
      a.download = 'GestionSocialAdelantada_' + encuesta_id + '.pdf';
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