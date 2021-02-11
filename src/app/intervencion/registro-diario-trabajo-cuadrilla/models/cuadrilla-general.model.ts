import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { WorkflowMantenimientoModel } from '../../../workflow/models/workflow-mantenimiento.model';
import { Intervencion } from '../../models/intervencionModel.model';
import { CuadrillaArchivoModel } from './cuadrilla-archivo.model';
import { CuadrillaAvanceModel } from './cuadrilla-avance.model';
import { CuadrillaPersonalModel } from './cuadrilla-personal.model';
import { CuadrillaMaterialModel } from './cuadrilla-material.model';
import { CuadrillaPetreosModel } from './cuadrilla-petreos-rap.model';
import { CuadrillaEquipoModel } from './cuadrilla-equipo.model';
import { CuadrillaRetiroModel } from './cuadrilla-retiro.model';
import { CuadrillaCalidadModel } from './cuadrilla-calidad.model';
import { CuadrillaObservacionGeneralModel } from './cuadrilla-observacion-general.model';


export class CuadrillaGeneralModel {

    id: number;
    areaTotal: number;
    longitudTotal: number;
    activo: boolean;
    mantenimiento: WorkflowMantenimientoModel;
    intervencionEncabezado: Intervencion;
    climaManiana: ListaItem;
    climaTarde: ListaItem;
    climaNoche: ListaItem;
    servicioVigilancia: ListaItem;
    vigilanciaHora: ListaItem;
    aperturaCuadrilla: String;
    archivos: Array<CuadrillaArchivoModel> = new Array<CuadrillaArchivoModel>();
    avance: Array<CuadrillaAvanceModel> = new Array<CuadrillaAvanceModel>();
    personal: Array<CuadrillaPersonalModel> = new Array<CuadrillaPersonalModel>();
    materiales: Array<CuadrillaMaterialModel> = new Array<CuadrillaMaterialModel>();
    petreos: Array<CuadrillaPetreosModel> = new Array<CuadrillaPetreosModel>();
    equipos: Array<CuadrillaEquipoModel> = new Array<CuadrillaEquipoModel>();
    retiro: Array<CuadrillaRetiroModel> = new Array<CuadrillaRetiroModel>();
    calidad: Array<CuadrillaCalidadModel> = new Array<CuadrillaCalidadModel>();
    observacionGeneral: Array<CuadrillaObservacionGeneralModel> = new Array<CuadrillaObservacionGeneralModel>();


    constructor() {
        this.id = null;
        this.areaTotal = null;
        this.activo = null;
        this.longitudTotal = null;
        this.mantenimiento = null;
        this.intervencionEncabezado = null;
        this.climaManiana = null;
        this.climaTarde = null;
        this.climaNoche = null;
        this.servicioVigilancia = null;
        this.vigilanciaHora = null;
    }
}
