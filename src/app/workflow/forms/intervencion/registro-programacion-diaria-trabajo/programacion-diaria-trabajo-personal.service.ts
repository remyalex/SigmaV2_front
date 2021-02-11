import { ProgramacionDiariaTrabajoPersonal } from './programacion-diaria-trabajo-personal.model';
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
 * Servicio de las operaciones con el API de ProgramacionDiariaTrabajoPersonal
 *
 */
@Injectable({
    providedIn: 'root'
})
export class ProgramacionDiariaTrabajoPersonalService {

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
        this.resourceUrl = this.apiAddress + '/api/intervencion/programacion-diaria-trabajo-personal';
    }

    /**
     * Guarda la información de Personal asociado a la programación diaria de trabajo
     * @param data Personal asociado a la programación diaria de trabajo
     */
    post(data: ProgramacionDiariaTrabajoPersonal): Observable<ProgramacionDiariaTrabajoPersonal> {
        return this.http.post<ProgramacionDiariaTrabajoPersonal>(this.resourceUrl, data, httpOptions);
    }

    /**
     * Busca según los criterios
     * @param criteria Criterios de búsqueda
     */
    /*
    search(criteria: ProgramacionDiariaTrabajoPersonalCriteria) {
        return this.http.get<CollectionResponse<ProgramacionDiariaTrabajoPersonal>>(
            this.resourceUrl + "/search?" + criteria.getUrlParameters(),
            httpOptions
        );
    }
    */

}
