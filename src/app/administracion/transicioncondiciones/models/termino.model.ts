import { Permiso } from '../../permisos/models/permiso.model';

export class Termino {
    public activo = true;
    public eliminado = false;
    public id: number;
    public atributo: any;
    public operador: any;
    public operadorLogico: any;
    public valor = '';
    public descripcionValor = '';
    public orden: number;


    constructor() {}
}
