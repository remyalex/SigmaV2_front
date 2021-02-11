import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { SolicitudMezcla } from '../models/solicitud-mezcla.model';
import { Observable } from 'rxjs';
import { SolicitudMezclaCriteria } from '../models/solicitud-mezcla.criteria';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
    providedIn: 'root'
})
export class SolicitudMezclaService {


    resulrceUrl: string;
    resulrceUrlSelect: string;

    constructor(
        private _http: HttpClient,
        private appSettings: AppSettings,
        private dataGeneric: DataGenericService
    ) {
        this.resulrceUrl = appSettings.settings.hostApi + '/api/produccion/solicitudMezcla';
        this.resulrceUrlSelect = appSettings.settings.hostApi + '/api/produccion/solicitudMezcla/select';
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (solicitud: SolicitudMezcla): Observable<SolicitudMezcla> {
        return this._http.post<SolicitudMezcla>(this.resulrceUrl, solicitud, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (solicitud: SolicitudMezcla): Observable<SolicitudMezcla> {
        return this._http.put<SolicitudMezcla>(this.resulrceUrl, solicitud, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la
    * consulta de información de un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    detail (id: number): Observable<SolicitudMezcla> {
        return this._http.get<SolicitudMezcla>(this.resulrceUrl + '/' + id);
    }

    /**
    * Método encargado de generar la petición al servidor para la eliminación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    delete (id: number): Observable<SolicitudMezcla> {
        return this._http.delete<SolicitudMezcla>(this.resulrceUrl + '/' + id);
    }

    /**
    * Método encargado de invocar la busqueda de mantenimientos que
    * correspondan con los criterios indicados como parámetros
    *
    * @param criteria Objeto con los campos y valores por los
    * cuales se realizará la búsqueda según el formulario de busqueda
    * del componente SigmaGrid.
    */
    search(criteria: SolicitudMezclaCriteria): Observable<CollectionResponse<SolicitudMezcla>> {
        return this._http.get<CollectionResponse<SolicitudMezcla>>(this.resulrceUrlSelect + '/search?' + criteria.getUrlParameters());
    }


}
