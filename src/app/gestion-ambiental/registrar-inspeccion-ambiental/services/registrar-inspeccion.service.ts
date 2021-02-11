import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElementoInspeccionModel } from '../models/elemento-inspeccion.model';
import { AppSettings } from '../../../app.settings';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
    providedIn: 'root'
})
export class RegistrarInspeccionService {

    private resourceUrl: string;

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings
    ) {
        this.resourceUrl = appSettings.settings.hostApi + '/api/ambiental/elementoInspeccion';
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (inspeccionElemento: ElementoInspeccionModel): Observable<ElementoInspeccionModel> {
        return this.http.post<ElementoInspeccionModel>(this.resourceUrl, inspeccionElemento, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (inspeccionElemento: ElementoInspeccionModel): Observable<ElementoInspeccionModel> {
        return this.http.put<ElementoInspeccionModel>(this.resourceUrl, inspeccionElemento, httpOptions);
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de {nombre_modelo}
    */
    list() {
        return this.http.get<ElementoInspeccionModel>(this.resourceUrl, httpOptions);
    }

}
