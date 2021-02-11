import { Persona } from 'src/app/administracion/persona/models/persona.model';
import { Zona } from 'src/app/administracion/ubicaciones/zona/models/zona.model';

export class UsuarioInfo {
    public id: number;
    public identificacion: string;
    public apellidos: string;
    public nombres: string;
    public usuario: string;
    public nombresYapellidos: string;
    public correoElectronico: string;
    public persona: Persona;
    public zona: Zona;

}
