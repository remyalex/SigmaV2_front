import { SolicitudMezclaDetalle } from './../produccion-mezcla/models/solicitud-mezcla-detalle.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { SolicitudMezclaVale } from './solicitud-mezcla-vale.model';
import { SolicitudMezclaMaterial } from './solicitud-mezcla-material.model';

/**
 * Representación de la entidad SolicitudMezcla
 */
export class SolicitudMezcla {
    id: number;
    activo: boolean;
    numero: string;
    fechaProgramacion: string;
    fechaSolicitud: string;
    estado: ListaItem;
    tipoMaterial: ListaItem;
    jornada: ListaItem;
    turno: ListaItem;
    cantidad: number;
    vales: SolicitudMezclaVale[];
    materiales: SolicitudMezclaMaterial[];
    items: SolicitudMezclaDetalle[];
}
