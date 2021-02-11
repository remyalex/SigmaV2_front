import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Usuario } from '../../usuario/models/usuario.model';

export class  Persona {
    
    public posicion: number;//Atributo usado para indicar la posicion en un grid
    public activo: boolean= true;
    public apellidos: string;
    public areaUmv: ListaItem;
    public cargo: ListaItem;
    public categoriaPersona: ListaItem;
    public correo: string;
    public estado: ListaItem;
    public horaFinProgramacion: string;
    public horaInicioProgramacion: string;
    public id: number;
    public identificacion: string;
    public nombres: string;
    public novedades: Array<any>;
    public telefono: string;
    public tipoIdentificacion: ListaItem;
    public tipoRegimen: ListaItem;
    public usuario: Usuario = new Usuario();
    public cant_Pks_Asig_Residente_Social: number;
    public cant_Pks_Asig_Residente_Ambiental: number;
    public cant_Pks_Asig_Residente_SST: number;
    public nombresYapellidos: string;

    constructor() {
    }
}
