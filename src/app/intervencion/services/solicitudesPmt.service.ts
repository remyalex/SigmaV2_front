import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { SolicitudPMT } from 'src/app/workflow/forms/intervencion/solicitud-pmt/models/solicitud-pmt.model';
import { Observable } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  @Injectable({
    providedIn: 'root'
  })
export class SolicitudPmtService {

    private resourceUrl: string;

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings
    ) {
        this.resourceUrl = appSettings.settings.hostApi + '/api/intervencion/solicitudPmt';
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (solicitudPmt: SolicitudPMT): Observable<SolicitudPMT> {
        return this.http.post<SolicitudPMT>(this.resourceUrl, solicitudPmt, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (solicitudPmt: SolicitudPMT): Observable<SolicitudPMT> {
        return this.http.put<SolicitudPMT>(this.resourceUrl, solicitudPmt, httpOptions);
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de {nombre_modelo}
    */
    list() {
        return this.http.get<SolicitudPMT>(this.resourceUrl, httpOptions);
    }

    getByNumeroRadicadoPmt(numeroRadicadoPmt: number, mantenimientoId: number) {
        return this.http.get<SolicitudPMT>(
            this.resourceUrl + '/getByNumeroRadicadoPmt/' + numeroRadicadoPmt + '/' + mantenimientoId, httpOptions
            );
    }

}
