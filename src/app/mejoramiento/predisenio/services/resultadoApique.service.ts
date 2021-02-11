import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { WorkflowMantenimientoModel } from 'src/app/workflow/models/workflow-mantenimiento.model';

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
export class ResultadoApiqueService {

  private resourceUrl: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento/resultadosSolicitudesApiques';
  }

  /**
  * Método encargado de generar la petición al servidor para la actualización de
  * un registro de {nombre_modelo}.
  *
  * @param {nombre_modelo} Objeto de tipo modelo con los datos del
  * registro que se va a actualizar
  */
  update (mantenimiento: WorkflowMantenimientoModel): Observable<WorkflowMantenimientoModel> {
    return this.http.post<WorkflowMantenimientoModel>(this.resourceUrl, mantenimiento, httpOptions);
  }
}
