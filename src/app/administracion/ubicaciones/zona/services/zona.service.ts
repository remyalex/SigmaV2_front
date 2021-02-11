import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { Zona } from '../models/zona.model';
import { ZonaCriteria } from '../models/zona.criteria.model';

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
export class ZonaService {

    /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
    resourceUrl: string;

    /**
     * Método encargado de construir una instancia de la clase
     *
     * @param _http Peticion de protocolo http para realizar envío al servidor
     * @param _appSettings Opciones de construcción del protocolo http para envio de petición al servidor
     */
    constructor(
        private _http: HttpClient,
        private appSettings: AppSettings,
    ) {
    this.resourceUrl = appSettings.settings.hostApi + '/api/administracion/ubicaciones/zona';
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de zona
    */
    list(): Observable<Zona[]> {
        return this._http.get<Zona[]>(this.resourceUrl);
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de zona.
    *
    * @param zona Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (zona: Zona): Observable<Zona> {
        return this._http.post<Zona>(this.resourceUrl, zona, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la
    * consulta de información de un registro de zona.
    *
    * @param zona Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    detail (id: number): Observable<Zona> {
        return this._http.get<Zona>(this.resourceUrl + '/' + id);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de zona.
    *
    * @param zona Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (zona: Zona): Observable<Zona> {
        return this._http.put<Zona>(this.resourceUrl, zona, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la eliminación de
    * un registro de zona.
    *
    * @param zona Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    delete (id: number): Observable<Zona> {
        return this._http.delete<Zona>(this.resourceUrl + '/' + id);
    }

    /**
    * Método encargado de invocar la busqueda de mantenimientos que
    * correspondan con los criterios indicados como parámetros
    *
    * @param criteria Objeto con los campos y valores por los
    * cuales se realizará la búsqueda según el formulario de busqueda
    * del componente SigmaGrid.
    */
    search(criteria: ZonaCriteria): Observable<CollectionResponse<Zona>> {
        return this._http.get<CollectionResponse<Zona>>(this.resourceUrl + '/search?' + criteria.getUrlPatterns());
    }

}
