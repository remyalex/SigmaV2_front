import { DataGenericService } from './../../../shared/services/data-generic.service';
import { AppSettings } from './../../../app.settings';
import { CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS } from './../mantenimientos-programados.constant';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionResponse } from 'src/app/shared/models/collection-response';
import { MantenimientoProgramado } from '../models/mantenimientos-programados.model';
import { Equipo } from 'src/app/administracion/equipo/models/equipo.model';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'content-type': 'application/json' })
};

@Injectable()
export class MantenimientosProgramadosService {

    private procesodataSource = new BehaviorSubject({});
    equipoFallaData = this.procesodataSource.asObservable();

   /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MANTENIMIENTOS_PROGRAMADOS;
    private resourceURL: string;

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings,
        private dateGeneric: DataGenericService
    ) {
        this.resourceURL = appSettings.settings.hostApi + this.constants.path_produccion_mantenimientos_programados;
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (mantenimiento: MantenimientoProgramado) {
        console.log("trying to create mantenimiento from service", mantenimiento);
        return this.http.post<MantenimientoProgramado>(this.resourceURL, mantenimiento, httpOptions);
    }

    /**
    * Método encargado de generar la petición al servidor para la actualización de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    update (mantenimiento: MantenimientoProgramado) {
        console.log("trying to update mantenimiento from service", mantenimiento);
        return this.http.put<MantenimientoProgramado>(this.resourceURL, mantenimiento, httpOptions);
    }

    getActivesByEquipo(equipoId): Observable<CollectionResponse<MantenimientoProgramado>> {
        const url = `${this.resourceURL}/search?equipoId=${equipoId}&estado=PROGRAMADO`;
        console.log('url de consulta', url);
        return this.http.get<CollectionResponse<MantenimientoProgramado>>(url);
    }

}