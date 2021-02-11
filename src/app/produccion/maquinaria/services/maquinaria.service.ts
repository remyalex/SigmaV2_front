import { DataGenericService } from './../../../shared/services/data-generic.service';
import { AppSettings } from './../../../app.settings';
import { CONST_PRODUCCION_MAQUINARIA } from './../maquinaria.constant';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Maquinaria } from './../models/maquinaria.model';
import { MaquinariaCriteria } from '../models/maquinaria-criteria.model';
import { CollectionResponse } from 'src/app/shared/models/collection-response';

/** Constante usada para identificar el encabezado de la peticion http como JSon */
const httpOptions = {
    headers: new HttpHeaders({ 'content-type': 'application/json' })
};

/**
 * Componente de servicio usado para gestionar las peticiones de componente
 * con el que interactúa el usuario hacia el componente de servidor
 */
@Injectable({ providedIn: 'root' })
export class MaquinariaService {

    private procesodataSource = new BehaviorSubject({});
    equipoFallaData = this.procesodataSource.asObservable();

   /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_MAQUINARIA;
    private resourceURL: string;

    constructor(
        private http: HttpClient,
        private appSettings: AppSettings,
        private dateGeneric: DataGenericService
    ) {
        this.resourceURL = appSettings.settings.hostApi + this.constants.path_produccion_maquinaria
    }

    /**
    * Método encargado de generar la petición al servidor para la creación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del nuevo
    * registro a almacenar
    */
    create (maquinaria: Maquinaria) {
        console.log("trying to create maquinaria from service", maquinaria);
        return this.http.post<Maquinaria>(this.resourceURL, maquinaria, httpOptions);
    }

   /**
    * Método encargado de generar la petición al servidor para la búsqueda
    * de todos los registros de {nombre_modelo}
    */
    list() {
        return this.http.get<Maquinaria[]>(this.resourceURL, httpOptions);
    }

    /**
    * Método encargado de invocar la busqueda de mantenimientos que
    * correspondan con los criterios indicados como parámetros
    *
    * @param criteria Objeto con los campos y valores por los
    * cuales se realizará la búsqueda según el formulario de busqueda
    * del componente SigmaGrid.
    */
    search(criteria: MaquinariaCriteria): Observable<CollectionResponse<Maquinaria>> {
        return this.http.get<CollectionResponse<Maquinaria>>(`${this.resourceURL}/search?${criteria.getUrlParameters()}`);
    }

    /**
    * Método encargado de generar la petición al servidor para la eliminación de
    * un registro de {nombre_modelo}.
    *
    * @param {nombre_modelo} Objeto de tipo modelo con los datos del
    * registro que se va a actualizar
    */
    delete (id: number): Observable<Maquinaria> {
        console.log("removing", id)
        return this.http.delete<Maquinaria>(`${this.resourceURL}/${id}`);
    }

}