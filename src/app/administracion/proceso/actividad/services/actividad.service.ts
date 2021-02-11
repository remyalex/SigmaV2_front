import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { ActividadModel } from '../../models/actividad.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

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

export class ActividadService {

    private resourceUrl: string;
    constructor(
        private http: HttpClient,
        private appSettings: AppSettings,
    ) {
        this.resourceUrl = appSettings.settings.hostApi + '/api/administracion/actividad';
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de {nombre_modelo}
    */
    list(): Observable<ActividadModel[]> {
        return this.http.get<ActividadModel[]>(this.resourceUrl);
    }
}