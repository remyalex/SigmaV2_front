import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { DataGenericService } from 'src/app/shared/services/data-generic.service';
import { SolicitudMezclaDetalle } from '../models/solicitud-mezcla-detalle.model';
import { Observable } from 'rxjs';


const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({
    providedIn: 'root'
})
export class SolicitudMezclaDetalleService {

    resulrceUrl: string;

    constructor(
        private _http: HttpClient,
        private appSettings: AppSettings,
        private dataGeneric: DataGenericService
    ) {
        this.resulrceUrl = appSettings.settings.hostApi + '/api/produccion/solicitudMezclaDetalle';
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (SolicitudDetalle: SolicitudMezclaDetalle): Observable<SolicitudMezclaDetalle> {
        return this._http.post<SolicitudMezclaDetalle>(this.resulrceUrl, SolicitudDetalle, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (SolicitudDetalle: SolicitudMezclaDetalle): Observable<SolicitudMezclaDetalle> {
        return this._http.put<SolicitudMezclaDetalle>(this.resulrceUrl, SolicitudDetalle, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la
    * consulta de información de un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    detail (id: number): Observable<SolicitudMezclaDetalle> {
        return this._http.get<SolicitudMezclaDetalle>(this.resulrceUrl + '/' + id);
    }

    /**
    * Método encargado de generar la petición al servidor para la eliminación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    delete (id: number): Observable<SolicitudMezclaDetalle> {
        return this._http.delete<SolicitudMezclaDetalle>(this.resulrceUrl + '/' + id);
    }

}
