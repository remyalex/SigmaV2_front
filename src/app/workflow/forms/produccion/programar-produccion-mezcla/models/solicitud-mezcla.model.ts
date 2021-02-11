import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';
import { SolicitudMezclaDetalle } from './solicitud-mezcla-detalle.model';
import { SolicitudTipoMaterial } from './solicitud-tipo-material.model';
import { SolicitudMezclaVale } from '../../../../../produccion/mezcla/solicitud-mezcla-vale.model';
import { SolicitudMezclaMaterial } from '../../../../../produccion/mezcla/solicitud-mezcla-material.model';


export class SolicitudMezcla {
    id: number;
    activo: boolean;
    numero: string;
    estado: ListaItem;
    fechaSolicitud: string;
    fechaProgramacion: string;
    tipoMaterial: ListaItem;
    turno: ListaItem;
    cantidad: number;
    catidadTotal: number;
    vales: SolicitudMezclaVale[];
    items: SolicitudMezclaDetalle[] = [];
    tipoMateriales: SolicitudTipoMaterial[] = [];
    materiales: SolicitudMezclaMaterial[];
    turnoObj: ListaItem;
    jornada: ListaItem;
    tipoMaterialObj: ListaItem;
}
