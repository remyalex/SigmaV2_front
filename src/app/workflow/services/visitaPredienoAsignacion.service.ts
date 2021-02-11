import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { VisitaPredisenoAsignarModel } from '../models/visita.prediseno.asignar.model';
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
export class VisitaPredisenoAsignarService {

  /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  *
  * @param http Peticion de protocolo http para realizar envío al servidor
  * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
  */
  constructor(
    private http: HttpClient, 
    private appSettings: AppSettings,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/visita-prediseno-asignar/';
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de una visita de asignación de prediseño.
   *
   * @param visita Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (visita: VisitaPredisenoAsignarModel): Observable<VisitaPredisenoAsignarModel> {
    return this.http.post<VisitaPredisenoAsignarModel>(this.resourceUrl, visita, httpOptions);
  }

  /**
   * Listado de ingenieros que pertenecen a la visita
   *
   * @param path Ruta de la cual se obtendrá el listado de personas
   * relacionadas con la asignación
  */
  listIngenierosDisenio(path): Observable<CollectionResponse<Persona>> {
    return this.http.get<CollectionResponse<Persona>>(path);
  }
}
