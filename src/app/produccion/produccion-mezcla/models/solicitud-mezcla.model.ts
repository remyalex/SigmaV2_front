import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { SolicitudMezclaDetalle } from './solicitud-mezcla-detalle.model';


export class SolicitudMezcla {
    id: number;
    activo: boolean;
    numero: string;
    fechaSolicitud: string;
    tipoMaterial: ListaItem;
    turno: ListaItem;
    catidadTotal: number;
    tipoMaterialObj: ListaItem;
    turnoObj: ListaItem;
    items: SolicitudMezclaDetalle[] = [];
}
