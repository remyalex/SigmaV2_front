import { ProgramacionDiariaTrabajo } from './programacion-diaria-trabajo.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { ProgramacionDiariaTrabajoCriteria } from './programacion-diaria-trabajo.criteria';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Servicio de las operaciones con el API de ProgramacionDiariaTrabajo
 *
 */
@Injectable({
    providedIn: 'root'
})
export class ProgramacionDiariaTrabajoService {

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
        this.resourceUrl = this.apiAddress + '/api/intervencion/programacion-diaria-trabajo';
    }

    /**
     * Guarda la información de Programación diaria de trabajo
     * @param data Programación diaria de trabajo
     */
    post(data: ProgramacionDiariaTrabajo): Observable<ProgramacionDiariaTrabajo> {
        return this.http.post<ProgramacionDiariaTrabajo>(this.resourceUrl, data, httpOptions);
    }

    /**
     * Busca según los criterios
     * @param criteria Criterios de búsqueda
     */
    /*
    search(criteria: ProgramacionDiariaTrabajoCriteria) {
        return this.http.get<CollectionResponse<ProgramacionDiariaTrabajo>>(
            this.resourceUrl + "/search?" + criteria.getUrlParameters(),
            httpOptions
        );
    }
    */

    /**
     * Encuentra las programaciones por estado
     *
     * @param estados Valores de los estados
     * @return El resultado de la operación
     */
    findByEstadoValorIn(estados: string): Observable<ProgramacionDiariaTrabajo[]> {
        let url = this.resourceUrl + "/find-by-estado-valor-in" + "/" + estados;
        return this.http.get<ProgramacionDiariaTrabajo[]>(url, httpOptions);
    }

    /**
     * Encuentra las programaciones correspondientes a la intervención
     *
     * @param intervencionId Identificador de la intervención
     * @return El resultado de la operación
     */
    findByIntervencionEncabezadoId(intervencionId: number): Observable<ProgramacionDiariaTrabajo[]> {
        let url = this.resourceUrl + "/find-by-intervencion-encabezado-id" + "/" + intervencionId;
        return this.http.get<ProgramacionDiariaTrabajo[]>(url, httpOptions);
    }

    /**
     * Arma una nueva programación de trabajo con las reglas de negocio según la fecha actual
     *
     * @param intervencionId Identificador de la intervención
     * @return El resultado de la operación
     */
    newByIntervencionEncabezadoId(intervencionId: number): Observable<ProgramacionDiariaTrabajo> {
        let url = this.resourceUrl + "/new-by-intervencion-encabezado-id" + "/" + intervencionId;
        return this.http.get<ProgramacionDiariaTrabajo>(url, httpOptions);
    }

    /**
     * Busca las coincidencias mediante los criterios seleccionados
     * @param criteria Criterios de búsqueda
     */
    search(criteria: ProgramacionDiariaTrabajoCriteria): Observable<CollectionResponse<ProgramacionDiariaTrabajo>> {
        let url = this.resourceUrl + "/search" + "?" + criteria.getUrlParameters();
        return this.http.get<CollectionResponse<ProgramacionDiariaTrabajo>>(url, httpOptions);
    }

    getById(id: number): Observable<ProgramacionDiariaTrabajo> {
        let url = this.resourceUrl + "/" + id;
        return this.http.get<ProgramacionDiariaTrabajo>(url, httpOptions);
    }

}
