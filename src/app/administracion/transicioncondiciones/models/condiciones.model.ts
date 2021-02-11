import { Termino } from './termino.model';

export class Condiciones {
    public activo = true;
    public descripcion: string;
    public eliminado = false;
    public id: number;
    public nombre: string;
    public terminos: Termino[];

    constructor() {}
}
