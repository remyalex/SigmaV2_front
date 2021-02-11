import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { LocalidadCriteria } from '../models/localidad.criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { Localidad } from '../models/localidad.model';

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
export class LocalidadService {

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
        private _appSettings: AppSettings
    ) {
        this.resourceUrl = _appSettings.settings.hostApi + '/api/administracion/ubicaciones/localidad';
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de localidades
    */
    list(): Observable<Localidad[]> {
        return this._http.get<Localidad[]>(this.resourceUrl);
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de localidades.
    *
    * @param localidad Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (localidad: Localidad): Observable<Localidad> {
        return this._http.post<Localidad>(this.resourceUrl, localidad, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la
    * consulta de información de un registro de localidades.
    *
    * @param id Identificador de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    detail (id: number): Observable<Localidad> {
        return this._http.get<Localidad>(this.resourceUrl + '/' + id);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de localidades.
    *
    * @param localidad Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (localidad: Localidad): Observable<Localidad> {
        return this._http.put<Localidad>(this.resourceUrl, localidad, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la eliminación de
    * un registro de localidades.
    *
    * @param id Identificador de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    delete (id: number): Observable<Localidad> {
        return this._http.delete<Localidad>(this.resourceUrl + '/' + id);
    }

    /**
    * Método encargado de invocar la busqueda de mantenimientos que
    * correspondan con los criterios indicados como parámetros
    *
    * @param criteria Objeto con los campos y valores por los
    * cuales se realizará la búsqueda según el formulario de busqueda
    * del componente SigmaGrid.
    */
    search(criteria: LocalidadCriteria): Observable<CollectionResponse<Localidad>> {
        return this._http.get<CollectionResponse<Localidad>>(this.resourceUrl + '/search?' + criteria.getUrlPatterns());
    }

}
