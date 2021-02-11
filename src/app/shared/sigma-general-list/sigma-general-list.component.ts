import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Lista } from 'src/app/administracion/listas/models/lista.model';
import { DataGenericService } from '../services/data-generic.service';
import { filter } from 'rxjs/operators';
import { UtilitiesService } from '../services/utilities.service';
import { CONST_SHARED } from '../constantes-shared';

/**
 * Componente usado para estandarizar el campo de listas
 * en todos los formularios del sistema
 */
@Component({
    selector: 'sigma-general-list',
    templateUrl: './sigma-general-list.component.html'
})
export class SigmaGeneralListComponent implements OnInit {

    /**  Constantes que utiliza el componente */
    constanst = CONST_SHARED;
    /** Variable usada para recibir lista/data en la invocación
   * del componente */
    @Input('lista') lista: string;
    /** Variable usada para recibir etiqueta en la invocación
   * del componente */
    @Input('etiqueta') etiqueta = '';
    /** Variable usada para recibir valor en la invocación
   * del componente */
    @Input('value') value: number;
    /** Variable con el nombre de la columna por la cual se ordena el listado presentado al usuario */
    @Input('listBy') listBy: any = 'descripcion';
    /** Variable usada para recibir valor booleano para hacer
    * requerido el componente */
    @Input('required') required: boolean;
    /** Bandera usada para saber si el componente se encuentra deshabilitado */
    @Input('disabled') disabled: boolean = false;
    /** Ruta por la cual se consulta la información del usuario */
    @Input('path') path = '';
    /** Variable usada para recibir título en la invocación del componente */
    @Input('datos') datos: any = [];
    /** Variable usada para recibir lista de actividades en la invocación del componente */
    @Input('listActivities') listActivities: any = [];
    /** Variable usada para recibir Id en la invocación del componente */
    @Input('id') id: string = 'id';
    /** Variable usada para recibir tipo de respuesta en la invocación del componente */
    @Input('responseType') responseType: string = this.constanst.elemento;
    /** Lista de opciones a usar en el componente */
    optionsList: any[];
    /** Id de objeto seleccionado que devuelve el componente
     * una vez procesada la información */
    @Output() optionIdSelected = new EventEmitter<any>();

    /**
    * Método encargado de construir una instancia de la clase
    * @param servicioGeneral Servicios Generales usado en el componente para gestionar las peticiones
    * @param utilitiesService Componente de utilidades de peticiones a servicios
    */
    constructor(
        private servicioGeneral: DataGenericService,
        private utilitiesService: UtilitiesService
    ) { }

    /** Método encargado de inicializar el componente */
    ngOnInit() {
        if (this.listActivities.length > 0) {
            this.optionsList = this.listActivities;
        } else {
            if (this.datos.length > 0) {
                this.optionsList = this.datos;
            } else {
                this.servicioGeneral.cacheList(this.path);
                this.servicioGeneral.listQuery$
                    .pipe(
                        filter((data: any) => (data.path == this.path))
                    )
                    .subscribe((data: any) => {
                        let opciones = this.utilitiesService.orderArray(data.content, this.listBy);
                        this.optionsList = opciones.filter(item => item.activo == true);
                    });
            }
        }
    }

    /** Método encargado de asignar lista enviada por
     * parámetro a variable optionsList
     * @param listToShow objeto a usar
     */
    getListFromOtherSite(listToShow) {
        if (listToShow.length > 0) {
            this.optionsList = listToShow;
        }
    }

    /** Método encargado de emitir la opción seleccionada
    * @param option variable con valor de opción seleccionada
    */
    select(option: any): void {
        if (this.responseType == this.constanst.objeto) {
            try {
                let item = this.optionsList.filter(item => item[this.id] == option);
                this.optionIdSelected.emit(item[0]);
            } catch (error) {
                this.optionIdSelected.emit(option);
            }
        } else {
            this.optionIdSelected.emit(option);
        }
    }
}
