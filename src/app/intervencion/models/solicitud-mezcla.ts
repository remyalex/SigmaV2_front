import { IntervencionEncabezado } from '../visitatecnicaverificacion/visita-verificacion-admin/models/intervencionEncabezado.model';
import { ListaItem } from '../../administracion/listas-items/models/listas-items.model';

/**
 * Representa una solicitud de mezcla de material
 */
export class SolicitudMezcla {
    id: number;
    activo: boolean;
    fechaCreacion: string;
    jornada: ListaItem;
    intervencionEncabezado: IntervencionEncabezado;
    fechaSolicitud: string;
    tipoMaterial: ListaItem;
    cantidad: number;
}