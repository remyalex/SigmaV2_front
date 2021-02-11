import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CuadrillaGeneralModel } from '../models/cuadrilla-general.model';
import { AppSettings } from '../../../app.settings';
import { Equipo } from '../../../produccion/estado-maquinaria-propio/models/estado-maquinaria-propio.model';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
    providedIn: 'root'
})
export class CuadrillaGeneralService {

    private resourceUrl: string;
    private resourceUrlEquipo: string;
    public sendStatus = new BehaviorSubject('');
    sendStatus$ = this.sendStatus.asObservable();
    public serviceListenerPersonal = new BehaviorSubject({});
    serviceListenerPersonal$ = this.serviceListenerPersonal.asObservable();
    public serviceListenerMaterial = new BehaviorSubject({});
    serviceListenerMaterial$ = this.serviceListenerMaterial.asObservable();
    public serviceListenerPetreos = new BehaviorSubject({});
    serviceListenerPetreos$ = this.serviceListenerPetreos.asObservable();
    public serviceListenerEquipo = new BehaviorSubject({});
    serviceListenerEquipo$ = this.serviceListenerEquipo.asObservable();
    public serviceListenerRetiro = new BehaviorSubject({});
    serviceListenerRetiro$ = this.serviceListenerRetiro.asObservable();
    public serviceListenerCalidad = new BehaviorSubject({});
    serviceListenerCalidad$ = this.serviceListenerCalidad.asObservable();
    public serviceListenerObservaciones = new BehaviorSubject({});
    serviceListenerObservaciones$ = this.serviceListenerObservaciones.asObservable();

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings
    ) {
        this.resourceUrl = appSettings.settings.hostApi + '/api/intervencion/cuadrillaGeneral';
        this.resourceUrlEquipo = appSettings.settings.hostApi + '/api/administracion/equipo/listarMaquinaria';
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de CuadrillaGeneral.
    *
    * @param CuadrillaGeneral Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (CuadrillaGeneral: CuadrillaGeneralModel): Observable<CuadrillaGeneralModel> {
        return this.http.post<CuadrillaGeneralModel>(this.resourceUrl, CuadrillaGeneral, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de CuadrillaGeneral.
    *
    * @param CuadrillaGeneral Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (CuadrillaGeneral: CuadrillaGeneralModel): Observable<CuadrillaGeneralModel> {
        return this.http.put<CuadrillaGeneralModel>(this.resourceUrl, CuadrillaGeneral, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la eliminación de
    * un registro de CuadrillaGeneral.
    *
    * @param CuadrillaGeneral Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    delete (cuadrillaPersonaId: number): Observable<CuadrillaGeneralModel> {
        return this.http.delete<CuadrillaGeneralModel>(this.resourceUrl + '/' + cuadrillaPersonaId);
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de CuadrillaGeneral
    */
    list() {
        return this.http.get<CuadrillaGeneralModel>(this.resourceUrl, httpOptions);
    }

    equipoList(): Observable<any> {
        return this.http.get<any>(this.resourceUrlEquipo, httpOptions);
    }

    listenerActionPersonal(data) {
        this.serviceListenerPersonal.next(data);
    }

    listenerActionMaterial(data) {
        this.serviceListenerMaterial.next(data);
    }

    listenerActionPetreos(data) {
        this.serviceListenerPetreos.next(data);
    }

    listenerActionEquipo(data) {
        this.serviceListenerEquipo.next(data);
    }

    listenerActionRetiro(data) {
        this.serviceListenerRetiro.next(data);
    }

    listenerActionCalidad(data) {
        this.serviceListenerCalidad.next(data);
    }

    listenerActionObservaciones(data) {
        this.serviceListenerObservaciones.next(data);
    }

    listenerSendStatus(data) {
        this.sendStatus.next(data);
    }
}
