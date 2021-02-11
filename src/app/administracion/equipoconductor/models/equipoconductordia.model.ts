import { ListaItem } from './../../listas-items/models/listas-items.model';
import { Equipo } from '../../equipo/models/equipo.model';
import { Equipocalendario } from '../../equipocalendario/models/equipocalendario.model';

export class EquipoConductorDia {
    public id: number;
    public activo: boolean;
    public fecha: string;
    public dia: ListaItem;
    /** Método encargado de crear uns instancia vacía del componente */
  constructor() { }
}
