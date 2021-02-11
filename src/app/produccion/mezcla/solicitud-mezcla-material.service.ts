import { SolicitudMezclaMaterial } from './solicitud-mezcla-material.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Servicio de las operaciones con el API de SolicitudMezclaMaterial
 *
 */
@Injectable({
    providedIn: 'root'
})
export class SolicitudMezclaMaterialService {

    /**
     * Base de la dirección del API tomada la configuración
     */
    private apiAddress: string;

    /**
     * Dirección báse del API
     */
    private resourceUrl: string;

    /**
     * Constructor de la clase que recibe los componentes inyectados
     * @param http Cliente de HTTP
     * @param appSettings Configuración de ambiente de la aplicación
     */
    constructor(
        private http: HttpClient,
        private appSettings: AppSettings,
    ) {
        this.apiAddress = appSettings.settings.hostApi;
        this.resourceUrl = this.apiAddress + '/api/produccion/solicitud-mezcla-material';
    }

    /**
     * Guarda la información de Material asociado a la solicitud de mezcla
     * @param data Material asociado a la solicitud de mezcla
     */
    post(data: SolicitudMezclaMaterial): Observable<SolicitudMezclaMaterial> {
        return this.http.post<SolicitudMezclaMaterial>(this.resourceUrl, data, httpOptions);
    }

    /**
     * Guarda la información de Material asociado a la solicitud de mezcla
     * @param data Material asociado a la solicitud de mezcla
     */
    postAll(data: SolicitudMezclaMaterial[]): Observable<SolicitudMezclaMaterial[]> {
        return this.http.post<SolicitudMezclaMaterial[]>(this.resourceUrl + "/list", data, httpOptions);
    }

    /**
     * Busca según los criterios
     * @param criteria Criterios de búsqueda
     */
    /*
    search(criteria: SolicitudMezclaMaterialCriteria) {
        return this.http.get<CollectionResponse<SolicitudMezclaMaterial>>(
            this.resourceUrl + "/search?" + criteria.getUrlParameters(),
            httpOptions
        );
    }
    */

}
