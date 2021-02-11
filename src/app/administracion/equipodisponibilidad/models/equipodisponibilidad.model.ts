import { ListaItem } from './../../listas-items/models/listas-items.model';
import { Equipo } from '../../equipo/models/equipo.model';
import { Equipocalendario } from '../../equipocalendario/models/equipocalendario.model';

export class Equipodisponibilidad {
    public id: number;
    public activo: boolean;
    public hasta: string;
    public desde: string;
    public intervalo: string;
    public equipo: Equipo;
    public turno: ListaItem;
    public calendarios: Array<Equipocalendario>;


    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
