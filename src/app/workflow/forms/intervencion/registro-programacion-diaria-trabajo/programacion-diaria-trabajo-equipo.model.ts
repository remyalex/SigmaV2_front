import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { IntervencionEncabezado } from 'src/app/intervencion/visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ProgramacionDiariaTrabajo } from './programacion-diaria-trabajo.model';

/**
 * Representación de la entidad ProgramacionDiariaTrabajoEquipo
 */
export class ProgramacionDiariaTrabajoEquipo {
    id: number;
    activo: boolean;
    programacionDiariaTrabajo: ProgramacionDiariaTrabajo;
    equipo: ListaItem;
    cantidad: number;
    hora: string;

    nombreEquipo: string;
}

