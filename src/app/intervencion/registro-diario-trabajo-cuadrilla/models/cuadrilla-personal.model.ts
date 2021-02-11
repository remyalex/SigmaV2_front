import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Persona } from '../../../administracion/persona/models/persona.model';

export class CuadrillaPersonalModel {

    id: number;
    activo: boolean;
    horaLlegada: string;
    horaSalida: string;
    porcentajeJornada: number;
    persona: Persona;

    constructor() {
    }
}
