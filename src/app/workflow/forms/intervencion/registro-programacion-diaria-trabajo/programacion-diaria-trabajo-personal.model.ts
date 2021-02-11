import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ProgramacionDiariaTrabajo } from './programacion-diaria-trabajo.model';

/**
 * Representación de la entidad ProgramacionDiariaTrabajoPersonal
 */
export class ProgramacionDiariaTrabajoPersonal {
    id: number;
    activo: boolean;
    programacionDiariaTrabajo: ProgramacionDiariaTrabajo;
    personal: ListaItem;
    tipoCuadrilla: ListaItem;
    inspector1: ListaItem;
    inspector2: ListaItem;
    inspector3: ListaItem;
    cantidadPersonalInspector: number;
    nombrePersonal: string;
    nombreTipoCuadrilla: string;
    nombreInspector1: string;
    nombreInspector2: string;
    nombreInspector3: string;

}

