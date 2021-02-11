import { ProgramacionDiariaTrabajoMaterial } from './programacion-diaria-trabajo-material.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Servicio de las operaciones con el API de ProgramacionDiariaTrabajoMaterial
 *
 */
@Injectable({
    providedIn: 'root'
})
export class ProgramacionDiariaTrabajoMaterialService {

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
        this.resourceUrl = this.apiAddress + '/api/intervencion/programacion-diaria-trabajo-material';
    }

    /**
     * Guarda la información de MAterial asociado a la programación diaria de trabajo
     * @param data MAterial asociado a la programación diaria de trabajo
     */
    post(data: ProgramacionDiariaTrabajoMaterial): Observable<ProgramacionDiariaTrabajoMaterial> {
        return this.http.post<ProgramacionDiariaTrabajoMaterial>(this.resourceUrl, data, httpOptions);
    }

    /**
     * Busca según los criterios
     * @param criteria Criterios de búsqueda
     */
    /*
    search(criteria: ProgramacionDiariaTrabajoMaterialCriteria) {
        return this.http.get<CollectionResponse<ProgramacionDiariaTrabajoMaterial>>(
            this.resourceUrl + "/search?" + criteria.getUrlParameters(),
            httpOptions
        );
    }
    */

}
