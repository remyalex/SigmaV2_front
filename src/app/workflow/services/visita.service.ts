import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { VisitaModel } from '../models/visita.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { Persona } from 'src/app/administracion/persona/models/persona.model';

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
export class VisitaService {

  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  * @param dataGeneric Referencia al servicio por el cual se obtendrán los datos requeridos
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/visita/';
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de una visita.
   *
   * @param visita Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (visita: VisitaModel): Observable<VisitaModel> {
    return this.http.post<VisitaModel>(this.resourceUrl, visita, httpOptions);
  }

  /**
   * Método encargado de listar los responsables de a visita
   * @param path Ruta sobre la cual se listarán los responsables de la visita
   */
  listResponsables(path): Observable<CollectionResponse<Persona>> {
    return this.http.get<CollectionResponse<Persona>>(path);
  }

  /**
   * Método que retorna el observable con la persona que asume la carga laboral
   * en la visita
   * @param path Path de la persona que se desea de la visita
   */
  getCargaLaboral(path): Observable<Persona> {
    return this.http.get<Persona>(path);
  }

}
