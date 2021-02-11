import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Equipo } from '../../../administracion/equipo/models/equipo.model';
import { CuadrillaMaterialArchivoModel } from './cuadrilla-material-archivo.model';


export class CuadrillaMaterialModel {

    id: number;
    cantidad: number;
    activo: boolean;
    horaEntrada: string;
    horaInstalacion: string;
    temperaturaRecibo: number;
    temperaturaLlegada: number;
    temperaturaExtendido: number;
    temperaturaCompactacion: number;
    vale: number;
    placa: string;
    tipoMaterial: ListaItem;
    claseMaterial: ListaItem;
    origenMezcla: ListaItem;
    materialArchivos: CuadrillaMaterialArchivoModel[];

    constructor() {
    }
}
