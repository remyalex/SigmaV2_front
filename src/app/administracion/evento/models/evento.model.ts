import { Eventousuario } from '../eventousuario/models/eventousuario.model';
import { Eventorol } from '../eventorol/models/eventorol.model';

export class Evento {
    public activo: boolean = true;
    public descripcion: string;
    public eventosRol: Array<Eventorol>;
    public eventosUsuario: Array<Eventousuario>;
    public id: number;
    public nombre: string;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
