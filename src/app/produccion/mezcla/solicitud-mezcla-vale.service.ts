import { SolicitudMezclaVale } from './solicitud-mezcla-vale.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Servicio de las operaciones con el API de SolicitudMezclaVale
 *
 */
@Injectable({
    providedIn: 'root'
})
export class SolicitudMezclaValeService {

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
        this.resourceUrl = this.apiAddress + '/api/produccion/solicitud-mezcla-vale';
    }

    /**
     * Guarda la información de Vale de despacho de material asociado a una mezcla
     * @param data Vale de despacho de material asociado a una mezcla
     */
    post(data: SolicitudMezclaVale): Observable<SolicitudMezclaVale> {
        return this.http.post<SolicitudMezclaVale>(this.resourceUrl, data, httpOptions);
    }

    /**
     * Guarda la información de Vale de despacho de material asociado a una mezcla
     * @param data Vale de despacho de material asociado a una mezcla
     */
    postAll(data: SolicitudMezclaVale[]): Observable<SolicitudMezclaVale[]> {
        return this.http.post<SolicitudMezclaVale[]>(this.resourceUrl + "/list", data, httpOptions);
    }

    /**
     * Busca según los criterios
     * @param criteria Criterios de búsqueda
     */
    /*
    search(criteria: SolicitudMezclaValeCriteria) {
        return this.http.get<CollectionResponse<SolicitudMezclaVale>>(
            this.resourceUrl + "/search?" + criteria.getUrlParameters(),
            httpOptions
        );
    }
    */

}
