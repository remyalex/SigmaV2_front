import { Localidad } from '../../localidad/models/localidad.model';


export class Zona {

    public id: number;
    public nombre: string;
    public valor: string;
    public activo: boolean;
    public Localidades: Localidad[] = [];

    constructor() {

    }
}
