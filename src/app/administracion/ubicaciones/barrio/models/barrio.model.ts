import { Localidad } from '../../localidad/models/localidad.model';


export class Barrio {

    public id: number;
    public nombre: string;
    public valor: string;
    public activo: boolean;
    public localidades: Localidad[] = [];

    constructor() {}

}
