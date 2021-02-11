import { Tipocargueestructura } from '../../tipocargueestructura/models/tipocargueestructura.model';

export class Tipocargue {
    
    public activo: boolean= true;
    public descripcion: string;
    public estructuras: Tipocargueestructura[];
    public id: number;
    public nombre: string;
    public programaSql: string;

    constructor() {

    }
}
