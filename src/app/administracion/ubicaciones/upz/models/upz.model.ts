import { Localidad } from '../../localidad/models/localidad.model';

export class Upz {
    public id: number;
    public nombre: string;
    public valor: string;
    public uplCodigo: string;
    public activo: boolean;
    public localidades: Localidad[] = [];

    constructor() {}
}