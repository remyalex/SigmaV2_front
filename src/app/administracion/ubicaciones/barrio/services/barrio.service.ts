import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { Barrio } from '../models/barrio.model';
import { BarrioCriteria } from '../models/barrio.criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({'Content-Type' : 'application/json'})
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
    providedIn: 'root'
})
export class BarrioService {

    /** Variable usada para contruir path url a invocar del servicio según el método de petición requerido */
    resourceUrl: string;

     /**
     * Método encargado de construir una instancia de la clase
     *
     * @param http Peticion de protocolo http para realizar envío al servidor
     * @param appSettings Opciones de construcción del protocolo http para envio de petición al servidor
     * @param dataGeneric Referencia al servicio por el cual se obtendrán los datos requeridos
     */
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettings
    ) {
        this.resourceUrl = _appSettings.settings.hostApi + '/api/administracion/ubicaciones/barrio';
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de barrios
    */
    list(): Observable<Barrio[]> {
        return this._http.get<Barrio[]>(this.resourceUrl);
    }

    /**
     * Método encargado de generar la petición al servidor para la creación de
     * un registro de barrio.
     *
     * @param barrio Objeto de tipo modelo con los datos del nuevo
     * registro a almacenar
     */
    create (barrio: Barrio): Observable<Barrio> {
        return this._http.post<Barrio>(this.resourceUrl, barrio, httpOptions);
    }

     /**
   * Método encargado de generar la petición al servidor para la
   * consulta de información de un registro de barrio.
   *
   * @param id Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
    detail(id: number): Observable<Barrio> {
        return this._http.get<Barrio>(this.resourceUrl + '/' + id);
    }

    /**
   * Método encargado de generar la petición al servidor para la actualización de
   * un registro de barrio.
   *
   * @param barrio Objeto de tipo modelo con los datos del
   * registro que se va a actualizar
   */
    update(barrio: Barrio): Observable<Barrio> {
        return this._http.put<Barrio>(this.resourceUrl, barrio, httpOptions);
    }

    /**
     * Método encargado de generar la petición al servidor para la eliminación de
     * un registro de barrio.
     *
     * @param id Objeto de tipo modelo con los datos del
     * registro que se va a actualizar
     */
    delete(id: number): Observable<Barrio> {
        return this._http.delete<Barrio>(this.resourceUrl + '/' + id);
    }

    /**
     * Método encargado de invocar la busqueda de mantenimientos que
     * correspondan con los criterios indicados como parámetros
     *
     * @param criteria Objeto con los campos y valores por los
     * cuales se realizará la búsqueda según el formulario de busqueda
     * del componente SigmaGrid.
     */
    search(criteria: BarrioCriteria): Observable<CollectionResponse<Barrio>> {
        return this._http.get<CollectionResponse<Barrio>>(this.resourceUrl + '/search?' + criteria.getUrlPatterns());
    }
}
