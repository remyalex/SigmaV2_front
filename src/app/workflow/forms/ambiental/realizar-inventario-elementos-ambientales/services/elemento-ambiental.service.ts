import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElementoAmbientalModel } from '../models/elemento-ambiental.model';
import { AppSettings } from '../../../../../app.settings';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
    providedIn: 'root'
})
export class ElementoAmbientalService {

    private resourceUrl: string;

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings
    ) {
        this.resourceUrl = appSettings.settings.hostApi + '/api/ambiental/elementoAmbiental';
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (inspeccionElemento: ElementoAmbientalModel): Observable<ElementoAmbientalModel> {
        return this.http.post<ElementoAmbientalModel>(this.resourceUrl, inspeccionElemento, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (inspeccionElemento: ElementoAmbientalModel): Observable<ElementoAmbientalModel> {
        return this.http.put<ElementoAmbientalModel>(this.resourceUrl, inspeccionElemento, httpOptions);
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de {nombre_modelo}
    */
    list() {
        return this.http.get<ElementoAmbientalModel>(this.resourceUrl, httpOptions);
    }

}
