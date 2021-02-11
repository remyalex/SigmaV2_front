import { Equipodisponibilidad } from '../../equipodisponibilidad/models/equipodisponibilidad.model';
import { ListaItem } from '../../listas-items/models/listas-items.model';

export class Equipocalendario {

    public id: number;
    public activo = true;
    public disponibilidad: Equipodisponibilidad;
    public inicio: string;
    public fin: string;
    public disponible: boolean;
    public select = false;
    public tipoAsignacion: ListaItem;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
