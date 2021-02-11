import { DataGenericService } from '../../../shared/services/data-generic.service';
import { AppSettings } from '../../../app.settings';
import { CONST_PRODUCCION_EQUIPOFALLA } from '../equipo-falla.constant';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { EquipoMantenimiento } from '../../equipo-mantenimiento/models/equipo-mantenimiento.models';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({'content-type':'application/json'})
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({providedIn: 'root'})
export class EquipoFallaservice {

    private procesodataSource = new BehaviorSubject({});
    equipoFallaData = this.procesodataSource.asObservable();

   /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_EQUIPOFALLA;
    private resourceURL: string;

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings,
        private dateGeneric: DataGenericService
    ) {
        this.resourceURL = appSettings.settings.hostApi + this.constants.path_administracion_equipoFalla
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (equipoMantenimiento: EquipoMantenimiento) {
        return this.http.post<EquipoMantenimiento>(this.resourceURL, equipoMantenimiento, httpOptions);
    }

    cancel(equipoMantenimiento: EquipoMantenimiento) {
        return this.http.put<EquipoMantenimiento>(this.resourceURL, equipoMantenimiento, httpOptions);
    }

}
