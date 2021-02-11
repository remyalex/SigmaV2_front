import { ListaItem } from './../../listas-items/models/listas-items.model';
import { Equipo } from '../../equipo/models/equipo.model';
import { Equipodisponibilidad } from './equipodisponibilidad.model';

export class Equipocalendario {
    public id: number;
    public activo: boolean;
    public inicio: string;
    public fin: string;
    public disponible: boolean;
    public equipoDisponibilidad: Equipodisponibilidad;
    public tipoAsignacion: ListaItem;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
