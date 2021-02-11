import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { VisitaVerificacionModel } from 'src/app/workflow/models/visita.verificacion';

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
export class VisitaVerificacionService {

  private resourceUrl: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient, 
    private appSettings: AppSettings, 
    private dataGeneric: DataGenericService,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/intervencion/visitaVerificacion/';
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de VisitaVerificacionModel.
   *
   * @param VisitaVerificacionModel Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (visita: VisitaVerificacionModel): Observable<VisitaVerificacionModel> {
    return this.http.post<VisitaVerificacionModel>(this.resourceUrl, visita, httpOptions);
  }

   /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de VisitaVerificacionModel.
   *
   * @param VisitaVerificacionModel Objeto de tipo modelo con los datos del nuevo
   * registro a actualizar
   */
  update (visita: VisitaVerificacionModel): Observable<VisitaVerificacionModel> {
    return this.http.put<VisitaVerificacionModel>(this.resourceUrl, visita, httpOptions);
  }

}
