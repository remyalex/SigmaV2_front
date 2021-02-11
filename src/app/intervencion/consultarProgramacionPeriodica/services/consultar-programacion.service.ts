import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { CONST_CONSULTAR_PROGRAMACION_PERIODICA } from '../consultar-programacion.constants';
import { ConsultarProgramacionCriteria } from '../models/consultarProgramacion.criteria.model';
import { ConsultarProgramacionModel } from '../models/consultarProgramacion.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { Observable } from 'rxjs';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'content-type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({ providedIn: 'root' })
export class ConsultarProgramacionService {

   /** Constantes a usar en el componente */
  constants = CONST_CONSULTAR_PROGRAMACION_PERIODICA;
    private resourceUrl: string;

    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettings,
        private _dataGeneric: DataGenericService
    ) {
        this.resourceUrl = _appSettings.settings.hostApi + this.constants.path_intervencion_consulta_programacion_periodica;
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
    search(criteria: ConsultarProgramacionCriteria): Observable<CollectionResponse<ConsultarProgramacionModel>> {
        return this._http.get<CollectionResponse<ConsultarProgramacionModel>>(this.resourceUrl + '/search?' +
            criteria.getUrlParameters());
    }

}