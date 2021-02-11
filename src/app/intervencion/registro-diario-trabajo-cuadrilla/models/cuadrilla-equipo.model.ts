import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Equipo } from '../../../administracion/equipo/models/equipo.model';
import { CuadrillaEquipoArchivoModel } from './cuadrilla-equipo-archivo.model';

export class CuadrillaEquipoModel {

    id: number;
    movil: Equipo;
    origen: string;
    unidad: string;
    horometroInicial: number;
    horometroFinal: number;
    horasTrabajadas: number;
    standBy: number;
    vale: number;
    numeroViaje: number;
    dia: number;
    activo: boolean;
    tipoMaquinaria: string;
    equipoArchivos: CuadrillaEquipoArchivoModel[];

    constructor() {
    }
}
