import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

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
export class PredisenioService {

  public serviceListener = new BehaviorSubject({});
  serviceListener$ = this.serviceListener.asObservable();

  private resourceUrl: string;

  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor( ) {
  }

  listenerAction(data) {
    this.serviceListener.next(data);
  }
}
