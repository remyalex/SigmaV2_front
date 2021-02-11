import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppSettings } from '../../../app.settings';

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

  public serviceListener = new BehaviorSubject({});
  serviceListener$ = this.serviceListener.asObservable();

  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  **/
  constructor(private http: HttpClient, private appSettings: AppSettings) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
  }

  listIntervencionByMantenimiento(pk: number) {
    return this.http.get<any>(
      this.resourceUrl + '/listIntervencionesByMantenimiento/' + pk, httpOptions
    );
  }

  listenerAction(data) {
    this.serviceListener.next(data);
  }
}
