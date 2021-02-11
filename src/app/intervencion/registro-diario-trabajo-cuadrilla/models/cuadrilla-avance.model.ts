import { ListaItem } from '../../../administracion/listas-items/models/listas-items.model';

export class CuadrillaAvanceModel {

    id: number;
    activo: boolean;
    fechaCreacionInforme: string;
    numeroInforme: string;
    porcentajeDiario: number;
    porcentajeAcumulado: number;
    jornada: ListaItem;
    estadoObra: ListaItem;
    estadoRegistroDiario: ListaItem;


    constructor() {
        this.fechaCreacionInforme = null;
        this.jornada = null;
        this.numeroInforme = null;
        this.porcentajeDiario = null;
        this.porcentajeAcumulado = null;
        this.estadoObra = null;
        this.estadoRegistroDiario = null;
    }
}
