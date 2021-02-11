import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';
import { Equipo } from '../../../administracion/equipo/models/equipo.model';
import { CuadrillaPetreosArchivoModel } from './cuadrilla-petreos-rap-archivos.model';

export class CuadrillaPetreosModel {

    id: number;
    placa: string;
    horaEntrada: string;
    volumenEntrada: number;
    valeEntrada: number;
    volumenSalida: number;
    valeSalida: number;
    destino: string;
    volumenUtilizado: number;
    volumenAcopio: number;
    activo: boolean;
    equipo: Equipo;
    claseMaterial: ListaItem;
    origenMezcla: ListaItem;
    archivosPetreos: CuadrillaPetreosArchivoModel[];

    constructor() {
    }
}
