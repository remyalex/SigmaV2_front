import { SolicitudMezcla } from './solicitud-mezcla.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppSettings } from 'src/app/app.settings';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { SolicitudMezclaCriteria } from './solicitud-mezcla-criteria.model';
import { WorkflowMantenimientoActividadModel } from '../../workflow/models/workflow-mantenimiento-actividad.model';
import { WorkflowMantenimientoModel } from '../../workflow/models/workflow-mantenimiento.model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Servicio de las operaciones con el API de SolicitudMezcla
 *
 */
@Injectable({
    providedIn: 'root'
})
export class SolicitudMezclaService {

    public serviceMantenimiento = new BehaviorSubject({});
    serviceMantenimiento$ = this.serviceMantenimiento.asObservable();

    /**
     * Base de la dirección del API tomada la configuración
     */
    private apiAddress: string;

    /**
     * Dirección báse del API
     */
    private resourceUrl: string;
    private resoruceUrl_M_A: string;
    private resource_mantenimiento: string;

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
        this.resourceUrl = this.apiAddress + '/api/produccion/solicitud-mezcla';
        this.resoruceUrl_M_A = appSettings.settings.hostApi + '/api/workflow';
        this.resource_mantenimiento = appSettings.settings.hostApi + '/api/mejoramiento/mantenimiento';
    }

    /**
     * Guarda la información de Representa una solicitud de mezcla
     * @param data Representa una solicitud de mezcla
     */
    post(data: SolicitudMezcla): Observable<SolicitudMezcla> {
        return this.http.post<SolicitudMezcla>(this.resourceUrl, data, httpOptions);
    }

    /**
     * Guarda la información de Representa una solicitud de mezcla
     * @param data Representa una solicitud de mezcla
     */
    postAll(data: SolicitudMezcla[]): Observable<SolicitudMezcla[]> {
        return this.http.post<SolicitudMezcla[]>(this.resourceUrl + "/list", data, httpOptions);
    }

    /**
     * Busca según los criterios
     * @param criteria Criterios de búsqueda
     */
    search(criteria: SolicitudMezclaCriteria) {
        return this.http.get<CollectionResponse<SolicitudMezcla>>(
            this.resourceUrl + "/search?" + criteria.getUrlParameters(),
            httpOptions
        );
    }


    /**
     * Encuentra las solicitudes en el estado suministrado
     *
     * @param estadoValor Valor del estado
     * @return El resultado de la operación
     */
    findByEstadoValor(estadoValor: string): Observable<SolicitudMezcla[]> {
        let url = this.resourceUrl + "/find-by-estado-valor" + "/" + estadoValor;
        return this.http.get<SolicitudMezcla[]>(url, httpOptions);
    }

    _getMantenimientoActividad(nombreProceso: string, nombreActividad: string): Observable<WorkflowMantenimientoActividadModel> {
        return this.http.get<WorkflowMantenimientoActividadModel>(this.resoruceUrl_M_A + '/' + nombreProceso + '/' + nombreActividad);
    }

    detailByPk(pk: number): Observable<WorkflowMantenimientoModel> {
        if (pk !== undefined) {
            return this.http.get<WorkflowMantenimientoModel>(this.resource_mantenimiento + '/' + pk);
        }
    }

    listenerActionMantenimiento(data) {
        this.serviceMantenimiento.next(data);
    }

}
