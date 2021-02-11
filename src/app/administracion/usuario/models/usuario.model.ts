import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Persona } from '../../persona/models/persona.model';
import { Zona } from '../../ubicaciones/zona/models/zona.model';

export class Usuario {

    public activo = true;
    public apellidos: string;
    public clave: string;
    public claveConfirmacion: string;
    public correoElectronico: string;
    public id: number;
    public identificacion: string;
    public nombres: string;
    public origen: ListaItem;
    public estado: ListaItem;
    public usuario: string;
    public nombresYapellidos: string;
    public roles: any [];
    public persona: Persona;
    public zona: Zona;

    constructor() {

    }
}
