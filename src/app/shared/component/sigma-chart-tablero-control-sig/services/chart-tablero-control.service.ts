
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { Observable } from 'rxjs';
import { ChartDefinition } from '../models/chartDefinition';
import { Injectable } from '@angular/core';
import { ChartCriteria } from '../models/chart-criteria';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
    providedIn: 'root'
})
export class ChartTableroControService {

    private resourceUrl: string;

    constructor(
        private _http: HttpClient,
        private appSettings: AppSettings,
        private dataGeneric: DataGenericService,
    ) {
        this.resourceUrl = appSettings.settings.hostApi + '/api/intervencion/tableroControlSig';
    }

    getDataChartEstrategia(criteriaChart: ChartCriteria, nombreGrafica: string): Observable<ChartDefinition> {
        return this._http.post<ChartDefinition>(this.resourceUrl + '/' + nombreGrafica, criteriaChart, httpOptions);
    }

}
