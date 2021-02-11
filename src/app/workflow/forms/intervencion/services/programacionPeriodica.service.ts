import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { ProgramacionperiodicaModel } from 'src/app/workflow/models/programacion.periodica.model';

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
export class ProgramacionPeriodicaService {
  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    appSettings: AppSettings,
  ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/intervencion/programacion-periodica';
  }

  /**
   * Método encargado de generar la petición al servidor para la creación de
   * un registro de {nombre_modelo}.
   *
   * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
   * registro a almacenar
   */
  create (programacionPeriodica: ProgramacionperiodicaModel): Observable<ProgramacionperiodicaModel> {
    return this.http.post<ProgramacionperiodicaModel>(this.resourceUrl, programacionPeriodica, httpOptions);
  }

}
