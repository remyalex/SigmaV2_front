import { SolicitudMezcla } from './solicitud-mezcla.model';
import { ListaItem } from 'src/app/administracion/listas-items/models/listas-items.model';

/**
 * Representación de la entidad SolicitudMezclaVale
 */
export class SolicitudMezclaVale {
    id: number;
    activo: boolean;
    fechaCreacion: string;
    planta: ListaItem;
    temperatura: number;
    asentamieno: number;
    noMovil: string;
    horaEntrada: string;
    horaLlegada: string;
    horaSalida: string;
    cantidad: number;
    nombreConductor: string;
    formula: ListaItem;
}
