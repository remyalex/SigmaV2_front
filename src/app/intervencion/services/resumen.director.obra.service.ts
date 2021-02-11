import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { VisitaVerificacionModel } from 'src/app/workflow/models/visita.verificacion';
import { ResumenDirectorObraCriteria } from '../models/ResumenDirectorObraCriteria';
import { ResumenDirectorObraModel } from '../models/ResumenDirectorObra';

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
export class ResumenDirectorObraService {

  private resourceUrl: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient, 
    private appSettings: AppSettings, 
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/directorObra';
  }

  /**
   * Método encargado de invocar la busqueda de mantenimientos que
   * correspondan con los criterios indicados como parámetros
   *
   * @param criteria Objeto con los campos y valores por los
   * cuales se realizará la búsqueda según el formulario de busqueda
   * del componente SigmaGrid.
   */
  search(criteria: ResumenDirectorObraCriteria): Observable<CollectionResponse<ResumenDirectorObraModel>> {
    return this.http.get<CollectionResponse<ResumenDirectorObraModel>>(this.resourceUrl + '/search?' + criteria.getUrlParameters());
  }

}
