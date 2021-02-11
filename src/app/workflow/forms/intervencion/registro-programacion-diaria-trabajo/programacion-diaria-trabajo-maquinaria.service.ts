import { ProgramacionDiariaTrabajoMaquinaria } from './programacion-diaria-trabajo-maquinaria.model';
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
 * Servicio de las operaciones con el API de ProgramacionDiariaTrabajoMaquinaria
 *
 */
@Injectable({
    providedIn: 'root'
})
export class ProgramacionDiariaTrabajoMaquinariaService {

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
        this.resourceUrl = this.apiAddress + '/api/intervencion/programacion-diaria-trabajo-maquinaria';
    }

    /**
     * Guarda la información de Maquinaria asociado a la programación diaria de trabajo
     * @param data Maquinaria asociado a la programación diaria de trabajo
     */
    post(data: ProgramacionDiariaTrabajoMaquinaria): Observable<ProgramacionDiariaTrabajoMaquinaria> {
        return this.http.post<ProgramacionDiariaTrabajoMaquinaria>(this.resourceUrl, data, httpOptions);
    }

    /**
     * Busca según los criterios
     * @param criteria Criterios de búsqueda
     */
    /*
    search(criteria: ProgramacionDiariaTrabajoMaquinariaCriteria) {
        return this.http.get<CollectionResponse<ProgramacionDiariaTrabajoMaquinaria>>(
            this.resourceUrl + "/search?" + criteria.getUrlParameters(),
            httpOptions
        );
    }
    */

}
