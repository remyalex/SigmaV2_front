import { Zona } from '../../zona/models/zona.model';
import { Upla } from '../../upla/models/upla.model';
import { Barrio } from '../../barrio/models/barrio.model';


export class Localidad {

    public id: number;
    public nombre: string;
    public valor: string;
    public activo: boolean;
    public barrios: Barrio[] = [];
    public uplas: Upla[] = [];
    public zona: Zona;

    constructor() {}

}
