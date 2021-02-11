import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Termino } from '../models/termino.model';
import { CONST_ADMINISTRACION_TRANSICIONCONDICIONES } from '../transicioncondiciones.constants';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TerminoService {

 /** Constantes a usar en el componente */
  constants = CONST_ADMINISTRACION_TRANSICIONCONDICIONES;
 /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
  private resourceUrl: string;


  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private http: HttpClient,
    appSettings: AppSettings,
    private terminoServices: TerminoService
  ) {
    this.resourceUrl = appSettings.settings.hostApi + this.constants.path_administracion_terminos_condicion;
  }

  getListTerminosByCondicion(idCondicion: number): Observable<Termino[]> {
    return this.http.get<Termino[]>(this.resourceUrl+ '/' + idCondicion, httpOptions);
  }  
}
