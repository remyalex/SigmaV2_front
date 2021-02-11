import {Injectable} from '@angular/core';
import {COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO} from './../historial-mantenimiento.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { Observable } from 'rxjs';
import { HistorialMantenimientoCriteria } from '../models/historialMantenimiento.criteria.model';
import { HistorialMantenimientoModel } from '../models/historialMantenimiento.model';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({'content-type': 'application/json'})
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({providedIn: 'root'})
export class HistorialMantenimientoService {

   /** Constantes a usar en el componente */
  constants = COSNT_MEJORAMIENTO_HISTORIAL_MANTENIMIENTO;
    private resourceUrl: string;

    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettings,
        private _dataGeneric: DataGenericService
    ) {
       this.resourceUrl = _appSettings.settings.hostApi + this.constants.path_mejoramiento_historial_mantenimiento;
    }

    searchByList(path: string, id: number) {
        return this._dataGeneric.buscarListaId(path, id);
    }

    /**
    * Método encargado de invocar la busqueda de mantenimientos que
    * correspondan con los criterios indicados como parámetros
    *
    * @param criteria Objeto con los campos y valores por los
    * cuales se realizará la búsqueda según el formulario de busqueda
    * del componente SigmaGrid.
    */
    search(criteria: HistorialMantenimientoCriteria): Observable<CollectionResponse<HistorialMantenimientoModel>> {
        return this._http.get<CollectionResponse<HistorialMantenimientoModel>>(this.resourceUrl + '/search?' +
        criteria.getUrlParameters());
    }

    searchByQuery(criteria: HistorialMantenimientoCriteria): Observable<CollectionResponse<HistorialMantenimientoModel>> {
        return this._http.get<CollectionResponse<HistorialMantenimientoModel>>(this.resourceUrl + '/mantenimientoHistorialActividades?' +
        criteria.getUrlQuery());
    }
}
