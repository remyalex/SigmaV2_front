import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { ProgramacionDiariaTrabajo } from './programacion-diaria-trabajo.model';

/**
 * Representación de la entidad ProgramacionDiariaTrabajoMaterial
 */
export class ProgramacionDiariaTrabajoMaterial {
    id: number;
    activo: boolean;
    programacionDiariaTrabajo: ProgramacionDiariaTrabajo;
    origenMezcla: ListaItem;
    tipoMaterial: ListaItem;
    claseMaterial: ListaItem;
    cantidad: number;

    nombreOrigenMezcla: string;
    nombreTipoMaterial: string;
    nombreClaseMaterial: string;

    hora: string;
}

