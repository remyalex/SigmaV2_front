export class Proceso {
    
    public activo: boolean = true;
    public id: number;
    public nombre: string;
    public descripcion: string;
    public actividades: Array<any>;
    public transiciones: Array<any>;
    public actividadInicialId: number;
    public url: String = '';

    public color: String; //Atributo que sirve para el componente sigma-graphic-allprocess NO BORRAR!

    constructor() {

    }
}
