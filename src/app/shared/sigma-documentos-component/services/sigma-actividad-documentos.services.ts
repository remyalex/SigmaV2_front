import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { CONST_DOCUMENTOS_COMPONENTE } from '../sigma-actividad-documentos.constant';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';
import { Documento } from 'src/app/administracion/proceso/transicion/documentos/models/documento.model';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DocService {

  private docs = new BehaviorSubject({});
  docs$ = this.docs.asObservable();

 /** Constantes a usar en el componente */
  constants = CONST_DOCUMENTOS_COMPONENTE;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private dataGeneric: DataGenericService,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_documento;
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (documento: Documento): Observable<Documento> {
    return this.http.post<Documento>(this.resourceUrl, documento, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (documento: Documento): Observable<Documento> {
    return this.http.put<Documento>(this.resourceUrl, documento, httpOptions);
  }

  listDocuments(idMant): Observable<Documento> {
    return this.http.get<Documento>(this.resourceUrl + '/' + idMant, httpOptions);
  }

  /**
  * Método encargado de generar la petición al servidor para la eliminación de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  delete (DeleteGroupId: Number) {
    return this.http.delete(this.resourceUrl + '/' + DeleteGroupId);
  }

  updateDocList(doc) {
    this.docs.next(doc);
  }
}
