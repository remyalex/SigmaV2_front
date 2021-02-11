import { ListaItem } from '../../listas-items/models/listas-items.model';
import { Personadisponibilidad } from '../../personadisponibilidad/models/personadisponibilidad.model';

export class Personacalendario {
    public activo = true;
    public disponibilidad: Personadisponibilidad;
    public disponible: boolean;
    public fin: string;
    public select: boolean;
    public inicio: string;
    public id: number;
    public tipoAsignacion: ListaItem;

    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
