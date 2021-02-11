import { SolicitudMezcla } from './solicitud-mezcla.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

/**
 * Representación de la entidad SolicitudMezclaMaterial
 */
export class SolicitudMezclaMaterial {
    id: number;
    activo: boolean;
    tipoMaterial: ListaItem;
    claseMaterial: ListaItem;
    cantidad: number;
    pk: number;
}
